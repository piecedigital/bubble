"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

exports["default"] = _react2["default"].createClass({
  displayName: "Home",
  render: function render() {
    return _react2["default"].createElement(
      "h1",
      null,
      "Hello ",
      this.props.data.who
    );
  }
});
module.exports = exports["default"];