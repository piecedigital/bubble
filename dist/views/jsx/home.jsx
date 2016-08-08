"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _componentsFeaturedStreamsJsx = require("./components/featured-streams.jsx");

var _componentsFeaturedStreamsJsx2 = _interopRequireDefault(_componentsFeaturedStreamsJsx);

// import Streams from "./components/live-streams";
// import Games from "./components/top-games";

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
        } })
    );
  }
});
module.exports = exports["default"];
/*<Streams methods={{
 appendStream
}} loadData={loadData} />*/ /*<Games methods={{
                             appendStream
                            }} loadData={loadData} />*/