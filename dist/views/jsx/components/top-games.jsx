"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

// list item for featured streams
var ListItem = _react2["default"].createClass({
  displayName: "feat-ListItem",
  render: function render() {
    var _props$data = this.props.data;
    var channels = _props$data.channels;
    var viewers = _props$data.viewers;
    var _props$data$game = _props$data.game;
    var name = _props$data$game.name;
    var id = _props$data$game._id;
    var box = _props$data$game.box;

    return _react2["default"].createElement(
      "li",
      null,
      _react2["default"].createElement(
        _reactRouter.Link,
        { to: "/search/game?q=" + name },
        _react2["default"].createElement(
          "div",
          { className: "image" },
          _react2["default"].createElement("img", { src: box.medium })
        ),
        _react2["default"].createElement(
          "div",
          { className: "info" },
          _react2["default"].createElement(
            "div",
            { className: "game-name" },
            name
          ),
          _react2["default"].createElement(
            "div",
            { className: "channel-count" },
            channels + " total streams"
          ),
          _react2["default"].createElement(
            "div",
            { className: "viewer-count" },
            viewers + " total viewers"
          )
        )
      )
    );
  }
});

// primary section for the featured component
exports["default"] = _react2["default"].createClass({
  displayName: "TopGames",
  getInitialState: function getInitialState() {
    return {
      requestOffset: 0,
      dataArray: []
    };
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    var loadData = this.props.methods.loadData;

    if (loadData) {
      loadData.call(this, function (e) {
        console.error(e.stack);
      }).then(function (methods) {
        methods.topGames().then(function (data) {
          // console.log(data);
          _this.setState({
            offset: _this.state.requestOffset + 20,
            dataArray: Array.from(_this.state.dataArray).concat(data.top)
          });
        })["catch"](function (e) {
          return console.error(e.stack);
        });
      })["catch"](function (e) {
        return console.error(e.stack);
      });
    }
  },
  render: function render() {
    var _state = this.state;
    var requestOffset = _state.requestOffset;
    var dataArray = _state.dataArray;
    var _props$methods = this.props.methods;
    var appendStream = _props$methods.appendStream;
    var loadData = _props$methods.loadData;

    return _react2["default"].createElement(
      "div",
      { className: "top-games" },
      _react2["default"].createElement(
        "div",
        { className: "wrapper" },
        _react2["default"].createElement(
          "ul",
          { className: "list" },
          dataArray.map(function (itemData, ind) {
            return _react2["default"].createElement(ListItem, { key: ind, index: ind, data: itemData });
          })
        )
      )
    );
  }
});
module.exports = exports["default"];