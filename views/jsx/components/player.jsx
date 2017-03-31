"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouter = require('react-router');

var _modulesClientLoadData = require("../../../modules/client/load-data");

var _modulesClientLoadData2 = _interopRequireDefault(_modulesClientLoadData);

var _followBtnJsx = require("./follow-btn.jsx");

var _followBtnJsx2 = _interopRequireDefault(_followBtnJsx);

var _streamPanelsJsx = require("./stream-panels.jsx");

var _streamPanelsJsx2 = _interopRequireDefault(_streamPanelsJsx);

var _bookmarkBtnJsx = require("./bookmark-btn.jsx");

var _bookmarkBtnJsx2 = _interopRequireDefault(_bookmarkBtnJsx);

// stream component for player
var PlayerStream = _react2["default"].createClass({
  displayName: "PlayerStream",
  getInitialState: function getInitialState() {
    return {
      chatOpen: true,
      menuOpen: false,
      doScroll: true,
      nameScroll1: 0,
      nameScroll2: 0,
      time: 0,
      playing: true,
      playerReady: false,
      // related to hosting
      suggestedHost: null,
      watchingHost: false
    };
  },
  toggleMenu: function toggleMenu(type) {
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
  refresh: function refresh(iframe) {
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
  swapOut: function swapOut() {
    var _props = this.props;
    var name = _props.name;
    var vod = _props.vod;
    var _props$methods = _props.methods;
    var spliceStream = _props$methods.spliceStream;
    var layoutTools = _props$methods.layoutTools;

    spliceStream(name, vod);
    setTimeout(function () {
      layoutTools("setStreamToView");
    }, 100);
  },
  mouseEvent: function mouseEvent(action, e) {
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
  nameScroll: function nameScroll() {
    var _this = this;

    var node1 = this.refs.streamerName1;
    var node2 = this.refs.streamerName2;
    // console.log(node1);
    // console.log(node2);
    setTimeout(function () {
      [node1, node2].map(function (node, ind) {
        if (node.offsetWidth > _this.refs.mobileName.offsetWidth) {
          var newLeft = parseInt(node.style.left || 0) - 1;
          _this._mounted ? _this.setState(_defineProperty({}, "nameScroll" + (ind + 1), newLeft), function () {
            var nodeRight = parseInt(node.style.left) + node.offsetWidth;
            if (nodeRight <= 0) {
              _this._mounted ? _this.setState(_defineProperty({}, "nameScroll" + (ind + 1), _this.refs.mobileName.offsetWidth)) : null;
            }
          }) : null;
        }
      });

      if (_this.state.doScroll) {
        _this.nameScroll();
      } else {
        _this._mounted ? _this.setState({
          nameScroll1: 0,
          nameScroll2: 0
        }) : null;
      }
    }, 10);
  },
  makePlayer: function makePlayer(overrideName) {
    var _this2 = this;

    var _props2 = this.props;
    var vod = _props2.vod;
    var name = _props2.name;

    var options = {};
    vod ? options.video = vod : options.channel = overrideName || name;
    // console.log("player options", options);
    var player = new Twitch.Player(this.refs.video, options);
    this.player = player;
    player.addEventListener(Twitch.Player.READY, function () {
      player.setMuted(true);
      console.log('Player is ready!');
      _this2.setState({
        playerReady: true
      });
      if (vod) {
        _this2.VODTimeTicker = setInterval(function () {
          var time = player.getCurrentTime();
          // console.log("time", time);
          _this2.setState({
            time: _this2.makeTime(time)
          });
        }, 1000);
      }
    });
    player.addEventListener(Twitch.Player.PLAY, function () {
      _this2.setState({
        playing: true
      });
      console.log('Player is playing!');
    });
    player.addEventListener(Twitch.Player.PAUSE, function () {
      _this2.setState({
        playing: false
      });
      console.log('Player is paused!');
    });
    player.addEventListener(Twitch.Player.ONLINE, function () {
      console.log('Player is online!');
      if (_this2.state.suggestedHost) {
        if (!_this2.state.watchingHost) {
          _this2.setState({
            suggestedHost: null
          });
        }
      }
    });
    player.addEventListener(Twitch.Player.OFFLINE, function () {
      console.log('Player is offline!');
      _this2.hostTicker = setInterval(function () {
        if (_this2.state.suggestedHost) return clearInterval(_this2.hostTicker);
        _this2.checkHost().then(function (data) {
          if (data.hosts[0].target_login) {
            clearInterval(hostTicker);
            _this2.suggestHost(data);
          };
        });
      }, 1000 * 5);
    });
  },
  replaceVideo: function replaceVideo(username, returnToHoster) {
    this.player.setChannel(username);
    this.setState({
      watchingHost: !returnToHoster
    });

    // recheck hosting
    if (returnToHoster) {
      this.fullHostingCheck();
    }
  },
  migrateStream: function migrateStream(username, displayName) {
    var _props3 = this.props;
    var name = _props3.name;
    var vod = _props3.vod;
    var _props3$methods = _props3.methods;
    var replaceStream = _props3$methods.replaceStream;
    var appendStream = _props3$methods.appendStream;
    var spliceStream = _props3$methods.spliceStream;
    var layoutTools = _props3$methods.layoutTools;

    // appendStream(username, displayName);
    // setTimeout(() => {
    //   spliceStream(name, vod);
    //   setTimeout(() => {
    //     layoutTools("setStreamToView");
    //   }, 100);
    // }, 100);
    replaceStream(name, vod, username, displayName);
    setTimeout(function () {
      layoutTools("setStreamToView");
    }, 100);
  },
  makeTime: function makeTime(time) {
    // http://stackoverflow.com/a/11486026/4107851
    var hour = Math.floor(time / 3600);
    var minute = Math.floor(time % 3600 / 60);
    var second = Math.floor(time % 60);
    var formatted = "";

    if (hour > 0) {
      formatted += hour + ":" + (minute < 10 ? "0" : "");
    }
    formatted += minute + ":" + (second < 10 ? "0" : "") + second;
    // console.log(formatted);
    return {
      hour: hour,
      minute: minute,
      second: second,
      formatted: formatted
    };
  },
  pauseVOD: function pauseVOD() {
    this.player.pause();
  },
  checkOnlineStatus: function checkOnlineStatus() {
    var name = this.props.name;

    return new Promise(function (resolve, reject) {
      _modulesClientLoadData2["default"].call(this, function (e) {
        console.error(e.stack);
      }, {
        username: name
      }).then(function (methods) {
        methods.getStreamByName().then(function (data) {
          // console.log(name, ", data:", data);
          // if(name === "spawnofodd") console.log(data);
          console.log("Check online status", data);
          resolve(!!data.stream);
        })["catch"](function (e) {
          return console.error(e ? e.stack : e);
        });
      })["catch"](function (e) {
        return console.error(e ? e.stack : e);
      });
    });
  },
  checkHost: function checkHost() {
    var name = this.props.name;

    return new Promise(function (resolve, reject) {
      _modulesClientLoadData2["default"].call(this, function (e) {
        console.error(e.stack);
      }, {
        username: name
      }).then(function (methods) {
        methods.getHostingByName().then(function (data) {
          // console.log(name, ", data:", data);
          // if(name === "spawnofodd") console.log(data);
          console.log("Check host", data);
          resolve(data);
        })["catch"](function (e) {
          return console.error(e ? e.stack : e);
        });
      })["catch"](function (e) {
        return console.error(e ? e.stack : e);
      });
    });
  },
  suggestHost: function suggestHost(data) {
    // console.log("Suggest host", data);
    var username = data.hosts[0].target_login;
    var displayName = data.hosts[0].target_display_name;
    this.setState({
      suggestedHost: {
        username: username,
        displayName: displayName
      }
    });
  },
  fullHostingCheck: function fullHostingCheck() {
    var _this3 = this;

    this.checkOnlineStatus().then(function (bool) {
      if (!bool) {
        _this3.checkHost().then(function (data) {
          if (data.hosts[0].target_login) {
            _this3.suggestHost(data);
          };
        });
      }
    });
  },
  addToPlayer: function addToPlayer() {
    var appendStream = this.props.methods.appendStream;
    var suggestedHost = this.state.suggestedHost;

    this.setState({
      suggestedHost: null
    });
    appendStream(suggestedHost.username, suggestedHost.displayName);
  },
  componentDidMount: function componentDidMount() {
    var _this4 = this;

    this._mounted = true;
    this.refs.tools ? this.refs.tools.addEventListener("mouseleave", function () {
      // console.log("leave");
      _this4.toggleMenu("close");
    }, false) : null;
    if (this.props.isFor === "video") this.makePlayer();

    this.checkOnlineStatus().then(function (bool) {
      if (!bool) {
        _this4.checkHost().then(function (data) {
          if (data.hosts[0].target_login) _this4.suggestHost(data);
        });
      }
    });
  },
  componentWillUnmount: function componentWillUnmount() {
    delete this._mounted;
    clearInterval(this.VODTimeTicker);
    clearInterval(this.hostTicker);
  },
  render: function render() {
    var _this5 = this;

    // console.log(this.props);
    var _props4 = this.props;
    var fireRef = _props4.fireRef;
    var userData = _props4.userData;
    var name = _props4.name;
    var display_name = _props4.display_name;
    var auth = _props4.auth;
    var inView = _props4.inView;
    var isFor = _props4.isFor;
    var index = _props4.index;
    var vod = _props4.vod;
    var versionData = _props4.versionData;
    var _props4$methods = _props4.methods;
    var appendStream = _props4$methods.appendStream;
    var spliceStream = _props4$methods.spliceStream;
    var togglePlayer = _props4$methods.togglePlayer;
    var alertAuthNeeded = _props4$methods.alertAuthNeeded;
    var layoutTools = _props4$methods.layoutTools;
    var panelsHandler = _props4$methods.panelsHandler;
    var putInView = _props4$methods.putInView;
    var popUpHandler = _props4$methods.popUpHandler;
    var alertHandler = _props4$methods.alertHandler;
    var _state = this.state;
    var menuOpen = _state.menuOpen;
    var nameScroll1 = _state.nameScroll1;
    var nameScroll2 = _state.nameScroll2;
    var time = _state.time;
    var playing = _state.playing;
    var playerReady = _state.playerReady;
    var suggestedHost = _state.suggestedHost;
    var watchingHost = _state.watchingHost;

    switch (isFor) {
      case "video":
        return _react2["default"].createElement(
          "li",
          { className: "player-stream" + (inView ? " in-view" : "") },
          _react2["default"].createElement(
            "div",
            { className: "video" },
            _react2["default"].createElement("div", { ref: "video", className: "nested player-div" })
          ),
          _react2["default"].createElement(
            "div",
            { ref: "tools", className: "tools-wrapper" },
            _react2["default"].createElement(
              "div",
              { className: "tools" + (menuOpen ? " menu-open" : "") },
              _react2["default"].createElement(
                "div",
                { className: "mobile" },
                _react2["default"].createElement(
                  "div",
                  { ref: "mobileName", onMouseEnter: this.mouseEvent.bind(this, "enter"), onMouseLeave: this.mouseEvent.bind(this, "leave"), className: "name" },
                  _react2["default"].createElement(
                    "span",
                    { ref: "streamerName1", style: {
                        position: "relative",
                        left: nameScroll1,
                        transition: "0s all" } },
                    _react2["default"].createElement(
                      _reactRouter.Link,
                      {
                        title: "Go to " + name + " on Twitch.tv",
                        className: "bold",
                        to: "/profile/" + name,
                        onClick: function () {
                          togglePlayer("collapse");
                          _this5.toggleMenu("close");
                        } },
                      display_name || name,
                      vod ? "/" + vod : display_name && !display_name.match(/^[a-z0-9\_]+$/i) ? "(" + name + ")" : ""
                    )
                  )
                ),
                _react2["default"].createElement(
                  "div",
                  _extends({ className: "lines" }, {
                    onClick: this.toggleMenu.bind(this, "toggle"),
                    onMouseEnter: this.toggleMenu.bind(this, "open")
                  }),
                  _react2["default"].createElement("div", null),
                  _react2["default"].createElement("div", null),
                  _react2["default"].createElement("div", null)
                )
              ),
              suggestedHost ? _react2["default"].createElement(
                "div",
                { className: "host" },
                _react2["default"].createElement(
                  "span",
                  null,
                  watchingHost ? ["Now watching ", _react2["default"].createElement(
                    _reactRouter.Link,
                    {
                      key: "0",
                      title: "Go to " + suggestedHost.displayName + "' profile",
                      className: "bold",
                      to: "/profile/" + suggestedHost.displayName,
                      onClick: function () {
                        togglePlayer("collapse");
                        _this5.toggleMenu("close");
                      } },
                    suggestedHost.displayName
                  ), " via ", _react2["default"].createElement(
                    _reactRouter.Link,
                    {
                      key: "1",
                      title: "Go to " + display_name + "' profile",
                      className: "bold",
                      to: "/profile/" + display_name,
                      onClick: function () {
                        togglePlayer("collapse");
                        _this5.toggleMenu("close");
                      } },
                    display_name
                  ), "."] : [_react2["default"].createElement(
                    _reactRouter.Link,
                    {
                      key: "0",
                      title: "Go to " + display_name + "' profile",
                      className: "bold",
                      to: "/profile/" + display_name,
                      onClick: function () {
                        togglePlayer("collapse");
                        _this5.toggleMenu("close");
                      } },
                    display_name
                  ), " is hosting ", _react2["default"].createElement(
                    _reactRouter.Link,
                    {
                      key: "1",
                      title: "Go to " + suggestedHost.displayName + "' profile",
                      className: "bold",
                      to: "/profile/" + suggestedHost.displayName,
                      onClick: function () {
                        togglePlayer("collapse");
                        _this5.toggleMenu("close");
                      } },
                    suggestedHost.displayName
                  ), "."],
                  " ",
                  _react2["default"].createElement(
                    "span",
                    {
                      title: "Add this stream to the player",
                      className: "btn",
                      onClick: this.addToPlayer },
                    "Add To Player"
                  ),
                  " ",
                  !watchingHost ? [_react2["default"].createElement(
                    "span",
                    {
                      key: "0",
                      title: "Replaces the current video with the hosted video, but doesn't change the chat",
                      className: "btn",
                      onClick: function () {
                        _this5.replaceVideo(suggestedHost.username);
                      } },
                    "Replace Video"
                  ), " ", _react2["default"].createElement(
                    "span",
                    {
                      key: "1",
                      title: "Switch the current stream player to the hosted stream",
                      className: "btn",
                      onClick: function () {
                        _this5.migrateStream(suggestedHost.username, suggestedHost.displayName);
                      } },
                    "Migrate Stream"
                  )] : [_react2["default"].createElement(
                    "span",
                    {
                      key: "0",
                      title: "Return the video to the hosting streamer",
                      className: "btn",
                      onClick: function () {
                        _this5.replaceVideo(name, true);
                      } },
                    "Return To Hoster"
                  ), " ", _react2["default"].createElement(
                    "span",
                    {
                      key: "1",
                      title: "Switch the current stream player to the hosted stream",
                      className: "btn",
                      onClick: function () {
                        _this5.migrateStream(suggestedHost.username, suggestedHost.displayName);
                      } },
                    "Migrate Stream"
                  )]
                )
              ) : null,
              _react2["default"].createElement(
                "div",
                { onMouseEnter: this.mouseEvent.bind(this, "enter"), onMouseLeave: this.mouseEvent.bind(this, "leave"), className: "streamer" },
                _react2["default"].createElement(
                  "span",
                  { ref: "streamerName2", style: {
                      position: "relative",
                      left: nameScroll2,
                      transition: "0s all" } },
                  _react2["default"].createElement(
                    _reactRouter.Link,
                    {
                      title: "Go to " + name + "'s profile",
                      className: "bold",
                      to: "/profile/" + name,
                      onClick: function () {
                        togglePlayer("collapse");
                        _this5.toggleMenu("close");
                      } },
                    vod ? _react2["default"].createElement(
                      "span",
                      { className: "vod" },
                      "VOD: "
                    ) : "",
                    display_name || name,
                    vod ? "/" + vod : display_name && !display_name.match(/^[a-z0-9\_]+$/i) ? "(" + name + ")" : ""
                  )
                )
              ),
              _react2["default"].createElement(
                "div",
                { className: "to-channel" },
                _react2["default"].createElement(
                  _reactRouter.Link,
                  { to: "https://twitch.tv/" + name, target: "_blank", onClick: function () {
                      _this5.toggleMenu("close");
                    } },
                  "Visit On Twitch"
                )
              ),
              _react2["default"].createElement(
                "div",
                { className: "put-in-view bgc-green-priority", onClick: function () {
                    putInView(index);
                    _this5.toggleMenu("close");
                  } },
                "Put In View"
              ),
              _react2["default"].createElement(
                "div",
                { className: "refresh" },
                _react2["default"].createElement(
                  "span",
                  { className: "title bold" },
                  "Refresh:"
                ),
                _react2["default"].createElement(
                  "span",
                  { className: "video", onClick: function () {
                      _this5.refresh("video");
                      _this5.toggleMenu("close");
                    } },
                  "Video"
                ),
                "/",
                _react2["default"].createElement(
                  "span",
                  { className: "chat", onClick: function () {
                      _this5.refresh("chat");
                      _this5.toggleMenu("close");
                    } },
                  "Chat"
                )
              ),
              _react2["default"].createElement(
                "div",
                { className: "open-panels", onClick: function () {
                    panelsHandler("open", name);
                    _this5.toggleMenu("close");
                  } },
                "Open Stream Panels"
              ),
              _react2["default"].createElement(_bookmarkBtnJsx2["default"], {
                className: "no-underline",
                named: true,
                fireRef: fireRef,
                userData: userData,
                givenUsername: name,
                versionData: versionData }),
              userData ? [_react2["default"].createElement(_followBtnJsx2["default"], {
                key: "follow",
                className: "no-underline",
                name: userData.name,
                targetName: name,
                targetDisplay: display_name,
                auth: auth
              }), _react2["default"].createElement(
                "div",
                {
                  key: "ask",
                  className: "ask",
                  onClick: function () {
                    popUpHandler("askQuestion", {
                      receiver: name,
                      sender: userData.name
                    });
                    _this5.toggleMenu("close");
                  } },
                "Ask A Question"
              )] : _react2["default"].createElement(
                "div",
                { className: "follow need-auth", onClick: function () {
                    alertAuthNeeded();
                    _this5.toggleMenu("close");
                  } },
                "Follow ",
                name
              ),
              _react2["default"].createElement(
                "div",
                { className: "open-alert", onClick: function () {
                    alertHandler({
                      message: "Share " + (display_name || name) + "&#39;s Stream",
                      options: ["close"],
                      links: ["twitter", "facebook"],
                      state: {
                        name: name
                      }
                    });
                    _this5.toggleMenu("close");
                  } },
                "Share ",
                display_name || name,
                "'s Stream"
              ),
              vod && playerReady ? _react2["default"].createElement(
                "div",
                { className: "closer" },
                !playing ? _react2["default"].createElement("input", { type: "text", value: "https://www.twitch.tv/videos/" + vod + "?t=" + (time.hour > 0 ? time.hour + "h" : "") + (time.minute > 0 ? time.minute + "m" : "") + (time.second > 0 ? time.second + "s" : ""), onClick: function (e) {
                    return e.target.select();
                  }, readOnly: true }) : _react2["default"].createElement(
                  "span",
                  { onClick: this.pauseVOD },
                  "Click/Pause VOD For Timestamped Link"
                )
              ) : null,
              _react2["default"].createElement(
                "div",
                { className: "closer bgc-orange-priority", onClick: function () {
                    _this5.swapOut();
                    _this5.toggleMenu("close");
                  } },
                "Close This Stream"
              )
            )
          )
        );
      case "chat":
        return _react2["default"].createElement(
          "li",
          { className: "player-stream" + (inView ? " in-view" : "") },
          _react2["default"].createElement(
            "div",
            { className: "chat" },
            _react2["default"].createElement("iframe", { ref: "chat", src: "https://www.twitch.tv/" + name + "/chat", frameBorder: "0", scrolling: "no" })
          )
        );
      default:
        console.error("Player needs to know whether to give video or give chat");
        return null;
    }
  }
});

// player component to house streams
exports["default"] = _react2["default"].createClass({
  displayName: "Player",
  getInitialState: function getInitialState() {
    return {
      canScroll: true,
      streamInView: 0,
      scrollTop: 0,
      chatOpen: true
    };
  },
  layoutTools: function layoutTools(type) {
    var videoList = this.refs.videoList;
    var chatList = this.refs.chatList;

    switch (type) {
      case "setStreamToView":
        var count = 1;
        // console.log("layout", this.props.layout);
        switch (this.props.layout) {
          case "by-2":
            count = 2;
            break;
          case "by-3":
            count = 3;
            break;
        }
        // console.log("scroll value", (videoList.offsetHeight / count) * this.refs.selectStream.value);
        // console.log("select value", this.refs.selectStream.value);
        videoList.scrollTop = videoList.offsetHeight / count * this.refs.selectStream.value;
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
  listScroll: function listScroll(e) {},
  toggleChat: function toggleChat(type) {
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
  putInView: function putInView(index) {
    console.log(this.refs.selectStream, this.refs.selectStream.value, index);
    if (this.refs.selectStream) {
      this.refs.selectStream.value = index;
      this.setState({
        streamInView: index
      });
    }
  },
  refreshChat: function refreshChat(name) {
    var chat = this.refs[name + "_chat"].refs.chat;

    console.log(name, chat);
    chat.src = chat.src;
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var dataObject = nextProps.data.dataObject;
    var streamInView = this.state.streamInView;

    // console.log("receiving props", nextProps, this.props);
    var count = Object.keys(dataObject).length;
    // console.log("setting view", streamInView, count);
    if (streamInView > count - 1) {
      this.setState({
        streamInView: count - 1
      });
    } else if (streamInView < 0) {
      this.setState({
        streamInView: 0
      });
    }
  },
  componentDidMount: function componentDidMount() {
    var _this6 = this;

    this.rescroll = setInterval(function () {
      var videoList = _this6.refs.videoList;

      // videoList.scrollTop = 0;
    }, 1000);
  },
  componentWillUnmount: function componentWillUnmount() {
    this.rescroll = null;
  },
  render: function render() {
    var _this7 = this;

    var _props5 = this.props;
    var fireRef = _props5.fireRef;
    var userData = _props5.userData;
    var auth = _props5.auth;
    var playerState = _props5.playerState;
    var panelData = _props5.panelData;
    var versionData = _props5.versionData;
    var _props5$methods = _props5.methods;
    var appendStream = _props5$methods.appendStream;
    var spliceStream = _props5$methods.spliceStream;
    var replaceStream = _props5$methods.replaceStream;
    var clearPlayer = _props5$methods.clearPlayer;
    var togglePlayer = _props5$methods.togglePlayer;
    var alertAuthNeeded = _props5$methods.alertAuthNeeded;
    var setLayout = _props5$methods.setLayout;
    var panelsHandler = _props5$methods.panelsHandler;
    var popUpHandler = _props5$methods.popUpHandler;
    var alertHandler = _props5$methods.alertHandler;
    var dataObject = _props5.data.dataObject;
    var layout = this.props.layout;
    var _state2 = this.state;
    var streamInView = _state2.streamInView;
    var chatOpen = _state2.chatOpen;

    var dataArray = Object.keys(dataObject);
    layout = layout || "layout-" + Object.keys(dataObject).length;

    return _react2["default"].createElement(
      "div",
      { className: "player" },
      _react2["default"].createElement(
        "div",
        { className: "wrapper" },
        _react2["default"].createElement(
          "ul",
          { ref: "videoList", onScroll: this.listScroll, className: "list video-list" },
          dataObject ? dataArray.map(function (key, ind) {
            var isObject = typeof dataObject[key] === "object";
            if (isObject) {
              var _dataObject$key = dataObject[key];
              var username = _dataObject$key.username;
              var displayName = _dataObject$key.displayName;
              var id = _dataObject$key.id;
              var vod = _dataObject$key.vod;
            }
            var channelData = dataObject[key];
            // console.log(streamInView, ind, streamInView === ind);
            return _react2["default"].createElement(PlayerStream, {
              key: key,
              fireRef: fireRef,
              versionData: versionData,
              vod: isObject ? id : false,
              name: isObject ? username : key,
              display_name: isObject ? displayName : dataObject[key],
              userData: userData,
              auth: auth,
              inView: streamInView === ind,
              isFor: "video",
              index: ind,
              methods: {
                appendStream: appendStream,
                spliceStream: spliceStream,
                replaceStream: replaceStream,
                togglePlayer: togglePlayer,
                panelsHandler: panelsHandler,
                alertAuthNeeded: alertAuthNeeded,
                popUpHandler: popUpHandler,
                alertHandler: alertHandler,
                layoutTools: _this7.layoutTools,
                putInView: _this7.putInView,
                refreshChat: _this7.refreshChat } });
          }) : null
        ),
        _react2["default"].createElement(
          "ul",
          { ref: "chatList", onScroll: this.listScroll, className: "list chat-list" + (!chatOpen ? " hide-chat" : "") },
          dataObject ? dataArray.map(function (key, ind) {
            var isObject = typeof dataObject[key] === "object";
            if (isObject) {
              var _dataObject$key2 = dataObject[key];
              var username = _dataObject$key2.username;
              var displayName = _dataObject$key2.displayName;
              var id = _dataObject$key2.id;
              var vod = _dataObject$key2.vod;
            }
            var channelData = dataObject[key];
            return _react2["default"].createElement(PlayerStream, { ref: key + "_chat", key: key, vod: isObject ? id : false, name: isObject ? username : key, display_name: dataObject[key], userData: userData, auth: auth, inView: streamInView === ind, isFor: "chat", methods: {} });
          }) : null
        ),
        _react2["default"].createElement(
          "div",
          { className: "tools" },
          _react2["default"].createElement(
            "div",
            { title: "Closes all streams in the player", className: "main-tool closer bold bgc-red-priority", onClick: clearPlayer },
            "x"
          ),
          _react2["default"].createElement(
            "div",
            { title: "Shrink the player to the side of the browser", className: "main-tool flexer", onClick: togglePlayer.bind(null, "toggle") },
            playerState.playerCollapsed ? "Expand" : "Collapse"
          ),
          _react2["default"].createElement(
            "div",
            { className: "main-tool hide", onClick: this.toggleChat.bind(this, "toggle") },
            chatOpen ? "Hide" : "Show",
            " Chat"
          ),
          _react2["default"].createElement(
            "div",
            { className: "wrap" },
            _react2["default"].createElement(
              "select",
              { title: "Choose a layout for the streams", ref: "selectLayout", className: "main-tool  layout", defaultValue: 0, onChange: this.layoutTools.bind(null, "setLayout") },
              ["", "Singular", dataArray.length > 2 ? "By 2" : null, dataArray.length > 3 ? "By 3" : null].map(function (layoutName) {
                if (layoutName !== null) return _react2["default"].createElement(
                  "option",
                  { key: layoutName, value: layoutName.toLowerCase() },
                  layoutName || "Auto"
                );
              })
            ),
            _react2["default"].createElement(
              "div",
              { className: "hover-msg" },
              _react2["default"].createElement(
                "span",
                null,
                "Change Layout"
              )
            )
          ),
          dataObject && layout === "singular" || layout !== "layout-1" || layout !== "layout-by-2" || layout !== "layout-by-3" ? _react2["default"].createElement(
            "div",
            { className: "wrap" },
            _react2["default"].createElement(
              "select",
              { title: "Choose which stream and chat appears as the main or in-view stream", ref: "selectStream", className: "main-tool streamers", defaultValue: 0, onChange: this.layoutTools.bind(null, "setStreamToView") },
              dataObject ? dataArray.map(function (key, ind) {
                return _react2["default"].createElement(
                  "option",
                  { key: key, value: ind },
                  key
                );
              }) : null
            ),
            _react2["default"].createElement(
              "div",
              { className: "hover-msg" },
              _react2["default"].createElement(
                "span",
                null,
                "Change In-View Stream/Chat"
              )
            )
          ) : null,
          _react2["default"].createElement(
            "div",
            { className: "wrap" },
            _react2["default"].createElement(
              "div",
              { className: "main-tool multistream", onClick: function () {
                  alertHandler({
                    message: "Share this link with your friends!",
                    options: ["close"],
                    inputData: (window ? window.location.protocol : "http:") + "//" + (window ? window.location.host : "amorrius.net") + (window ? window.location.pathname : "") + "?ms=" + dataArray.join("+")
                  });
                } },
              _react2["default"].createElement(
                "span",
                null,
                "Generate Multistream Link"
              )
            ),
            _react2["default"].createElement(
              "div",
              { className: "hover-msg" },
              _react2["default"].createElement(
                "span",
                null,
                "Generate Multistream Link"
              )
            )
          )
        ),
        _react2["default"].createElement(_streamPanelsJsx2["default"], { panelData: panelData, methods: {
            panelsHandler: panelsHandler
          } })
      )
    );
  }
});
module.exports = exports["default"];
/* <iframe ref="video" src={`https://player.twitch.tv/?${vod ? `video=${vod}` : `channel=${name}`}&muted=true`} frameBorder="0" scrolling="no" allowFullScreen /> */