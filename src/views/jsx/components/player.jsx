import React from "react";
import { Link, browserHistory as History } from 'react-router';
import loadData from "../../../modules/load-data";
import FollowButton from "./follow.jsx";

// stream component for player
const PlayerStream = React.createClass({
  displayName: "PlayerStream",
  getInitialState: () => ({ chatOpen: true, menuOpen: false }),
  toggleMenu(type) {
    switch (type) {
      case "close":
        this.setState({
          menuOpen: false
        });
        break;
      case "open":
        this.setState({
          menuOpen: true
        });
        break;
      case "toggle":
      default:
        console.log("no type match:", type);
        this.setState({
          menuOpen: !this.state.menuOpen
        });
    }
  },
  refresh(iframe) {
    console.log(iframe, this.refs[iframe].src);
    switch (iframe) {
      case "video":
        this.refs.video.src = this.refs.video.src;
        break;
      case "chat":
        this.refs.chat.src = this.refs.chat.src;
        break;
    }
  },
  swapOut() {
    const {
      name,
      methods: {
        spliceStream,
        layoutTools
      }
    } = this.props;
    spliceStream(name);
    setTimeout(() => {
      layoutTools("setStreamToView");
    }, 100);
  },
  render() {
    // console.log(this.props);
    const {
      userData,
      name,
      display_name,
      auth,
      inView,
      isFor,
      methods: {
        spliceStream,
        togglePlayer,
        alertAuthNeeded,
        layoutTools,
        panelsHandler,
      }
    } = this.props;
    const {
      menuOpen,
    } = this.state;
    switch (isFor) {
      case "video": return (
        <li className={`player-stream${inView ? " in-view" : ""}`}>
          <div className="video">
            <div className="nested">
              <iframe ref="video" src={`https://player.twitch.tv/?channel=${name}&muted=true`} frameBorder="0" scrolling="no" allowFullScreen />
            </div>
          </div>
          <div className="tools-wrapper">
            <div className={`tools${menuOpen ? " menu-open" : ""}`}>
              <div className="mobile">
                <div className="name">
                  <Link title={name} to={`/user/${name}`} onClick={togglePlayer.bind(null, "close")}>{display_name}{!display_name.match(/^[a-z0-9\_]+$/i) ? `(${name})` : ""}</Link>
                </div>
                <div className="lines" onClick={this.toggleMenu.bind(this, "toggle")}>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
              <div className="streamer">
                <Link to={`/user/${name}`} onClick={togglePlayer.bind(null, "close")}>{display_name}{!display_name.match(/^[a-z0-9\_]+$/i) ? `(${name})` : ""}</Link>
              </div>
              <div className="to-channel">
                <Link to={`https://twitch.tv/${name}`} target="_blank" onClick={togglePlayer.bind(null, "close")}>Go To Channel</Link>
              </div>
              <div className="closer" onClick={this.swapOut}>
                Close
              </div>
              <div className="refresh-video" onClick={this.refresh.bind(this, "video")}>
                Refresh Video
              </div>
              <div className="refresh-chat" onClick={this.refresh.bind(this, "chat")}>
                Refresh Chat
              </div>
              <div className="open-panels" onClick={panelsHandler.bind(null, "open", name)}>
                Open Panels
              </div>
              {
                userData ? (
                  <FollowButton name={userData.name} targetName={name} targetDisplay={display_name} auth={auth}/>
                ) : (
                  <div className="follow need-auth" onClick={alertAuthNeeded}>
                    Follow {name}
                  </div>
                )
              }
            </div>
          </div>
        </li>
      );
      case "chat": return (
        <li className={`player-stream${inView ? " in-view" : ""}`}>
          <div className={`chat`}>
            <iframe ref="chat" src={`https://www.twitch.tv/${name}/chat`} frameBorder="0" scrolling="no"></iframe>
          </div>
        </li>
      );
      default:
        console.error("Player needs to know whether to give video or give chat");
        return null;
    }
  }
})

