"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _modulesLoadData = require("../../../../modules/load-data");

var _modulesLoadData2 = _interopRequireDefault(_modulesLoadData);

var _modulesHelperTools = require("../../../../modules/helper-tools");

var _hoverOptionsJsx = require("../hover-options.jsx");

var missingLogo = "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png";

// components
var components = {
  // list item for streams matching the search
  VideosListItem: _react2["default"].createClass({
    displayName: "video-ListItem",
    render: function render() {
      // console.log(this.props);
      var _props = this.props;
      var auth = _props.auth;
      var index = _props.index;
      var userData = _props.userData;
      var appendVOD = _props.methods.appendVOD;
      var _props$data = _props.data;
      var preview = _props$data.preview;
      var animated_preview = _props$data.animated_preview;
      var title = _props$data.title;
      var game = _props$data.game;
      var recorded_at = _props$data.recorded_at;
      var id = _props$data._id;
      var _props$data$channel = _props$data.channel;
      var name = _props$data$channel.name;
      var display_name = _props$data$channel.display_name;

      var hoverOptions = _react2["default"].createElement(_hoverOptionsJsx.ListItemHoverOptions, { auth: auth, vod: id, name: name, display_name: display_name, clickCallback: appendVOD });

      return _react2["default"].createElement(
        "li",
        { className: "video-list-item" },
        _react2["default"].createElement(
          "div",
          { className: "wrapper" },
          _react2["default"].createElement(
            "div",
            { className: "image" },
            _react2["default"].createElement("img", { src: preview })
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
              "\"",
              title,
              "\""
            ),
            _react2["default"].createElement(
              "div",
              { className: "game" },
              "Vod of \"" + game + "\""
            )
          ),
          hoverOptions
        )
      );
    }
  })
};

