"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _modulesClientLoadData = require("../../../modules/client/load-data");

var _modulesClientLoadData2 = _interopRequireDefault(_modulesClientLoadData);

// import BookmarkButton from "./bookmark-btn.jsx";
// import UserQuestions from "./user-questions.jsx";

var _reactRouter = require('react-router');

var _modulesClientHelperTools = require("../../../modules/client/helper-tools");

var _hoverOptionsJsx = require("./hover-options.jsx");

var currentNotifs = 0;

var StreamListItem = _react2["default"].createClass({
  displayName: "feat-StreamListItem",
  render: function render() {
    var _props = this.props;
    var auth = _props.auth;
    var userData = _props.userData;
    var versionData = _props.versionData;
    var fireRef = _props.fireRef;
    var index = _props.index;
    var homepage = _props.homepage;
    var _props$methods = _props.methods;
    var displayStream = _props$methods.displayStream;
    var appendStream = _props$methods.appendStream;
    var data = _props.data;
    var stream = _props.data.stream;

    var game = undefined,
        viewers = undefined,
        title = undefined,
        id = undefined,
        preview = undefined,
        mature = undefined,
        logo = undefined,
        name = undefined,
        display_name = undefined,
        language = undefined;
    if (stream) {
      game = stream.game;
      viewers = stream.viewers;
      title = stream.title;
      id = stream._id;
      preview = stream.preview;
      var _stream$channel = stream.channel;
      mature = _stream$channel.mature;
      logo = _stream$channel.logo;
      name = _stream$channel.name;
      display_name = _stream$channel.display_name;
      language = _stream$channel.language;
    } else {
      game = data.game;
      viewers = data.viewers;
      title = data.title;
      id = data._id;
      preview = data.preview;
      var _data$channel = data.channel;
      mature = _data$channel.mature;
      logo = _data$channel.logo;
      name = _data$channel.name;
      display_name = _data$channel.display_name;
      language = _data$channel.language;
    }

    var viewersString = viewers.toLocaleString("en"); // http://www.livecoding.tv/earth_basic/
    var hoverOptions = !homepage ? _react2["default"].createElement(_hoverOptionsJsx.ListItemHoverOptions, { auth: auth, fireRef: fireRef, stream: true, name: name, display_name: display_name, userData: userData, clickCallback: appendStream, versionData: versionData }) : null;

    return _react2["default"].createElement(
      "li",
      { className: "stream-list-item" + (homepage ? " clickable home" : ""), onClick: function () {
          if (typeof displayStream === "function") displayStream(index);
        } },
      _react2["default"].createElement(
        "div",
        { className: "wrapper" },
        _react2["default"].createElement(
          "div",
          { className: "image" },
          _react2["default"].createElement(_modulesClientHelperTools.CImg, {
            style: {
              width: 215,
              height: 121
            },
            src: preview.medium || _modulesClientHelperTools.missingLogo
          })
        ),
        _react2["default"].createElement(
          "div",
          { className: "info" },
          _react2["default"].createElement(
            "div",
            { className: "channel-name" },
            name
          ),
          _react2["default"].createElement("div", { className: "separator-1-7" }),
          _react2["default"].createElement(
            "div",
            { className: "title" },
            title
          ),
          _react2["default"].createElement(
            "div",
            { className: "game" },
            "Live with \"" + (game || null) + "\", streaming to " + viewersString + " viewer" + (viewers > 1 ? "s" : "")
          )
        ),
        hoverOptions
      )
    );
  }
});

