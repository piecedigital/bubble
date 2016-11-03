"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _componentsUserFollowStreamsJsx = require("./components/user/follow-streams.jsx");

var _componentsUserFollowStreamsJsx2 = _interopRequireDefault(_componentsUserFollowStreamsJsx);

// import FollowedStreams from "./components/user/followed-streams.jsx";
// import FollowingStreams from "./components/user/following-streams.jsx";

exports["default"] = _react2["default"].createClass({
  displayName: "Profile",
  render: function render() {
    return _react2["default"].createElement(
      "div",
      { className: "top-level-component profile" },
      _react2["default"].createElement(
        "div",
        { className: "general-page profile" },
        _react2["default"].createElement(_componentsUserFollowStreamsJsx2["default"], _extends({ follow: "IFollow" }, this.props)),
        _react2["default"].createElement("div", { className: "separator-4-black" }),
        _react2["default"].createElement(_componentsUserFollowStreamsJsx2["default"], _extends({ follow: "followMe" }, this.props))
      )
    );
  }
});
module.exports = exports["default"];