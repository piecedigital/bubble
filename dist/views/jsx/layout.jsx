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
function loadData(errorCB) {
  var _this = this;

  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  options = Object.assign({}, options);
  options.stream_type = options.stream_type || "live";
  options.limit = options.limit || 20;
  var baseURL = "https://api.twitch.tv/kraken/";
  var makeRequest = function makeRequest(okayCB, path) {
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
  };
  return new Promise(function (resolve, reject) {
    resolve({
      featured: function featured(okayCB) {
        // console.log(this);
        options.limit = 25;
        options.offset = 0;
        return makeRequest(okayCB, "streams/featured");
      },
      topGames: function topGames(okayCB) {
        // console.log(this);
        options.offset = options.offset || _this.state.requestOffset;
        return makeRequest(okayCB, "games/top");
      },
      topStreams: function topStreams(okayCB) {
        // console.log(this);
        options.offset = options.offset || _this.state.requestOffset;
        return makeRequest(okayCB, "streams");
      },
      getUser: function getUser(okayCB, username) {
        delete options.stream_type;
        delete options.limit;
        return makeRequest(okayCB, "users/" + username);
      },
      followedStreams: function followedStreams(okayCB) {
        options.offset = options.offset || _this.state.requestOffset;
        return makeRequest(okayCB, "search/followed");
      },
      followedVideos: function followedVideos(okayCB) {
        options.offset = options.offset || _this.state.requestOffset;
        return makeRequest(okayCB, "videos/followed");
      },
      searchChannels: function searchChannels(okayCB) {
        options.offset = options.offset || _this.state.requestOffset;
        return makeRequest(okayCB, "search/channels");
      },
      searchStreams: function searchStreams(okayCB) {
        options.offset = options.offset || _this.state.requestOffset;
        return makeRequest(okayCB, "search/streams");
      },
      searchGames: function searchGames(okayCB) {
        options.offset = options.offset || _this.state.requestOffset;
        return makeRequest(okayCB, "search/games");
      }
    });
  });
};

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
    var _state = this.state;
    var authData = _state.authData;
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
      _react2["default"].createElement(_componentsPlayerJsx2["default"], { data: {
          dataObject: dataObject
        }, methods: {
          spliceStream: this.spliceStream
        } }),
      this.props.children ? _react2["default"].cloneElement(this.props.children, {
        parent: this,
        auth: authData,
        data: data,
        methods: {
          appendStream: this.appendStream,
          loadData: loadData
        }
      }) : null
    );
  }
});
module.exports = exports["default"];