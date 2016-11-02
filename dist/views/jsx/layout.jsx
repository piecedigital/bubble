"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _componentsPlayerJsx = require("./components/player.jsx");

var _componentsPlayerJsx2 = _interopRequireDefault(_componentsPlayerJsx);

var _modulesLoadData = require("../../modules/load-data");

var _modulesLoadData2 = _interopRequireDefault(_modulesLoadData);

var _reactRouter = require('react-router');

var _firebase = require("firebase");

var _firebase2 = _interopRequireDefault(_firebase);

var redirectURI = typeof location === "object" && !location.host.match(/localhost/) ? "https://" + location.host : "http://localhost:8080";
var clientID = redirectURI.match(/http(s)?\:\/\/localhost\:[0-9]{4,5}/) ? "cye2hnlwj24qq7fezcbq9predovf6yy" : "2lbl5iik3q140d45q5bddj3paqekpbi";
console.log(redirectURI, clientID);
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
      streamersInPlayer: {},
      playerCollapsed: true,
      layout: "",
      playerStreamMax: 6,
      panelData: []
    };
  },
  appendStream: function appendStream(username, displayName) {
    var isSolo = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    console.log("appending stream", username, isSolo);
    // only append if below the mas
    if (Object.keys(this.state.streamersInPlayer).length < this.state.playerStreamMax) {
      if (!this.state.streamersInPlayer.hasOwnProperty(username)) {
        var streamersInPlayer = JSON.parse(JSON.stringify(this.state.streamersInPlayer));
        streamersInPlayer[username] = displayName;
        console.log("New streamersInPlayer:", streamersInPlayer);
        this.setState({
          streamersInPlayer: streamersInPlayer
        });
      }
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
  clearPlayer: function clearPlayer() {
    this.setState({
      streamersInPlayer: {}
    });
  },
  logout: function logout() {
    var newAuthData = Object.assign({}, this.state.authData);
    delete newAuthData.access_token;
    this.setState({
      authData: newAuthData,
      userData: null
    });
    document.cookie = "access_token=; expires=" + new Date(0).toUTCString() + ";";
  },
  togglePlayer: function togglePlayer(type) {
    switch (type) {
      case "close":
        this.setState({
          playerCollapsed: true
        });
        break;
      case "open":
        this.setState({
          playerCollapsed: true
        });
        break;
      case "toggle":
      default:
        console.log("no type match:", type);
        this.setState({
          playerCollapsed: !this.state.playerCollapsed
        });
    }
  },
  panelsHandler: function panelsHandler(type, name) {
    var _this = this;

    switch (type) {
      case "open":
        console.log("This would open panels for:", name);
        alert("Feature coming soon (I hope...)");
        _modulesLoadData2["default"].call(this, function (e) {
          console.error(e.stack);
        }, {
          // access_token: this.state.authData.access_token,
          username: name
        }).then(function (methods) {
          methods.getPanels().then(function (data) {
            console.log("panel data", data);
            _this.setState({
              panelData: data
            });
          })["catch"](function (e) {
            return console.error(e.stack || e);
          });
        })["catch"](function (e) {
          return console.error(e.stack || e);
        });
        break;
      default:
    }
  },
  componentDidMount: function componentDidMount() {
    var _this2 = this;

    var authData = {};
    window.location.hash.replace(/(\#|\&)([\w\d\_\-]+)=([\w\d\_\-]+)/g, function (_, symbol, key, value) {
      authData[key] = value;
      document.cookie = key + "=" + value + "; expires=" + new Date(new Date().getTime() * 1000 * 60 * 60 * 2).toUTCString();
    });
    document.cookie.replace(/([\w\d\_\-]+)=([\w\d\_\-]+)(;)/g, function (_, key, value, symbol) {
      authData[key] = value;
    });
    // console.log(authData, "auth data");
    // load user data
    _modulesLoadData2["default"].call(this, function (e) {
      console.error(e.stack);
    }, {
      access_token: authData.access_token
    }).then(function (methods) {
      methods.getCurrentUser().then(function (data) {
        _this2.setState({
          userData: data,
          authData: authData
        });
      })["catch"](function (e) {
        return console.error(e.stack || e);
      });
    })["catch"](function (e) {
      return console.error(e.stack || e);
    });

    window.location.hash = "";
  },
  alertAuthNeeded: function alertAuthNeeded() {
    console.log("Auth needed");
    alert("You must connect with Twitch to perform this action");
  },
  setLayout: function setLayout(layout) {
    switch (layout) {
      case "singular":
      case "by 2":
      case "by 3":
        this.setState({
          layout: layout.replace(/\s/g, "-")
        });
        break;
      default:
        this.setState({
          layout: ""
        });
    }
  },
  render: function render() {
    var _state = this.state;
    var authData = _state.authData;
    var userData = _state.userData;
    var dataObject = _state.streamersInPlayer;
    var playerCollapsed = _state.playerCollapsed;
    var layout = _state.layout;
    var panelData = _state.panelData;
    var data = this.props.data;

    var playerHasStreamers = Object.keys(dataObject).length > 0;

    var url = "https://api.twitch.tv/kraken/oauth2/authorize" + "?response_type=token" + ("&client_id=" + clientID) + ("&redirect_uri=" + redirectURI) + "&scope=user_read+user_follows_edit";
    return _react2["default"].createElement(
      "div",
      { className: "root" + (playerHasStreamers ? " player-open" : "") + (playerHasStreamers && playerCollapsed ? " player-collapsed" : "") + " layout-" + (layout || Object.keys(dataObject).length) },
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
            userData ? _react2["default"].createElement(
              _reactRouter.Link,
              { className: "nav-item", to: "/Profile" },
              "Profile"
            ) : null,
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
        },
        userData: userData,
        auth: authData,
        panelData: panelData,
        playerState: {
          playerCollapsed: playerCollapsed
        },
        layout: layout,
        methods: {
          spliceStream: this.spliceStream,
          clearPlayer: this.clearPlayer,
          expandPlayer: this.expandPlayer,
          collapsePlayer: this.collapsePlayer,
          togglePlayer: this.togglePlayer,
          alertAuthNeeded: this.alertAuthNeeded,
          setLayout: this.setLayout,
          panelsHandler: this.panelsHandler
        } }),
      this.props.children ? _react2["default"].cloneElement(this.props.children, {
        parent: this,
        auth: authData,
        userData: userData,
        data: data,
        methods: {
          appendStream: this.appendStream,
          spliceStream: this.spliceStream,
          loadData: _modulesLoadData2["default"]
        }
      }) : null
    );
  }
});
module.exports = exports["default"];