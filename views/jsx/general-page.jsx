"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _modulesClientLoadData = require("../../modules/client/load-data");

var _modulesClientLoadData2 = _interopRequireDefault(_modulesClientLoadData);

var _componentsHoverOptionsJsx = require("./components/hover-options.jsx");

var _modulesClientHelperTools = require("../../modules/client/helper-tools");

var _componentsListItemsJsx = require('./components/list-items.jsx');

var components = _interopRequireWildcard(_componentsListItemsJsx);

exports["default"] = _react2["default"].createClass({
  displayName: "StreamsPage",
  getInitialState: function getInitialState() {
    return {
      page: this.props.params ? this.props.params.page : null,
      requestOffset: 0,
      dataArray: []
    };
  },
  gatherData: function gatherData() {
    var _this = this;

    var _props = this.props;

    _objectDestructuringEmpty(_props.methods);

    var
    // loadData
    params = _props.params;
    var location = _props.location;

    if (!params.page) return;
    if (_modulesClientLoadData2["default"]) {
      (function () {
        var capitalType = undefined;
        switch (params.page.toLowerCase()) {
          case "streams":
            capitalType = "Stream";break;
          case "games":
            capitalType = "Game";break;
          default:

        }
        var searchType = "top" + capitalType + "s";
        var offset = _this.state.requestOffset;
        _this.setState({
          requestOffset: _this.state.requestOffset + 25
        });
        _modulesClientLoadData2["default"].call(_this, function (e) {
          console.error(e.stack);
        }, {
          offset: offset,
          limit: 25
        }).then(function (methods) {
          methods[searchType]().then(function (data) {
            // console.log(components, components.GameListItem, components.StreamListItem);
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
  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
    return !!this.props.params.page || !!nextProps.params.page;
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    // console.log("updated");
    this.setState({
      page: nextProps.params.page || this.state.page
    });
  },
  componentDidUpdate: function componentDidUpdate(_, oldState) {
    var _this2 = this;

    if (this.state.page !== oldState.page) {
      this.setState({
        dataArray: [],
        requestOffset: 0
      }, function () {
        _this2.gatherData();
      });
    }
  },
  render: function render() {
    var _this3 = this;

    var _state = this.state;
    var requestOffset = _state.requestOffset;
    var dataArray = _state.dataArray;
    var component = _state.component;
    var page = _state.page;
    var _props2 = this.props;
    var auth = _props2.auth;
    var fireRef = _props2.fireRef;
    var userData = _props2.userData;
    var data = _props2.data;
    var _props2$methods = _props2.methods;
    var appendStream = _props2$methods.appendStream;
    var loadData = _props2$methods.loadData;
    var params = _props2.params;

    if (component) {
      var _ret2 = (function () {
        var ListItem = components[component];

        return {
          v: _react2["default"].createElement(
            "div",
            { className: "top-level-component " + (page || (params ? params.page : data.page)) },
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
                    return [_react2["default"].createElement(ListItem, {
                      key: ind,
                      fireRef: fireRef,
                      auth: auth,
                      userData: userData,
                      data: itemData,
                      index: ind,
                      methods: {
                        appendStream: appendStream
                      } }), _react2["default"].createElement("div", { key: "sep-" + ind, className: "separator-4-dim" })];
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