exports.StreamListItem = StreamListItem;
var ChannelListItem = _react2["default"].createClass({
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
        // if(name === "spawnofodd") console.log(data);
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
    // console.log(this.props.follow);
    if (this.props.follow === "IFollow") {
      if (follow) {
        // following channel
        if (typeof this.props.methods.addToDataArray === "function") this.props.methods.addToDataArray(this.props.index);
      } else {
        // unfollowing channel
        if (typeof this.props.methods.removeFromDataArray === "function") this.props.methods.removeFromDataArray(this.props.index);
      }
    }
  },
  appendStream: function appendStream(name, display_name) {
    this.props.methods.appendStream(name, display_name);
  },
  notify: function notify() {
    var _this2 = this;

    var _props2 = this.props;
    var data = _props2.data;
    var params = _props2.params;
    var userData = _props2.userData;

    // I wouldn't care to receive desktop notifications regarding someone elses followings
    // this should keep that from happening
    if (params && userData && params.username !== userData.name) console.log("not my follows, not my interest");
    if (params && userData && params.username !== userData.name) return;

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
      if (this.props.userData && nextState.streamData && nextState.streamData.stream && this.props.follow === "IFollow") {
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
    var _props3 = this.props;
    var auth = _props3.auth;
    var fireRef = _props3.fireRef;
    var index = _props3.index;
    var filter = _props3.filter;
    var userData = _props3.userData;
    var versionData = _props3.versionData;
    var data = _props3.data;

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
              _react2["default"].createElement(_modulesClientHelperTools.CImg, {
                "for": "channel-list-item",
                src: logo || _modulesClientHelperTools.missingLogo })
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
            _react2["default"].createElement(_modulesClientHelperTools.CImg, {
              "for": "channel-list-item",
              src: logo || _modulesClientHelperTools.missingLogo })
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
});

exports.ChannelListItem = ChannelListItem;
var VideoListItem = _react2["default"].createClass({
  displayName: "video-ListItem",
  readableDate: function readableDate(givenDate) {
    var date = new Date(givenDate);
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var hours = date.getHours();
    var dayHalf = hours > 12 ? "PM" : "AM";
    hours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return date.getDate() + " " + months[date.getMonth()] + ", " + date.getFullYear() + " - " + hours + ":" + minutes + " " + dayHalf;
  },
  render: function render() {
    // console.log(this.props);
    var _props4 = this.props;
    var auth = _props4.auth;
    var fireRef = _props4.fireRef;
    var versionData = _props4.versionData;
    var index = _props4.index;
    var userData = _props4.userData;
    var appendVOD = _props4.methods.appendVOD;
    var _props4$data = _props4.data;
    var preview = _props4$data.preview;
    var animated_preview = _props4$data.animated_preview;
    var title = _props4$data.title;
    var game = _props4$data.game;
    var recorded_at = _props4$data.recorded_at;
    var id = _props4$data._id;
    var _props4$data$channel = _props4$data.channel;
    var name = _props4$data$channel.name;
    var display_name = _props4$data$channel.display_name;

    var hoverOptions = _react2["default"].createElement(_hoverOptionsJsx.ListItemHoverOptions, {
      auth: auth,
      fireRef: fireRef,
      userData: userData,
      versionData: versionData,
      vod: id,
      name: name,
      display_name: display_name,
      clickCallback: appendVOD });

    return _react2["default"].createElement(
      "li",
      { className: "video-list-item" },
      _react2["default"].createElement(
        "div",
        { className: "wrapper" },
        _react2["default"].createElement(
          "div",
          { className: "image" },
          _react2["default"].createElement(_modulesClientHelperTools.CImg, {
            "for": "video-list-item",
            style: {
              width: 136,
              height: 102
            },
            src: preview.template.replace("{width}", 136).replace("{height}", 102) })
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
            "VOD of \"" + game + "\""
          ),
          _react2["default"].createElement(
            "div",
            { className: "date" },
            this.readableDate(recorded_at)
          )
        ),
        hoverOptions
      )
    );
  }
});

exports.VideoListItem = VideoListItem;
var GameListItem = _react2["default"].createClass({
  displayName: "games-ListItem",
  render: function render() {
    // console.log(this.props);
    var _props5 = this.props;
    var index = _props5.index;
    var appendStream = _props5.methods.appendStream;
    var _props5$data = _props5.data;
    var _props5$data$game = _props5$data.game;
    var name = _props5$data$game.name;
    var box = _props5$data$game.box;
    var id = _props5$data$game._id;
    var viewers = _props5$data.viewers;
    var channels = _props5$data.channels;

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
});
exports.GameListItem = GameListItem;

// url,