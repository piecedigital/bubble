import React from "react";
import { Link, browserHistory as History } from 'react-router';
import loadData from "../../../../modules/load-data";
import { browserNotification as notification } from "../../../../modules/helper-tools";
import { ListItemHoverOptions } from "../hover-options.jsx";

const missingLogo = "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png";

// components
let components = {
  // list item for streams matching the search
  VideosListItem: React.createClass({
    displayName: "video-ListItem",
    render() {
      // console.log(this.props);
      const {
        auth,
        index,
        userData,
        methods: {
          appendVOD
        },
        data: {
          preview,
          animated_preview,
          title,
          game,
          recorded_at,
          // url,
          _id: id,
          channel: {
            name,
            display_name
          }
        }
      } = this.props;
      let hoverOptions = <ListItemHoverOptions auth={auth} vod={id} name={name} display_name={display_name} clickCallback={appendVOD} />;

      return (
        <li className="video-list-item">
          <div className="wrapper">
            <div className="image">
              <img src={preview} />
            </div>
            <div className="info">
              <div className="channel-name">
                {name}
              </div>
              <div className="title">
                "{title}"
              </div>
              <div className="game">
                {`Vod of "${game}"`}
              </div>
            </div>
            {hoverOptions}
          </div>
        </li>
      )
    }
  }),
};

// primary section for the search component
export default React.createClass({
  displayName: "VideosListing",
  getInitialState() {
    return {
      requestOffset: 0,
      limit: 12,
      dataArray: [],
      filter: "all",
      loadingQueue: [],
      currentNotifs: 0
    }
  },
  gatherData(limit, offset, callback) {
    limit = typeof limit === "number" ? limit : this.state.limit || 25;
    offset = typeof offset === "number" ? offset : this.state.requestOffset;
    const {
      params,
      userData,
    } = this.props;
    let {
      broadcasts
    } = this.props;
    broadcasts = (typeof broadcasts !== "boolean") ? true : broadcasts;
    let username;
    if(params && params.username) {
      username = params.username;
    } else {
      username = userData.name;
    }
    // console.log(username, this.props.params, this.props.userData);
    if(loadData) {
      this.setState({
        requestOffset: (offset + limit)
      });
      console.log("gathering data", limit, offset);
      console.log(`Given Channel Name getVideos`, username);
      loadData.call(this, e => {
        console.error(e.stack);
      }, {
        offset,
        limit,
        username,
        broadcasts,
        stream_type: "all"
      })
      .then(methods => {
        methods
        ["getVideos"]()
        .then(data => {
          console.log("data", data);
          this.setState({
            dataArray: Array.from(this.state.dataArray).concat(data.videos),
            component: `VideosListItem`
          }, () => {
            console.log("total data getVideos", this.state.dataArray.length);
            if(typeof callback === "function") callback();
          });
        })
        .catch(e => console.error(e.stack));
      })
      .catch(e => console.error(e.stack));
    }
  },
  capitalize(string) {
    return string.toLowerCase().split(" ").map(word => word.replace(/^(\.)/, (_, l) => {
      return l.toUpperCase();
    })).join(" ");
  },
  refreshList(reset, length, offset) {
    length = length || this.state.dataArray.length;
    offset = offset || 0;
    console.log(reset, length, offset);
    let requestOffset = reset ? 0 : offset;
    let obj = {};
    if(reset) obj.dataArray = [];
    this.setState(obj, () => {
      if(length > 100) {
        this.gatherData(100, offset, this.refreshList.bind(this, false, length - 100, requestOffset + 100));
      } else {
        this.gatherData(length, offset);
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
  componentWillReceiveProps() {
    this.scrollEvent();
  },
  componentDidMount() {
    this.gatherData();
    this.scrollEvent();
    document.addEventListener("scroll", this.scrollEvent, false);
    document.addEventListener("mousewheel", this.scrollEvent, false);
  },
  componentWillUnmount() {
    document.removeEventListener("scroll", this.scrollEvent, false);
    document.removeEventListener("mousewheel", this.scrollEvent, false);
  },
  render() {
    const {
      requestOffset,
      dataArray,
      component,
      limit,
      loadingQueue,
      locked,
      lockedTop,
    } = this.state;
    const {
      auth,
      data,
      params,
      userData,
      methods: {
        appendVOD,
        loadData
      }
    } = this.props;

    if(component) {
      const ListItem = components[component];
      const list = dataArray.map((itemData, ind) => {
        // return null;
        return <ListItem ref={r => dataArray[ind].ref = r} key={ind} data={itemData} userData={userData} index={ind} auth={auth} notifyMultiplier={Math.floor(ind / 3)} methods={{
          appendVOD,
          notify: this.notify,
          removeFromDataArray: this.removeFromDataArray
        }} />
      });

      return (
        <div ref="root" className={`videos-listing profile${locked ? " locked" : ""}`}>
          <div className={`title`}>Videos</div>
          <div className="wrapper">
            <ul className="list">
              {list}
            </ul>
          </div>
          <div ref="tools" className={`tools${lockedTop ? " locked-top" : locked ? " locked" : ""}`}>
            <div className="parent">
              <div className="scroll">
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
          {`Loading ${params.username ? params.username : userData ? userData.name : ""}'s videos...`}
        </div>
      );
    }
  }
})
