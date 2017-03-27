"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require("react-router");

var _questionToolsJsx = require("./question-tools.jsx");

var _bookmarkToolsJsx = require("./bookmark-tools.jsx");

var _notificationToolsJsx = require("./notification-tools.jsx");

var _pollToolsJsx = require("./poll-tools.jsx");

var _gameQueueToolsJsx = require("./game-queue-tools.jsx");

var _feedbackToolsJsx = require("./feedback-tools.jsx");

var components = {
  "askQuestion": _questionToolsJsx.AskQuestion,
  "answerQuestion": _questionToolsJsx.AnswerQuestion,
  "viewQuestion": _questionToolsJsx.ViewQuestion,
  "viewAskedQuestions": _questionToolsJsx.ViewAskedQuestions,
  "viewBookmarks": _bookmarkToolsJsx.ViewBookmarks,
  "viewNotifications": _notificationToolsJsx.ViewNotifications,
  "makePoll": _pollToolsJsx.MakePoll,
  "votePoll": _pollToolsJsx.VotePoll,
  "viewPoll": _pollToolsJsx.ViewPoll,
  "viewCreatedPolls": _pollToolsJsx.ViewCreatedPolls,
  "viewGameQueue": _gameQueueToolsJsx.ViewGameQueue,
  "feedback": _feedbackToolsJsx.Feedback
};

exports["default"] = _react2["default"].createClass({
  displayName: "Overlay",
  render: function render() {
    // console.log("overlay", this.props);
    var _props = this.props;
    var auth = _props.auth;
    var userData = _props.userData;
    var versionData = _props.versionData;
    var fireRef = _props.fireRef;
    var overlay = _props.overlay;
    var overlayState = _props.overlayState;
    var params = _props.params;
    var location = _props.location;
    var methods = _props.methods;
    var popUpHandler = _props.methods.popUpHandler;

    var Component = components[overlay] || null;
    // console.log(overlay, components, Component);
    if (!fireRef) return null;
    if (!userData) {
      // with the correct case we wont require the user to be logged in
      switch (overlay) {
        case "viewQuestion":
        case "viewPoll":
        case "viewGameQueue":
        case "feedback":
          Component = Component;
          break;
        default:
          Component = null;
      }
    }
    return _react2["default"].createElement(
      "div",
      { className: "overlay" + (Component ? " open" : ""), onClick: popUpHandler.bind(null, "close") },
      (function () {
        return Component ? _react2["default"].createElement(Component, _extends({
          auth: auth,
          overlay: overlay
        }, overlayState, {
          fireRef: fireRef,
          versionData: versionData,
          params: params,
          location: location,
          userData: userData,
          methods: methods })) : null;
      })()
    );
  }
});
module.exports = exports["default"];