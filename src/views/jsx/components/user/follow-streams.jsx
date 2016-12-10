import React from "react";
import { Link, browserHistory as History } from 'react-router';
import loadData from "../../../../modules/load-data";
import { browserNotification as notification } from "../../../../modules/helper-tools";
import { ListItemHoverOptions } from "../hover-options.jsx";

const missingLogo = "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png";

let currentNotifs = 0;
// components
let components = {
  // list item for streams matching the search
  ChannelsListItem: React.createClass({
    displayName: "channel-ListItem",
    getInitialState: () => ({ streamData: null }),
    getStreamData() {
      const {
        data
      } = this.props;
      const {
        name,
        display_name
      } = data.channel || data.user;
      // console.log(`getting stream data for ${name}`);
      loadData.call(this, e => {
        console.error(e.stack);
      }, {
        username: name
      })
      .then(methods => {
        methods
        .getStreamByName()
        .then(data => {
          // console.log(name, ", data:", data);
          this.setState({
            streamData: data
          });
        })
        .catch(e => console.error(e.stack));
      })
      .catch(e => console.error(e.stack));
    },
    followCallback(follow) {
      if(follow) {
        // following channel
        if(typeof this.props.methods.addToDataArray === "function") this.props.methods.addToDataArray(this.props.index);
      } else {
        // unfollowing channel
        if(typeof this.props.methods.removeFromDataArray === "function") this.props.methods.removeFromDataArray(this.props.index);
      }
    },
    appendStream(name, display_name) {
      this.props.methods.appendStream(name, display_name);
    },
    notify(multiplier) {
      const {
        data
      } = this.props;
      const {
        name,
        display_name
      } = data.channel || data.user;
      const timeout = 2;
      // setTimeout(() => {
      //   notification({
      //     type: "stream_online",
      //     channelName: display_name,
      //     timeout,
      //     callback: () => {
      //       this.appendStream(name, display_name);
      //     }
      //   });
      // }, (timeout * 1000) * (multiplier % 3));
      const action = notification.bind(this, {
        type: "stream_online",
        channelName: display_name,
        timeout,
        callback: () => {
          this.appendStream(name, display_name);
        },
        finishCB: () => {
          currentNotifs--;
        }
      });
      if(currentNotifs < 3) {
        console.log("Notifying now:", name, ", ahead:", currentNotifs);
        currentNotifs++;
        action();
      } else {
        multiplier = Math.floor(currentNotifs / 3);
        const time = (2000 * multiplier) + 700;
        console.log("Queuing notify:", name, "; ahead:", currentNotifs, "; time:", time, "; multiplier:", multiplier);
        currentNotifs++;
        setTimeout(() => {
          action();
        }, time);
      }

      // this.props.methods.notify(name, display_name);
    },
    componentWillUpdate(_, nextState) {
      // console.log(this.state.streamData, nextState.streamData);
      if(!this.state.streamData || this.state.streamData && this.state.streamData.stream === null && nextState.streamData && nextState.streamData.stream !== null) {
        // console.log(this.state.streamData.stream !== nextState.streamData.stream);
        if(nextState.streamData && nextState.streamData.stream && this.props.follow === "IFollow") {
          this.notify(this.props.notifyMultiplier);
        }
      }
    },
    componentDidMount() { this.getStreamData() },
    render() {
      if(!this.state.streamData) return null;
      // console.log(this.props);
      const {
        auth,
        index,
        filter,
        userData,
        data
      } = this.props;
      const {
        mature,
        logo,
        name,
        display_name,
        language
      } = data.channel || data.user;
      const {
        streamData: {
          stream
        }
      } = this.state;

      let hoverOptions = <ListItemHoverOptions auth={auth} stream={stream} name={name} display_name={display_name} userData={userData} callback={this.followCallback} clickCallback={this.appendStream} />;

      if(!stream) {
        if(filter === "all" || filter === "offline") {
          return (
            <li className={`channel-list-item null`}>
              <div className="wrapper">
                <div className="image">
                  <img src={logo || missingLogo} />
                </div>
                <div className="info">
                  <div className={`live-indicator offline`} />
                  <div className="channel-name">
                    {name}
                  </div>
                  <div className="game">
                    {`Offline`}
                  </div>
                </div>
                {hoverOptions}
              </div>
            </li>
          );
        } else {
          return null;
        }
      }
      const {
        game,
        viewers,
        title,
        _id: id,
        preview,
      } = stream;
      let viewersString = viewers.toLocaleString("en"); // https://www.livecoding.tv/earth_basic/
      if(filter === "all" || filter === "online") {
        return (
          <li className={`channel-list-item`}>
            <div className="wrapper">
              <div className="image">
                <img src={logo || missingLogo} />
              </div>
              <div className="info">
                <div className={`live-indicator online`} />
                <div className="channel-name">
                  {name}
                </div>
                <div className="title">
                  {title}
                </div>
                <div className="game">
                  {`Live with "${game}"`}
                </div>
                <div className="viewers">
                  {`Streaming to ${viewersString} viewer${viewers > 1 ? "s" : ""}`}
                </div>
              </div>
              {hoverOptions}
            </div>
          </li>
        );
      } else {
        return null;
      }
    }
  })
};

