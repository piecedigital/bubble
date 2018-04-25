"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _modulesClientHelperToolsJs = require("../../modules/client/helper-tools.js");

var Container = _react2["default"].createClass({
  displayName: "SyncPlayerContainer",
  getInitialState: function getInitialState() {
    return {
      isHost: null,
      lobbyData: null,
      playerReady: false,
      autoSyncTime: true,
      autoSyncPlay: true,
      timeDiff: 1,
      updateInterval: 1,
      chatMessages: []
    };
  },
  makePlayer: function makePlayer(overrideName) {
    var _this = this;

    var options = {
      video: this.state.lobbyData.videoLink,
      width: "100%",
      height: "100%"
    };

    var player = new Twitch.Player(this.refs.video, options);
    this.player = player;

    player.addEventListener(Twitch.Player.READY, function () {
      _this.setState({
        playerReady: true
      });
      console.log('Player is ready!');
      if (_this.props.userData && _this.state.lobbyData.hostID === _this.props.userData._id) {
        _this.setState({
          isHost: true
        });
        console.log("is host");
        _this.timestampTimeTicker = function () {
          setInterval(function () {
            var time = player.getCurrentTime();
            // console.log("time", time);
            if (_this.props.fireRef) _this.props.fireRef.syncLobbyRef.child(_this.props.params.lobbyID + "/videoState/time").set(time);
          }, 1000 + _this.state.updateInterval);
        };
        _this.timestampTimeTicker();
      } else {
        console.log("is not host");
        setTimeout(function () {
          _this.setState({
            isHost: false
          });
          // listen as non host on lobby data
          _this.props.fireRef.syncLobbyRef.child(_this.props.params.lobbyID).on("child_changed", function (snap) {
            var dataKey = snap.getKey();
            var data = snap.val();

            var currentTime = player.getCurrentTime();
            if (dataKey === "videoState") {
              if (currentTime - data.time >= _this.state.timeDiff || currentTime - data.time <= -_this.state.timeDiff) {
                if (_this.state.autoSyncTime) player.seek(data.time);
              }

              if (_this.state.autoSyncPlay) {
                if (player.isPaused()) {
                  if (data.playing) player.play();
                } else {
                  if (!data.playing) player.pause();
                }
              }
            }

            if (dataKey === "videoLink" && data.videoLink != _this.state.lobbyData.videoLink) {
              _this.setState({
                lobbyData: Object.assign(_this.state.lobbyData, {
                  videoLink: data
                })
              });
              // videoType: data,
              _this.player.setVideo(data);
            }
          });
        }, 1000);
      }
    });

    if (!this.props.userData || this.state.lobbyData.hostID === this.props.userData._id) {
      player.addEventListener(Twitch.Player.PLAY, function () {
        _this.setState({
          playing: true
        });
        console.log('Player is playing!');
        if (_this.props.fireRef) _this.props.fireRef.syncLobbyRef.child(_this.props.params.lobbyID + "/videoState/playing").set(true);
      });

      player.addEventListener(Twitch.Player.PAUSE, function () {
        _this.setState({
          playing: false
        });
        console.log('Player is paused!');
        if (_this.props.fireRef) _this.props.fireRef.syncLobbyRef.child(_this.props.params.lobbyID + "/videoState/playing").set(false);
      });
    }
  },
  changeLink: function changeLink(e) {
    e.preventDefault();
    var lobbyID = this.props.params.lobbyID;
    var vodID = this.refs.newLink.value.split("/").slice(-2).join("");
    this.player.setVideo(vodID);
    this.props.fireRef.syncLobbyRef.child(lobbyID + "/videoLink").set(vodID);
    this.props.fireRef.syncLobbyRef.child(lobbyID + "/videoType").set("Twitch");
  },
  updateOptions: function updateOptions(key) {
    var value = this.refs[key].value;
    if (value === "false") value = false;
    if (value === "true") value = true;
    console.log(key, value);
    value = parseInt(value) || value;

    this.state[key] = value;
  },
  sendChatMessage: function sendChatMessage(e) {
    e.preventDefault();
    this.props.fireRef.syncLobbyRef.child(this.props.params.lobbyID).child("chatMessages").push().set({
      username: this.props.userData.display_name,
      userID: this.props.userData._id,
      message: this.refs.chatMessageInput.value,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    });

    this.refs.chatMessageInput.value = "";
  },
  formatTime: function formatTime(time) {
    var formattedTime = (0, _modulesClientHelperToolsJs.formatDate)(time);
    return formattedTime.formatted;
  },
  scrollChat: function scrollChat() {
    console.log("scroll");
    this.refs.messages.scrollTop = this.refs.messages.scrollHeight - this.refs.messages.offsetHeight;
  },
  componentDidMount: function componentDidMount() {},
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var _this2 = this;

    if (!this._fireRefMounted && nextProps.fireRef) {
      nextProps.fireRef.syncLobbyRef.child(this.props.params.lobbyID).once("value").then(function (snap) {
        _this2.setState({
          lobbyData: snap.val()
        }, function () {
          _this2.makePlayer();
        });
      });

      //
      nextProps.fireRef.syncLobbyRef.child(this.props.params.lobbyID).child("chatMessages").on("child_added", function (snap) {
        var dataKey = snap.getKey();
        var data = snap.val();

        var newChatMessages = Array.from(_this2.state.chatMessages);
        newChatMessages.push(data);
        _this2.setState({
          chatMessages: newChatMessages
        }, _this2.scrollChat);
      });
    }
    if (nextProps.fireRef) {
      this._fireRefMounted = true;
    }
  },
  render: function render() {
    var _this3 = this;

    return _react2["default"].createElement(
      "div",
      { className: "sync-player-container" },
      _react2["default"].createElement("div", { className: "video", ref: "video" }),
      _react2["default"].createElement(
        "div",
        { className: "side-panel" },
        _react2["default"].createElement(
          "div",
          { className: "controls" },
          this.state.isHost != null ? this.state.isHost ? _react2["default"].createElement(
            "div",
            null,
            _react2["default"].createElement(
              "div",
              { className: "row" },
              _react2["default"].createElement(
                "label",
                { title: "Change the video link for the lobby" },
                "Change video link"
              ),
              _react2["default"].createElement(
                "form",
                { onSubmit: this.changeLink },
                _react2["default"].createElement("input", { ref: "newLink" }),
                _react2["default"].createElement(
                  "button",
                  null,
                  "Submit"
                )
              )
            )
          ) : _react2["default"].createElement(
            "div",
            null,
            _react2["default"].createElement(
              "div",
              { className: "row" },
              _react2["default"].createElement(
                "label",
                null,
                "Automatically sync video time?"
              ),
              _react2["default"].createElement(
                "select",
                { ref: "autoSyncTime", onChange: this.updateOptions.bind(this, "autoSyncTime") },
                _react2["default"].createElement(
                  "option",
                  { value: true },
                  "Yes"
                ),
                _react2["default"].createElement(
                  "option",
                  { value: false },
                  "No"
                )
              )
            ),
            _react2["default"].createElement(
              "div",
              { className: "row" },
              _react2["default"].createElement(
                "label",
                null,
                "Automatically sync play state?"
              ),
              _react2["default"].createElement(
                "select",
                { ref: "autoSyncPlay", onChange: this.updateOptions.bind(this, "autoSyncPlay") },
                _react2["default"].createElement(
                  "option",
                  { value: true },
                  "Yes"
                ),
                _react2["default"].createElement(
                  "option",
                  { value: false },
                  "No"
                )
              )
            ),
            _react2["default"].createElement(
              "div",
              { className: "row" },
              _react2["default"].createElement(
                "label",
                { title: "How big of a time difference you want to allow between viewers" },
                "Time offset (in seconds)"
              ),
              _react2["default"].createElement("input", { ref: "timeDiff", onChange: this.updateOptions.bind(this, "timeDiff"), type: "number", min: "1", defaultValue: this.state.timeDiff })
            )
          ) : null
        ),
        _react2["default"].createElement(
          "div",
          { className: "chat-messages" },
          _react2["default"].createElement(
            "div",
            { className: "messages", ref: "messages" },
            this.state.chatMessages.map(function (msg, ind) {
              return _react2["default"].createElement(
                "div",
                { key: ind, className: "chat-msg" },
                _react2["default"].createElement(
                  "p",
                  null,
                  _react2["default"].createElement(
                    "span",
                    { className: "timestamp" },
                    "[",
                    _this3.formatTime(msg.timestamp),
                    "]"
                  ),
                  _react2["default"].createElement(
                    "span",
                    null,
                    " "
                  ),
                  _react2["default"].createElement(
                    _reactRouter.Link,
                    { to: "/profile/" + msg.username.toLowerCase(), className: "name" },
                    msg.username
                  ),
                  _react2["default"].createElement(
                    "span",
                    null,
                    ": "
                  ),
                  _react2["default"].createElement(
                    "span",
                    { className: "body" },
                    msg.message
                  )
                )
              );
            })
          ),
          _react2["default"].createElement(
            "div",
            { className: "form" },
            _react2["default"].createElement(
              "form",
              { onSubmit: this.sendChatMessage },
              _react2["default"].createElement("input", { ref: "chatMessageInput" }),
              _react2["default"].createElement(
                "button",
                null,
                "Send"
              )
            )
          )
        )
      )
    );
  }
});

