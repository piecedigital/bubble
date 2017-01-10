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
    var fireRef = _props.fireRef;
    var userData = _props.userData;
    var _props$params = _props.params;
    var params = _props$params === undefined ? {} : _props$params;

    var name = (params.username ? params.username : userData ? userData.name : "").toLowerCase();

    // don't render without this data
    if (!fireRef || !userData) return null;
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
              { target: "_blank", rel: "nofollow", href: "https://twitch.com/" + name },
              name
            ) : null
          )
        ),
        _react2["default"].createElement("div", { className: "separator-4-black" }),
        _react2["default"].createElement(_componentsUserUserInfoJsx2["default"], this.props),
        _react2["default"].createElement("div", { className: "separator-4-black" }),
        _react2["default"].createElement(_componentsUserQuestionsJsx2["default"], this.props),
        _react2["default"].createElement("div", { className: "separator-4-black" }),
        _react2["default"].createElement(_componentsUserFollowStreamsJsx2["default"], _extends({ follow: "IFollow" }, this.props)),
        _react2["default"].createElement("div", { className: "separator-4-black" }),
        _react2["default"].createElement(_componentsUserFollowStreamsJsx2["default"], _extends({ follow: "followMe" }, this.props)),
        _react2["default"].createElement("div", { className: "separator-4-black" }),
        _react2["default"].createElement(_componentsUserVideosListingJsx2["default"], _extends({ broadcasts: true }, this.props))
      )
    );
  }
});
module.exports = exports["default"];