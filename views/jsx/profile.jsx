"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _componentsUserUserInfoJsx = require("./components/user/user-info.jsx");

var _componentsUserUserInfoJsx2 = _interopRequireDefault(_componentsUserUserInfoJsx);

var _componentsUserQuestionsJsx = require("./components/user-questions.jsx");

var _componentsUserQuestionsJsx2 = _interopRequireDefault(_componentsUserQuestionsJsx);

var _componentsUserFollowStreamsJsx = require("./components/user/follow-streams.jsx");

var _componentsUserFollowStreamsJsx2 = _interopRequireDefault(_componentsUserFollowStreamsJsx);

var _componentsUserVideosListingJsx = require("./components/user/videos-listing.jsx");

var _componentsUserVideosListingJsx2 = _interopRequireDefault(_componentsUserVideosListingJsx);

exports["default"] = _react2["default"].createClass({
  displayName: "Profile",
  render: function render() {
    var _props = this.props;
    var auth = _props.auth;
    var fireRef = _props.fireRef;
    var userData = _props.userData;
    var _props$params = _props.params;
    var params = _props$params === undefined ? {} : _props$params;

    var name = (params.username ? params.username : userData ? userData.name : "").toLowerCase();

    // don't render without this data
    return _react2["default"].createElement(
      "div",
      { className: "top-level-component profile" },
      _react2["default"].createElement(
        "div",
        { className: "general-page profile" },
        _react2["default"].createElement(
          "div",
          { className: "page-header" },
          _react2["default"].createElement(
            "div",
            { className: "title" },
            "Profile: ",
            name ? _react2["default"].createElement(
              "a",
              { target: "_blank", rel: "nofollow", href: "//twitch.com/" + name },
              name
            ) : null
          )
        ),
        fireRef ? [_react2["default"].createElement("div", { key: "1", className: "separator-4-black" }), params.username || userData ? _react2["default"].createElement(_componentsUserUserInfoJsx2["default"], _extends({ key: "2" }, this.props)) : null, _react2["default"].createElement("div", { key: "3", className: "separator-4-black" }), userData || params.username ? _react2["default"].createElement(_componentsUserQuestionsJsx2["default"], _extends({ key: "4" }, this.props)) : null, auth && auth.access_token && (userData || params.username) ? [_react2["default"].createElement("div", { key: "sep-IFollow", className: "separator-4-black" }), _react2["default"].createElement(_componentsUserFollowStreamsJsx2["default"], _extends({ key: "comp-IFollow", follow: "IFollow" }, this.props))] : null, auth && auth.access_token && (userData || params.username) ? [_react2["default"].createElement("div", { key: "sep-followMe", className: "separator-4-black" }), _react2["default"].createElement(_componentsUserFollowStreamsJsx2["default"], _extends({ key: "comp-followMe", follow: "followMe" }, this.props))] : null, _react2["default"].createElement("div", { key: "5", className: "separator-4-black" }), params.username || userData ? _react2["default"].createElement(_componentsUserVideosListingJsx2["default"], _extends({ key: "6", broadcasts: true }, this.props)) : null] : null
      )
    );
  }
});
module.exports = exports["default"];