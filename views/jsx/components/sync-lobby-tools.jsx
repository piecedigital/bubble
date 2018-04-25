"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _firebase = require("firebase");

var _firebase2 = _interopRequireDefault(_firebase);

var _reactRouter = require('react-router');

var SyncLobbyItem = _react2["default"].createClass({
  displayName: "SyncLobbyItem",
  remove: function remove() {
    var _props = this.props;
    var fireRef = _props.fireRef;
    var lobbyID = _props.lobbyID;

    fireRef.syncLobbyRef.child(lobbyID).set(null);
  },
  render: function render() {
    var lobbyID = this.props.lobbyID;

    return _react2["default"].createElement(
      "div",
      { className: "lobby-item" },
      _react2["default"].createElement(
        "label",
        null,
        _react2["default"].createElement(
          _reactRouter.Link,
          { className: "name", to: "/sync-lobby/" + lobbyID },
          lobbyID
        ),
        _react2["default"].createElement(
          "div",
          { className: "tools" },
          _react2["default"].createElement(
            "span",
            { className: "unmark warning", onClick: this.remove },
            "x"
          )
        )
      )
    );
  }
});

var ViewSyncLobby = _react2["default"].createClass({
  displayName: "ViewSyncLobby",
  getInitialState: function getInitialState() {
    return {
      lobbies: {}
    };
  },
  newLobby: function newLobby(snap) {
    var lobbyKey = snap.getKey();
    var lobbyData = snap.val();
    var newLobbies = JSON.parse(JSON.stringify(this.state.lobbies));
    // appends the new lobby to the top of the lobby list
    this.setState({
      lobbies: Object.assign(newLobbies, _defineProperty({}, lobbyKey, lobbyData))
    });
  },
  removedLobby: function removedLobby(snap) {
    var lobbyKey = snap.getKey();
    var lobbyData = snap.val();
    console.log(lobbyKey, lobbyData);
    var newLobbies = JSON.parse(JSON.stringify(this.state.lobbies));
    delete newLobbies[lobbyKey];
    this.setState({
      lobbys: newLobbies
    });
  },
  addLobby: function addLobby(e) {
    e.preventDefault();
    var _props2 = this.props;
    var fireRef = _props2.fireRef;
    var userData = _props2.userData;
    var versionData = _props2.versionData;

    var vodID = this.refs["new-lobby"].value.split("/").slice(-2).join("");

    if (!vodID) return;

    fireRef.syncLobbyRef.push().set({
      "hostID": userData._id,
      "videoType": "Twitch",
      "videoLink": vodID,
      "videoState": {
        "time": 0,
        "playing": true
      },
      "chatMessages": {},
      "date": _firebase2["default"].database.ServerValue.TIMESTAMP,
      "version": versionData
    });

    this.refs["new-lobby"].value = "";
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    var _props3 = this.props;
    var fireRef = _props3.fireRef;
    var userData = _props3.userData;

    fireRef.syncLobbyRef.orderByChild("hostID").equalTo(userData._id).once("value").then(function (snap) {
      _this.setState({
        lobbies: snap.val() || {}
      });
    });

    var refNode = fireRef.syncLobbyRef.orderByChild("hostID").equalTo(userData._id);
    refNode.on("child_added", this.newLobby);
    refNode.on("child_removed", this.removedLobby);
  },
  componentWillUnmount: function componentWillUnmount() {
    var _props4 = this.props;
    var fireRef = _props4.fireRef;
    var userData = _props4.userData;

    var refNode = fireRef.syncLobbyRef.orderByChild("hostID").equalTo(userData._id);
    refNode.off("child_added", this.newLobby);
    refNode.off("child_removed", this.removedLobby);
  },
  render: function render() {
    var _props5 = this.props;
    var fireRef = _props5.fireRef;
    var userData = _props5.userData;
    var popUpHandler = _props5.methods.popUpHandler;

    var syncLobbyList = Object.keys(this.state.lobbies).map(function (lobbyID) {
      return _react2["default"].createElement(SyncLobbyItem, _extends({
        key: lobbyID
      }, {
        fireRef: fireRef,
        userData: userData,
        lobbyID: lobbyID
      }));
    }).reverse();

    return _react2["default"].createElement(
      "div",
      { className: "overlay-ui-default view-sync-lobbies open", onClick: function (e) {
          return e.stopPropagation();
        } },
      _react2["default"].createElement(
        "div",
        { className: "close", onClick: popUpHandler.bind(null, "close") },
        "x"
      ),
      _react2["default"].createElement(
        "div",
        { className: "title" },
        "Sync Lobbies"
      ),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement(
        "div",
        { className: "scroll" },
        _react2["default"].createElement(
          "div",
          { className: "section" },
          _react2["default"].createElement(
            "div",
            { className: "list" },
            syncLobbyList
          )
        )
      ),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement(
        "div",
        { className: "section" },
        _react2["default"].createElement(
          "form",
          { onSubmit: this.addLobby },
          _react2["default"].createElement(
            "div",
            { className: "section" },
            _react2["default"].createElement(
              "label",
              null,
              _react2["default"].createElement(
                "div",
                { className: "label bold" },
                "Add Lobby"
              ),
              _react2["default"].createElement("input", { type: "text", ref: "new-lobby" })
            )
          ),
          _react2["default"].createElement(
            "div",
            { className: "section" },
            _react2["default"].createElement(
              "button",
              { className: "submit btn-default" },
              "Submit"
            )
          )
        )
      )
    );
  }
});
exports.ViewSyncLobby = ViewSyncLobby;