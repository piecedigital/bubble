"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _homeJsx = require("./home.jsx");

var _homeJsx2 = _interopRequireDefault(_homeJsx);

var _modulesAjax = require("../../modules/ajax");

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
      featuredRequestOffset: 0,
      streamRequestOffset: 0,
      gameRequestOffset: 0,
      featuredArray: [],
      streamsArray: [],
      gamesArray: []
    };
  },
  loadData: function loadData(errorCB) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    options = Object.assign({}, options);
    options.stream_type = options.stream_type || "live";
    options.limit = options.limit || 20;
    var baseURL = "https://api.twitch.tv/kraken/";
    return {
      featured: function featured(okayCB) {
        options.limit = 25;
        options.offset = 0;
        return this.makeRequest(okayCB, "streams/featured");
      },
      streams: function streams(okayCB) {
        options.offset = options.offset || this.state.streamRequestOffset;
        return this.makeRequest(okayCB, "streams");
      },
      games: function games(okayCB) {
        options.offset = options.offset || this.state.gameRequestOffset;
        return this.makeRequest(okayCB, "games");
      },
      users: function users(okayCB, username) {
        delete options.stream_type;
        delete options.limit;
        return this.makeRequest(okayCB, "users/" + username);
      },
      makeRequest: function makeRequest(okayCB, path) {
        return new Promise(function (resolve, reject) {
          var requestURL = "" + baseURL + path + "?";
          Object.keys(options).map(function (key) {
            var value = options[key];
            requestURL += key + "=" + value + "&";
          });
          requestURL.replace(/&$/, "");
          (0, _modulesAjax.ajax)({
            url: requestURL,
            success: function success(data) {
              data = JSON.parse(data);
              resolve(data);
              if (typeof okayCB === "function") okayCB(data);
            },
            error: function error(_error) {
              console.error(_error);
            }
          });
        });
      }
    };
  },
  appendStream: function appendStream(username) {
    var isSolo = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    console.log("appending stream", username, isSolo);
  },
  componentDidMount: function componentDidMount() {
    var authData = {};
    window.location.hash.replace(/(\#|\&)([\w\d\_\-]+)=([\w\d\_\-]+)/g, function (_, symbol, key, value) {
      authData[key] = value;
      document.cookie = key + "=" + value + "; expires=" + new Date(new Date().getTime() * 1000 * 60 * 60 * 12).toUTCString();
    });
    document.cookie.replace(/([\w\d\_\-]+)=([\w\d\_\-]+)(;)/g, function (_, key, value, symbol) {
      authData[key] = value;
    });
    if (!Object.keys(authData).length) {
      authData = null;
    }
    console.log(authData);
    this.setState({
      authData: authData
    });
    window.location.hash = "";
  },
  render: function render() {
    var authData = this.state.authData;

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
          authData && authData.access_token ? _react2["default"].createElement(
            _reactRouter.Link,
            { className: "nav-item", to: "/profile" },
            "Profile"
          ) : _react2["default"].createElement(
            "a",
            { className: "nav-item login", href: url },
            "Login to Twitch"
          )
        )
      ),
      _react2["default"].createElement(_homeJsx2["default"], { parent: this, auth: authData, methods: {
          appendStream: this.appendStream,
          loadData: this.loadData
        } })
    );
  }
});
module.exports = exports["default"];