// player component to house streams
export default React.createClass({
  displayName: "Player",
  getInitialState() {
    return {
      canScroll: true,
      streamInView: 0,
      scrollTop: 0,
      chatOpen: true
    }
  },
  layoutTools(type) {
    let { videoList } = this.refs;
    let { chatList } = this.refs;
    switch (type) {
      case "setStreamToView":
        let count = 1;
        console.log("layout", this.props.layout);
        switch (this.props.layout) {
          case "by-2":
            count = 2;
          break;
          case "by-3":
            count = 3;
          break;
        }
        console.log("scroll value", (videoList.offsetHeight / count) * this.refs.selectStream.value);
        console.log("select value", this.refs.selectStream.value);
        videoList.scrollTop = (videoList.offsetHeight / count) * this.refs.selectStream.value;
        // chatList.scrollTop = chatList.offsetHeight * this.refs.selectStream.value
        this.setState({
          streamInView: parseInt(this.refs.selectStream.value || 0)
        });
      break;
      case "setLayout":
        this.props.methods.setLayout(this.refs.selectLayout.value);
      break;
    }
  },
  listScroll(e) {},
  toggleChat(type) {
    switch (type) {
      case "close":
        this.setState({
          chatOpen: false
        });
        break;
      case "open":
        this.setState({
          chatOpen: true
        });
        break;
      case "toggle":
      default:
        console.log("no type match:", type);
        this.setState({
          chatOpen: !this.state.chatOpen
        });
    }
  },
  render() {
    let {
      userData,
      auth,
      playerState,
      methods: {
        spliceStream,
        clearPlayer,
        togglePlayer,
        alertAuthNeeded,
        setLayout,
        panelsHandler,
      },
      data: {
        dataObject
      },
      layout,
    } = this.props;
    const {
      streamInView,
      chatOpen
    } = this.state;
    var dataArray = Object.keys(dataObject);
    layout = layout || `layout-${Object.keys(dataObject).length}`;

    return (
      <div className="player">
        <div className="wrapper">
          <ul ref="videoList" onScroll={this.listScroll} className={`list video-list`}>
            {
              dataObject ? (
                dataArray.map((channelName, ind) => {
                  let channelData = dataObject[channelName];
                  console.log(streamInView, ind, streamInView === ind);
                  return (
                    <PlayerStream key={channelName} name={channelName} display_name={dataObject[channelName]} userData={userData} auth={auth} inView={streamInView === ind} isFor="video" methods={{
                      spliceStream,
                      togglePlayer,
                      panelsHandler,
                      alertAuthNeeded,
                      layoutTools: this.layoutTools
                    }} />
                  );
                })
              ) : null
            }
          </ul>
          <ul ref="chatList" onScroll={this.listScroll} className={`list chat-list${!chatOpen ? " hide-chat" : ""}`}>
            {
              dataObject ? (
                dataArray.map((channelName, ind) => {
                  let channelData = dataObject[channelName];
                  return (
                    <PlayerStream key={channelName} name={channelName} display_name={dataObject[channelName]} userData={userData} auth={auth} inView={streamInView === ind} isFor="chat" methods={{}} />
                  );
                })
              ) : null
            }
          </ul>
          <div className={`tools`}>
            <div title="Closing the player will remove all current streams" className="closer" onClick={clearPlayer}>
              Close
            </div>
            <div title="Shrink the player to the side of the browser" className="closer" onClick={togglePlayer.bind(null, "toggle")}>
              {playerState.playerCollapsed ? "Expand" : "Collapse"}
            </div>
            <div className="hide" onClick={this.toggleChat.bind(this, "toggle")}>
              {chatOpen ? "Hide" : "Show"} Chat
            </div>
            <select title="Choose a layout for the streams" ref="selectLayout" className="layout" defaultValue={0} onChange={this.layoutTools.bind(null, "setLayout")}>
              {
                ["",
                "Singular",
                dataArray.length > 2 ? "By 2" : null,
                dataArray.length > 3 ? "By 3" : null].map(layoutName => {
                  if(layoutName !== null) return (
                    <option key={layoutName} value={layoutName.toLowerCase()}>{layoutName || "Auto"}</option>
                  );
                })
              }
            </select>
            {
              dataObject &&
              layout === "singular" ||
              layout !== "layout-1" ||
              layout !== "layout-by-2" ||
              layout !== "layout-by-3" ? (
                <select title="Choose which stream and chat appears as the main or in-view stream" ref="selectStream" className="streamers" defaultValue={0} onChange={this.layoutTools.bind(null, "setStreamToView")}>
                  {
                    dataObject ? (
                      dataArray.map((channelName, ind) => {
                        return (
                          <option key={channelName} value={ind}>{channelName}</option>
                        );
                      })
                    ) : null
                  }
                </select>
              )  : null
            }
          </div>
        </div>
      </div>
    );
  }
})
