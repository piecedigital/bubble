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

// stream component for player
var PlayerStream = _react2["default"].createClass({
  displayName: "PlayerStream",
  getInitialState: function getInitialState() {
    return { chatOpen: true, menuOpen: false };
  },
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
  render: function render() {
    // console.log(this.props);
    var _props2 = this.props;
    var userData = _props2.userData;
    var name = _props2.name;
    var display_name = _props2.display_name;
    var auth = _props2.auth;
    var inView = _props2.inView;
    var isFor = _props2.isFor;
    var _props2$methods = _props2.methods;
    var spliceStream = _props2$methods.spliceStream;
    var togglePlayer = _props2$methods.togglePlayer;
    var alertAuthNeeded = _props2$methods.alertAuthNeeded;
    var layoutTools = _props2$methods.layoutTools;
    var _state = this.state;
    var chatOpen = _state.chatOpen;
    var menuOpen = _state.menuOpen;

    switch (isFor) {
      case "video":
        return _react2["default"].createElement(
          "li",
          { className: "player-stream" + (!chatOpen ? " hide-chat" : "") + (inView ? " in-view" : "") },
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
            { className: "tools-wrapper" },
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
                    { title: name, to: "/user/" + name, onClick: togglePlayer.bind(null, "close"), target: "_blank" },
                    display_name,
                    !display_name.match(/^[a-z0-9\_]+$/i) ? "(" + name + ")" : ""
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
                  { to: "/user/" + name, onClick: togglePlayer.bind(null, "close") },
                  display_name,
                  !display_name.match(/^[a-z0-9\_]+$/i) ? "(" + name + ")" : ""
                )
              ),
              _react2["default"].createElement(
                "div",
                { className: "closer", onClick: this.swapOut },
                "Close"
              ),
              _react2["default"].createElement(
                "div",
                { className: "hide", onClick: this.toggleChat.bind(this, "toggle") },
                chatOpen ? "Hide" : "Show",
                " Chat"
              ),
              _react2["default"].createElement(
                "div",
                { className: "refresh-video", onClick: this.refresh.bind(this, "video") },
                "Refresh Video"
              ),
              _react2["default"].createElement(
                "div",
                { className: "refresh-chat", onClick: this.refresh.bind(this, "chat") },
                "Refresh Chat"
              ),
              userData ? _react2["default"].createElement(_followJsx2["default"], { name: userData.name, targetName: name, targetDisplay: display_name, auth: auth }) : _react2["default"].createElement(
                "div",
                { className: "follow need-auth", onClick: alertAuthNeeded },
                "Follow ",
                name
              )
            )
          )
        );
      case "chat":
        return _react2["default"].createElement(
          "li",
          { className: "player-stream" + (!chatOpen ? " hide-chat" : "") + (inView ? " in-view" : "") },
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
      scrollTop: 0
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
  render: function render() {
    var _this = this;

    var _props3 = this.props;
    var userData = _props3.userData;
    var auth = _props3.auth;
    var playerState = _props3.playerState;
    var _props3$methods = _props3.methods;
    var spliceStream = _props3$methods.spliceStream;
    var togglePlayer = _props3$methods.togglePlayer;
    var alertAuthNeeded = _props3$methods.alertAuthNeeded;
    var setLayout = _props3$methods.setLayout;
    var dataObject = _props3.data.dataObject;
    var layout = _props3.layout;
    var streamInView = this.state.streamInView;

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
            console.log(streamInView, ind, streamInView === ind);
            return _react2["default"].createElement(PlayerStream, { key: channelName, name: channelName, display_name: dataObject[channelName], userData: userData, auth: auth, inView: streamInView === ind, isFor: "video", methods: {
                spliceStream: spliceStream,
                togglePlayer: togglePlayer,
                alertAuthNeeded: alertAuthNeeded,
                layoutTools: _this.layoutTools
              } });
          }) : null
        ),
        _react2["default"].createElement(
          "ul",
          { ref: "chatList", onScroll: this.listScroll, className: "list chat-list" },
          dataObject ? dataArray.map(function (channelName, ind) {
            var channelData = dataObject[channelName];
            return _react2["default"].createElement(PlayerStream, { key: channelName, name: channelName, display_name: dataObject[channelName], userData: userData, auth: auth, inView: streamInView === ind, isFor: "chat", methods: {
                spliceStream: spliceStream,
                togglePlayer: togglePlayer,
                alertAuthNeeded: alertAuthNeeded
              } });
          }) : null
        ),
        _react2["default"].createElement(
          "div",
          { className: "tools" },
          _react2["default"].createElement(
            "div",
            { title: "Closing the player will remove all current streams", className: "closer", onClick: function () {
                Object.keys(dataObject).map(function (channelName) {
                  spliceStream(channelName);
                });
              } },
            "Close"
          ),
          _react2["default"].createElement(
            "div",
            { title: "Shrink the player to the side of the browser", className: "closer", onClick: togglePlayer.bind(null, "toggle") },
            playerState.playerCollapsed ? "Expand" : "Collapse"
          ),
          _react2["default"].createElement(
            "select",
            { title: "Choose a layout for the streams", ref: "selectLayout", className: "layout", defaultValue: 0, onChange: this.layoutTools.bind(null, "setLayout") },
            ["", "Linear", dataArray.length > 2 ? "By 2" : null, dataArray.length > 3 ? "By 3" : null].map(function (layoutName) {
              if (layoutName !== null) return _react2["default"].createElement(
                "option",
                { key: layoutName, value: layoutName.toLowerCase() },
                layoutName || "Auto"
              );
            })
          ),
          dataObject && layout === "linear" || layout !== "layout-1" || layout !== "layout-by-2" || layout !== "layout-by-3" ? _react2["default"].createElement(
            "select",
            { title: "Choose which stream and chat appears as the main or in-view stream", ref: "selectStream", className: "layout", defaultValue: 0, onChange: this.layoutTools.bind(null, "setStreamToView") },
            dataObject ? dataArray.map(function (channelName, ind) {
              return _react2["default"].createElement(
                "option",
                { key: channelName, value: ind },
                channelName
              );
            }) : null
          ) : null
        )
      )
    );
  }
});
module.exports = exports["default"];