"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var Panel = _react2["default"].createClass({
  displayName: "Panel",
  render: function render() {
    var data = this.props.data;

    console.log("PANEL", data);
    return _react2["default"].createElement(
      "div",
      { className: "panel" },
      "One Panel"
    );
  }
});

exports["default"] = _react2["default"].createClass({
  displayName: "StreamPanels",
  render: function render() {
    var panelData = this.props.panelData;

    return _react2["default"].createElement(
      "div",
      { className: "stream-panels" },
      _react2["default"].createElement(
        "div",
        { className: "wrapper" },
        _react2["default"].createElement(
          "div",
          { className: "list" },
          panelData.map(function (data) {
            return _react2["default"].createElement(Panel, { data: data });
          })
        )
      )
    );
  }
});
module.exports = exports["default"];