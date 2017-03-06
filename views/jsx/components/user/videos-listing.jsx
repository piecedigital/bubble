"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _modulesClientLoadData = require("../../../../modules/client/load-data");

var _modulesClientLoadData2 = _interopRequireDefault(_modulesClientLoadData);

var _modulesClientHelperTools = require("../../../../modules/client/helper-tools");

var _hoverOptionsJsx = require("../hover-options.jsx");

var _listItemsJsx = require('../list-items.jsx');

var missingLogo = "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png";

// components
var components = {
  // list item for streams matching the search
  VideoListItem: _listItemsJsx.VideoListItem
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
  gatherData: function gatherData(limit, offset, callback, wipe) {
    var _this = this;

    this.setState(wipe ? {
      dataArray: []
    } : {}, function () {
      limit = typeof limit === "number" ? limit : _this.state.limit || 25;
      offset = typeof offset === "number" ? offset : _this.state.requestOffset;
      var _props = _this.props;
      var params = _props.params;
      var userData = _props.userData;
      var archive = _this.props.archive;

      archive = typeof archive !== "boolean" ? true : archive;
      var username = undefined;
      if (params && params.username) {
        username = params.username;
      } else {
        username = userData.name;
      }
      // console.log(username, this.props.params, this.props.userData);
      if (_modulesClientLoadData2["default"]) {
        _this.setState({
          requestOffset: offset + limit
        });
        // console.log("gathering data", limit, offset);
        // console.log(`Given Channel Name getVideos`, username);
        _modulesClientLoadData2["default"].call(_this, function (e) {
          console.error(e.stack);
        }, {
          offset: offset,
          limit: limit,
          username: username,
          archive: archive,
          stream_type: "all"
        }).then(function (methods) {
          methods["getVideos"]().then(function (data) {
            // console.log("data", data);
            _this.setState({
              dataArray: Array.from(_this.state.dataArray).concat(data.videos),
              component: "VideoListItem"
            }, function () {
              // console.log("total data getVideos", this.state.dataArray.length);
              if (typeof callback === "function") callback();
            });
          })["catch"](function (e) {
            return console.error(e.stack);
          });
        })["catch"](function (e) {
          return console.error(e.stack);
        });
      }
    });
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
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var _this4 = this;

    setTimeout(function () {
      _this4.scrollEvent();
    }, 100);
    // rerun gather data if...
    if (this.props.params.username !== nextProps.params.username) {
      this.gatherData(this.state.limit, 0, null, true);
    }
    // const last = this.props.params.username,
    // curr = nextProps.params.username,
    // signedIn = this.props.userData ? this.props.userData.name : "";
    // // console.log("new name", last, curr, signedIn);
    // if(last || curr) {
    //   if(
    //     // ... username changes
    //     last !== signedIn &&
    //     curr !== signedIn &&
    //     last !== curr
    //   ) {
    //     this.gatherData(this.state.limit, 0, null, true);
    //   }
    // }
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
    var _props2 = this.props;
    var auth = _props2.auth;
    var fireRef = _props2.fireRef;
    var data = _props2.data;
    var params = _props2.params;
    var userData = _props2.userData;
    var versionData = _props2.versionData;
    var _props2$methods = _props2.methods;
    var appendVOD = _props2$methods.appendVOD;
    var loadData = _props2$methods.loadData;

    if (component) {
      var _ret = (function () {
        var ListItem = components[component];
        var list = dataArray.map(function (itemData, ind) {
          // return null;
          return _react2["default"].createElement(ListItem, {
            ref: function (r) {
              return dataArray[ind].ref = r;
            },
            key: ind,
            data: itemData,
            fireRef: fireRef,
            userData: userData,
            versionData: versionData,
            index: ind,
            auth: auth,
            notifyMultiplier: Math.floor(ind / 3),
            methods: {
              appendVOD: appendVOD,
              notify: _this5.notify
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
/*loadingQueue.length > 0 ? `Loading ${limit * loadingQueue.length} More` : "Load More"*/