var Form = _react2["default"].createClass({
  displayName: "SyncPlayerForm",
  createLobby: function createLobby(e) {
    e.preventDefault();
    var vodID = this.refs.linkInput.value.split("/").slice(-2).join("");

    var lobbyID = this.props.fireRef.syncLobbyRef.push().getKey();
    // https://www.twitch.tv/noxidlyrrad/v/253112858
    if (!vodID) return;

    console.log(lobbyID);
    this.props.fireRef.syncLobbyRef.child(lobbyID).update({
      "hostID": this.props.userData._id,
      "videoType": "Twitch",
      "videoLink": vodID,
      "videoState": {
        "time": 0,
        "playing": true
      },
      "chatMessages": {},
      "date": firebase.database.ServerValue.TIMESTAMP,
      "version": this.props.versionData
    });

    _reactRouter.browserHistory.push("sync-player/" + lobbyID);
  },
  render: function render() {
    if (!this.props.userData) return _react2["default"].createElement(
      "div",
      { className: "general-form" },
      _react2["default"].createElement(
        "div",
        { className: "box" },
        _react2["default"].createElement(
          "h3",
          { className: "title" },
          "Loading user auth..."
        )
      )
    );
    return _react2["default"].createElement(
      "div",
      { className: "general-form" },
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
          "label",
          null,
          "Link to Twitch VOD"
        ),
        _react2["default"].createElement(
          "form",
          { onSubmit: this.createLobby },
          _react2["default"].createElement("input", { ref: "linkInput", type: "text", placeholder: "link to twitch VOD" }),
          _react2["default"].createElement("br", null),
          _react2["default"].createElement("br", null),
          _react2["default"].createElement(
            "button",
            null,
            "Create Lobby"
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
      this.props.params && this.props.params.lobbyID ? _react2["default"].createElement(Container, this.props) : _react2["default"].createElement(Form, this.props)
    );
  }
});
module.exports = exports["default"];
/* <div className="row">
 <label title="How often the sync times should be checked">Sync Interval (in seconds)</label>
 <input ref="updateInterval" onChange={this.updateOptions.bind(this, "updateInterval")} type="number" min="1" />
</div> */