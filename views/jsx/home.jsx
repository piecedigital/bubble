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
    var _props = this.props;
    var auth = _props.auth;
    var userData = _props.userData;
    var fireRef = _props.fireRef;
    var versionData = _props.versionData;
    var _props$methods = _props.methods;
    var loadData = _props$methods.loadData;
    var appendStream = _props$methods.appendStream;
    var popUpHandler = _props$methods.popUpHandler;

    return _react2["default"].createElement(
      "div",
      { className: "top-level-component home-page" },
      _react2["default"].createElement(_componentsFeaturedStreamsJsx2["default"], {
        auth: auth,
        userData: userData,
        fireRef: fireRef,
        versionData: versionData,
        methods: {
          appendStream: appendStream,
          loadData: loadData,
          popUpHandler: popUpHandler
        } }),
      _react2["default"].createElement("div", { className: "separator-4-black" }),
      _react2["default"].createElement(_componentsTopGamesJsx2["default"], { methods: {
          loadData: loadData
        } })
    );
  }
});
module.exports = exports["default"];