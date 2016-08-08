"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

// list item for featured streams
var ListItem = _react2["default"].createClass({
  displayName: "feat-ListItem",
  render: function render() {
    var _props = this.props;
    var index = _props.index;
    var displayStream = _props.methods.displayStream;
    var _props$data$stream = _props.data.stream;
    var game = _props$data$stream.game;
    var viewers = _props$data$stream.viewers;
    var title = _props$data$stream.title;
    var id = _props$data$stream._id;
    var preview = _props$data$stream.preview;
    var _props$data$stream$channel = _props$data$stream.channel;
    var mature = _props$data$stream$channel.mature;
    var logo = _props$data$stream$channel.logo;
    var name = _props$data$stream$channel.name;
    var language = _props$data$stream$channel.language;

    return _react2["default"].createElement(
      "li",
      { onClick: function () {
          displayStream(index);
        } },
      _react2["default"].createElement(
        "div",
        { className: "image" },
        _react2["default"].createElement("img", { src: preview.medium })
      ),
      _react2["default"].createElement(
        "div",
        { className: "info" },
        _react2["default"].createElement(
          "div",
          { className: "channel-name" },
          name
        ),
        _react2["default"].createElement(
          "div",
          { className: "title" },
          title
        ),
        _react2["default"].createElement(
          "div",
          { className: "game" },
          "Live with \"" + game + "\""
        )
      )
    );
  }
});

// the displayed stream of the feature streams
var FeaturedStream = _react2["default"].createClass({
  displayName: "FeaturedStream",
  render: function render() {
    console.log(this.props);
    var name = this.props.data.stream.channel.name;

    return _react2["default"].createElement(
      "div",
      { className: "featured-stream" },
      _react2["default"].createElement(
        "div",
        { className: "stream" },
        _react2["default"].createElement("iframe", { src: "http://player.twitch.tv/?channel=" + name })
      )
    );
  }
});

// primary section for the featured componentt
exports["default"] = _react2["default"].createClass({
  displayName: "FeaturedStreams",
  getInitialState: function getInitialState() {
    return {
      featuredRequestOffset: 0,
      featuredArray: [],
      featuredStreamIndex: 0
    };
  },
  displayStream: function displayStream(index) {
    this.setState({
      featuredStreamIndex: index
    });
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    var loadData = this.props.loadData;

    if (loadData) {
      loadData(function (e) {
        console.error(e.stack);
      }).featured().then(function (data) {
        // console.log(data);
        _this.setState({
          featuredRequestOffset: _this.state.featuredRequestOffset + 25,
          featuredArray: Array.from(_this.state.featuredArray).concat(data.featured)
        });
      })["catch"](function (e) {
        return console.error(e.stack);
      });
    }
  },
  render: function render() {
    var _this2 = this;

    var _state = this.state;
    var featuredRequestOffset = _state.featuredRequestOffset;
    var featuredArray = _state.featuredArray;
    var appendStream = this.props.methods.appendStream;

    // console.log(featuredArray);
    return _react2["default"].createElement(
      "div",
      { className: "featured-streams" },
      featuredArray.length > 0 ? _react2["default"].createElement(FeaturedStream, { data: featuredArray[this.state.featuredStreamIndex] }) : null,
      _react2["default"].createElement(
        "div",
        { className: "wrapper" },
        _react2["default"].createElement(
          "ul",
          { className: "list" },
          featuredArray.map(function (itemData, ind) {
            return _react2["default"].createElement(ListItem, { key: ind, index: ind, data: itemData, methods: {
                appendStream: appendStream,
                displayStream: _this2.displayStream
              } });
          })
        )
      )
    );
  }
});
module.exports = exports["default"];