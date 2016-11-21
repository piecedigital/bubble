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
    var content = _react2["default"].createElement(
      "div",
      { className: "wrapper" },
      data.data.title ? _react2["default"].createElement(
        "div",
        { className: "pad" },
        _react2["default"].createElement(
          "div",
          { className: "title" },
          data.data.title
        )
      ) : null,
      data.data.image ? data.data.link ? _react2["default"].createElement(
        "a",
        { href: data.data.link, rel: "nofollow", target: "_blank" },
        _react2["default"].createElement(
          "div",
          { className: "image" },
          _react2["default"].createElement("img", { src: data.data.image })
        )
      ) : _react2["default"].createElement(
        "div",
        { className: "image" },
        _react2["default"].createElement("img", { src: data.data.image })
      ) : null,
      _react2["default"].createElement(
        "div",
        { className: "pad" },
        data.html_description ? _react2["default"].createElement("div", { className: "description", dangerouslySetInnerHTML: { __html: data.html_description } }) : null
      )
    );
    return _react2["default"].createElement(
      "div",
      { className: "panel" },
      content
    );
  }
});

exports["default"] = _react2["default"].createClass({
  displayName: "StreamPanels",
  render: function render() {
    var _props = this.props;
    var panelData = _props.panelData;
    var panelsHandler = _props.methods.panelsHandler;

    return _react2["default"].createElement(
      "div",
      { className: "stream-panels" + (panelData.length > 0 ? "" : " empty") },
      _react2["default"].createElement(
        "div",
        { className: "wrapper" },
        _react2["default"].createElement(
          "div",
          { className: "list" },
          panelData.map(function (data) {
            return _react2["default"].createElement(Panel, { data: data });
          })
        ),
        _react2["default"].createElement(
          "div",
          { className: "tools" },
          _react2["default"].createElement(
            "div",
            { className: "option btn-default close", onClick: panelsHandler },
            "Close"
          )
        )
      )
    );
  }
});
module.exports = exports["default"];