"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

// components
var components = {
  // list item for streams matching the search
  StreamsListItem: _react2["default"].createClass({
    displayName: "stream-ListItem",
    render: function render() {
      // console.log(this.props);
      var _props = this.props;
      var index = _props.index;
      var appendStream = _props.methods.appendStream;
      var _props$data = _props.data;
      var game = _props$data.game;
      var viewers = _props$data.viewers;
      var title = _props$data.title;
      var id = _props$data._id;
      var preview = _props$data.preview;
      var _props$data$channel = _props$data.channel;
      var mature = _props$data$channel.mature;
      var logo = _props$data$channel.logo;
      var name = _props$data$channel.name;
      var language = _props$data$channel.language;

      return _react2["default"].createElement(
        "li",
        { onClick: function () {
            appendStream(name);
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
          ),
          _react2["default"].createElement(
            "div",
            { className: "viewers" },
            "Streaming to " + viewers + " viewer" + (viewers > 1 ? "s" : "")
          )
        )
      );
    }
  })
};

// primary section for the search component
exports["default"] = _react2["default"].createClass({
  displayName: "FollowedStreams",
  getInitialState: function getInitialState() {
    return {
      requestOffset: 0,
      dataArray: []
    };
  },
  gatherData: function gatherData() {
    var _this = this;

    var _props2 = this.props;
    var loadData = _props2.methods.loadData;
    var params = _props2.params;
    var location = _props2.location;

    if (loadData) {
      (function () {
        var capitalType = params.page.replace(/^(.)/, function (_, letter) {
          return letter.toUpperCase();
        });
        var searchType = "top" + capitalType;
        _this.setState({
          requestOffset: _this.state.requestOffset + 25
        });
        loadData.call(_this, function (e) {
          console.error(e.stack);
        }, {}).then(function (methods) {
          methods[searchType]().then(function (data) {
            _this.setState({
              // offset: this.state.requestOffset + 25,
              dataArray: Array.from(_this.state.dataArray).concat(data.channels || data.streams || data.games || data.top),
              component: capitalType + "ListItem"
            });
          })["catch"](function (e) {
            return console.error(e.stack);
          });
        })["catch"](function (e) {
          return console.error(e.stack);
        });
      })();
    }
  },
  componentDidMount: function componentDidMount() {
    this.gatherData();
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var _this2 = this;

    console.log("updated");
    if (this.props.params.page !== nextProps.params.page) {
      setTimeout(function () {
        _this2.setState({
          dataArray: [],
          requestOffset: 0
        }, function () {
          _this2.gatherData();
        });
      });
    }
  },
  render: function render() {
    var _this3 = this;

    var _state = this.state;
    var requestOffset = _state.requestOffset;
    var dataArray = _state.dataArray;
    var component = _state.component;
    var _props3 = this.props;
    var data = _props3.data;
    var _props3$methods = _props3.methods;
    var appendStream = _props3$methods.appendStream;
    var loadData = _props3$methods.loadData;
    var params = _props3.params;

    if (component) {
      var _ret2 = (function () {
        var ListItem = components[component];
        return {
          v: _react2["default"].createElement(
            "div",
            { className: "top-level-component general-page " + (params ? params.page : data.page) },
            _react2["default"].createElement(
              "div",
              { className: "wrapper" },
              _react2["default"].createElement(
                "ul",
                { className: "list" },
                dataArray.map(function (itemData, ind) {
                  return _react2["default"].createElement(ListItem, { key: ind, data: itemData, index: ind, methods: {
                      appendStream: appendStream
                    } });
                })
              )
            ),
            _react2["default"].createElement(
              "div",
              { className: "tools" },
              _react2["default"].createElement(
                "div",
                { className: "btn-default load-more", onClick: _this3.gatherData },
                "Load More"
              )
            )
          )
        };
      })();

      if (typeof _ret2 === "object") return _ret2.v;
    } else {
      return _react2["default"].createElement(
        "div",
        { className: "top-level-component general-page " + (params ? params.page : data.page) },
        "Loading " + (params ? params.page : data.page) + "..."
      );
    }
  }
});
module.exports = exports["default"];