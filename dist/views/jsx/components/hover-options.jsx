"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _followJsx = require("./follow.jsx");

var _followJsx2 = _interopRequireDefault(_followJsx);

var ListItemHoverOptions = _react2["default"].createClass({
  displayName: "ListItemTools",
  render: function render() {
    var _props = this.props;
    var auth = _props.auth;
    var name = _props.name;
    var stream = _props.stream;
    var display_name = _props.display_name;
    var userData = _props.userData;
    var followCallback = _props.callback;
    var appendStream = _props.clickCallback;

    return _react2["default"].createElement(
      "div",
      { className: "hover-options" },
      _react2["default"].createElement(
        "div",
        { className: "go-to-channel" },
        _react2["default"].createElement(
          "a",
          { href: "https://twitch.tv/" + name, target: "_blank" },
          "Visit On Twitch"
        )
      ),
      userData ? _react2["default"].createElement(_followJsx2["default"], { name: userData.name, targetName: name, targetDisplay: display_name, auth: auth, callback: followCallback }) : null,
      stream ? _react2["default"].createElement(
        "div",
        { className: "append-stream" },
        _react2["default"].createElement(
          "a",
          { href: "#", onClick: appendStream.bind(null, name, display_name) },
          "Watch Stream"
        )
      ) : _react2["default"].createElement(
        "div",
        { className: "append-stream" },
        _react2["default"].createElement(
          "a",
          { href: "#", onClick: appendStream.bind(null, name, display_name) },
          "Open Stream"
        )
      )
    );
  }
});
exports.ListItemHoverOptions = ListItemHoverOptions;