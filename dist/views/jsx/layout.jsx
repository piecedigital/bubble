"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _componentsPlayerJsx = require("./components/player.jsx");

var _componentsPlayerJsx2 = _interopRequireDefault(_componentsPlayerJsx);

var _modulesAjax = require("../../modules/ajax");

var _modulesLoadData = require("../../modules/load-data");

var _modulesLoadData2 = _interopRequireDefault(_modulesLoadData);

var _reactRouter = require('react-router');

var _firebase = require("firebase");

var _firebase2 = _interopRequireDefault(_firebase);

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCKZDymYonde07sD7vMu7RukYhGwau1mm4",
  authDomain: "bubble-13387.firebaseapp.com",
  databaseURL: "https://bubble-13387.firebaseio.com",
  storageBucket: "bubble-13387.appspot.com"
};
_firebase2["default"].initializeApp(config);
var ref = _firebase2["default"].database().ref;

exports["default"] = _react2["default"].createClass({
  displayName: "Layout",
  getInitialState: function getInitialState() {
    return {
      authData: this.props.data && this.props.data.authData || null,
      streamersInPlayer: {}
    };
  },
  appendStream: function appendStream(username) {
    var isSolo = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    console.log("appending stream", username, isSolo);
    if (!this.state.streamersInPlayer.hasOwnProperty(username)) {
      var streamersInPlayer = JSON.parse(JSON.stringify(this.state.streamersInPlayer));
      streamersInPlayer[username] = username;
      console.log("New streamersInPlayer:", streamersInPlayer);
      this.setState({
        streamersInPlayer: streamersInPlayer
      });
    }
  },
  spliceStream: function spliceStream(username) {
    console.log("removing stream", username);
    var streamersInPlayer = JSON.parse(JSON.stringify(this.state.streamersInPlayer));
    delete streamersInPlayer[username];
    console.log("New streamersInPlayer:", streamersInPlayer);
    this.setState({
      streamersInPlayer: streamersInPlayer
    });
  },
  logout: function logout() {
    var newAuthData = Object.assign({}, this.state.authData);
    delete newAuthData.access_token;
    this.setState({
      authData: newAuthData
    });
    document.cookie = "access_token=; expires=" + new Date(0).toUTCString() + ";";
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    var authData = {};
    window.location.hash.replace(/(\#|\&)([\w\d\_\-]+)=([\w\d\_\-]+)/g, function (_, symbol, key, value) {
      authData[key] = value;
      document.cookie = key + "=" + value + "; expires=" + new Date(new Date().getTime() * 1000 * 60 * 60 * 12).toUTCString();
    });
    document.cookie.replace(/([\w\d\_\-]+)=([\w\d\_\-]+)(;)/g, function (_, key, value, symbol) {
      authData[key] = value;
    });
    // load user data
    _modulesLoadData2["default"].call(this, function (e) {
      console.error(e.stack);
    }, {
      access_token: authData.access_token
    }).then(function (methods) {
      methods.getCurrentUser().then(function (data) {
        _this.setState({
          userData: data,
          authData: authData
        });
      })["catch"](function (e) {
        return console.error(e.stack);
      });
    })["catch"](function (e) {
      return console.error(e.stack);
    });

    window.location.hash = "";
  },
  render: function render() {
    var _state = this.state;
    var authData = _state.authData;
    var userData = _state.userData;
    var dataObject = _state.streamersInPlayer;
    var data = this.props.data;

    var url = "https://api.twitch.tv/kraken/oauth2/authorize" + "?response_type=token" + "&client_id=cye2hnlwj24qq7fezcbq9predovf6yy" + "&redirect_uri=http://localhost:8080" + "&scope=user_read;";
    return _react2["default"].createElement(
      "div",
      null,
      _react2["default"].createElement(
        "nav",
        null,
        _react2["default"].createElement(
          "div",
          null,
          _react2["default"].createElement(
            _reactRouter.Link,
            { className: "nav-item", to: "/" },
            "Home"
          ),
          _react2["default"].createElement(
            _reactRouter.Link,
            { className: "nav-item", to: "/streams" },
            "Streams"
          ),
          _react2["default"].createElement(
            _reactRouter.Link,
            { className: "nav-item", to: "/games" },
            "Games"
          ),
          authData && authData.access_token ? _react2["default"].createElement(
            "span",
            null,
            _react2["default"].createElement(
              _reactRouter.Link,
              { className: "nav-item", to: "/profile" },
              "Profile"
            ),
            _react2["default"].createElement(
              "a",
              { className: "nav-item", href: "#", onClick: this.logout },
              "Disconnect"
            )
          ) : _react2["default"].createElement(
            "a",
            { className: "nav-item login", href: url },
            "Connect to Twitch"
          )
        )
      ),
      _react2["default"].createElement(_componentsPlayerJsx2["default"], { data: {
          dataObject: dataObject
        }, methods: {
          spliceStream: this.spliceStream
        } }),
      this.props.children ? _react2["default"].cloneElement(this.props.children, {
        parent: this,
        auth: authData,
        userData: userData,
        data: data,
        methods: {
          appendStream: this.appendStream,
          loadData: _modulesLoadData2["default"]
        }
      }) : null
    );
  }
});
module.exports = exports["default"];