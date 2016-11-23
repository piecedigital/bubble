"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _modulesLoadData = require("../../../modules/load-data");

var _modulesLoadData2 = _interopRequireDefault(_modulesLoadData);

var _followJsx = require("./follow.jsx");

var _followJsx2 = _interopRequireDefault(_followJsx);

var _streamPanelsJsx = require("./stream-panels.jsx");

var _streamPanelsJsx2 = _interopRequireDefault(_streamPanelsJsx);

// stream component for player
var PlayerStream = _react2["default"].createClass({
  displayName: "PlayerStream",
  getInitialState: function getInitialState() {
    return { chatOpen: true, menuOpen: false };
  },
  toggleMenu: function toggleMenu(type) {
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
  refresh: function refresh(iframe) {
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
  swapOut: function swapOut() {
    var _props = this.props;
    var name = _props.name;
    var _props$methods = _props.methods;
    var spliceStream = _props$methods.spliceStream;
    var layoutTools = _props$methods.layoutTools;

    spliceStream(name);
    setTimeout(function () {
      layoutTools("setStreamToView");
    }, 100);
  },
  componentDidMount: function componentDidMount() {
    this.refs.tools ? this.refs.tools.addEventListener("mouseleave", function () {
      // console.log("leave");
      // this.toggleMenu("close");
    }, false) : null;
  },
  render: function render() {
    var _this = this;

    // console.log(this.props);
    var _props2 = this.props;
    var userData = _props2.userData;
    var name = _props2.name;
    var display_name = _props2.display_name;
    var auth = _props2.auth;
    var inView = _props2.inView;
    var isFor = _props2.isFor;
    var index = _props2.index;
    var _props2$methods = _props2.methods;
    var spliceStream = _props2$methods.spliceStream;
    var togglePlayer = _props2$methods.togglePlayer;
    var alertAuthNeeded = _props2$methods.alertAuthNeeded;
    var layoutTools = _props2$methods.layoutTools;
    var panelsHandler = _props2$methods.panelsHandler;
    var putInView = _props2$methods.putInView;
    var menuOpen = this.state.menuOpen;

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
              _react2["default"].createElement("iframe", { ref: "video", src: "https://player.twitch.tv/?channel=" + name + "&muted=true", frameBorder: "0", scrolling: "no", allowFullScreen: true })
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
                  { className: "name" },
                  _react2["default"].createElement(
                    _reactRouter.Link,
                    { title: name, to: "/user/" + name, onClick: function () {
                        togglePlayer("collapse");
                        _this.toggleMenu("close");
                      } },
                    display_name || name,
                    display_name && !display_name.match(/^[a-z0-9\_]+$/i) ? "(" + name + ")" : ""
                  )
                ),
                _react2["default"].createElement(
                  "div",
                  { className: "lines", onClick: this.toggleMenu.bind(this, "toggle") },
                  _react2["default"].createElement("div", null),
                  _react2["default"].createElement("div", null),
                  _react2["default"].createElement("div", null)
                )
              ),
              _react2["default"].createElement(
                "div",
                { className: "streamer" },
                _react2["default"].createElement(
                  _reactRouter.Link,
                  { to: "/user/" + name, onClick: function () {
                      togglePlayer("collapse");
                      _this.toggleMenu("close");
                    } },
                  display_name || name,
                  display_name && !display_name.match(/^[a-z0-9\_]+$/i) ? "(" + name + ")" : ""
                )
              ),
              _react2["default"].createElement(
                "div",
                { className: "to-channel" },
                _react2["default"].createElement(
                  _reactRouter.Link,
                  { to: "https://twitch.tv/" + name, target: "_blank", onClick: function () {
                      _this.toggleMenu("close");
                    } },
                  "Visit On Twitch"
                )
              ),
              _react2["default"].createElement(
                "div",
                { className: "closer", onClick: function () {
                    _this.swapOut();
                    _this.toggleMenu("close");
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
                      _this.refresh("video");
                      _this.toggleMenu("close");
                    } },
                  "Video"
                ),
                _react2["default"].createElement(
                  "span",
                  { className: "chat", onClick: function () {
                      _this.refresh("chat");
                      _this.toggleMenu("close");
                    } },
                  "Chat"
                )
              ),
              _react2["default"].createElement(
                "div",
                { className: "put-in-view", onClick: function () {
                    putInView(index);
                    _this.toggleMenu("close");
                  } },
                "Put In View"
              ),
              _react2["default"].createElement(
                "div",
                { className: "open-panels", onClick: function () {
                    panelsHandler("open", name);
                    _this.toggleMenu("close");
                  } },
                "Open Stream Panels"
              ),
              userData ? _react2["default"].createElement(_followJsx2["default"], { name: userData.name, targetName: name, targetDisplay: display_name, auth: auth }) : _react2["default"].createElement(
                "div",
                { className: "follow need-auth", onClick: function () {
                    alertAuthNeeded();
                    _this.toggleMenu("close");
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
    console.log(name, this[name + "_chat"].refs.chat);
    var chat = this[name + "_chat"].refs.chat;

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
    var _this2 = this;

    this.rescroll = setInterval(function () {
      var videoList = _this2.refs.videoList;

      videoList.scrollTop = 0;
    }, 1000);
  },
  componentWillUnmount: function componentWillUnmount() {
    this.rescroll = null;
  },
  render: function render() {
    var _this3 = this;

    var _props3 = this.props;
    var userData = _props3.userData;
    var auth = _props3.auth;
    var playerState = _props3.playerState;
    var panelData = _props3.panelData;
    var _props3$methods = _props3.methods;
    var spliceStream = _props3$methods.spliceStream;
    var clearPlayer = _props3$methods.clearPlayer;
    var togglePlayer = _props3$methods.togglePlayer;
    var alertAuthNeeded = _props3$methods.alertAuthNeeded;
    var setLayout = _props3$methods.setLayout;
    var panelsHandler = _props3$methods.panelsHandler;
    var dataObject = _props3.data.dataObject;
    var layout = _props3.layout;
    var _state = this.state;
    var streamInView = _state.streamInView;
    var chatOpen = _state.chatOpen;

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
          dataObject ? dataArray.map(function (channelName, ind) {
            var channelData = dataObject[channelName];
            // console.log(streamInView, ind, streamInView === ind);
            return _react2["default"].createElement(PlayerStream, { key: channelName, name: channelName, display_name: dataObject[channelName], userData: userData, auth: auth, inView: streamInView === ind, isFor: "video", index: ind, methods: {
                spliceStream: spliceStream,
                togglePlayer: togglePlayer,
                panelsHandler: panelsHandler,
                alertAuthNeeded: alertAuthNeeded,
                layoutTools: _this3.layoutTools,
                putInView: _this3.putInView,
                refreshChat: _this3.refreshChat
              } });
          }) : null
        ),
        _react2["default"].createElement(
          "ul",
          { ref: "chatList", onScroll: this.listScroll, className: "list chat-list" + (!chatOpen ? " hide-chat" : "") },
          dataObject ? dataArray.map(function (channelName, ind) {
            var channelData = dataObject[channelName];
            return _react2["default"].createElement(PlayerStream, { ref: function (r) {
                return _this3[channelName + "_chat"] = r;
              }, key: channelName, name: channelName, display_name: dataObject[channelName], userData: userData, auth: auth, inView: streamInView === ind, isFor: "chat", methods: {} });
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
            dataObject ? dataArray.map(function (channelName, ind) {
              return _react2["default"].createElement(
                "option",
                { key: channelName, value: ind },
                channelName
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