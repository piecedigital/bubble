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

var missingLogo = "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png";

// primary section for the search component
exports["default"] = _react2["default"].createClass({
  displayName: "UserInfo",
  getInitialState: function getInitialState() {
    return { userUserData: null, userChannelData: null };
  },
  gatherData: function gatherData() {
    var _this = this;

    [{ place: "userUserData", method: "getUserByName" }, { place: "userChannelData", method: "getChannelByName" }].map(function (_ref) {
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
        console.log("gathering data");
        console.log("Given Channel Name " + method, username);
        _modulesLoadData2["default"].call(_this, function (e) {
          console.error(e.stack);
        }, {
          username: username
        }).then(function (methods) {
          methods[method]().then(function (data) {
            console.log("data", data);
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
  componentWillUnmount: function componentWillUnmount() {
    delete this._mounted;
  },
  render: function render() {
    var _props2 = this.props;
    var params = _props2.params;
    var userData = _props2.userData;
    var _state = this.state;
    var userUserData = _state.userUserData;
    var userChannelData = _state.userChannelData;

    return _react2["default"].createElement(
      "div",
      { ref: "root", className: "user-info" },
      _react2["default"].createElement(
        "div",
        { className: "title" },
        params && params.username ? params.username : userData ? userData.name : null,
        "'s info"
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
                _react2["default"].createElement("img", { src: userChannelData.logo })
              ),
              _react2["default"].createElement(
                "div",
                { className: "info" },
                _react2["default"].createElement(
                  "div",
                  { className: "views" },
                  "Views: ",
                  userChannelData.views
                ),
                _react2["default"].createElement(
                  "div",
                  { className: "followers" },
                  "Followers: ",
                  userChannelData.followers
                ),
                _react2["default"].createElement(
                  "div",
                  { className: "partner" },
                  "Partnered?: ",
                  userChannelData.partner ? "Yes" : "No"
                )
              )
            )
          )
        ) : null,
        userUserData ? _react2["default"].createElement(
          "div",
          { className: "user" },
          _react2["default"].createElement(
            "div",
            { className: "image" },
            _react2["default"].createElement("img", { src: userUserData.logo })
          ),
          _react2["default"].createElement(
            "div",
            { className: "name" },
            userUserData.display_name
          ),
          _react2["default"].createElement(
            "div",
            { className: "bio" },
            userUserData.bio
          )
        ) : null
      )
    );
  }
});
module.exports = exports["default"];