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

// const missingLogo = "http://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png";

// components
var components = {
  // list item for streams matching the search
  ChannelListItem: _listItemsJsx.ChannelListItem
};

// primary section for the search component
exports["default"] = _react2["default"].createClass({
  displayName: "FollowStreams",
  getInitialState: function getInitialState() {
    return {
      requestOffset: 0,
      limit: 25,
      dataArray: [],
      dataObject: {},
      filter: "all",
      notifArray: [],
      // locked: this.props.follow === "IFollow" ? false : true,
      locked: true,
      // lockedTop: this.props.follow === "IFollow" ? false : true,
      lockedTop: true,
      loadData: false,
      currentNotifs: 0
    };
  },
  gatherData: function gatherData(limit, offset, callback, wipe) {
    var _this = this;

    // console.log("auth", this.props.auth);
    if (!this.props.auth) return this.setState({
      component: "ChannelListItem"
    });
    this.setState(Object.assign({
      loadingData: true
    }, wipe ? {
      dataObject: {}
    } : {}), function () {
      limit = typeof limit === "number" ? limit : _this.state.limit || 25;
      offset = typeof offset === "number" ? offset : _this.state.requestOffset;
      var _props = _this.props;
      var params = _props.params;
      var location = _props.location;
      var userData = _props.userData;

      var username = undefined;
      if (params && params.username) {
        username = params.username;
      } else {
        username = userData.name;
      }
      if (_modulesClientLoadData2["default"]) {
        _this._mounted ? _this.setState({
          requestOffset: offset + limit
        }) : null;
        // console.log("gathering data", limit, offset);
        // console.log(`Given Channel Name ${this.props.follow === "IFollow" ? "followedStreams" : "followingStreams"}`, username);
        // console.log("follow:", this.props.follow);
        _modulesClientLoadData2["default"].call(_this, function (e) {
          console.error(e.stack);
        }, {
          offset: offset,
          limit: limit,
          stream_type: "all",
          username: username
        }).then(function (methods) {
          methods[_this.props.follow === "IFollow" ? "followedStreams" : "followingStreams"]().then(function (data) {
            // let newDataArray = Array.from(this.state.dataArray).concat(data.channels || data.streams || data.games || data.top || data.follows);
            var obj = {};
            var itemsData = data.follows;

            itemsData.map(function (data) {
              var itemData = data.user || data.channel;
              var name = data.user ? data.user.name : data.channel.name;

              obj[name] = itemData;
            });

            var newDataObject = Object.assign(_this.state.dataObject, obj);
            _this._mounted ? _this.setState({
              dataObject: newDataObject,
              requestOffset: Object.keys(newDataObject).length,
              component: "ChannelListItem",
              loadingData: false
            }, function () {
              if (typeof callback === "function") callback();
            }) : null;
          })["catch"](function (e) {
            return console.error(e.stack);
          });
        })["catch"](function (e) {
          return console.error(e.stack);
        });
      }
    });
  },
  removeFromDataObject: function removeFromDataObject( /*index*/name) {
    var _this2 = this;

    console.log("removing", name);
    // let newDataArray = this.state.dataArray;
    var newDataObject = this.state.dataObject;
    console.log(newDataObject);
    // let removed = newDataArray.splice(parseInt(index), 1);
    var removed = newDataObject[name];
    delete newDataObject[name];
    this._mounted ? this.setState({
      dataObject: newDataObject,
      requestOffset: Object.keys(newDataObject).length
    }, function () {
      return console.log("final offset:", _this2.state.requestOffset);
    }) : null;
    console.log(removed);
  },
  refresh: function refresh() {
    var _this3 = this;

    Object.keys(this.state.dataObject).map(function (streamName) {
      _this3.state.dataObject[streamName].ref.getStreamData();
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
    this._mounted ? this.setState({
      filter: filter
    }) : null;
  },
  refreshList: function refreshList(reset, length, offset) {
    var _this4 = this;

    length = length || Object.keys(this.state.dataObject).length;
    offset = offset || 0;
    console.log(reset, length, offset);
    var requestOffset = reset ? 0 : offset;
    var obj = {};
    // if(reset) obj.dataArray = [];
    if (reset) obj.dataObject = {};
    this._mounted ? this.setState(obj, function () {
      if (length > 100) {
        _this4.gatherData(100, offset, _this4.refreshList.bind(_this4, false, length - 100, requestOffset + 100));
      } else {
        _this4.gatherData(length, offset);
      }
    }) : null;
  },
  scrollEvent: function scrollEvent(e) {
    var _this5 = this;

    setTimeout(function () {
      var _refs = _this5.refs;
      var root = _refs.root;
      var tools = _refs.tools;

      if (root && tools) {
        var trueRoot = document.body.querySelector(".react-app .root");
        // console.log("root", root.offsetTop + root.offsetHeight);
        // console.log("trueRoot", trueRoot.scrollTop);
        var bottom = root.offsetTop + root.offsetHeight - tools.offsetHeight - 16 * 4.75;
        // console.log("bottom", bottom);

        // lock the tools menu to the top of it's parent
        // if the top of the page root is higher than or equal to the top of the app root
        if (trueRoot.scrollTop <= root.offsetTop) {
          _this5.setState({
            locked: true,
            lockedTop: true
          });
        } else
          // lock the tools menu to the bottom of it's parent
          // if the top of the page root is lower than or equal to the top of the app root
          if (trueRoot.scrollTop >= bottom) {
            _this5.setState({
              locked: true,
              lockedTop: false
            });
          } else {
            // don't lock anything; fix it to the page scrolling
            _this5.setState({
              locked: false,
              lockedTop: false
            });
          }
      }
    }, 200);
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var _this6 = this;

    setTimeout(function () {
      _this6.scrollEvent();
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
    //     (last !== signedIn &&
    //     curr !== signedIn &&
    //     last !== curr) ||
    //     // ... auth changes
    //     !!this.props.auth !== !!nextProps.auth
    //   ) {
    //     this.gatherData(this.state.limit, 0, null, true);
    //   }
    // }
  },
  componentDidMount: function componentDidMount() {
    // console.log("auth", this.props.auth);
    this._mounted = true;
    this.gatherData();
    this.scrollEvent();
    document.addEventListener("scroll", this.scrollEvent, false);
    document.addEventListener("mousewheel", this.scrollEvent, false);
  },
  componentWillUnmount: function componentWillUnmount() {
    delete this._mounted;
    document.removeEventListener("scroll", this.scrollEvent, false);
    document.removeEventListener("mousewheel", this.scrollEvent, false);
  },
  render: function render() {
    var _this7 = this;

    var _state = this.state;
    var requestOffset = _state.requestOffset;
    var dataArray = _state.dataArray;
    var dataObject = _state.dataObject;
    var component = _state.component;
    var filter = _state.filter;
    var limit = _state.limit;
    var loadingData = _state.loadingData;
    var loadingQueue = _state.loadingQueue;
    var locked = _state.locked;
    var lockedTop = _state.lockedTop;
    var _props2 = this.props;
    var auth = _props2.auth;
    var data = _props2.data;
    var fireRef = _props2.fireRef;
    var userData = _props2.userData;
    var follow = _props2.follow;
    var versionData = _props2.versionData;
    var params = _props2.params;
    var _props2$methods = _props2.methods;
    var appendStream = _props2$methods.appendStream;
    var loadData = _props2$methods.loadData;

    if (component) {
      var _ret = (function () {
        var ListItem = components[component];
        var list = Object.keys(dataObject).map(function (itemName, ind) {
          var itemData = dataObject[itemName];

          return _react2["default"].createElement(ListItem, { ref: function (r) {
              itemData ? itemData.ref = r : null;
            }, key: "" + (itemData.channel ? itemData.name : itemData.name),
            data: itemData,
            fireRef: fireRef,
            userData: userData,
            versionData: versionData,
            index: ind,
            filter: filter,
            auth: auth,
            notifyMultiplier: Math.floor(ind / 3),
            params: _this7.props.params, follow: follow, methods: {
              appendStream: appendStream,
              notify: _this7.notify,
              removeFromDataObject: _this7.removeFromDataObject
            } });
        });
        var person = params.username === undefined || userData && userData.name === params.username ? "You" : params.username;
        // this will append an "s" to "follows" in the string if the user is on someone elses page
        var s = params.username === undefined || userData && userData.name === params.username ? "" : "s";
        return {
          v: _react2["default"].createElement(
            "div",
            { ref: "root", className: (_this7.props.follow === "IFollow" ? "following-streams" : "followed-streams") + " profile" + (locked ? " locked" : "") },
            _react2["default"].createElement(
              "div",
              { className: "title" },
              "Channels ",
              _this7.props.follow === "IFollow" ? person + " Follow" + s : "Following " + person
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
                    { className: "option btn-default refresh", onClick: _this7.refresh },
                    "Refresh Streams"
                  ),
                  _react2["default"].createElement(
                    "div",
                    { className: "option btn-default refresh", onClick: function () {
                        return _this7.refreshList(true);
                      } },
                    "Refresh Listing"
                  ),
                  _react2["default"].createElement(
                    "div",
                    { className: "option btn-default load-more" + (loadingData ? " bg-color-dimmer not-clickable" : ""), onClick: loadingData ? null : _this7.gatherData },
                    loadingData ? "Loading More" : "Load More"
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
                        { id: "filter-select", className: "", ref: "filterSelect", onChange: _this7.applyFilter, defaultValue: "all" },
                        ["all", "online", "offline"].map(function (filter) {
                          return _react2["default"].createElement(
                            "option",
                            { key: filter, value: filter },
                            "Show ",
                            _this7.capitalize(filter)
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
        "Loading " + (this.props.follow === "IFollow" ? "followed" : "following") + " streams..."
      );
    }
  }
});
module.exports = exports["default"];