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

var _modulesHelperTools = require("../../../../modules/helper-tools");

var _hoverOptionsJsx = require("../hover-options.jsx");

var missingLogo = "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png";

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

      var data = this.props.data;

      var _ref = data.channel || data.user;

      var name = _ref.name;
      var display_name = _ref.display_name;

      // console.log(`getting stream data for ${name}`);
      _modulesLoadData2["default"].call(this, function (e) {
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
          return console.error(e.stack);
        });
      })["catch"](function (e) {
        return console.error(e.stack);
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
    notify: function notify(multiplier) {
      var _this2 = this;

      var data = this.props.data;

      var _ref2 = data.channel || data.user;

      var name = _ref2.name;
      var display_name = _ref2.display_name;

      var timeout = 2;
      setTimeout(function () {
        // notification({
        //   type: "stream_online",
        //   channelName: display_name,
        //   timeout,
        //   callback: () => {
        //     this.appendStream(name, display_name);
        //   }
        // });
        _this2.props.methods.notify(name, display_name);
      }, timeout * 1000 * multiplier);
    },
    componentWillUpdate: function componentWillUpdate(_, nextState) {
      // console.log(this.state.streamData, nextState.streamData);
      if (!this.state.streamData || this.state.streamData && this.state.streamData.stream === null && nextState.streamData && nextState.streamData.stream !== null) {
        // console.log(this.state.streamData.stream !== nextState.streamData.stream);
        if (nextState.streamData && nextState.streamData.stream) {
          this.notify(this.props.notifyMultiplier);
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
      var index = _props2.index;
      var filter = _props2.filter;
      var userData = _props2.userData;
      var data = _props2.data;

      var _ref3 = data.channel || data.user;

      var mature = _ref3.mature;
      var logo = _ref3.logo;
      var name = _ref3.name;
      var display_name = _ref3.display_name;
      var language = _ref3.language;
      var stream = this.state.streamData.stream;

      var hoverOptions = _react2["default"].createElement(_hoverOptionsJsx.ListItemHoverOptions, { auth: auth, stream: stream, name: name, display_name: display_name, userData: userData, callback: this.followCallback, clickCallback: this.appendStream });

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
                _react2["default"].createElement("img", { src: logo || missingLogo })
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

      var viewersString = viewers.toLocaleString("en"); // https://www.livecoding.tv/earth_basic/
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
              _react2["default"].createElement("img", { src: logo || missingLogo })
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
      loadingQueue: [],
      locked: this.props.follow === "IFollow" ? false : true,
      lockedTop: this.props.follow === "IFollow" ? false : true,
      currentNotifs: 0
    };
  },
  gatherData: function gatherData(limit, offset, callback) {
    var _this3 = this;

    limit = typeof limit === "number" ? limit : this.state.limit || 25;
    offset = typeof offset === "number" ? offset : this.state.requestOffset;
    var _props3 = this.props;

    _objectDestructuringEmpty(_props3.methods);

    var
    // loadData
    location = _props3.location;

    if (_modulesLoadData2["default"]) {
      this.setState({
        requestOffset: offset + limit
      });
      console.log("gathering data", limit, offset);
      _modulesLoadData2["default"].call(this, function (e) {
        console.error(e.stack);
      }, {
        offset: offset,
        limit: limit,
        stream_type: "all"
      }).then(function (methods) {
        methods[_this3.props.follow === "IFollow" ? "followedStreams" : "followingStreams"]().then(function (data) {
          _this3.setState({
            dataArray: Array.from(_this3.state.dataArray).concat(data.channels || data.streams || data.games || data.top || data.follows),
            component: "ChannelsListItem"
          }, function () {
            console.log("total data", _this3.state.dataArray.length);
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
  removeFromDataArray: function removeFromDataArray(index) {
    var newDataArray = JSON.parse(JSON.stringify(this.state.dataArray));
    newDataArray.splice(parseInt(index), 1);
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
  refreshList: function refreshList(reset, length, offset) {
    var _this4 = this;

    length = length || this.state.dataArray.length;
    offset = offset || 0;
    console.log(reset, length, offset);
    var requestOffset = reset ? 0 : offset;
    var obj = {};
    if (reset) obj.dataArray = [];
    this.setState(obj, function () {
      if (length > 100) {
        _this4.gatherData(100, offset, _this4.refreshList.bind(_this4, false, length - 100, requestOffset + 100));
      } else {
        _this4.gatherData(length, offset);
      }
    });
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
        if (trueRoot.scrollTop <= root.offsetTop) {
          _this5.setState({
            locked: true,
            lockedTop: true
          });
        } else if (trueRoot.scrollTop >= bottom) {
          _this5.setState({
            locked: true,
            lockedTop: false
          });
        } else {
          _this5.setState({
            locked: false,
            lockedTop: false
          });
        }
      }
    }, 200);
  },
  notify: function notify(name, display_name) {
    var _this6 = this;

    if (this.state.currentNotifs < 3) {
      this.setState({
        currentNotifs: this.state.currentNotifs + 1
      }, function () {
        (0, _modulesHelperTools.browserNotification)({
          type: "stream_online",
          channelName: display_name,
          timeout: 2,
          callback: function callback() {
            _this6.appendStream(name, display_name);
          }
        });
      });
    } else {
      setTimeout(function () {
        _this6.setState({
          currentNotifs: _this6.state.currentNotifs - 1
        });
        _this6.notify(name, display_name);
      }, 3000);
    }
  },
  componentWillReceiveProps: function componentWillReceiveProps() {
    this.scrollEvent();
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
    var _this7 = this;

    var _state = this.state;
    var requestOffset = _state.requestOffset;
    var dataArray = _state.dataArray;
    var component = _state.component;
    var filter = _state.filter;
    var limit = _state.limit;
    var loadingQueue = _state.loadingQueue;
    var locked = _state.locked;
    var lockedTop = _state.lockedTop;
    var _props4 = this.props;
    var auth = _props4.auth;
    var data = _props4.data;
    var userData = _props4.userData;
    var _props4$methods = _props4.methods;
    var appendStream = _props4$methods.appendStream;
    var loadData = _props4$methods.loadData;

    if (component) {
      var _ret = (function () {
        var ListItem = components[component];
        var list = dataArray.map(function (itemData, ind) {
          return _react2["default"].createElement(ListItem, { ref: function (r) {
              return dataArray[ind].ref = r;
            }, key: "" + (itemData.channel ? itemData.channel.name : itemData.user.name), data: itemData, userData: userData, index: ind, filter: filter, auth: auth, notifyMultiplier: Math.floor(ind / 3), methods: {
              appendStream: appendStream,
              notify: _this7.notify,
              removeFromDataArray: _this7.removeFromDataArray
            } });
        });

        return {
          v: _react2["default"].createElement(
            "div",
            { ref: "root", className: (_this7.props.follow === "IFollow" ? "following-streams" : "followed-streams") + " profile" + (locked ? " locked" : "") },
            _react2["default"].createElement(
              "div",
              { className: "title" },
              _this7.props.follow === "IFollow" ? "Followed" : "Following",
              " Channels"
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
                    { className: "option btn-default load-more", onClick: _this7.gatherData },
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
/*loadingQueue.length > 0 ? `Loading ${limit * loadingQueue.length} More` : "Load More"*/