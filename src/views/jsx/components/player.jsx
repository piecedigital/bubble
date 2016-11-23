import React from "react";
import { Link, browserHistory as History } from 'react-router';
import loadData from "../../../modules/load-data";
import FollowButton from "./follow.jsx";
import StreamPanels from "./stream-panels.jsx";

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
    console.log("iframe:", iframe);
    switch (iframe) {
      case "video":
        this.refs.video.src = this.refs.video.src;
        break;
      case "chat":
        this.props.methods.refreshChat(this.props.name);
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
  componentDidMount() {
    this.refs.tools ? this.refs.tools.addEventListener("mouseleave", () => {
      // console.log("leave");
      // this.toggleMenu("close");
    }, false) : null;
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
      index,
      methods: {
        spliceStream,
        togglePlayer,
        alertAuthNeeded,
        layoutTools,
        panelsHandler,
        putInView,
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
          <div ref="tools" className="tools-wrapper">
            <div className={`tools${menuOpen ? " menu-open" : ""}`}>
              <div className="mobile">
                <div className="name">
                  <Link title={name} to={`/user/${name}`} onClick={() => {
                    togglePlayer("collapse");
                    this.toggleMenu("close");
                  }}>{display_name || name}{display_name && !display_name.match(/^[a-z0-9\_]+$/i) ? `(${name})` : ""}</Link>
                </div>
                <div className="lines" onClick={this.toggleMenu.bind(this, "toggle")}>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
              <div className="streamer">
                <Link to={`/user/${name}`} onClick={() => {
                  togglePlayer("collapse");
                  this.toggleMenu("close");
                }}>{display_name || name}{display_name && !display_name.match(/^[a-z0-9\_]+$/i) ? `(${name})` : ""}</Link>
              </div>
              <div className="to-channel">
                <Link to={`https://twitch.tv/${name}`} target="_blank" onClick={() => {
                  this.toggleMenu("close");
                }}>Visit On Twitch</Link>
              </div>
              <div className="closer" onClick={() => {
                this.swapOut();
                this.toggleMenu("close");
              }}>
                Close
              </div>
              <div className="refresh">
                <span className="title">Refresh</span><span className="video" onClick={() => {
                  this.refresh("video");
                  this.toggleMenu("close");
                }}>Video</span><span className="chat" onClick={() => {
                  this.refresh("chat");
                  this.toggleMenu("close");
                }}>Chat</span>
              </div>
              <div className="put-in-view" onClick={() => {
                putInView(index);
                this.toggleMenu("close");
              }}>
                Put In View
              </div>
              <div className="open-panels" onClick={() => {
                panelsHandler("open", name);
                this.toggleMenu("close");
              }}>
                Open Stream Panels
              </div>
              {
                userData ? (
                  <FollowButton name={userData.name} targetName={name} targetDisplay={display_name} auth={auth}/>
                ) : (
                  <div className="follow need-auth" onClick={() => {
                    alertAuthNeeded();
                    this.toggleMenu("close");
                  }}>
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
            <iframe ref={`chat`} src={`https://www.twitch.tv/${name}/chat`} frameBorder="0" scrolling="no"></iframe>
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
  putInView(index) {
    console.log(this.refs.selectStream, this.refs.selectStream.value, index);
    if(this.refs.selectStream) {
      this.refs.selectStream.value = index;
      this.setState({
        streamInView: index
      });
    }
  },
  refreshChat(name) {
    console.log(name, this[`${name}_chat`].refs.chat);
    let { chat } = this[`${name}_chat`].refs;
    chat.src = chat.src;
  },
  componentWillReceiveProps(nextProps) {
    const {
      data: {
        dataObject
      }
    } = nextProps;
    const {
      streamInView
    } = this.state;
    // console.log("receiving props", nextProps, this.props);
    const count = Object.keys(dataObject).length;
    // console.log("setting view", streamInView, count);
    if( streamInView > (count - 1) ) {
      this.setState({
        streamInView: count - 1
      })
    } else
    if( streamInView < 0 ) {
      this.setState({
        streamInView: 0
      })
    }
  },
  componentDidMount() {
    this.rescroll = setInterval(() => {
      let { videoList } = this.refs;
      videoList.scrollTop = 0;
    }, 1000);
  },
  componentWillUnmount() {
    this.rescroll = null;
  },
  render() {
    let {
      userData,
      auth,
      playerState,
      panelData,
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
                  // console.log(streamInView, ind, streamInView === ind);
                  return (
                    <PlayerStream key={channelName} name={channelName} display_name={dataObject[channelName]} userData={userData} auth={auth} inView={streamInView === ind} isFor="video" index={ind} methods={{
                      spliceStream,
                      togglePlayer,
                      panelsHandler,
                      alertAuthNeeded,
                      layoutTools: this.layoutTools,
                      putInView: this.putInView,
                      refreshChat: this.refreshChat
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
                    <PlayerStream ref={r => this[`${channelName}_chat`] = r} key={channelName} name={channelName} display_name={dataObject[channelName]} userData={userData} auth={auth} inView={streamInView === ind} isFor="chat" methods={{}} />
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
          <StreamPanels panelData={panelData} methods={{
            panelsHandler
          }} />
        </div>
      </div>
    );
  }
})
