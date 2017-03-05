"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _modulesClientLoadData = require("../../modules/client/load-data");

var _modulesClientLoadData2 = _interopRequireDefault(_modulesClientLoadData);

var _componentsHoverOptionsJsx = require("./components/hover-options.jsx");

var _modulesClientHelperTools = require("../../modules/client/helper-tools");

// components
var components = {
  // list item for streams matching the search
  StreamsListItem: _react2["default"].createClass({
    displayName: "stream-ListItem",
    render: function render() {
      // console.log(this.props);
      var _props = this.props;
      var auth = _props.auth;
      var fireRef = _props.fireRef;
      var userData = _props.userData;
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
      var display_name = _props$data$channel.display_name;
      var language = _props$data$channel.language;

      // let viewersString = viewers.toString().split("").reverse().join("").replace(/(\d{3})/g, function(_, group) {
      //   console.log(arguments)
      //   return `${group},`;
      // }).replace(/,$/, "").split("").reverse().join("");

      // let viewersString = viewers.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2') // https://www.livecoding.tv/efleming969/

      var viewersString = viewers.toLocaleString("en"); // https://www.livecoding.tv/earth_basic/
      var hoverOptions = _react2["default"].createElement(_componentsHoverOptionsJsx.ListItemHoverOptions, { auth: auth, fireRef: fireRef, stream: true, name: name, display_name: display_name, userData: userData, clickCallback: appendStream });

      return _react2["default"].createElement(
        "li",
        { className: "stream-list-item" },
        _react2["default"].createElement(
          "div",
          { className: "wrapper" },
          _react2["default"].createElement(
            "div",
            { className: "image" },
            _react2["default"].createElement(_modulesClientHelperTools.CImg, {
              style: {
                width: 136,
                height: 76.5
              },
              src: preview.medium })
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
          ),
          hoverOptions
        )
      );
    }
  }),
  GamesListItem: _react2["default"].createClass({
    displayName: "games-ListItem",
    render: function render() {
      // console.log(this.props);
      var _props2 = this.props;
      var index = _props2.index;
      var appendStream = _props2.methods.appendStream;
      var _props2$data = _props2.data;
      var _props2$data$game = _props2$data.game;
      var name = _props2$data$game.name;
      var box = _props2$data$game.box;
      var id = _props2$data$game._id;
      var viewers = _props2$data.viewers;
      var channels = _props2$data.channels;

      var viewersString = viewers.toLocaleString("en"); // https://www.livecoding.tv/earth_basic/
      var channelsString = channels.toLocaleString("en"); // https://www.livecoding.tv/earth_basic/

      return _react2["default"].createElement(
        "li",
        { className: "game-list-item" },
        _react2["default"].createElement(
          "div",
          { className: "wrapper" },
          _react2["default"].createElement(
            _reactRouter.Link,
            { to: "/search/streams?q=" + encodeURIComponent(name) },
            _react2["default"].createElement(
              "div",
              { className: "image" },
              _react2["default"].createElement(_modulesClientHelperTools.CImg, {
                style: {
                  width: 168,
                  height: 235
                },
                src: box ? box.medium : "" })
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
                { className: "count" },
                channelsString + " streaming to " + viewersString + " viewer" + (viewers > 1 ? "s" : "")
              )
            )
          )
        )
      );
    }
  })
};

// primary section for the search component
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

    var _props3 = this.props;

    _objectDestructuringEmpty(_props3.methods);

    var
    // loadData
    params = _props3.params;
    var location = _props3.location;

    if (!params.page) return;
    if (_modulesClientLoadData2["default"]) {
      (function () {
        var capitalType = params.page.replace(/^(.)/, function (_, letter) {
          return letter.toUpperCase();
        });
        var searchType = "top" + capitalType;
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
    var _props4 = this.props;
    var auth = _props4.auth;
    var fireRef = _props4.fireRef;
    var userData = _props4.userData;
    var data = _props4.data;
    var _props4$methods = _props4.methods;
    var appendStream = _props4$methods.appendStream;
    var loadData = _props4$methods.loadData;
    var params = _props4.params;

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
                    return _react2["default"].createElement(ListItem, {
                      key: ind,
                      fireRef: fireRef,
                      auth: auth,
                      userData: userData,
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