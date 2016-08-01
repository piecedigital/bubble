"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

exports["default"] = _react2["default"].createClass({
  displayName: "Home",
  getInitialState: function getInitialState() {
    return {
      posts: this.props.userData && this.props.userData.posts || {}
    };
  },
  render: function render() {
    var auth = this.props.auth;

    if (auth && this.props.userData) {
      var posts = this.props.userData.posts;
    } else {
      return _react2["default"].createElement(
        "ul",
        null,
        _react2["default"].createElement(
          "div",
          { className: "not-logged-in" },
          "You must log in to see your feed"
        )
      );
    }
  }
});
module.exports = exports["default"];