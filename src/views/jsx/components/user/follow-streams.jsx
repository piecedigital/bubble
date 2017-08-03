import React from "react";
import { Link, browserHistory as History } from 'react-router';
import loadData from "../../../../modules/client/load-data";
import { browserNotification as notification, missingLogo, CImg } from "../../../../modules/client/helper-tools";
import { ListItemHoverOptions } from "../hover-options.jsx";
import { ChannelListItem } from '../list-items.jsx';

// const missingLogo = "http://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png";

// components
let components = {
  // list item for streams matching the search
  ChannelListItem
};

// primary section for the search component
export default React.createClass({
  displayName: "FollowStreams",
  getInitialState() {
    return {
      requestOffset: 0,
      limit: 25,
      dataArray: [],
      dataObject: {},
      filter: "all",
      notifArray: [],
      // locked: this.props.follow === "IFollow" ? false : true,
      locked: true,
      // lockedTop: this.props.follow === "IFollow" ? false : true,
      lockedTop: true,
      loadData: false,
      currentNotifs: 0
    }
  },
  gatherData(limit, offset, callback, wipe) {
    // console.log("auth", this.props.auth);
    if(!this.props.auth ) return this.setState({
      component: `ChannelListItem`,
    });
    this.setState(Object.assign({
      loadingData: true,
    }, wipe ? {
      dataObject: {}
    } : {}), () => {
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
        // console.log("gathering data", limit, offset);
        // console.log(`Given Channel Name ${this.props.follow === "IFollow" ? "followedStreams" : "followingStreams"}`, username);
        // console.log("follow:", this.props.follow);
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
            // let newDataArray = Array.from(this.state.dataArray).concat(data.channels || data.streams || data.games || data.top || data.follows);
            const obj = {};
            const itemsData = data.follows;

            itemsData.map(data => {
              var itemData = data.user || data.channel;
              const name = data.user ? data.user.name : data.channel.name;

              obj[name] = itemData;
            });

            let newDataObject = Object.assign(this.state.dataObject, obj);
            this._mounted ? this.setState({
              dataObject: newDataObject,
              requestOffset: Object.keys(newDataObject).length,
              component: `ChannelListItem`,
              loadingData: false
            }, () => {
              if(typeof callback === "function") callback();
            }) : null;
          })
          .catch(e => console.error(e.stack));
        })
        .catch(e => console.error(e.stack));
      }
    })
  },
  removeFromDataObject(/*index*/ name) {
    console.log("removing", name);
    // let newDataArray = this.state.dataArray;
    let newDataObject = this.state.dataObject;
    console.log(newDataObject);
    // let removed = newDataArray.splice(parseInt(index), 1);
    let removed = newDataObject[name];
    delete newDataObject[name];
    this._mounted ? this.setState({
      dataObject: newDataObject,
      requestOffset: Object.keys(newDataObject).length
    }, () => console.log("final offset:", this.state.requestOffset) ) : null;
    console.log(removed);
  },
  refresh() {
    Object.keys(this.state.dataObject).map(streamName => {
      this.state.dataObject[streamName].ref.getStreamData();
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
    length = length || Object.keys(this.state.dataObject).length;
    offset = offset || 0;
    console.log(reset, length, offset);
    let requestOffset = reset ? 0 : offset;
    let obj = {};
    // if(reset) obj.dataArray = [];
    if(reset) obj.dataObject = {};
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
  componentWillReceiveProps(nextProps) {
    setTimeout(() => {
      this.scrollEvent();
    }, 100);
    // rerun gather data if...

    if(this.props.params.username !== nextProps.params.username) {
      this.gatherData(this.state.limit, 0, null, true);
    }

    // const last = this.props.params.username,
    // curr = nextProps.params.username,
    // signedIn = this.props.userData ? this.props.userData.name : "";
    // // console.log("new name", last, curr, signedIn);
    // if(last || curr) {
    //   if(
    //     // ... username changes
    //     (last !== signedIn &&
    //     curr !== signedIn &&
    //     last !== curr) ||
    //     // ... auth changes
    //     !!this.props.auth !== !!nextProps.auth
    //   ) {
    //     this.gatherData(this.state.limit, 0, null, true);
    //   }
    // }
  },
  componentDidMount() {
    // console.log("auth", this.props.auth);
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
      dataObject,
      component,
      filter,
      limit,
      loadingData,
      loadingQueue,
      locked,
      lockedTop,
    } = this.state;
    const {
      auth,
      data,
      fireRef,
      userData,
      follow,
      versionData,
      params,
      methods: {
        appendStream,
        loadData
      }
    } = this.props;

    if(component) {
      const ListItem = components[component];
      const list = Object.keys(dataObject).map((itemName, ind) => {
        const itemData = dataObject[itemName];

        return (
          <ListItem ref={r => {
            itemData ? itemData.ref = r : null
          }} key={`${itemData.channel ? itemData.name : itemData.name}`}
          data={itemData}
          fireRef={fireRef}
          userData={userData}
          versionData={versionData}
          index={ind}
          filter={filter}
          auth={auth}
          notifyMultiplier={Math.floor(ind / 3)}
          params={this.props.params} follow={follow} methods={{
            appendStream,
            notify: this.notify,
            removeFromDataObject: this.removeFromDataObject
          }} />
        )
      });
      const person = params.username === undefined || (userData && userData.name === params.username) ? "You" : params.username;
      // this will append an "s" to "follows" in the string if the user is on someone elses page
      const s = params.username === undefined || (userData && userData.name === params.username) ? "" : "s";
      return (
        <div ref="root" className={`${this.props.follow === "IFollow" ? "following-streams" : "followed-streams"} profile${locked ? " locked" : ""}`}>
          <div className={`title`}>Channels {this.props.follow === "IFollow" ? `${person} Follow${s}` : `Following ${person}`}</div>
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
                <div className={`option btn-default load-more${loadingData ? " bg-color-dimmer not-clickable" : ""}`} onClick={loadingData ? null : this.gatherData}>
                  {loadingData ? "Loading More" : "Load More"}
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