// primary section for the search component
export default React.createClass({
  displayName: "FollowStreams",
  getInitialState() {
    return {
      requestOffset: 0,
      limit: 25,
      dataArray: [],
      filter: "all",
      notifArray: [],
      // locked: this.props.follow === "IFollow" ? false : true,
      locked: true,
      // lockedTop: this.props.follow === "IFollow" ? false : true,
      lockedTop: true,
      currentNotifs: 0
    }
  },
  gatherData(limit, offset, callback) {
    limit = typeof limit === "number" ? limit : this.state.limit || 25;
    offset = typeof offset === "number" ? offset : this.state.requestOffset;
    const {
      params,
      location,
      userData
    } = this.props;

    let username;
    if(params && params.username) {
      username = params.username;
    } else {
      username = userData.name;
    }
    if(loadData) {
      this._mounted ? this.setState({
        requestOffset: (offset + limit)
      }) : null;
      console.log("gathering data", limit, offset);
      // console.log(`Given Channel Name ${this.props.follow === "IFollow" ? "followedStreams" : "followingStreams"}`, username);
      loadData.call(this, e => {
        console.error(e.stack);
      }, {
        offset,
        limit,
        stream_type: "all",
        username
      })
      .then(methods => {
        methods
        [this.props.follow === "IFollow" ? "followedStreams" : "followingStreams"]()
        .then(data => {
          let newDataArray = Array.from(this.state.dataArray).concat(data.channels || data.streams || data.games || data.top || data.follows);
          this._mounted ? this.setState({
            dataArray: newDataArray,
            requestOffset: newDataArray.length,
            component: `ChannelsListItem`
          }, () => {
            console.log(`total data ${this.props.follow === "IFollow" ? "followedStreams" : "followingStreams"}`, this.state.dataArray.length);
            console.log("final offset:", this.state.requestOffset);
            if(typeof callback === "function") callback();
          }) : null;
        })
        .catch(e => console.error(e.stack));
      })
      .catch(e => console.error(e.stack));
    }
  },
  removeFromDataArray(index) {
    console.log("removing", index);
    let newDataArray = this.state.dataArray;
    let removed = newDataArray.splice(parseInt(index), 1);
    this._mounted ? this.setState({
      dataArray: newDataArray,
      requestOffset: newDataArray.length
    }, () => console.log("final offset:", this.state.requestOffset) ) : null;
    console.log(removed);
  },
  refresh() {
    this.state.dataArray.map(stream => {
      stream.ref.getStreamData();
    });
  },
  capitalize(string) {
    return string.toLowerCase().split(" ").map(word => word.replace(/^(\.)/, (_, l) => {
      return l.toUpperCase();
    })).join(" ");
  },
  applyFilter() {
    const filter = this.refs.filterSelect.value;
    console.log(filter);
    this._mounted ? this.setState({
      filter
    }) : null;
  },
  refreshList(reset, length, offset) {
    length = length || this.state.dataArray.length;
    offset = offset || 0;
    console.log(reset, length, offset);
    let requestOffset = reset ? 0 : offset;
    let obj = {};
    if(reset) obj.dataArray = [];
    this._mounted ? this.setState(obj, () => {
      if(length > 100) {
        this.gatherData(100, offset, this.refreshList.bind(this, false, length - 100, requestOffset + 100));
      } else {
        this.gatherData(length, offset);
      }
    }) : null;
  },
  scrollEvent(e) {
    setTimeout(() => {
      let {
        root,
        tools
      } = this.refs;
      if(root && tools) {
        let trueRoot = document.body.querySelector(".react-app .root");
        // console.log("root", root.offsetTop + root.offsetHeight);
        // console.log("trueRoot", trueRoot.scrollTop);
        const bottom = (root.offsetTop + root.offsetHeight) - tools.offsetHeight  - (16 * 4.75);
        // console.log("bottom", bottom);

        // lock the tools menu to the top of it's parent
        // if the top of the page root is higher than or equal to the top of the app root
        if(trueRoot.scrollTop <= root.offsetTop) {
          this.setState({
            locked: true,
            lockedTop: true,
          });
        } else
        // lock the tools menu to the bottom of it's parent
        // if the top of the page root is lower than or equal to the top of the app root
        if(trueRoot.scrollTop >= bottom) {
          this.setState({
            locked: true,
            lockedTop: false,
          });
        } else {
          // don't lock anything; fix it to the page scrolling
          this.setState({
            locked: false,
            lockedTop: false,
          });
        }
      }
    }, 200);
  },
  componentWillReceiveProps() {
    setTimeout(() => {
      this.scrollEvent();
    }, 100);
  },
  componentDidUpdate() {
    // const notifArray = Array.from(this.state.notifArray);
    // console.log(this.state.notifArray, notifArray.length, this.state.currentNotifs);
    // if(notifArray.length > 0 && this.state.currentNotifs < 3) {
    //   this.sendNotif(notifArray.splice(0, 3 - this.state.currentNotifs), notifArray);
    // }
  },
  componentDidMount() {
    this._mounted = true;
    this.gatherData();
    this.scrollEvent();
    document.addEventListener("scroll", this.scrollEvent, false);
    document.addEventListener("mousewheel", this.scrollEvent, false);
  },
  componentWillUnmount() {
    delete this._mounted;
    document.removeEventListener("scroll", this.scrollEvent, false);
    document.removeEventListener("mousewheel", this.scrollEvent, false);
  },
  render() {
    const {
      requestOffset,
      dataArray,
      component,
      filter,
      limit,
      loadingQueue,
      locked,
      lockedTop,
    } = this.state;
    const {
      auth,
      data,
      userData,
      follow,
      methods: {
        appendStream,
        loadData
      }
    } = this.props;

    if(component) {
      const ListItem = components[component];
      const list = dataArray.map((itemData, ind) => {
        return <ListItem ref={r => {
          dataArray[ind] ? dataArray[ind].ref = r : null
        }} key={`${itemData.channel ? itemData.channel.name : itemData.user.name}${""}`} data={itemData} userData={userData} index={ind} filter={filter} auth={auth} notifyMultiplier={Math.floor(ind / 3)} follow={follow} methods={{
          appendStream,
          notify: this.notify,
          removeFromDataArray: this.removeFromDataArray
        }} />
      });

      return (
        <div ref="root" className={`${this.props.follow === "IFollow" ? "following-streams" : "followed-streams"} profile${locked ? " locked" : ""}`}>
          <div className={`title`}>{this.props.follow === "IFollow" ? "Followed" : "Following"} Channels</div>
          <div className="wrapper">
            <ul className="list">
              {list}
            </ul>
          </div>
          <div ref="tools" className={`tools${lockedTop ? " locked-top" : locked ? " locked" : ""}`}>
            <div className="parent">
              <div className="scroll">
                <div className="option btn-default refresh" onClick={this.refresh}>
                  Refresh Streams
                </div>
                <div className="option btn-default refresh" onClick={() => this.refreshList(true)}>
                  Refresh Listing
                </div>
                <div className="option btn-default load-more" onClick={this.gatherData}>
                  {/*loadingQueue.length > 0 ? `Loading ${limit * loadingQueue.length} More` : "Load More"*/}
                  Load More
                </div>
                <div className="option btn-default filters">
                  <div className="filter-status">
                    <label htmlFor="filter-select">
                      Show
                    </label>
                    <select id="filter-select" className="" ref="filterSelect" onChange={this.applyFilter} defaultValue="all">
                      {
                        ["all", "online", "offline"].map(filter => {
                          return (
                            <option key={filter} value={filter}>Show {this.capitalize(filter)}</option>
                          );
                        })
                      }
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={`top-level-component general-page profile`}>
          {`Loading ${this.props.follow === "IFollow" ? "followed" : "following"} streams...`}
        </div>
      );
    }
  }
})
