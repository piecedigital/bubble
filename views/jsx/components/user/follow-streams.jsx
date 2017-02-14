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

// const missingLogo = "http://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png";

var currentNotifs = 0;
// components
var components = {
  // list item for streams matching the search
  ChannelsListItem: _react2["default"].createClass({
    displayName: "channel-ListItem",
    getInitialState: function getInitialState() {
      return { streamData: null };
    },
    getStreamData: function getStreamData() {
      var _this = this;

      var data = this.props.data;

      var _ref = data.channel || data.user;

      var name = _ref.name;
      var display_name = _ref.display_name;

      // console.log(`getting stream data for ${name}`);
      _modulesClientLoadData2["default"].call(this, function (e) {
        console.error(e.stack);
      }, {
        username: name
      }).then(function (methods) {
        methods.getStreamByName().then(function (data) {
          // console.log(name, ", data:", data);
          _this.setState({
            streamData: data
          });
        })["catch"](function (e) {
          return console.error(e ? e.stack : e);
        });
      })["catch"](function (e) {
        return console.error(e ? e.stack : e);
      });
    },
    followCallback: function followCallback(follow) {
      if (follow) {
        // following channel
        if (typeof this.props.methods.addToDataArray === "function") this.props.methods.addToDataArray(this.props.index);
      } else {
        // unfollowing channel
        if (typeof this.props.methods.removeFromDataArray === "function") this.props.methods.removeFromDataArray(this.props.index);
      }
    },
    appendStream: function appendStream(name, display_name) {
      this.props.methods.appendStream(name, display_name);
    },
    notify: function notify() {
      var _this2 = this;

      var _props = this.props;
      var data = _props.data;
      var params = _props.params;

      // I wouldn't care to receive desktop notifications regarding someone elses followings
      // this should keep that from happening
      if (params && params.username) return;

      var _ref2 = data.channel || data.user;

      var name = _ref2.name;
      var display_name = _ref2.display_name;

      var timeout = 2;
      // setTimeout(() => {
      //   notification({
      //     type: "stream_online",
      //     channelName: display_name,
      //     timeout,
      //     callback: () => {
      //       this.appendStream(name, display_name);
      //     }
      //   });
      // }, (timeout * 1000) * (multiplier % 3));
      var action = _modulesClientHelperTools.browserNotification.bind(this, {
        type: "stream_online",
        channelName: display_name,
        timeout: timeout,
        callback: function callback() {
          _this2.appendStream(name, display_name);
        },
        finishCB: function finishCB() {
          currentNotifs--;
        }
      });
      if (currentNotifs < 3) {
        console.log("Notifying now:", name, ", ahead:", currentNotifs);
        currentNotifs++;
        action();
      } else {
        var multiplier = Math.floor(currentNotifs / 3);
        var time = 2000 * multiplier + 700;
        console.log("Queuing notify:", name, "; ahead:", currentNotifs, "; time:", time, "; multiplier:", multiplier);
        currentNotifs++;
        setTimeout(function () {
          action();
        }, time);
      }

      // this.props.methods.notify(name, display_name);
    },
    componentWillUpdate: function componentWillUpdate(_, nextState) {
      // console.log(this.state.streamData, nextState.streamData);
      if (!this.state.streamData || this.state.streamData && this.state.streamData.stream === null && nextState.streamData && nextState.streamData.stream !== null) {
        // console.log(this.state.streamData.stream !== nextState.streamData.stream);
        if (nextState.streamData && nextState.streamData.stream && this.props.follow === "IFollow") {
          this.notify();
        }
      }
    },
    componentDidMount: function componentDidMount() {
      this.getStreamData();
    },
    render: function render() {
      if (!this.state.streamData) return null;
      // console.log(this.props);
      var _props2 = this.props;
      var auth = _props2.auth;
      var fireRef = _props2.fireRef;
      var index = _props2.index;
      var filter = _props2.filter;
      var userData = _props2.userData;
      var versionData = _props2.versionData;
      var data = _props2.data;

      var _ref3 = data.channel || data.user;

      var mature = _ref3.mature;
      var logo = _ref3.logo;
      var name = _ref3.name;
      var display_name = _ref3.display_name;
      var language = _ref3.language;
      var stream = this.state.streamData.stream;

      var hoverOptions = _react2["default"].createElement(_hoverOptionsJsx.ListItemHoverOptions, {
        auth: auth,
        fireRef: fireRef,
        stream: stream,
        name: name,
        display_name: display_name,
        userData: userData,
        versionData: versionData,
        callback: this.followCallback,
        clickCallback: this.appendStream });

      if (!stream) {
        if (filter === "all" || filter === "offline") {
          return _react2["default"].createElement(
            "li",
            { className: "channel-list-item null" },
            _react2["default"].createElement(
              "div",
              { className: "wrapper" },
              _react2["default"].createElement(
                "div",
                { className: "image" },
                _react2["default"].createElement("img", { src: logo || _modulesClientHelperTools.missingLogo })
              ),
              _react2["default"].createElement(
                "div",
                { className: "info" },
                _react2["default"].createElement("div", { className: "live-indicator offline" }),
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
              ),
              hoverOptions
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

      var viewersString = viewers.toLocaleString("en"); // http://www.livecoding.tv/earth_basic/
      if (filter === "all" || filter === "online") {
        return _react2["default"].createElement(
          "li",
          { className: "channel-list-item" },
          _react2["default"].createElement(
            "div",
            { className: "wrapper" },
            _react2["default"].createElement(
              "div",
              { className: "image" },
              _react2["default"].createElement("img", { src: logo || _modulesClientHelperTools.missingLogo })
            ),
            _react2["default"].createElement(
              "div",
              { className: "info" },
              _react2["default"].createElement("div", { className: "live-indicator online" }),
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
      } else {
        return null;
      }
    }
  })
};

// primary section for the search component
exports["default"] = _react2["default"].createClass({
  displayName: "FollowStreams",
  getInitialState: function getInitialState() {
    return {
      requestOffset: 0,
      limit: 25,
      dataArray: [],
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
    var _this3 = this;

    // console.log("auth", this.props.auth);
    if (!this.props.auth) return this.setState({
      component: "ChannelsListItem"
    });
    this.setState(Object.assign({
      loadingData: true
    }, wipe ? {
      dataArray: []
    } : {}), function () {
      limit = typeof limit === "number" ? limit : _this3.state.limit || 25;
      offset = typeof offset === "number" ? offset : _this3.state.requestOffset;
      var _props3 = _this3.props;
      var params = _props3.params;
      var location = _props3.location;
      var userData = _props3.userData;

      var username = undefined;
      if (params && params.username) {
        username = params.username;
      } else {
        username = userData.name;
      }
      if (_modulesClientLoadData2["default"]) {
        _this3._mounted ? _this3.setState({
          requestOffset: offset + limit
        }) : null;
        // console.log("gathering data", limit, offset);
        // console.log(`Given Channel Name ${this.props.follow === "IFollow" ? "followedStreams" : "followingStreams"}`, username);
        // console.log("follow:", this.props.follow);
        _modulesClientLoadData2["default"].call(_this3, function (e) {
          console.error(e.stack);
        }, {
          offset: offset,
          limit: limit,
          stream_type: "all",
          username: username
        }).then(function (methods) {
          methods[_this3.props.follow === "IFollow" ? "followedStreams" : "followingStreams"]().then(function (data) {
            var newDataArray = Array.from(_this3.state.dataArray).concat(data.channels || data.streams || data.games || data.top || data.follows);
            _this3._mounted ? _this3.setState({
              dataArray: newDataArray,
              requestOffset: newDataArray.length,
              component: "ChannelsListItem",
              loadingData: false
            }, function () {
              // console.log(`total data ${this.props.follow === "IFollow" ? "followedStreams" : "followingStreams"}`, this.state.dataArray.length);
              // console.log("final offset:", this.state.requestOffset);
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
  removeFromDataArray: function removeFromDataArray(index) {
    var _this4 = this;

    console.log("removing", index);
    var newDataArray = this.state.dataArray;
    var removed = newDataArray.splice(parseInt(index), 1);
    this._mounted ? this.setState({
      dataArray: newDataArray,
      requestOffset: newDataArray.length
    }, function () {
      return console.log("final offset:", _this4.state.requestOffset);
    }) : null;
    console.log(removed);
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
    this._mounted ? this.setState({
      filter: filter
    }) : null;
  },
  refreshList: function refreshList(reset, length, offset) {
    var _this5 = this;

    length = length || this.state.dataArray.length;
    offset = offset || 0;
    console.log(reset, length, offset);
    var requestOffset = reset ? 0 : offset;
    var obj = {};
    if (reset) obj.dataArray = [];
    this._mounted ? this.setState(obj, function () {
      if (length > 100) {
        _this5.gatherData(100, offset, _this5.refreshList.bind(_this5, false, length - 100, requestOffset + 100));
      } else {
        _this5.gatherData(length, offset);
      }
    }) : null;
  },
  scrollEvent: function scrollEvent(e) {
    var _this6 = this;

    setTimeout(function () {
      var _refs = _this6.refs;
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
          _this6.setState({
            locked: true,
            lockedTop: true
          });
        } else
          // lock the tools menu to the bottom of it's parent
          // if the top of the page root is lower than or equal to the top of the app root
          if (trueRoot.scrollTop >= bottom) {
            _this6.setState({
              locked: true,
              lockedTop: false
            });
          } else {
            // don't lock anything; fix it to the page scrolling
            _this6.setState({
              locked: false,
              lockedTop: false
            });
          }
      }
    }, 200);
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var _this7 = this;

    setTimeout(function () {
      _this7.scrollEvent();
    }, 100);
    // rerun gather data if...
    var last = this.props.params.username,
        curr = nextProps.params.username,
        signedIn = this.props.userData ? this.props.userData.name : "";
    // console.log("new name", last, curr, signedIn);
    if (last || curr) {
      if (
      // ... username changes
      last !== signedIn && curr !== signedIn && last !== curr ||
      // ... auth changes
      !!this.props.auth !== !!nextProps.auth) {
        this.gatherData(this.state.limit, 0, null, true);
      }
    }
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
    var _this8 = this;

    var _state = this.state;
    var requestOffset = _state.requestOffset;
    var dataArray = _state.dataArray;
    var component = _state.component;
    var filter = _state.filter;
    var limit = _state.limit;
    var loadingData = _state.loadingData;
    var loadingQueue = _state.loadingQueue;
    var locked = _state.locked;
    var lockedTop = _state.lockedTop;
    var _props4 = this.props;
    var auth = _props4.auth;
    var data = _props4.data;
    var fireRef = _props4.fireRef;
    var userData = _props4.userData;
    var follow = _props4.follow;
    var versionData = _props4.versionData;
    var params = _props4.params;
    var _props4$methods = _props4.methods;
    var appendStream = _props4$methods.appendStream;
    var loadData = _props4$methods.loadData;

    if (component) {
      var _ret = (function () {
        var ListItem = components[component];
        var list = dataArray.map(function (itemData, ind) {
          return _react2["default"].createElement(ListItem, { ref: function (r) {
              dataArray[ind] ? dataArray[ind].ref = r : null;
            }, key: "" + (itemData.channel ? itemData.channel.name : itemData.user.name),
            data: itemData,
            fireRef: fireRef,
            userData: userData,
            versionData: versionData,
            index: ind,
            filter: filter,
            auth: auth,
            notifyMultiplier: Math.floor(ind / 3),
            params: _this8.props.params, follow: follow, methods: {
              appendStream: appendStream,
              notify: _this8.notify,
              removeFromDataArray: _this8.removeFromDataArray
            } });
        });
        var person = params.username === undefined || userData.name === params.username ? "You" : params.username;
        // this will append an "s" to "follows" in the string if the user is on someone elses page
        var s = params.username === undefined || userData.name === params.username ? "" : "s";
        return {
          v: _react2["default"].createElement(
            "div",
            { ref: "root", className: (_this8.props.follow === "IFollow" ? "following-streams" : "followed-streams") + " profile" + (locked ? " locked" : "") },
            _react2["default"].createElement(
              "div",
              { className: "title" },
              "Channels ",
              _this8.props.follow === "IFollow" ? person + " Follow" + s : "Following " + person,
              !userData ? " (login required for this feature)" : ""
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
                    { className: "option btn-default refresh", onClick: _this8.refresh },
                    "Refresh Streams"
                  ),
                  _react2["default"].createElement(
                    "div",
                    { className: "option btn-default refresh", onClick: function () {
                        return _this8.refreshList(true);
                      } },
                    "Refresh Listing"
                  ),
                  _react2["default"].createElement(
                    "div",
                    { className: "option btn-default load-more" + (loadingData ? " bg-color-dimmer not-clickable" : ""), onClick: loadingData ? null : _this8.gatherData },
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
                        { id: "filter-select", className: "", ref: "filterSelect", onChange: _this8.applyFilter, defaultValue: "all" },
                        ["all", "online", "offline"].map(function (filter) {
                          return _react2["default"].createElement(
                            "option",
                            { key: filter, value: filter },
                            "Show ",
                            _this8.capitalize(filter)
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