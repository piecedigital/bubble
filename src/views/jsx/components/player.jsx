import React from "react";
import ReactDOM from "react-dom";
import { Link, browserHistory as History } from 'react-router';
import loadData from "../../../modules/client/load-data";
import { makeTime } from "../../../modules/client/helper-tools";
import FollowButton from "./follow-btn.jsx";
import StreamPanels from "./stream-panels.jsx";
import BookmarkButton from "./bookmark-btn.jsx";

// stream component for player
const PlayerStream = React.createClass({
  displayName: "PlayerStream",
  getInitialState: () => ({
    chatOpen: true,
    menuOpen: false,
    doScroll: true,
    nameScroll1: 0,
    nameScroll2: 0,
    timeOff: 0,
    time: {},
    playing: true,
    playerReady: false,
    // related to hosting
    suggestedHost: null,
    watchingHost: false,
    concurrentVOD: ""
  }),
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
    // console.log("iframe:", iframe);
    switch (iframe) {
      case "video":
        this.refs.video.getElementsByTagName("iframe")[0].src = this.refs.video.getElementsByTagName("iframe")[0].src;
        break;
      case "chat":
        this.props.methods.refreshChat(this.props.vod || this.props.name);
        break;
    }

    this._mounted ? this.setState({
      suggestedHost: null,
      watchingHost: false
    }) : null;
    this.fullHostingCheck();
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
    const node3 = (this.refs.streamerFollow);
    const node4 = (this.refs.streamerShare);
    const nodesToScroll = [node1, node2, node3, node4];
    setTimeout(() => {
      nodesToScroll.map((node, ind) => {
        if(node && node.offsetWidth > node.parentNode.offsetWidth) {
          let newLeft = (parseInt(node.style.left || 0) - 1);
          this._mounted ? this.setState({
            [`nameScroll${ind + 1}`]: newLeft
          }, () => {
            let nodeRight = parseInt(node.style.left) + node.offsetWidth;
            if(nodeRight <= 0) {
              this._mounted ? this.setState({
                [`nameScroll${ind + 1}`]: node.parentNode.offsetWidth
              }) : null;
            }
          }) : null;
        }
      });

      if(this.state.doScroll) {
        this.nameScroll();
      } else {
        this._mounted ? this.setState(Object.assign.apply(null, [{}].concat(nodesToScroll.map(function (_, ind) {
          return {
            ["nameScroll" + (ind + 1)]: 0,
          };
        })) )) : null;
      }
    }, 10);
  },
  makePlayer(overrideName) {
    const { vod, name } = this.props;
    let options = {};
    vod ? options.video = vod : options.channel = overrideName || name;
    // console.log("player options", options);
    const player = new Twitch.Player(this.refs.video, options);
    this.player = player;
    player.addEventListener(Twitch.Player.READY, () => {
      player.setMuted(true);
      console.log('Player is ready!');
      this.setState({
        playerReady: true
      });
      if(vod) {
        this.timestampTimeTicker = setInterval(() => {
          const time = player.getCurrentTime();
          // console.log("time", time);
          this.setState({
            time: makeTime(time)
          });
        }, 1000);
      } else {
        this.timestampTimeTicker = setInterval(() => {
          if(this.timestampFocus() || !this.state.playing) {
            this.setState({
              timeOff: this.state.timeOff + 1
            });
            return;
          }
          const timeInSeconds = (this.state.time.raw || 0) + 1 + this.state.timeOff;
          const timeObject = makeTime(timeInSeconds);
          // console.log("time", timeObject.formatted);
          this.setState({
            timeOff: 0,
            time: timeObject
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
    player.addEventListener(Twitch.Player.PAUSE, () => {
      this.setState({
        playing: false
      });
      console.log('Player is paused!');
    });
    player.addEventListener(Twitch.Player.ONLINE, () => {
      console.log('Player is online!');
      if(this.state.suggestedHost) {
        if(!this.state.watchingHost) {
          this.setState({
            suggestedHost: null
          });
        }
      }
      this.checkOnlineStatus()
      .then(([bool, stream]) => {
        if(bool) {
          const date = new Date(stream.created_at);
          const ms = date.getTime();
          const s = Math.abs(ms / 1000);

          this.setState({
            time: makeTime((Date.now() / 1000) - s)
          });
        } else {
          this.setState({
            time: 0
          });
        }
      });

      this.getLatestVOD();
    });
    player.addEventListener(Twitch.Player.OFFLINE, () => {
      console.log('Player is offline!');
      this.hostTicker = setInterval(() => {
        if(!this._mounted) {
          clearInterval(this.hostTicker);
          delete this.hostTicker;
          return;
        }

        if(this.state.suggestedHost) return clearInterval(this.hostTicker);
        this.checkHost()
        .then(data => {
          if(data.hosts[0].target_login) {
            clearInterval(this.hostTicker);
            this.suggestHost(data)
          };
        });
      }, 1000 * 5);
    });
  },
  replaceVideo(username, returnToHoster) {
    this.player.setChannel(username);
    this.setState({
      watchingHost: !returnToHoster
    })

    // recheck hosting
    if(returnToHoster) {
      this.fullHostingCheck()
    }
  },
  getLatestVOD(shouldReturn, tries) {
    const {
      name
    } = this.props;

    loadData.call(this, e => console.error(e.stack || e), {
      username: name,
      limit: 1
    })
    .then(({getVideos}) => {
      getVideos()
      .then(data => {
        const videoData = data.videos.pop();
        // let's see if the video is still recording
        if(videoData && videoData.status === "recording") {
          this.setState({
            concurrentVOD: videoData._id
          })
        } else {
          if(tries < 1000) {
            setTimeout(this.getLatestVOD.bind(this, false, (tries || 0) + 1), 1000 * 30);
          }
        }
      })
      .catch(e => console.error(e))
    })
    .catch(e => console.error(e))
  },
  migrateStream(username, displayName) {
    const {
      name,
      vod,
      index,
      inVew,
      methods: {
        replaceStream,
        putInView,
        layoutTools
      }
    } = this.props;

    replaceStream(name, vod, username, displayName);
    setTimeout(() => {
      if(inVew) {
        putInView(index);
        layoutTools("setStreamToView");
      }
    }, 100);
  },
  pauseVOD() {
    this.player.pause();
  },
  checkOnlineStatus() {
    const { name } = this.props;

    return new Promise(function(resolve, reject) {
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
          console.log("Check online status", data);
          resolve([!!data.stream, data.stream]);
        })
        .catch(e => console.error(e ? e.stack : e) );
      })
      .catch(e => console.error(e ? e.stack : e));
    });
  },
  checkHost() {
    const { name } = this.props;

    return new Promise(function(resolve, reject) {
      loadData.call(this, e => {
        console.error(e.stack);
      }, {
        username: name
      })
      .then(methods => {
        methods
        .getHostingByName()
        .then(data => {
          // console.log(name, ", data:", data);
          console.log("Check host", data);
          resolve(data);
        })
        .catch(e => console.error(e ? e.stack : e) );
      })
      .catch(e => console.error(e ? e.stack : e));
    });

  },
  suggestHost(data) {
    // console.log("Suggest host", data);
    var username = data.hosts[0].target_login;
    var displayName = data.hosts[0].target_display_name;
    this.setState({
      suggestedHost: {
        username,
        displayName
      }
    });
  },
  fullHostingCheck() {
    this.checkOnlineStatus()
    .then(bool => {
      if(!bool) {
        this.checkHost()
        .then(data => {
          if(data.hosts[0].target_login) {
            this.suggestHost(data)
          };
        });
      }
    })
  },
  addToPlayer() {
    const {
      methods: {
        appendStream
      }
    } = this.props;
    const { suggestedHost } = this.state;
    this.setState({
      suggestedHost: null
    });
    appendStream(suggestedHost.username, suggestedHost.displayName)
  },
  timestampFocus(bool) {
    if(this.refs.timestamp) {
      if(bool === false) this.refs.timestamp.blur();
      var focus = this.refs.timestamp === document.activeElement;
      return focus;
    }
  },
  componentDidMount() {
    this._mounted = true;
    this.refs.tools ? this.refs.tools.addEventListener("mouseleave", () => {
      // console.log("leave");
      this.timestampFocus(false);
      this.toggleMenu("close");
    }, false) : null;
    if(this.props.isFor === "video") this.makePlayer();

    this.checkOnlineStatus()
    .then(([bool, stream]) => {
      if(!bool) {
        this.checkHost()
        .then(data => {
          if(data.hosts[0].target_login) this.suggestHost(data);
        });
      }
      if(bool) {
        // console.log("created stream time", stream.created_at);
        const date = new Date(stream.created_at);
        const ms = date.getTime();
        // console.log("ms", ms);
        const s = Math.abs(ms / 1000);
        // console.log("s", s);

        this.setState({
          time: makeTime((Date.now() / 1000) - s)
        })
      }
    })
  },
  componentWillUnmount() {
    this.refs.video ? this.refs.video.src = "about:blank" : null;
    delete this._mounted;
    this.player = null;
    clearInterval(this.timestampTimeTicker);
    clearInterval(this.hostTicker);
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
      order,
      vod,
      versionData,
      methods: {
        appendStream,
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
      nameScroll3,
      nameScroll4,
      time,
      playing,
      playerReady,
      suggestedHost,
      watchingHost,
      concurrentVOD
    } = this.state;

    var timestamp = `${time.hour > 0 ? time.hour + "h" : ""}${time.minute > 0 ? time.minute + "m" : ""}${time.second > 0 ? time.second + "s" : ""}`;

    switch (isFor) {
      case "video": return (
        <li className={`player-stream${inView ? " in-view" : ""}${order === 0 ? " top-player" : ""}`} style={{
          order
        }}>
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
                <div className="lines" {
                  ...{
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
                    title={`Go to ${name}&#39;s profile`}
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
                      nbps={true}
                      showname={false}
                      name={userData.name}
                      targetName={name}
                      targetDisplay={display_name}
                      auth={auth}
                    />,
                    // <div className="" onMouseEnter={this.mouseEvent.bind(this, "enter")} onMouseLeave={this.mouseEvent.bind(this, "leave")}>
                    //   <span ref="streamerFollow" style={{
                    //     position: "relative",
                    //     left: nameScroll3,
                    //     transition: "0s all" }}>
                    //     <FollowButton
                    //       key="follow"
                    //       className="no-underline"
                    //       nbps={true}
                    //       name={userData.name}
                    //       targetName={name}
                    //       targetDisplay={display_name}
                    //       auth={auth}
                    //     />
                    //   </span>
                    // </div>,
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
                this.toggleMenu("close"); }} onMouseEnter={this.mouseEvent.bind(this, "enter")} onMouseLeave={this.mouseEvent.bind(this, "leave")}>
                <span ref="streamerShare" style={{
                  position: "relative",
                  left: nameScroll4,
                  transition: "0s all" }}>
                  Share&nbsp;{display_name || name}&#39;s&nbsp;Stream
                </span>
              </div>
              {/* VOD time stamp */}
              {
                // vod && playerReady ? (
                (vod || concurrentVOD) && playerReady ? (
                  <div className="timestamp">
                    {
                      !playing || concurrentVOD ? (
                        <input ref="timestamp" type="text" value={`https://www.twitch.tv/videos/${(vod || concurrentVOD || "").replace(/^v/, "")}?t=${timestamp}`} onClick={e => e.target.select()} readOnly />
                      ) : (
                        <span onClick={this.pauseVOD}>Get Timestamped VOD Link</span>
                      )
                    }
                    <div className="timeOverlay"><span>{timestamp}</span></div>
                  </div>
                ) : null
              }
              <div className="closer bgc-orange-priority" onClick={() => {
                this.swapOut();
                this.toggleMenu("close"); }}>
                Close This Stream
              </div>
            </div>
            <div className={`tools host${suggestedHost ? " menu-open" : ""}`}>
              {
                suggestedHost ? (
                  <div className="host">
                    <span>
                      {
                        watchingHost ? (
                          <div className="main">
                            {"Now watching "}
                            <Link
                              title={`Go to ${suggestedHost.displayName}' profile`}
                              className="bold"
                              to={`/profile/${suggestedHost.displayName}`}
                              onClick={() => {
                                togglePlayer("collapse");
                                this.toggleMenu("close");
                              }}>{suggestedHost.displayName}</Link>
                            {" via "}
                            <Link
                              title={`Go to ${display_name}' profile`}
                              className="bold"
                              to={`/profile/${display_name}`}
                              onClick={() => {
                                togglePlayer("collapse");
                                this.toggleMenu("close");
                              }}>{display_name}</Link>
                            {"."}
                          </div>
                        ) : (
                          <div className="main">
                            <Link
                              title={`Go to ${display_name}' profile`}
                              className="bold"
                              to={`/profile/${display_name}`}
                              onClick={() => {
                                togglePlayer("collapse");
                                this.toggleMenu("close");
                              }}>{display_name}</Link>
                            {" is hosting "}
                            <Link
                              title={`Go to ${suggestedHost.displayName}' profile`}
                              className="bold"
                              to={`/profile/${suggestedHost.displayName}`}
                              onClick={() => {
                                togglePlayer("collapse");
                                this.toggleMenu("close");
                              }}>{suggestedHost.displayName}</Link>
                            {"."}
                          </div>
                        )
                      }
                      {" "}
                      <span
                        title="Add this stream to the player"
                        className="btn"
                        onClick={this.addToPlayer}>
                        Add To Player
                      </span>
                      {" "}
                      {
                        !watchingHost ? (
                          [
                            <span
                              key="0"
                              title="Replaces the current video with the hosted video, but doesn't change the chat"
                              className="btn"
                              onClick={() => {
                                this.replaceVideo(suggestedHost.username)
                              }}>
                              Replace Video
                            </span>,
                            " ",
                            <span
                              key="1"
                              title="Switch the current stream player to the hosted stream"
                              className="btn"
                              onClick={() => {
                                this.migrateStream(suggestedHost.username, suggestedHost.displayName)
                              }}>
                              Migrate Stream
                            </span>
                          ]
                        ) : (
                          [
                            <span
                              key="0"
                              title="Return the video to the hosting streamer"
                              className="btn"
                              onClick={() => {
                                this.replaceVideo(name, true)
                              }}>
                              Return To Hoster
                            </span>,
                            " ",
                            <span
                              key="1"
                              title="Switch the current stream player to the hosted stream"
                              className="btn"
                              onClick={() => {
                                this.migrateStream(suggestedHost.username, suggestedHost.displayName)
                              }}>
                              Migrate Stream
                            </span>
                          ]
                        )
                      }
                    </span>
                  </div>
                ) : null
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
    const {
      data: {
        dataObject: streamersInPlayer,
        streamOrderMap
      }
    } = this.props;

    switch (type) {
      case "setStreamToView":
        let count = 1;
        switch (this.props.layout) {
          case "by-2":
            count = 2;
          break;
          case "by-3":
            count = 3;
          break;
        }
        // make reference array. should match the selectStream element
        const streamersRef = Object.keys(streamersInPlayer);
        // get value based on index of streamOrderMap
        let value = streamOrderMap.indexOf(streamersRef[this.refs.selectStream.value]);
        value = value === -1 ? this.refs.selectStream.value : value;
        // console.log("in-viewing:", streamersRef, streamOrderMap, value);

        videoList.scrollTop = (videoList.offsetHeight / count) * value;
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
  generateMultistreamLink() {
    const {
      data: {
        dataObject
      }
    } = this.props;

    var dataArray = Object.keys(dataObject);

    return `${window ? window.location.protocol : "http:"}//${window ? window.location.host : "amorrius.net"}/multistream/${dataArray.join("/")}`
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
        appendStream,
        spliceStream,
        replaceStream,
        clearPlayer,
        togglePlayer,
        alertAuthNeeded,
        setLayout,
        panelsHandler,
        popUpHandler,
        alertHandler,
      },
      data: {
        dataObject,
        streamOrderMap
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

                  const getOrder = function (fallbackIndex) {
                    let order = streamOrderMap.indexOf(key);
                    return order >= 0 ? order : fallbackIndex;
                  }

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
                      order={getOrder(ind)}
                      methods={{
                        appendStream,
                        spliceStream,
                        replaceStream,
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
            <div title="Closes all streams in the player" className="main-tool closer bold bgc-red-priority" onClick={clearPlayer}>
              x
            </div>
            <div title="Shrink the player to the side of the browser" className="main-tool flexer" onClick={togglePlayer.bind(null, "toggle")}>
              <div className="image-hold">
                <img src={`/media/expand-collapse-icon.png`} style={{
                  transform: playerState.playerCollapsed ? "scaleX(-1)" : ""
                }}/>
              </div>
              {/* {playerState.playerCollapsed ? "Expand" : "Collapse"} */}
            </div>
            <div className="main-tool hide" title={`${chatOpen ? "Hide" : "Show"} Chat`} onClick={this.toggleChat.bind(this, "toggle")}>
              {/* {chatOpen ? "Hide" : "Show"} Chat */}
              <div className="image-hold">
                <img src={`/media/hide-chat-icon.png`} style={{
                  transform: chatOpen ? "scaleX(-1)" : ""
                }}/>
              </div>
            </div>
            <div className="wrap">
              <select title="Choose a layout for the streams" ref="selectLayout" className="main-tool  layout" defaultValue={0} onChange={this.layoutTools.bind(null, "setLayout")}>
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
              <div className="hover-msg" title="Choose a layout for the streams"><span>
                <div className="image-hold">
                  <img src={`/media/layout-icon.png`}/>
                </div>
              </span></div>
              {/* <div className="hover-msg"><span>Change Layout</span></div> */}
            </div>
            {
              dataObject &&
              layout === "singular" ||
              layout !== "layout-1" ||
              layout !== "layout-by-2" ||
              layout !== "layout-by-3" ? (
                <div className="wrap">
                  <select title="Choose which stream and chat appears as the main or in-view stream" ref="selectStream" className="main-tool streamers" defaultValue={0} onChange={this.layoutTools.bind(null, "setStreamToView")}>
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
                  <div className="hover-msg" title="Choose which stream and chat appears as the main or in-view stream"><span>
                    <div className="image-hold">
                      <img src={`/media/in-view-icon.png`}/>
                    </div>
                  </span></div>
                  {/* <div className="hover-msg"><span>Change In-View Stream/Chat</span></div> */}
                </div>
              )  : null
            }
            <div className="wrap">
              <div className="main-tool multistream" onClick={() => {
                alertHandler({
                  message: `Share this link with your friends!`,
                  options: ["close"],
                  inputData: this.generateMultistreamLink()
                });
              }}><span>Generate Multistream Link</span></div>
              <div className="hover-msg" title="Generate Multistream Link"><span>
                <div className="image-hold">
                  <img src={`/media/multi-icon.png`}/>
                </div>
              </span></div>
              {/* <div className="hover-msg"><span>Generate Multistream Link</span></div> */}
            </div>
            <div className="wrap">
              <div className="main-tool reorder" onClick={() => {
                popUpHandler("streamReorderer");
              }}><span>Re-Order Streams</span></div>
              <div className="hover-msg" title="Re-Order Streams"><span>
                <div className="image-hold">
                  <img src={`/media/reorder-icon.png`}/>
                </div>
              </span></div>
              {/* <div className="hover-msg"><span>Re-Order Streams</span></div> */}
            </div>
          </div>
          <StreamPanels panelData={panelData} methods={{
            panelsHandler
          }} />
        </div>
      </div>
    );
  }
})
