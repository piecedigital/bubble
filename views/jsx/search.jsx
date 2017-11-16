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

var _componentsListItemsJsx = require("./components/list-items.jsx");

// components
var searchComponents = {};

searchComponents.StreamsListItem = {
  name: "Stream",
  comp: _componentsListItemsJsx.StreamListItem
};
searchComponents.ChannelsListItem = {
  name: "Channel",
  comp: _componentsListItemsJsx.ChannelListItem
};
searchComponents.VideosListItem = {
  name: "Video",
  comp: _componentsListItemsJsx.VideoListItem
};
searchComponents.GamesListItem = {
  name: "Game",
  comp: _componentsListItemsJsx.SearchGameListItem
};

// primary section for the search component
exports["default"] = _react2["default"].createClass({
  displayName: "SearchPage",
  getInitialState: function getInitialState() {
    return {
      requestOffset: 0,
      // dataArray: [],
      StreamsListItem: [],
      ChannelsListItem: [],
      VideosListItem: [],
      GamesListItem: [],
      components: []
    };
  },
  gatherData: function gatherData(limit, offset, callback) {
    var _this = this;

    var _props = this.props;
    var params = _props.params;
    var location = _props.location;

    if (!params.searchtype) {
      limit = 12;
    } else {
      limit = typeof limit === "number" ? limit : this.state.limit || 25;
    }

    offset = typeof offset === "number" ? offset : this.state.requestOffset;
    if (_modulesClientLoadData2["default"]) {
      (function () {
        var searchParam = params.searchtype || "All";
        var capitalType = searchParam.replace(/^(.)/, function (_, letter) {
          return letter.toUpperCase();
        });

        var searchTypes = [];
        console.log(params);
        if (searchParam === "All") {
          searchTypes.push("searchStreams", "searchGames", "searchChannels", "searchVideos");
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
          query: encodeURIComponent(location.query.q),
          offset: offset,
          limit: limit
        }).then(function (methods) {
          searchTypes.map(function (searchType) {
            var func = methods[searchType];
            if (typeof func === "function") {
              func().then(function (data) {
                var _setState;

                var componentName = searchType.replace(/^search/i, "") + "ListItem";
                // console.log(searchType, capitalType, componentName, data);
                if (_this.state.components.indexOf(componentName) < 0) {
                  _this.state.components.push(componentName);
                }
                _this._mounted ? _this.setState((_setState = {}, _defineProperty(_setState, componentName, Array.from(_this.state[componentName]).concat(data.channels || data.streams || data.games || data.vods)), _defineProperty(_setState, "components", _this.state.components), _setState)) : null;
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
      requestOffset: 0,
      components: []
    };
    this._mounted ? this.setState(obj, cb) : null;
  },
  componentDidMount: function componentDidMount() {
    this._mounted = true;
    this.gatherData();
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var _this2 = this;

    var _props2 = this.props;
    var searchtype = _props2.params.searchtype;
    var q = _props2.location.query.q;

    if (nextProps.params.searchtype !== searchtype || nextProps.location.query.q !== q) {
      console.log("refreshing");
      this.refreshLists(function () {
        _this2.gatherData();
      });
    }
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
    var _props3 = this.props;
    var auth = _props3.auth;
    var fireRef = _props3.fireRef;
    var userData = _props3.userData;
    var versionData = _props3.versionData;
    var data = _props3.data;
    var _props3$methods = _props3.methods;
    var appendStream = _props3$methods.appendStream;
    var loadData = _props3$methods.loadData;
    var location = _props3.location;
    var params = _props3.params;

    console.log(this.state);
    if (components.length > 0) {
      return _react2["default"].createElement(
        "div",
        { className: "top-level-component search-page" },
        _react2["default"].createElement(
          "div",
          { className: "general-page" },
          components.map(function (componentName) {
            var ListItem = searchComponents[componentName].comp;
            var name = searchComponents[componentName].name;
            var dataArray = _this3.state[componentName];
            // console.log(componentName, dataArray);
            if (dataArray.length === 0) return null;
            return [_react2["default"].createElement(
              "div",
              { className: "search-results" },
              _react2["default"].createElement(
                "div",
                { className: "title" },
                _react2["default"].createElement(
                  "span",
                  null,
                  name,
                  " Results."
                ),
                !params.searchtype ? [" ", _react2["default"].createElement(
                  _reactRouter.Link,
                  { className: "load-more", to: "/search/" + name.toLowerCase() + "s?q=" + encodeURIComponent(location.query.q) },
                  "See More..."
                )] : null
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
                      methods: {
                        appendStream: appendStream
                      } });
                  })
                )
              ),
              params.searchtype ? _react2["default"].createElement(
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
              ) : null
            ), _react2["default"].createElement("div", { className: "separator-4-black" })];
          })
        )
      );
    } else {
      return _react2["default"].createElement(
        "div",
        { className: "search-page" },
        "Loading streams for " + (location ? location.query.q || location.query.query : data.query.q || data.query.query) + "..."
      );
    }
  }
});
module.exports = exports["default"];

// offset: this.state.requestOffset + 25,
/* <div className="option btn-default refresh" onClick={() => this.refreshList(true)}>
 Refresh Listing
</div> */