"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var Container = _react2["default"].createClass({
  displayName: "SyncPlayerContainer",
  getInitialState: function getInitialState() {
    return {
      playerReady: false
    };
  },
  makePlayer: function makePlayer(overrideName) {
    var _this = this;

    var link = this.props.link;

    var options = {
      video: link || "https://www.twitch.tv/noxidlyrrad/v/253112858".split("/").slice(-2).join(),
      width: "100%",
      height: "800"
    };

    var player = new Twitch.Player(this.refs.video, options);
    this.player = player;

    player.addEventListener(Twitch.Player.READY, function () {
      _this.setState({
        playerReady: true
      });
      console.log('Player is ready!');
      _this.timestampTimeTicker = setInterval(function () {
        var time = player.getCurrentTime();
        // console.log("time", time);
        if (_this.props.fireRef) _this.props.fireRef.syncLobbyRef.child("videoState/time").set(time);
      }, 5000);
    });

    player.addEventListener(Twitch.Player.PLAY, function () {
      _this.setState({
        playing: true
      });
      console.log('Player is playing!');
    });

    player.addEventListener(Twitch.Player.PAUSE, function () {
      _this.setState({
        playing: false
      });
      console.log('Player is paused!');
    });
  },
  componentDidMount: function componentDidMount() {
    this.makePlayer();
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    console.log(this.props);
    if (nextProps.userData != null && nextProps.fireRef != null) {
      console.log("initial lobby commit");
      this.props.fireRef.syncLobbyRef.update({
        "hostID": nextProps.userData._id,
        "videoType": "Twitch",
        "videoLink": "https://www.twitch.tv/noxidlyrrad/v/253112858".split("/").slice(-2).join(), // full required for now
        "videoState": {
          "playing": true
        },
        "chatMessages": {},
        "date": Date.now(),
        "version": this.props.versionData
      });
    }
  },
  render: function render() {
    return _react2["default"].createElement(
      "div",
      { className: "sync-player-container" },
      _react2["default"].createElement("div", { ref: "video" })
    );
  }
});

var Form = _react2["default"].createClass({
  displayName: "SyncPlayerForm",
  render: function render() {
    return _react2["default"].createElement(
      "div",
      { className: "form" },
      _react2["default"].createElement(
        "div",
        { className: "box" },
        _react2["default"].createElement(
          "h3",
          { className: "title" },
          "Create a new lobby"
        ),
        _react2["default"].createElement("br", null),
        _react2["default"].createElement("div", { className: "separator-2-dimmer" }),
        _react2["default"].createElement("br", null),
        _react2["default"].createElement(
          "form",
          { onSubmit: this.performSearch },
          _react2["default"].createElement("input", { ref: "searchInput", type: "text" }),
          _react2["default"].createElement("br", null),
          _react2["default"].createElement("br", null),
          _react2["default"].createElement(
            "button",
            null,
            "Search"
          )
        )
      )
    );
  }
});

// primary section for the search component
exports["default"] = _react2["default"].createClass({
  displayName: "SyncPlayer",
  render: function render() {
    return _react2["default"].createElement(
      "div",
      { className: "top-level-component sync-player" },
      this.props.params && this.props.params.lobbyID ? _react2["default"].createElement(Container, this.props) : _react2["default"].createElement(Form, null)
    );
  }
});
module.exports = exports["default"];