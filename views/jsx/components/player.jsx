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

var _modulesLoadData = require("../../../modules/load-data");

var _modulesLoadData2 = _interopRequireDefault(_modulesLoadData);

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
    return { chatOpen: true, menuOpen: false, doScroll: true, nameScroll1: 0, nameScroll2: 0 };
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
    console.log("iframe:", iframe);
    switch (iframe) {
      case "video":
        this.refs.video.src = this.refs.video.src;
        break;
      case "chat":
        this.props.methods.refreshChat(this.props.vod || this.props.name);
        break;
    }
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
    console.log("name - mouse", action);
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
  componentDidMount: function componentDidMount() {
    var _this2 = this;

    this._mounted = true;
    this.refs.tools ? this.refs.tools.addEventListener("mouseleave", function () {
      // console.log("leave");
      _this2.toggleMenu("close");
    }, false) : null;
  },
  componentWillUnmount: function componentWillUnmount() {
    delete this._mounted;
  },
  render: function render() {
    var _this3 = this;

    // console.log(this.props);
    var _props2 = this.props;
    var fireRef = _props2.fireRef;
    var userData = _props2.userData;
    var name = _props2.name;
    var display_name = _props2.display_name;
    var auth = _props2.auth;
    var inView = _props2.inView;
    var isFor = _props2.isFor;
    var index = _props2.index;
    var vod = _props2.vod;
    var versionData = _props2.versionData;
    var _props2$methods = _props2.methods;
    var spliceStream = _props2$methods.spliceStream;
    var togglePlayer = _props2$methods.togglePlayer;
    var alertAuthNeeded = _props2$methods.alertAuthNeeded;
    var layoutTools = _props2$methods.layoutTools;
    var panelsHandler = _props2$methods.panelsHandler;
    var putInView = _props2$methods.putInView;
    var _state = this.state;
    var menuOpen = _state.menuOpen;
    var nameScroll1 = _state.nameScroll1;
    var nameScroll2 = _state.nameScroll2;

    switch (isFor) {
      case "video":
        return _react2["default"].createElement(
          "li",
          { className: "player-stream" + (inView ? " in-view" : "") },
          _react2["default"].createElement(
            "div",
            { className: "video" },
            _react2["default"].createElement(
              "div",
              { className: "nested" },
              _react2["default"].createElement("iframe", { ref: "video", src: "https://player.twitch.tv/?" + (vod ? "video=" + vod : "channel=" + name) + "&muted=true", frameBorder: "0", scrolling: "no", allowFullScreen: true })
            )
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
                        transition: "0s all"
                      } },
                    _react2["default"].createElement(
                      _reactRouter.Link,
                      { title: name, to: "/profile/" + name, onClick: function () {
                          togglePlayer("collapse");
                          _this3.toggleMenu("close");
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
              _react2["default"].createElement(
                "div",
                { onMouseEnter: this.mouseEvent.bind(this, "enter"), onMouseLeave: this.mouseEvent.bind(this, "leave"), className: "streamer" },
                _react2["default"].createElement(
                  "span",
                  { ref: "streamerName2", style: {
                      position: "relative",
                      left: nameScroll2,
                      transition: "0s all"
                    } },
                  _react2["default"].createElement(
                    _reactRouter.Link,
                    { to: "/profile/" + name, onClick: function () {
                        togglePlayer("collapse");
                        _this3.toggleMenu("close");
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
                      _this3.toggleMenu("close");
                    } },
                  "Visit On Twitch"
                )
              ),
              _react2["default"].createElement(
                "div",
                { className: "closer", onClick: function () {
                    _this3.swapOut();
                    _this3.toggleMenu("close");
                  } },
                "Close"
              ),
              _react2["default"].createElement(
                "div",
                { className: "refresh" },
                _react2["default"].createElement(
                  "span",
                  { className: "title" },
                  "Refresh"
                ),
                _react2["default"].createElement(
                  "span",
                  { className: "video", onClick: function () {
                      _this3.refresh("video");
                      _this3.toggleMenu("close");
                    } },
                  "Video"
                ),
                _react2["default"].createElement(
                  "span",
                  { className: "chat", onClick: function () {
                      _this3.refresh("chat");
                      _this3.toggleMenu("close");
                    } },
                  "Chat"
                )
              ),
              _react2["default"].createElement(
                "div",
                { className: "put-in-view", onClick: function () {
                    putInView(index);
                    _this3.toggleMenu("close");
                  } },
                "Put In View"
              ),
              _react2["default"].createElement(
                "div",
                { className: "open-panels", onClick: function () {
                    panelsHandler("open", name);
                    _this3.toggleMenu("close");
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
              userData ? _react2["default"].createElement(_followBtnJsx2["default"], { name: userData.name, targetName: name, targetDisplay: display_name, auth: auth }) : _react2["default"].createElement(
                "div",
                { className: "follow need-auth", onClick: function () {
                    alertAuthNeeded();
                    _this3.toggleMenu("close");
                  } },
                "Follow ",
                name
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
        console.log("layout", this.props.layout);
        switch (this.props.layout) {
          case "by-2":
            count = 2;
            break;
          case "by-3":
            count = 3;
            break;
        }
        console.log("scroll value", videoList.offsetHeight / count * this.refs.selectStream.value);
        console.log("select value", this.refs.selectStream.value);
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
    var _this4 = this;

    this.rescroll = setInterval(function () {
      var videoList = _this4.refs.videoList;

      // videoList.scrollTop = 0;
    }, 1000);
  },
  componentWillUnmount: function componentWillUnmount() {
    this.rescroll = null;
  },
  render: function render() {
    var _this5 = this;

    var _props3 = this.props;
    var fireRef = _props3.fireRef;
    var userData = _props3.userData;
    var auth = _props3.auth;
    var playerState = _props3.playerState;
    var panelData = _props3.panelData;
    var versionData = _props3.versionData;
    var _props3$methods = _props3.methods;
    var spliceStream = _props3$methods.spliceStream;
    var clearPlayer = _props3$methods.clearPlayer;
    var togglePlayer = _props3$methods.togglePlayer;
    var alertAuthNeeded = _props3$methods.alertAuthNeeded;
    var setLayout = _props3$methods.setLayout;
    var panelsHandler = _props3$methods.panelsHandler;
    var dataObject = _props3.data.dataObject;
    var layout = _props3.layout;
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
                spliceStream: spliceStream,
                togglePlayer: togglePlayer,
                panelsHandler: panelsHandler,
                alertAuthNeeded: alertAuthNeeded,
                layoutTools: _this5.layoutTools,
                putInView: _this5.putInView,
                refreshChat: _this5.refreshChat
              } });
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
            { title: "Closing the player will remove all current streams", className: "closer", onClick: clearPlayer },
            "Close"
          ),
          _react2["default"].createElement(
            "div",
            { title: "Shrink the player to the side of the browser", className: "closer", onClick: togglePlayer.bind(null, "toggle") },
            playerState.playerCollapsed ? "Expand" : "Collapse"
          ),
          _react2["default"].createElement(
            "div",
            { className: "hide", onClick: this.toggleChat.bind(this, "toggle") },
            chatOpen ? "Hide" : "Show",
            " Chat"
          ),
          _react2["default"].createElement(
            "select",
            { title: "Choose a layout for the streams", ref: "selectLayout", className: "layout", defaultValue: 0, onChange: this.layoutTools.bind(null, "setLayout") },
            ["", "Singular", dataArray.length > 2 ? "By 2" : null, dataArray.length > 3 ? "By 3" : null].map(function (layoutName) {
              if (layoutName !== null) return _react2["default"].createElement(
                "option",
                { key: layoutName, value: layoutName.toLowerCase() },
                layoutName || "Auto"
              );
            })
          ),
          dataObject && layout === "singular" || layout !== "layout-1" || layout !== "layout-by-2" || layout !== "layout-by-3" ? _react2["default"].createElement(
            "select",
            { title: "Choose which stream and chat appears as the main or in-view stream", ref: "selectStream", className: "streamers", defaultValue: 0, onChange: this.layoutTools.bind(null, "setStreamToView") },
            dataObject ? dataArray.map(function (key, ind) {
              return _react2["default"].createElement(
                "option",
                { key: key, value: ind },
                key
              );
            }) : null
          ) : null
        ),
        _react2["default"].createElement(_streamPanelsJsx2["default"], { panelData: panelData, methods: {
            panelsHandler: panelsHandler
          } })
      )
    );
  }
});
module.exports = exports["default"];