"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _followBtnJsx = require("./follow-btn.jsx");

var _followBtnJsx2 = _interopRequireDefault(_followBtnJsx);

var _bookmarkBtnJsx = require("./bookmark-btn.jsx");

var _bookmarkBtnJsx2 = _interopRequireDefault(_bookmarkBtnJsx);

var _reactRouter = require('react-router');

var ListItemHoverOptions = _react2["default"].createClass({
  displayName: "ListItemTools",
  render: function render() {
    var _props = this.props;
    var fireRef = _props.fireRef;
    var versionData = _props.versionData;
    var auth = _props.auth;
    var name = _props.name;
    var stream = _props.stream;
    var vod = _props.vod;
    var display_name = _props.display_name;
    var userData = _props.userData;
    var followCallback = _props.callback;
    var clickCallback = _props.clickCallback;

    return _react2["default"].createElement(
      "div",
      { className: "hover-options" },
      _react2["default"].createElement(
        "div",
        { className: "wrapper" },
        _react2["default"].createElement(
          "div",
          { className: "go-to-channel" },
          _react2["default"].createElement(
            _reactRouter.Link,
            { to: "/profile/" + name },
            "View Profile"
          )
        ),
        userData ? _react2["default"].createElement(_followBtnJsx2["default"], { name: userData.name, targetName: name, targetDisplay: display_name, auth: auth, callback: followCallback }) : null,
        _react2["default"].createElement(
          "div",
          { className: "append-stream" },
          _react2["default"].createElement(
            "a",
            { href: vod ? "http://www.twitch.tv/" + name + "/v/" + vod : "http://www.twitch.tv/" + name, target: "_blank", rel: "nofollow", onClick: function (e) {
                e.preventDefault();
                clickCallback(name, display_name, vod);
              } },
            stream || vod ? "Watch" : "Open",
            " ",
            vod ? "VOD" : "Stream"
          )
        ),
        _react2["default"].createElement(
          "div",
          { className: "send-message" },
          _react2["default"].createElement(
            "a",
            { className: "btn-default btn-rect btn-no-pad color-black no-underline", href: "http://www.twitch.tv/message/compose?to=" + name, target: "_blank" },
            "Send Message"
          )
        ),
        userData ? _react2["default"].createElement(_bookmarkBtnJsx2["default"], {
          fireRef: fireRef,
          userData: userData,
          givenUsername: name,
          versionData: versionData }) : null
      )
    );
  }
});
exports.ListItemHoverOptions = ListItemHoverOptions;