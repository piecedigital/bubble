import React from "react";
import ReactDOM from "react-dom";
import { Link, browserHistory as History } from 'react-router';
import loadData from "../../../modules/client/load-data";
import FollowButton from "./follow-btn.jsx";
import StreamPanels from "./stream-panels.jsx";
import BookmarkButton from "./bookmark-btn.jsx";

// stream component for player
const PlayerStream = React.createClass({
  displayName: "PlayerStream",
  getInitialState: () => ({ chatOpen: true, menuOpen: false, doScroll: true, nameScroll1: 0, nameScroll2: 0, time: 0, playing: true, playerReady: false }),
  toggleMenu(type) {
    switch (type) {
      case "close":
        this._mounted ? this.setState({
          menuOpen: false
        }) : null;
        break;
      case "open":
        this._mounted ? this.setState({
          menuOpen: true
        }) : null;
        break;
      case "toggle":
      default:
        console.log("no type match:", type);
        this._mounted ? this.setState({
          menuOpen: !this.state.menuOpen
        }) : null;
    }
  },
  refresh(iframe) {
    console.log("iframe:", iframe);
    switch (iframe) {
      case "video":
        this.refs.video.getElementsByTagName("iframe")[0].src = this.refs.video.getElementsByTagName("iframe")[0].src;
        break;
      case "chat":
        this.props.methods.refreshChat(this.props.vod || this.props.name);
        break;
    }
  },
  swapOut() {
    const {
      name,
      vod,
      methods: {
        spliceStream,
        layoutTools
      }
    } = this.props;
    spliceStream(name, vod);
    setTimeout(() => {
      layoutTools("setStreamToView");
    }, 100);
  },
  mouseEvent(action, e) {
    // console.log("name - mouse", action);
    switch (action) {
      case "enter":
        this._mounted ? this.setState({
          doScroll: true
        }) : null;
        this.nameScroll();
        break;
      case "leave":
        this._mounted ? this.setState({
          doScroll: false
        }) : null;
        break;
    }
  },
  nameScroll() {
    const node1 = (this.refs.streamerName1);
    const node2 = (this.refs.streamerName2);
    // console.log(node1);
    // console.log(node2);
    setTimeout(() => {
      [node1, node2].map((node, ind) => {
        if(node.offsetWidth > this.refs.mobileName.offsetWidth) {
          let newLeft = (parseInt(node.style.left || 0) - 1);
          this._mounted ? this.setState({
            [`nameScroll${ind + 1}`]: newLeft
          }, () => {
            let nodeRight = parseInt(node.style.left) + node.offsetWidth;
            if(nodeRight <= 0) {
              this._mounted ? this.setState({
                [`nameScroll${ind + 1}`]: this.refs.mobileName.offsetWidth
              }) : null;
            }
          }) : null;
        }
      });

      if(this.state.doScroll) {
        this.nameScroll();
      } else {
        this._mounted ? this.setState({
          nameScroll1: 0,
          nameScroll2: 0,
        }) : null;
      }
    }, 10);
  },
  makePlayer() {
    const { vod, name } = this.props;
    let options = {};
    vod ? options.video = vod : options.channel = name;
    // console.log("player options", options);
    const player = new Twitch.Player(this.refs.video, options);
    this.player = player;
    player.setMuted(true);
    player.addEventListener(Twitch.Player.READY, () => {
      console.log('Player is ready!');
      this.setState({
        playerReady: true
      });
      if(vod) {
        this.ticker = setInterval(() => {
          const time = player.getCurrentTime();
          // console.log("time", time);
          this.setState({
            time: this.makeTime(time)
          });
        }, 1000);
      }
    });
    player.addEventListener(Twitch.Player.PLAY, () => {
      this.setState({
        playing: true
      });
      console.log('Player is playing!');
    });
    if(vod) {
      player.addEventListener(Twitch.Player.PAUSE, () => {
        this.setState({
          playing: false
        });
        console.log('Player is paused!');
      });
    }
  },
  makeTime(time) {
    // http://stackoverflow.com/a/11486026/4107851
    const hour = Math.floor(time / 3600);
    const minute = Math.floor((time % 3600) / 60);
    const second = Math.floor(time % 60);
    let formatted = "";

    if(hour > 0) {
      formatted += `${hour}:${minute < 10 ? "0" : ""}`;
    }
    formatted += `${minute}:${second < 10 ? "0" : ""}${second}`;
    // console.log(formatted);
    return {
      hour,
      minute,
      second,
      formatted
    }
  },
  pauseVOD() {
    this.player.pause();
  },
  componentDidMount() {
    this._mounted = true;
    this.refs.tools ? this.refs.tools.addEventListener("mouseleave", () => {
      // console.log("leave");
      this.toggleMenu("close");
    }, false) : null;
    if(this.props.isFor === "video") this.makePlayer();
  },
  componentWillUnmount() {
    delete this._mounted;
    clearInterval(this.ticker);
  },
  render() {
    // console.log(this.props);
    const {
      fireRef,
      userData,
      name,
      display_name,
      auth,
      inView,
      isFor,
      index,
      vod,
      versionData,
      methods: {
        spliceStream,
        togglePlayer,
        alertAuthNeeded,
        layoutTools,
        panelsHandler,
        putInView,
        popUpHandler,
        alertHandler,
      }
    } = this.props;
    const {
      menuOpen,
      nameScroll1,
      nameScroll2,
      time,
      playing,
      playerReady,
    } = this.state;
    switch (isFor) {
      case "video": return (
        <li className={`player-stream${inView ? " in-view" : ""}`}>
          <div className="video">
            <div ref="video" className="nested player-div">
              {/* <iframe ref="video" src={`https://player.twitch.tv/?${vod ? `video=${vod}` : `channel=${name}`}&muted=true`} frameBorder="0" scrolling="no" allowFullScreen /> */}
            </div>
          </div>
          <div ref="tools" className="tools-wrapper">
            <div className={`tools${menuOpen ? " menu-open" : ""}`}>
              <div className="mobile">
                <div ref="mobileName" onMouseEnter={this.mouseEvent.bind(this, "enter")} onMouseLeave={this.mouseEvent.bind(this, "leave")} className="name">
                  <span ref="streamerName1" style={{
                    position: "relative",
                    left: nameScroll1,
                    transition: "0s all" }}>
                    <Link
                      title={`Go to ${name} on Twitch.tv`}
                      className="bold"
                      to={`/profile/${name}`}
                      onClick={() => {
                      togglePlayer("collapse");
                      this.toggleMenu("close");
                    }}>{display_name || name}{vod ? `/${vod}` : display_name && !display_name.match(/^[a-z0-9\_]+$/i) ? `(${name})` : ""}</Link>
                  </span>
                </div>
                <div className="lines" {...{
                  onClick: this.toggleMenu.bind(this, "toggle"),
                  onMouseEnter: this.toggleMenu.bind(this, "open"),
                }}>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
              <div onMouseEnter={this.mouseEvent.bind(this, "enter")} onMouseLeave={this.mouseEvent.bind(this, "leave")} className="streamer">
                <span ref="streamerName2" style={{
                  position: "relative",
                  left: nameScroll2,
                  transition: "0s all" }}>
                  <Link
                    title={`Go to ${name} on Twitch.tv`}
                    className="bold"
                    to={`/profile/${name}`}
                    onClick={() => {
                    togglePlayer("collapse");
                    this.toggleMenu("close");
                  }}>{vod ? <span className="vod">VOD: </span> : ""}{display_name || name}{vod ? `/${vod}` : display_name && !display_name.match(/^[a-z0-9\_]+$/i) ? `(${name})` : ""}</Link>
                </span>
              </div>
              <div className="to-channel">
                <Link to={`https://twitch.tv/${name}`} target="_blank" onClick={() => {
                  this.toggleMenu("close");
                }}>Visit On Twitch</Link>
              </div>
              <div className="put-in-view bgc-green-priority" onClick={() => {
                putInView(index);
                this.toggleMenu("close"); }}>
                Put In View
              </div>
              <div className="refresh">
                <span className="title bold">Refresh:</span><span className="video" onClick={() => {
                  this.refresh("video");
                  this.toggleMenu("close"); }}>
                  Video</span>/<span className="chat" onClick={() => {
                  this.refresh("chat");
                  this.toggleMenu("close"); }}>
                  Chat</span>
              </div>
              <div className="open-panels" onClick={() => {
                panelsHandler("open", name);
                this.toggleMenu("close"); }}>
                Open Stream Panels
              </div>
              <BookmarkButton
                className="no-underline"
                named
                fireRef={fireRef}
                userData={userData}
                givenUsername={name}
                versionData={versionData}/>
              {
                userData ? (
                  [
                    <FollowButton
                      key="follow"
                      className="no-underline"
                      name={userData.name}
                      targetName={name}
                      targetDisplay={display_name}
                      auth={auth}
                    />,
                    <div
                      key="ask"
                      className="ask"
                      onClick={() => {
                      popUpHandler("askQuestion", {
                        receiver: name,
                        sender: userData.name
                      });
                      this.toggleMenu("close"); }}>
                      Ask A Question
                    </div>
                  ]
                ) : (
                  <div className="follow need-auth" onClick={() => {
                    alertAuthNeeded();
                    this.toggleMenu("close"); }}>
                    Follow {name}
                  </div>
                )
              }
              <div className="open-alert" onClick={() => {
                alertHandler({
                  message: `Share ${display_name || name}&#39;s Stream`,
                  options: ["close"],
                  links: ["twitter", "facebook"],
                  state: {
                    name
                  }
                });
                this.toggleMenu("close"); }}>
                Share {display_name || name}&#39;s Stream
              </div>
              {
                vod && playerReady ? (
                  <div className="closer">
                    {
                      !playing ? (
                        <input type="text" value={`https://www.twitch.tv/videos/${vod}?t=${time.hour > 0 ? time.hour + "h" : ""}${time.minute > 0 ? time.minute + "m" : ""}${time.second > 0 ? time.second + "s" : ""}`} onClick={e => e.target.select()} readOnly />
                      ) : (
                        <span onClick={this.pauseVOD}>Click/Pause VOD For Timestamped Link</span>
                      )
                    }
                  </div>
                ) : null
              }
              <div className="closer bgc-orange-priority" onClick={() => {
                this.swapOut();
                this.toggleMenu("close"); }}>
                Close This Stream
              </div>
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
    let { chat } = this.refs[`${name}_chat`].refs;
    console.log(name, chat);
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
      // videoList.scrollTop = 0;
    }, 1000);
  },
  componentWillUnmount() {
    this.rescroll = null;
  },
  render() {
    const {
      fireRef,
      userData,
      auth,
      playerState,
      panelData,
      versionData,
      methods: {
        spliceStream,
        clearPlayer,
        togglePlayer,
        alertAuthNeeded,
        setLayout,
        panelsHandler,
        popUpHandler,
        alertHandler,
      },
      data: {
        dataObject
      },
    } = this.props;
    let {
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
                dataArray.map((key, ind) => {
                  var isObject = typeof dataObject[key] === "object";
                  if(isObject) {
                    var {
                      username,
                      displayName,
                      id,
                      vod
                    } = dataObject[key];
                  }
                  let channelData = dataObject[key];
                  // console.log(streamInView, ind, streamInView === ind);
                  return (
                    <PlayerStream
                      key={key}
                      fireRef={fireRef}
                      versionData={versionData}
                      vod={isObject ? id : false}
                      name={isObject ? username : key}
                      display_name={isObject ? displayName : dataObject[key]}
                      userData={userData}
                      auth={auth}
                      inView={streamInView === ind}
                      isFor="video"
                      index={ind}
                      methods={{
                        spliceStream,
                        togglePlayer,
                        panelsHandler,
                        alertAuthNeeded,
                        popUpHandler,
                        alertHandler,
                        layoutTools: this.layoutTools,
                        putInView: this.putInView,
                        refreshChat: this.refreshChat }} />
                  );
                })
              ) : null
            }
          </ul>
          <ul ref="chatList" onScroll={this.listScroll} className={`list chat-list${!chatOpen ? " hide-chat" : ""}`}>
            {
              dataObject ? (
                dataArray.map((key, ind) => {
                  var isObject = typeof dataObject[key] === "object";
                  if(isObject) {
                    var {
                      username,
                      displayName,
                      id,
                      vod
                    } = dataObject[key];
                  }
                  let channelData = dataObject[key];
                  return (
                    <PlayerStream ref={`${key}_chat`} key={key} vod={isObject ? id : false} name={isObject ? username : key} display_name={dataObject[key]} userData={userData} auth={auth} inView={streamInView === ind} isFor="chat" methods={{}} />
                  );
                })
              ) : null
            }
          </ul>
          <div className={`tools`}>
            <div title="Closes all streams in the player" className="closer bold bgc-red-priority" onClick={clearPlayer}>
              x
            </div>
            <div title="Shrink the player to the side of the browser" className="flexer" onClick={togglePlayer.bind(null, "toggle")}>
              {playerState.playerCollapsed ? "Expand" : "Collapse"}
            </div>
            <div className="hide" onClick={this.toggleChat.bind(this, "toggle")}>
              {chatOpen ? "Hide" : "Show"} Chat
            </div>
            <div className="wrap">
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
              <div className="hover-msg"><span>Change Layout</span></div>
            </div>
            {
              dataObject &&
              layout === "singular" ||
              layout !== "layout-1" ||
              layout !== "layout-by-2" ||
              layout !== "layout-by-3" ? (
                <div className="wrap">
                  <select title="Choose which stream and chat appears as the main or in-view stream" ref="selectStream" className="streamers" defaultValue={0} onChange={this.layoutTools.bind(null, "setStreamToView")}>
                    {
                      dataObject ? (
                        dataArray.map((key, ind) => {
                          return (
                            <option key={key} value={ind}>{key}</option>
                          );
                        })
                      ) : null
                    }
                  </select>
                  <div className="hover-msg"><span>Change In-View Stream/Chat</span></div>
                </div>
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