// primary section for the search component
exports["default"] = _react2["default"].createClass({
  displayName: "VideosListing",
  getInitialState: function getInitialState() {
    return {
      requestOffset: 0,
      limit: 12,
      dataArray: [],
      filter: "all",
      loadingQueue: [],
      currentNotifs: 0,
      locked: true,
      lockedTop: true
    };
  },
  gatherData: function gatherData(limit, offset, callback) {
    var _this = this;

    limit = typeof limit === "number" ? limit : this.state.limit || 25;
    offset = typeof offset === "number" ? offset : this.state.requestOffset;
    var _props2 = this.props;
    var params = _props2.params;
    var userData = _props2.userData;
    var broadcasts = this.props.broadcasts;

    broadcasts = typeof broadcasts !== "boolean" ? true : broadcasts;
    var username = undefined;
    if (params && params.username) {
      username = params.username;
    } else {
      username = userData.name;
    }
    // console.log(username, this.props.params, this.props.userData);
    if (_modulesLoadData2["default"]) {
      this.setState({
        requestOffset: offset + limit
      });
      console.log("gathering data", limit, offset);
      console.log("Given Channel Name getVideos", username);
      _modulesLoadData2["default"].call(this, function (e) {
        console.error(e.stack);
      }, {
        offset: offset,
        limit: limit,
        username: username,
        broadcasts: broadcasts,
        stream_type: "all"
      }).then(function (methods) {
        methods["getVideos"]().then(function (data) {
          console.log("data", data);
          _this.setState({
            dataArray: Array.from(_this.state.dataArray).concat(data.videos),
            component: "VideosListItem"
          }, function () {
            console.log("total data getVideos", _this.state.dataArray.length);
            if (typeof callback === "function") callback();
          });
        })["catch"](function (e) {
          return console.error(e.stack);
        });
      })["catch"](function (e) {
        return console.error(e.stack);
      });
    }
  },
  capitalize: function capitalize(string) {
    return string.toLowerCase().split(" ").map(function (word) {
      return word.replace(/^(\.)/, function (_, l) {
        return l.toUpperCase();
      });
    }).join(" ");
  },
  refreshList: function refreshList(reset, length, offset) {
    var _this2 = this;

    length = length || this.state.dataArray.length;
    offset = offset || 0;
    console.log(reset, length, offset);
    var requestOffset = reset ? 0 : offset;
    var obj = {};
    if (reset) obj.dataArray = [];
    this.setState(obj, function () {
      if (length > 100) {
        _this2.gatherData(100, offset, _this2.refreshList.bind(_this2, false, length - 100, requestOffset + 100));
      } else {
        _this2.gatherData(length, offset);
      }
    });
  },
  scrollEvent: function scrollEvent(e) {
    var _this3 = this;

    setTimeout(function () {
      var _refs = _this3.refs;
      var root = _refs.root;
      var tools = _refs.tools;

      if (root && tools) {
        var trueRoot = document.body.querySelector(".react-app .root");
        // console.log("root", root.offsetTop + root.offsetHeight);
        // console.log("trueRoot", trueRoot.scrollTop);
        var bottom = root.offsetTop + root.offsetHeight - tools.offsetHeight - 16 * 4.75;
        // console.log("bottom", bottom);
        if (trueRoot.scrollTop <= root.offsetTop) {
          _this3.setState({
            locked: true,
            lockedTop: true
          });
        } else if (trueRoot.scrollTop >= bottom) {
          _this3.setState({
            locked: true,
            lockedTop: false
          });
        } else {
          _this3.setState({
            locked: false,
            lockedTop: false
          });
        }
      }
    }, 200);
  },
  componentWillReceiveProps: function componentWillReceiveProps() {
    var _this4 = this;

    setTimeout(function () {
      _this4.scrollEvent();
    }, 100);
  },
  componentDidMount: function componentDidMount() {
    this.gatherData();
    this.scrollEvent();
    document.addEventListener("scroll", this.scrollEvent, false);
    document.addEventListener("mousewheel", this.scrollEvent, false);
  },
  componentWillUnmount: function componentWillUnmount() {
    document.removeEventListener("scroll", this.scrollEvent, false);
    document.removeEventListener("mousewheel", this.scrollEvent, false);
  },
  render: function render() {
    var _this5 = this;

    var _state = this.state;
    var requestOffset = _state.requestOffset;
    var dataArray = _state.dataArray;
    var component = _state.component;
    var limit = _state.limit;
    var loadingQueue = _state.loadingQueue;
    var locked = _state.locked;
    var lockedTop = _state.lockedTop;
    var _props3 = this.props;
    var auth = _props3.auth;
    var data = _props3.data;
    var params = _props3.params;
    var userData = _props3.userData;
    var _props3$methods = _props3.methods;
    var appendVOD = _props3$methods.appendVOD;
    var loadData = _props3$methods.loadData;

    if (component) {
      var _ret = (function () {
        var ListItem = components[component];
        var list = dataArray.map(function (itemData, ind) {
          // return null;
          return _react2["default"].createElement(ListItem, { ref: function (r) {
              return dataArray[ind].ref = r;
            }, key: ind, data: itemData, userData: userData, index: ind, auth: auth, notifyMultiplier: Math.floor(ind / 3), methods: {
              appendVOD: appendVOD,
              notify: _this5.notify,
              removeFromDataArray: _this5.removeFromDataArray
            } });
        });

        return {
          v: _react2["default"].createElement(
            "div",
            { ref: "root", className: "videos-listing profile" + (locked ? " locked" : "") },
            _react2["default"].createElement(
              "div",
              { className: "title" },
              "Videos"
            ),
            _react2["default"].createElement(
              "div",
              { className: "wrapper" },
              _react2["default"].createElement(
                "ul",
                { className: "list" },
                list
              )
            ),
            _react2["default"].createElement(
              "div",
              { ref: "tools", className: "tools" + (lockedTop ? " locked-top" : locked ? " locked" : "") },
              _react2["default"].createElement(
                "div",
                { className: "parent" },
                _react2["default"].createElement(
                  "div",
                  { className: "scroll" },
                  _react2["default"].createElement(
                    "div",
                    { className: "option btn-default refresh", onClick: function () {
                        return _this5.refreshList(true);
                      } },
                    "Refresh Listing"
                  ),
                  _react2["default"].createElement(
                    "div",
                    { className: "option btn-default load-more", onClick: _this5.gatherData },
                    "Load More"
                  ),
                  _react2["default"].createElement(
                    "div",
                    { className: "option btn-default filters" },
                    _react2["default"].createElement(
                      "div",
                      { className: "filter-status" },
                      _react2["default"].createElement(
                        "label",
                        { htmlFor: "filter-select" },
                        "Show"
                      ),
                      _react2["default"].createElement(
                        "select",
                        { id: "filter-select", className: "", ref: "filterSelect", onChange: _this5.applyFilter, defaultValue: "all" },
                        ["all", "online", "offline"].map(function (filter) {
                          return _react2["default"].createElement(
                            "option",
                            { key: filter, value: filter },
                            "Show ",
                            _this5.capitalize(filter)
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
        "Loading " + (params && params.username ? params.username : userData ? userData.name : "") + "'s videos..."
      );
    }
  }
});
module.exports = exports["default"];

// url,
/*loadingQueue.length > 0 ? `Loading ${limit * loadingQueue.length} More` : "Load More"*/