"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _modulesLoadData = require("../../../modules/load-data");

var _modulesLoadData2 = _interopRequireDefault(_modulesLoadData);

// stream component for player
var PlayerStream = _react2["default"].createClass({
  displayName: "PlayerStream",
  render: function render() {
    // console.log(this.props);
    var _props = this.props;
    var name = _props.data;
    var spliceStream = _props.methods.spliceStream;

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
      ),
      _react2["default"].createElement(
        "div",
        { className: "tools", onClick: spliceStream.bind(null, name) },
        _react2["default"].createElement(
          "div",
          { className: "closer" },
          "x"
        )
      )
    );
  }
});

// player component to house streams
exports["default"] = _react2["default"].createClass({
  displayName: "Player",
  getInitialState: function getInitialState() {
    return {};
  },
  render: function render() {
    var _props2 = this.props;
    var spliceStream = _props2.methods.spliceStream;
    var dataObject = _props2.data.dataObject;

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
            return _react2["default"].createElement(PlayerStream, { key: channelName, data: channelName, methods: {
                spliceStream: spliceStream
              } });
          }) : null
        )
      )
    );
  }
});
module.exports = exports["default"];