"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _modulesClientLoadData = require("../../modules/client/load-data");

var _modulesClientLoadData2 = _interopRequireDefault(_modulesClientLoadData);

var _componentsHoverOptionsJsx = require("./components/hover-options.jsx");

var _modulesClientHelperTools = require("../../modules/client/helper-tools");

var _componentsListItemsJsx = require("./components/list-items.jsx");

// components
var components = {};

components.StreamsListItem = _componentsListItemsJsx.StreamListItem;

// primary section for the search component
exports["default"] = _react2["default"].createClass({
  displayName: "SearchPage",
  getInitialState: function getInitialState() {
    return {
      requestOffset: 0,
      dataArray: []
    };
  },
  gatherData: function gatherData(limit, offset, callback) {
    var _this = this;

    limit = typeof limit === "number" ? limit : this.state.limit || 25;
    offset = typeof offset === "number" ? offset : this.state.requestOffset;
    var _props = this.props;
    var params = _props.params;
    var location = _props.location;

    if (_modulesClientLoadData2["default"]) {
      (function () {
        var capitalType = params.searchtype.replace(/^(.)/, function (_, letter) {
          return letter.toUpperCase();
        });
        var searchType = "search" + capitalType;
        _this._mounted ? _this.setState({
          requestOffset: _this.state.requestOffset + 25
        }) : null;
        console.log(_this);
        _modulesClientLoadData2["default"].call(_this, function (e) {
          console.error(e.stack);
        }, {
          query: location.query.q,
          offset: offset,
          limit: 25
        }).then(function (methods) {
          methods[searchType]().then(function (data) {
            _this._mounted ? _this.setState({
              // offset: this.state.requestOffset + 25,
              dataArray: Array.from(_this.state.dataArray).concat(data.channels || data.streams || data.games),
              component: capitalType + "ListItem"
            }) : null;
          })["catch"](function (e) {
            return console.error(e.stack);
          });
        })["catch"](function (e) {
          return console.error(e.stack);
        });
      })();
    }
  },
  refreshList: function refreshList(reset, length, offset) {
    var _this2 = this;

    length = length || this.state.dataArray.length;
    offset = offset || 0;
    console.log(reset, length, offset);
    var requestOffset = reset ? 0 : offset;
    var obj = {};
    if (reset) obj.dataArray = [];
    this._mounted ? this.setState(obj, function () {
      if (length > 100) {
        _this2.gatherData(100, offset, _this2.refreshList.bind(_this2, false, length - 100, requestOffset + 100));
      } else {
        _this2.gatherData(length, offset);
      }
    }) : null;
  },
  componentDidMount: function componentDidMount() {
    this._mounted = true;
    this.gatherData();
  },
  componentWillUnmount: function componentWillUnmount() {
    delete this._mounted;
  },
  render: function render() {
    var _this3 = this;

    var _state = this.state;
    var requestOffset = _state.requestOffset;
    var dataArray = _state.dataArray;
    var component = _state.component;
    var _props2 = this.props;
    var auth = _props2.auth;
    var fireRef = _props2.fireRef;
    var userData = _props2.userData;
    var versionData = _props2.versionData;
    var data = _props2.data;
    var _props2$methods = _props2.methods;
    var appendStream = _props2$methods.appendStream;
    var loadData = _props2$methods.loadData;
    var location = _props2.location;

    if (component) {
      var _ret2 = (function () {
        var ListItem = components[component];
        return {
          v: _react2["default"].createElement(
            "div",
            { className: "top-level-component search-page" },
            _react2["default"].createElement(
              "div",
              { className: "general-page" },
              _react2["default"].createElement(
                "div",
                { className: "wrapper" },
                _react2["default"].createElement(
                  "ul",
                  { className: "list" },
                  dataArray.map(function (itemData, ind) {
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
                      { className: "option btn-default refresh", onClick: function () {
                          return _this3.refreshList(true);
                        } },
                      "Refresh Listing"
                    ),
                    _react2["default"].createElement(
                      "div",
                      { className: "btn-default load-more", onClick: _this3.gatherData },
                      "Load More"
                    )
                  )
                )
              )
            )
          )
        };
      })();

      if (typeof _ret2 === "object") return _ret2.v;
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