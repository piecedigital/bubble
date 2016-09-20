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
  render: function render() {
    // console.log(this.props);
    var _props = this.props;
    var userData = _props.userData;
    var name = _props.name;
    var display_name = _props.display_name;
    var auth = _props.auth;
    var _props$methods = _props.methods;
    var spliceStream = _props$methods.spliceStream;
    var togglePlayer = _props$methods.togglePlayer;
    var alertAuthNeeded = _props$methods.alertAuthNeeded;
    var _state = this.state;
    var chatOpen = _state.chatOpen;
    var menuOpen = _state.menuOpen;

    return _react2["default"].createElement(
      "li",
      { className: "player-stream" + (!chatOpen ? " hide-chat" : "") },
      _react2["default"].createElement(
        "div",
        { className: "video" },
        _react2["default"].createElement(
          "div",
          { className: "nested" },
          _react2["default"].createElement("iframe", { src: "https://player.twitch.tv/?channel=" + name, frameBorder: "0", scrolling: "no" })
        )
      ),
      _react2["default"].createElement(
        "div",
        { className: "chat" },
        _react2["default"].createElement("iframe", { src: "https://www.twitch.tv/" + name + "/chat", frameBorder: "0", scrolling: "no" })
      ),
      _react2["default"].createElement(
        "div",
        { className: "tools" + (menuOpen ? " menu-open" : "") },
        _react2["default"].createElement(
          "div",
          { className: "streamer" },
          _react2["default"].createElement(
            _reactRouter.Link,
            { to: "/user/" + name, onClick: togglePlayer.bind(null, "close") },
            display_name,
            !display_name.match(/^[a-z\_]+$/i) ? "(" + name + ")" : ""
          )
        ),
        _react2["default"].createElement(
          "div",
          { className: "closer", onClick: spliceStream.bind(null, name) },
          "Close"
        ),
        _react2["default"].createElement(
          "div",
          { className: "hide", onClick: this.toggleChat.bind(this, "toggle") },
          chatOpen ? "Hide" : "Show",
          " Chat"
        ),
        userData ? _react2["default"].createElement(_followJsx2["default"], { name: userData.name, targetName: name, targetDisplay: display_name, auth: auth }) : _react2["default"].createElement(
          "div",
          { className: "follow need-auth", onClick: alertAuthNeeded },
          "Follow ",
          name
        ),
        _react2["default"].createElement(
          "div",
          { className: "mobile" },
          _react2["default"].createElement(
            "div",
            { className: "name" },
            _react2["default"].createElement(
              _reactRouter.Link,
              { to: "/user/" + name, onClick: togglePlayer.bind(null, "close") },
              display_name,
              !display_name.match(/^[a-z\_]+$/i) ? "(" + name + ")" : ""
            )
          ),
          _react2["default"].createElement(
            "div",
            { className: "lines", onClick: this.toggleMenu.bind(this, "toggle") },
            _react2["default"].createElement("div", null),
            _react2["default"].createElement("div", null),
            _react2["default"].createElement("div", null)
          )
        )
      )
    );
  }
});

// player component to house streams
exports["default"] = _react2["default"].createClass({
  displayName: "Player",
  getInitialState: function getInitialState() {
    return {};
  },
  render: function render() {
    var _props2 = this.props;
    var userData = _props2.userData;
    var auth = _props2.auth;
    var playerState = _props2.playerState;
    var _props2$methods = _props2.methods;
    var spliceStream = _props2$methods.spliceStream;
    var togglePlayer = _props2$methods.togglePlayer;
    var alertAuthNeeded = _props2$methods.alertAuthNeeded;
    var dataObject = _props2.data.dataObject;

    return _react2["default"].createElement(
      "div",
      { className: "player" },
      _react2["default"].createElement(
        "div",
        { className: "wrapper" },
        _react2["default"].createElement(
          "ul",
          { className: "list" },
          dataObject ? Object.keys(dataObject).map(function (channelName) {
            var channelData = dataObject[channelName];
            return _react2["default"].createElement(PlayerStream, { key: channelName, name: channelName, display_name: dataObject[channelName], userData: userData, auth: auth, methods: {
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
          )
        )
      )
    );
  }
});
module.exports = exports["default"];