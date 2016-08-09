"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _componentsFeaturedStreamsJsx = require("./components/featured-streams.jsx");

var _componentsFeaturedStreamsJsx2 = _interopRequireDefault(_componentsFeaturedStreamsJsx);

var _componentsTopGamesJsx = require("./components/top-games.jsx");

var _componentsTopGamesJsx2 = _interopRequireDefault(_componentsTopGamesJsx);

exports["default"] = _react2["default"].createClass({
  displayName: "Home",
  getInitialState: function getInitialState() {
    return {};
  },
  render: function render() {
    var _props$methods = this.props.methods;
    var loadData = _props$methods.loadData;
    var appendStream = _props$methods.appendStream;

    return _react2["default"].createElement(
      "div",
      { className: "home-page" },
      _react2["default"].createElement(_componentsFeaturedStreamsJsx2["default"], { methods: {
          appendStream: appendStream,
          loadData: loadData
        } }),
      _react2["default"].createElement(_componentsTopGamesJsx2["default"], { methods: {
          loadData: loadData
        } })
    );
  }
});
module.exports = exports["default"];