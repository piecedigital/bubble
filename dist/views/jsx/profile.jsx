"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _componentsUserFollowedStreamsJsx = require("./components/user/followed-streams.jsx");

var _componentsUserFollowedStreamsJsx2 = _interopRequireDefault(_componentsUserFollowedStreamsJsx);

var _componentsUserFollowingStreamsJsx = require("./components/user/following-streams.jsx");

var _componentsUserFollowingStreamsJsx2 = _interopRequireDefault(_componentsUserFollowingStreamsJsx);

exports["default"] = _react2["default"].createClass({
  displayName: "Profile",
  render: function render() {
    return _react2["default"].createElement(
      "div",
      { className: "top-level-component profile" },
      _react2["default"].createElement(
        "div",
        { className: "general-page profile" },
        _react2["default"].createElement(_componentsUserFollowedStreamsJsx2["default"], this.props),
        _react2["default"].createElement("div", { className: "separator-4-black" }),
        _react2["default"].createElement(_componentsUserFollowingStreamsJsx2["default"], this.props)
      )
    );
  }
});
module.exports = exports["default"];