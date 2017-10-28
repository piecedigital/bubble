"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

exports["default"] = _react2["default"].createClass({
  displayName: "About",
  render: function render() {
    var _props = this.props;
    var auth = _props.auth;
    var userData = _props.userData;

    if (typeof window !== "undefined") {
      if (auth && userData) {

        window.opener.postMessage(JSON.stringify({
          res: "auth", authData: auth, userData: userData
        }), "*");
      }
    };

    return _react2["default"].createElement(
      "div",
      { className: "top-level-component about" },
      _react2["default"].createElement(
        "div",
        { className: "general-page about" },
        _react2["default"].createElement(
          "div",
          { className: "wrapper-about" },
          _react2["default"].createElement(
            "section",
            null,
            _react2["default"].createElement(
              "p",
              null,
              _react2["default"].createElement(
                "span",
                { className: "headline" },
                "Authenticating..."
              )
            )
          )
        )
      )
    );
  }
});
module.exports = exports["default"];