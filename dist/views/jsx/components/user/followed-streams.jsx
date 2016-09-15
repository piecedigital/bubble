"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _modulesLoadData = require("../../../../modules/load-data");

var _modulesLoadData2 = _interopRequireDefault(_modulesLoadData);

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

      var viewersString = viewers.toLocaleString("en"); // https://www.livecoding.tv/earth_basic/
      return _react2["default"].createElement(
        "li",
        { className: "stream", onClick: function () {
            appendStream.call(null, name, displayName);
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
            "Streaming to " + viewersString + " viewer" + (viewers > 1 ? "s" : "")
          )
        )
      );
    }
  }),
  ChannelsListItem: _react2["default"].createClass({
    displayName: "channel-ListItem",
    getInitialState: function getInitialState() {
      return { streamData: null };
    },
    getStreamData: function getStreamData() {
      var _this = this;

      var name = this.props.data.channel.name;

      // console.log(`getting stream data for ${name}`);
      _modulesLoadData2["default"].call(this, function (e) {
        console.error(e.stack);
      }, {
        username: name
      }).then(function (methods) {
        methods.getStreamByName().then(function (data) {
          console.log(name, ", data:", data);
          _this.setState({
            streamData: data
          });
        })["catch"](function (e) {
          return console.error(e.stack);
        });
      })["catch"](function (e) {
        return console.error(e.stack);
      });
    },
    componentDidMount: function componentDidMount() {
      this.getStreamData();
    },
    render: function render() {
      if (!this.state.streamData) return null;
      // console.log(this.props);
      var _props2 = this.props;
      var index = _props2.index;
      var filter = _props2.filter;
      var appendStream = _props2.methods.appendStream;
      var _props2$data$channel = _props2.data.channel;
      var mature = _props2$data$channel.mature;
      var logo = _props2$data$channel.logo;
      var name = _props2$data$channel.name;
      var language = _props2$data$channel.language;
      var stream = this.state.streamData.stream;

      if (!stream) {
        if (filter === "all" || filter === "offline") {
          return _react2["default"].createElement(
            "li",
            null,
            _react2["default"].createElement(
              "div",
              { className: "image" },
              _react2["default"].createElement("img", { src: logo })
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
                { className: "game" },
                "Offline"
              )
            )
          );
        } else {
          return null;
        }
      }
      var game = stream.game;
      var viewers = stream.viewers;
      var title = stream.title;
      var id = stream._id;
      var preview = stream.preview;

      var viewersString = viewers.toLocaleString("en"); // https://www.livecoding.tv/earth_basic/
      if (filter === "all" || filter === "online") {
        return _react2["default"].createElement(
          "li",
          { onClick: function () {
              appendStream(name);
            } },
          _react2["default"].createElement(
            "div",
            { className: "image" },
            _react2["default"].createElement("img", { src: logo })
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
              "Streaming to " + viewersString + " viewer" + (viewers > 1 ? "s" : "")
            )
          )
        );
      } else {
        return null;
      }
    }
  })
};

// primary section for the search component
exports["default"] = _react2["default"].createClass({
  displayName: "FollowedStreams",
  getInitialState: function getInitialState() {
    return {
      requestOffset: 0,
      dataArray: [],
      filter: "all"
    };
  },
  gatherData: function gatherData(limit) {
    var _this2 = this;

    typeof limit === "number" ? limit = limit : limit = 25;
    console.log("gathering data");
    var _props3 = this.props;

    _objectDestructuringEmpty(_props3.methods);

    var
    // loadData
    location = _props3.location;

    if (_modulesLoadData2["default"]) {
      var offset = this.state.requestOffset;
      this.setState({
        requestOffset: this.state.requestOffset + limit
      });
      _modulesLoadData2["default"].call(this, function (e) {
        console.error(e.stack);
      }, {
        offset: offset,
        limit: limit,
        stream_type: "all"
      }).then(function (methods) {
        methods.followedStreams().then(function (data) {
          _this2.setState({
            dataArray: Array.from(_this2.state.dataArray).concat(data.channels || data.streams || data.games || data.top || data.follows),
            component: "ChannelsListItem"
          });
        })["catch"](function (e) {
          return console.error(e.stack);
        });
      })["catch"](function (e) {
        return console.error(e.stack);
      });
    }
  },
  refresh: function refresh() {
    this.state.dataArray.map(function (stream) {
      stream.ref.getStreamData();
    });
  },
  capitalize: function capitalize(string) {
    return string.toLowerCase().split(" ").map(function (word) {
      return word.replace(/^(\.)/, function (_, l) {
        return l.toUpperCase();
      });
    }).join(" ");
  },
  applyFilter: function applyFilter() {
    var filter = this.refs.filterSelect.value;
    console.log(filter);
    this.setState({
      filter: filter
    });
  },
  refreshList: function refreshList(length) {
    if (length > 100) {
      this.gatherData(100);
      this.refreshList(length - 100);
    } else {
      this.gatherData(length);
    }
  },
  componentDidMount: function componentDidMount() {
    this.gatherData();
  },
  render: function render() {
    var _this3 = this;

    var _state = this.state;
    var requestOffset = _state.requestOffset;
    var dataArray = _state.dataArray;
    var component = _state.component;
    var filter = _state.filter;
    var _props4 = this.props;
    var data = _props4.data;
    var _props4$methods = _props4.methods;
    var appendStream = _props4$methods.appendStream;
    var loadData = _props4$methods.loadData;

    if (component) {
      var _ret = (function () {
        var ListItem = components[component];
        return {
          v: _react2["default"].createElement(
            "div",
            { className: "top-level-component general-page profile" },
            _react2["default"].createElement(
              "div",
              { className: "wrapper" },
              _react2["default"].createElement(
                "ul",
                { className: "list" },
                dataArray.map(function (itemData, ind) {
                  return _react2["default"].createElement(ListItem, { ref: function (r) {
                      return dataArray[ind].ref = r;
                    }, key: itemData.channel.name, data: itemData, index: ind, filter: filter, methods: {
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
                { className: "parent" },
                _react2["default"].createElement(
                  "div",
                  { className: "scroll" },
                  _react2["default"].createElement(
                    "div",
                    { className: "btn-default refresh", onClick: _this3.refresh },
                    "Refresh Streams"
                  ),
                  _react2["default"].createElement(
                    "div",
                    { className: "btn-default load-more", onClick: _this3.gatherData },
                    "Load More"
                  ),
                  _react2["default"].createElement(
                    "div",
                    { className: "btn-default filters" },
                    _react2["default"].createElement(
                      "div",
                      { className: "btn-default filter-status" },
                      _react2["default"].createElement(
                        "span",
                        null,
                        "Show:"
                      ),
                      _react2["default"].createElement(
                        "select",
                        { ref: "filterSelect", onChange: _this3.applyFilter, defaultValue: "all" },
                        ["all", "online", "offline"].map(function (filter) {
                          return _react2["default"].createElement(
                            "option",
                            { key: filter, value: filter },
                            _this3.capitalize(filter)
                          );
                        })
                      )
                    )
                  )
                )
              )
            )
          )
        };
      })();

      if (typeof _ret === "object") return _ret.v;
    } else {
      return _react2["default"].createElement(
        "div",
        { className: "top-level-component general-page profile" },
        "Loading followed streams..."
      );
    }
  }
});
module.exports = exports["default"];