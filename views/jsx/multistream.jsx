"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _modulesClientLoadData = require("../../modules/client/load-data");

var _modulesClientLoadData2 = _interopRequireDefault(_modulesClientLoadData);

var _componentsHoverOptionsJsx = require("./components/hover-options.jsx");

var _modulesClientHelperTools = require("../../modules/client/helper-tools");

var _componentsListItemsJsx = require(
// SearchGameListItem
"./components/list-items.jsx");

// components
var searchComponents = {};

searchComponents.StreamsListItem = {
  name: "Stream",
  comp: _componentsListItemsJsx.StreamListItem
};
// searchComponents.ChannelsListItem = {
//   name: "Channel",
//   comp: ChannelListItem,
// };
searchComponents.VideosListItem = {
  name: "Video",
  comp: _componentsListItemsJsx.VideoListItem
};
// searchComponents.GamesListItem = {
//   name: "Game",
//   comp: SearchGameListItem,
// };

// primary section for the search component
exports["default"] = _react2["default"].createClass({
  displayName: "Multistream",
  getInitialState: function getInitialState() {
    return {
      requestOffset: 0,
      // dataArray: [],
      StreamsListItem: [],
      // ChannelsListItem: [],
      VideosListItem: [],
      // GamesListItem: [],
      components: ["StreamsListItem",
      // "ChannelsListItem",
      "VideosListItem"]
    };
  },

  // "GamesListItem"
  gatherData: function gatherData(limit, offset, callback) {
    var _this = this;

    limit = typeof limit === "number" ? limit : this.state.limit || 25;
    offset = typeof offset === "number" ? offset : this.state.requestOffset;

    if (_modulesClientLoadData2["default"]) {
      (function () {
        var searchParam = "All";
        var capitalType = searchParam.replace(/^(.)/, function (_, letter) {
          return letter.toUpperCase();
        });

        var searchTypes = [];
        if (searchParam === "All") {
          searchTypes.push("searchStreams",
          // "searchGames",
          // "searchChannels",
          "searchVideos");
        } else {
          searchTypes.push("search" + capitalType);
        }

        _this._mounted ? _this.setState({
          requestOffset: _this.state.requestOffset + 25
        }) : null;
        // console.log(this);
        _modulesClientLoadData2["default"].call(_this, function (e) {
          console.error(e.stack);
        }, {
          query: _this.refs.searchInput.value,
          offset: offset,
          limit: limit
        }).then(function (methods) {
          searchTypes.map(function (searchType) {
            var func = methods[searchType];
            if (typeof func === "function") {
              func().then(function (data) {
                var componentName = searchType.replace(/^search/i, "") + "ListItem";
                var dataArray = Array.from(_this.state[componentName]).concat(data.channels || data.streams || data.games || data.vods);

                // filter for only truthy data
                // console.log(searchType, capitalType, componentName, dataArray);
                dataArray = dataArray.filter(function (d) {
                  return !!d;
                });console.log(searchType, dataArray);

                // if(this.state.components.indexOf(componentName) < 0) {
                //   this.state.components.push(componentName);
                // }

                _this._mounted ? _this.setState(_defineProperty({}, componentName, dataArray)) :
                // components: this.state.components
                null;
              })["catch"](function (e) {
                return console.error(e.stack);
              });
            } else {
              console.error("Cannot get data for method", searchType);
            }
          });
        })["catch"](function (e) {
          return console.error(e.stack);
        });
      })();
    }
  },
  refreshLists: function refreshLists(cb) {
    var obj = {
      StreamsListItem: [],
      ChannelsListItem: [],
      VideosListItem: [],
      GamesListItem: [],
      requestOffset: 0
    };
    this._mounted ? this.setState(obj, cb) : null;
  },
  performSearch: function performSearch(e) {
    e.preventDefault();
    this.refreshLists();
    this.gatherData(null, 0);
  },
  componentDidMount: function componentDidMount() {
    var _this2 = this;

    this._mounted = true;
    // this.gatherData();
    ["stream1", "stream2", "stream3", "stream4", "stream5", "stream6"].map(function (streamParam) {
      var streamName = _this2.props.params[streamParam];
      if (!streamName) return;
      setTimeout(function (streamName) {
        _this2.props.methods.appendStream(streamName);
      }, 0, streamName);
    });
  },
  componentWillUnmount: function componentWillUnmount() {
    delete this._mounted;
  },
  render: function render() {
    var _this3 = this;

    var _state = this.state;
    var requestOffset = _state.requestOffset;
    var
    // dataArray,
    components = _state.components;
    var _props = this.props;
    var auth = _props.auth;
    var fireRef = _props.fireRef;
    var userData = _props.userData;
    var versionData = _props.versionData;
    var data = _props.data;
    var _props$methods = _props.methods;
    var appendStream = _props$methods.appendStream;
    var loadData = _props$methods.loadData;
    var params = _props.params;

    return _react2["default"].createElement(
      "div",
      { className: "top-level-component multistream-page" },
      _react2["default"].createElement(
        "div",
        { className: "multi-search" },
        _react2["default"].createElement(
          "div",
          { className: "box" },
          _react2["default"].createElement(
            "h3",
            { className: "title" },
            "Search for new streams/videos to add"
          ),
          _react2["default"].createElement("br", null),
          _react2["default"].createElement("div", { className: "separator-2-dimmer" }),
          _react2["default"].createElement("br", null),
          _react2["default"].createElement(
            "form",
            { onSubmit: this.performSearch },
            _react2["default"].createElement("input", { ref: "searchInput", type: "text" }),
            _react2["default"].createElement("br", null),
            _react2["default"].createElement("br", null),
            _react2["default"].createElement(
              "button",
              null,
              "Search"
            )
          )
        )
      ),
      _react2["default"].createElement(
        "div",
        { className: "general-page" },
        components.map(function (componentName) {
          var ListItem = searchComponents[componentName].comp;
          var name = searchComponents[componentName].name;
          var dataArray = _this3.state[componentName];
          // console.log(componentName, dataArray);
          if (dataArray.length === 0) return [_react2["default"].createElement(
            "div",
            { key: componentName, className: "search-results" },
            _react2["default"].createElement(
              "div",
              { className: "title" },
              _react2["default"].createElement(
                "span",
                null,
                "No ",
                name,
                " Results"
              )
            )
          ), _react2["default"].createElement("div", { key: componentName + "-sep", className: "separator-4-black" })];
          return [_react2["default"].createElement(
            "div",
            { key: componentName, className: "search-results" },
            _react2["default"].createElement(
              "div",
              { className: "title" },
              _react2["default"].createElement(
                "span",
                null,
                name,
                " Results."
              )
            ),
            _react2["default"].createElement(
              "div",
              { className: "wrapper" },
              _react2["default"].createElement(
                "ul",
                { className: "list" },
                dataArray.map(function (itemData, ind) {
                  if (!itemData) return console.error("no data");
                  return _react2["default"].createElement(ListItem, {
                    auth: auth,
                    fireRef: fireRef,
                    userData: userData,
                    versionData: versionData,
                    key: ind,
                    data: itemData,
                    index: ind,

                    filter: "all", // for channels

                    methods: {
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
                    { className: "btn-default load-more", onClick: _this3.gatherData },
                    "Load More"
                  )
                )
              )
            )
          ), _react2["default"].createElement("div", { key: componentName + "-sep", className: "separator-4-black" })];
        })
      )
    );
  }
});
module.exports = exports["default"];

// ChannelListItem,

// offset: this.state.requestOffset + 25,
/* <div className="option btn-default refresh" onClick={() => this.refreshList(true)}>
 Refresh Listing
</div> */