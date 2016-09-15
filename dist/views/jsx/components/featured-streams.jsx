"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _modulesLoadData = require("../../../modules/load-data");

var _modulesLoadData2 = _interopRequireDefault(_modulesLoadData);

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

    var viewersString = viewers.toLocaleString("en"); // https://www.livecoding.tv/earth_basic/
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
          "Live with \"" + (game || null) + "\", streaming to " + viewersString + " viewer" + (viewers > 1 ? "s" : "")
        )
      )
    );
  }
});

// the displayed stream of the feature streams
var FeaturedStream = _react2["default"].createClass({
  displayName: "FeaturedStream",
  getInitialState: function getInitialState() {
    return {
      displayName: "",
      bio: ""
    };
  },
  fetchUserData: function fetchUserData() {
    var _this = this;

    this.setState({
      displayName: "",
      bio: ""
    }, function () {
      var _props$data$stream$channel2 = _this.props.data.stream.channel;
      var name = _props$data$stream$channel2.name;
      var logo = _props$data$stream$channel2.logo;

      _modulesLoadData2["default"].call(_this, function (e) {
        console.error(e.stack);
      }, {
        username: name
      }).then(function (methods) {
        methods.getUserByName().then(function (data) {
          // console.log("feature data", data);
          _this.setState({
            displayName: data.display_name,
            bio: data.bio
          });
        })["catch"](function (e) {
          return console.error(e.stack);
        });
      })["catch"](function (e) {
        return console.error(e.stack);
      });
    });
  },
  componentDidMount: function componentDidMount() {
    this.fetchUserData();
  },
  componentWillReceiveProps: function componentWillReceiveProps() {
    this.fetchUserData();
  },
  render: function render() {
    var _props2 = this.props;
    var appendStream = _props2.methods.appendStream;
    var name = _props2.data.stream.channel.name;
    var _state = this.state;
    var displayName = _state.displayName;
    var bio = _state.bio;

    return _react2["default"].createElement(
      "div",
      { className: "featured-stream" },
      _react2["default"].createElement(
        "div",
        { className: "stream" },
        _react2["default"].createElement("iframe", { src: "https://player.twitch.tv/?channel=" + name, frameBorder: "0", scrolling: "no" })
      ),
      displayName ? _react2["default"].createElement(
        "div",
        { className: "stream-info" },
        _react2["default"].createElement(
          "div",
          { className: "display-name" },
          displayName
        ),
        _react2["default"].createElement(
          "div",
          { className: "bio" },
          bio
        ),
        _react2["default"].createElement(
          "div",
          { className: "watch", onClick: function () {
              appendStream.call(null, name, displayName);
            } },
          "watch this stream"
        )
      ) : _react2["default"].createElement(
        "div",
        { className: "stream-info" },
        "Loading channel info..."
      )
    );
  }
});

// primary section for the featured component
exports["default"] = _react2["default"].createClass({
  displayName: "FeaturedStreams",
  getInitialState: function getInitialState() {
    return {
      requestOffset: 0,
      dataArray: [],
      featuredStreamIndex: 0
    };
  },
  displayStream: function displayStream(index) {
    this.setState({
      featuredStreamIndex: index
    });
  },
  componentDidMount: function componentDidMount() {
    var _this2 = this;

    var loadData = this.props.methods.loadData;

    if (loadData) {
      loadData.call(this, function (e) {
        console.error(e.stack);
      }).then(function (methods) {
        methods.featured().then(function (data) {
          // console.log(data);
          _this2.setState({
            offset: _this2.state.requestOffset + 25,
            dataArray: Array.from(_this2.state.dataArray).concat(data.featured)
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
    var _this3 = this;

    var _state2 = this.state;
    var requestOffset = _state2.requestOffset;
    var dataArray = _state2.dataArray;
    var _props$methods = this.props.methods;
    var appendStream = _props$methods.appendStream;
    var loadData = _props$methods.loadData;

    return _react2["default"].createElement(
      "div",
      { className: "featured-streams" },
      dataArray.length > 0 ? _react2["default"].createElement(FeaturedStream, { data: dataArray[this.state.featuredStreamIndex], methods: {
          appendStream: appendStream,
          loadData: loadData
        } }) : null,
      _react2["default"].createElement(
        "div",
        { className: "wrapper" },
        _react2["default"].createElement(
          "ul",
          { className: "list" },
          dataArray.map(function (itemData, ind) {
            return _react2["default"].createElement(ListItem, { key: ind, index: ind, data: itemData, methods: {
                appendStream: appendStream,
                displayStream: _this3.displayStream
              } });
          })
        )
      )
    );
  }
});
module.exports = exports["default"];