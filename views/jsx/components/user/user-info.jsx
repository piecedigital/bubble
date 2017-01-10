"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

// import { Link, browserHistory as History } from 'react-router';

var _modulesLoadData = require("../../../../modules/load-data");

var _modulesLoadData2 = _interopRequireDefault(_modulesLoadData);

var _followBtnJsx = require("../follow-btn.jsx");

var _followBtnJsx2 = _interopRequireDefault(_followBtnJsx);

var missingLogo = "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png";

// primary section for the search component
exports["default"] = _react2["default"].createClass({
  displayName: "UserInfo",
  getInitialState: function getInitialState() {
    return { userUserData: null, userChannelData: null };
  },
  gatherData: function gatherData() {
    var _this = this;

    [{ place: "userUserData", method: "getUserByName" }, { place: "userChannelData", method: "getChannelByName" }, { place: "userStreamData", method: "getStreamByName" }].map(function (_ref) {
      var place = _ref.place;
      var method = _ref.method;
      var _props = _this.props;
      var params = _props.params;
      var userData = _props.userData;

      var username = undefined;
      if (params && params.username) {
        username = params.username;
      } else {
        username = userData.name;
      }
      // console.log(username, this.props.params, this.props.userData);
      if (_modulesLoadData2["default"]) {
        // console.log("gathering data");
        // console.log(`Given Channel Name ${method}`, username);
        _modulesLoadData2["default"].call(_this, function (e) {
          console.error(e.stack);
        }, {
          username: username
        }).then(function (methods) {
          methods[method]().then(function (data) {
            // console.log("data", data);
            _this._mounted ? _this.setState(_defineProperty({}, place, data)) : null;
          })["catch"](function (e) {
            return console.error(e.stack);
          });
        })["catch"](function (e) {
          return console.error(e.stack);
        });
      }
    });
  },
  componentDidMount: function componentDidMount() {
    this.gatherData();
    this._mounted = true;
  },
  componentDidUpdate: function componentDidUpdate(lastProps) {
    if (this.props.params.username !== lastProps.params.username) this.gatherData();
  },
  componentWillUnmount: function componentWillUnmount() {
    delete this._mounted;
  },
  render: function render() {
    var _props2 = this.props;
    var auth = _props2.auth;
    var params = _props2.params;
    var userData = _props2.userData;
    var _props2$methods = _props2.methods;
    var appendStream = _props2$methods.appendStream;
    var popUpHandler = _props2$methods.popUpHandler;
    var _state = this.state;
    var userUserData = _state.userUserData;
    var userChannelData = _state.userChannelData;
    var userStreamData = _state.userStreamData;

    var name = params && params.username ? params.username : userData ? userData.name : null;

    return _react2["default"].createElement(
      "div",
      { ref: "root", className: "user-info" },
      _react2["default"].createElement(
        "div",
        { className: "title" },
        name ? name + "'s info" : null
      ),
      _react2["default"].createElement(
        "div",
        { className: "wrapper" },
        userChannelData ? _react2["default"].createElement(
          "div",
          { className: "channel" },
          _react2["default"].createElement(
            "div",
            { className: "banner" },
            _react2["default"].createElement("img", { src: userChannelData.profile_banner }),
            _react2["default"].createElement(
              "div",
              { className: "hover" },
              _react2["default"].createElement(
                "div",
                { className: "logo" },
                _react2["default"].createElement(
                  "a",
                  { href: "https://twitch.tv/" + userChannelData.name, target: "_blank", rel: "nofollow" },
                  _react2["default"].createElement("img", { src: userChannelData.logo || missingLogo })
                )
              ),
              _react2["default"].createElement(
                "div",
                { className: "info" },
                _react2["default"].createElement(
                  "div",
                  { className: "name" },
                  userChannelData.display_name
                ),
                _react2["default"].createElement(
                  "div",
                  { className: "views" },
                  "Views: ",
                  userChannelData.views.toLocaleString("en")
                ),
                _react2["default"].createElement(
                  "div",
                  { className: "followers" },
                  "Followers: ",
                  userChannelData.followers.toLocaleString("en")
                ),
                _react2["default"].createElement(
                  "div",
                  { className: "partner" },
                  "Partnered?: ",
                  userChannelData.partner ? _react2["default"].createElement(
                    "a",
                    { href: "https://www.twitch.tv/" + userChannelData.name + "/subscribe", className: "color-white", target: "_blank", rel: "nofollow" },
                    "Yes"
                  ) : "No"
                ),
                _react2["default"].createElement(
                  "div",
                  { className: "partner" },
                  "Live?: ",
                  userStreamData && userStreamData.stream ? _react2["default"].createElement(
                    "a",
                    { href: "https://www.twitch.tv/" + name, className: "color-white", target: "_blank", rel: "nofollow", onClick: function (e) {
                        e.preventDefault();
                        appendStream(userChannelData.name, userChannelData.display_name);
                      } },
                    "Yes"
                  ) : "No"
                )
              )
            )
          )
        ) : null,
        _react2["default"].createElement(
          "div",
          { className: "user" },
          userUserData ? _react2["default"].createElement(
            "div",
            { className: "bio" + (!userUserData.bio ? " no-bio" : "") },
            userUserData.bio ? userUserData.bio : ["This user has no bio ", _react2["default"].createElement("img", { key: "img", className: "sad-face", src: "https://github.com/Ranks/emojione/blob/master/assets/png_512x512/1f61e.png?raw=true", alt: "emojione frowny face" })]
          ) : null,
          _react2["default"].createElement("div", { className: "separator-4-3" }),
          name && userData && userData.name !== name ? [_react2["default"].createElement(
            "a",
            { key: "msg", className: "btn-default btn-rect color-black bold no-underline", href: "https://www.twitch.tv/message/compose?to=" + name, target: "_blank" },
            "Send Message"
          ), " ", _react2["default"].createElement(
            "div",
            { key: "ask", className: "btn-default btn-rect color-black bold no-underline", onClick: popUpHandler.bind(null, "askQuestion", {
                recipient: name.toLowerCase(),
                sender: userData.name
              }) },
            "Ask A Question"
          )] : null,
          userData && userData.name !== name ? [" ", _react2["default"].createElement(_followBtnJsx2["default"], { key: "follow", name: userData.name, targetName: name, targetDisplay: null, auth: auth, callback: null, className: "btn-default btn-rect color-black bold no-underline" })] : null,
          userChannelData ? [" ", _react2["default"].createElement(
            "div",
            { key: "open", className: "btn-default btn-rect color-black bold no-underline", onClick: appendStream.bind(null, userChannelData.name, userChannelData.display_name) },
            "Open Stream"
          )] : null,
          !params || !params.username || params && params.username === userData.name ? [" ", _react2["default"].createElement(
            "a",
            { key: "clips", className: "btn-default btn-rect color-black bold no-underline", href: "https://clips.twitch.tv/my-clips", target: "_blank" },
            "My Clips"
          )] : null
        )
      )
    );
  }
});
module.exports = exports["default"];