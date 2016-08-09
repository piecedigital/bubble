"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

// list item for featured streams
var ListItem = _react2["default"].createClass({
  displayName: "stream-ListItem",
  render: function render() {
    console.log(this.props);
    var name = this.props.data;

    return _react2["default"].createElement(
      "li",
      { className: "stream" },
      _react2["default"].createElement(
        "div",
        { className: "video" },
        _react2["default"].createElement("iframe", { src: "https://player.twitch.tv/?channel=" + name, frameBorder: "0", scrolling: "no" })
      ),
      _react2["default"].createElement(
        "div",
        { className: "chat" },
        _react2["default"].createElement("iframe", { src: "https://www.twitch.tv/" + name + "/chat", frameBorder: "0", scrolling: "no" })
      )
    );
  }
});

// primary section for the search component
exports["default"] = _react2["default"].createClass({
  displayName: "Player",
  getInitialState: function getInitialState() {
    return {};
  },
  render: function render() {
    var _props = this.props;
    var spliceStream = _props.methods.spliceStream;
    var dataObject = _props.data.dataObject;

    return _react2["default"].createElement(
      "div",
      { className: "player" },
      _react2["default"].createElement(
        "div",
        { className: "wrapper" },
        _react2["default"].createElement(
          "ul",
          { className: "list" },
          dataObject ? Object.keys(dataObject).map(function (channelName) {
            var channelData = dataObject[channelName];
            return _react2["default"].createElement(ListItem, { key: channelName, data: channelName, methods: {
                spliceStream: spliceStream
              } });
          }) : null
        )
      )
    );
  }
});
module.exports = exports["default"];