"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require("react-router");

var _questionToolsJsx = require("./question-tools.jsx");

exports["default"] = _react2["default"].createClass({
  displayName: "Overlay",
  render: function render() {
    console.log("overlay", this.props);
    var _props = this.props;
    var auth = _props.auth;
    var userData = _props.userData;
    var fireRef = _props.fireRef;
    var overlay = _props.overlay;
    var askQuestion = _props.askQuestion;
    var answerQuestion = _props.answerQuestion;
    var viewQuestion = _props.viewQuestion;
    var methods = _props.methods;
    var popUpHandler = _props.methods.popUpHandler;

    return _react2["default"].createElement(
      "div",
      { className: "overlay" + (overlay ? " open" : ""), onClick: popUpHandler.bind(null, "close") },
      (function () {
        var Component = null;
        switch (overlay) {
          case "askQuestion":
            Component = _questionToolsJsx.AskQuestion;
            break;
          case "answerQuestion":
            Component = _questionToolsJsx.AnswerQuestion;
            break;
          case "viewQuestion":
            Component = _questionToolsJsx.ViewQuestion;
            break;
          default:
            Component = null;
        }
        return Component ? _react2["default"].createElement(Component, {
          overlay: overlay,
          askQuestion: askQuestion,
          answerQuestion: answerQuestion,
          viewQuestion: viewQuestion,
          fireRef: fireRef,
          auth: auth,
          userData: userData,
          methods: methods }) : null;
      })()
    );
  }
});
module.exports = exports["default"];