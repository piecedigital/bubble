import React from "react";
import { Link, browserHistory as History } from 'react-router';
import loadData from "../../../../modules/load-data";
import { browserNotification as notification } from "../../../../modules/helper-tools";
import FollowButton from "../follow.jsx";

const missingLogo = "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png";

// components
let components = {
  // list item for streams matching the search
  StreamsListItem: React.createClass({
    displayName: "stream-ListItem",
    render() {
      // console.log(this.props);
      const {
        index,
        methods: {
          appendStream
        },
        data: {
          game,
          viewers,
          title,
          _id: id,
          preview,
          channel: {
            mature,
            logo,
            name,
            language
          }
        }
      } = this.props;
      let viewersString = viewers.toLocaleString("en"); // https://www.livecoding.tv/earth_basic/
      return (
        <li className="stream" onClick={() => {
          appendStream.call(null, name, displayName);
        }}>
          <div className="image">
            <img src={preview.medium} />
          </div>
          <div className="info">
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
        </li>
      )
    }
  }),
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
    componentWillUpdate(_, nextState) {
      const {
        data
      } = this.props;
      const {
        name,
        display_name
      } = data.channel || data.user;
      // console.log(this.state.streamData, nextState.streamData);
      if(!this.state.streamData || this.state.streamData && this.state.streamData.stream === null && nextState.streamData.stream !== null) {
        // console.log(this.state.streamData.stream !== nextState.streamData.stream);
        if(nextState.streamData.stream) {
          notification({
            type: "stream_online",
            channelName: display_name,
            callback: () => {
              this.appendStream(name, display_name);
            }
          });
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

      let hoverOptions = (
        <div className={`hover-options`}>
          <div className="go-to-channel">
            <a href={`https://twitch.tv/${name}`} target="_blank">Go To Channel</a>
          </div>
          <FollowButton name={userData.name} targetName={name} targetDisplay={display_name} auth={auth} callback={this.followCallback}/>
          {
            stream ? (
              <div className="append-stream">
                <a href="#" onClick={this.appendStream.bind(this, name, display_name)}>Watch Stream</a>
              </div>
            ) : <div className="append-stream">
              <a href="#" onClick={this.appendStream.bind(this, name, display_name)}>Open Stream</a>
            </div>
          }
        </div>
      );

      if(!stream) {
        if(filter === "all" || filter === "offline") {
          return (
            <li className={`channel-list-item`}>
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
  displayName: "FollowedStreams",
  getInitialState() {
    return {
      requestOffset: 0,
      limit: 25,
      dataArray: [],
      filter: "all",
      loadingQueue: [],
      locked: false,
      lockedTop: false,
    }
  },
  gatherData(limit) {
    let loadingQueue = ( JSON.parse(JSON.stringify(this.state.loadingQueue)) );
    loadingQueue.push(true);
    this.setState({
      loadingQueue
    });
    typeof limit === "number" ? limit = limit : limit = this.state.limit || 25;
    // console.log("gathering data");
    const {
      methods: {
        // loadData
      },
      location
    } = this.props;
    if(loadData) {
      let offset = this.state.requestOffset;
      this.setState({
        requestOffset: this.state.requestOffset + limit
      });
      loadData.call(this, e => {
        console.error(e.stack);
      }, {
        offset,
        limit: limit,
        stream_type: "all"
      })
      .then(methods => {
        methods
        [this.props.follow === "IFollow" ? "followedStreams" : "followingStreams"]()
        .then(data => {
          loadingQueue.pop();
          this.setState({
            dataArray: Array.from(this.state.dataArray).concat(data.channels || data.streams || data.games || data.top || data.follows),
            component: `ChannelsListItem`,
            loadingQueue
          });
        })
        .catch(e => console.error(e.stack));
      })
      .catch(e => console.error(e.stack));
    }
  },
  removeFromDataArray(index) {
    var newDataArray = JSON.parse(JSON.stringify(this.state.dataArray));
    newDataArray.splice(parseInt(index), 1);
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
    this.setState({
      filter
    });
  },
  refreshList(reset, _, length = this.state.dataArray.length) {
    console.log(reset, length, arguments);
    this.setState({
      requestOffset: reset ? 0 : this.state.requestOffset,
      dataArray: reset ? [] : this.state.dataArray
    }, () => {
      if(length > 100) {
        this.gatherData(100);
        this.refreshList(false, length - 100);
      } else {
        this.gatherData(length);
      }
    });
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
        if(trueRoot.scrollTop <= root.offsetTop) {
          this.setState({
            locked: true,
            lockedTop: true,
          });
        } else
        if(trueRoot.scrollTop >= bottom) {
          this.setState({
            locked: true,
            lockedTop: false,
          });
        } else {
          this.setState({
            locked: false,
            lockedTop: false,
          });
        }
      }
    }, 200);
  },
  componentDidMount() {
    this.gatherData();
    this.scrollEvent();
    document.addEventListener("scroll", this.scrollEvent, false);
    document.addEventListener("mousewheel", this.scrollEvent, false);
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
      methods: {
        appendStream,
        loadData
      }
    } = this.props;
    if(component) {
      const ListItem = components[component];
      const list = dataArray.map((itemData, ind) => {
        return <ListItem ref={r => dataArray[ind].ref = r} key={itemData.channel ? itemData.channel.name : itemData.user.name} data={itemData} userData={userData} index={ind} filter={filter} auth={auth} methods={{
          appendStream,
          removeFromDataArray: this.removeFromDataArray
        }} />
      });
      console.log(this.props.follow === "followMe" ? list : "");
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
                <div className="option btn-default refresh" onClick={this.refreshList.bind(this, true)}>
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
