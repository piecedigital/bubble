"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _componentsPlayerJsx = require("./components/player.jsx");

var _componentsPlayerJsx2 = _interopRequireDefault(_componentsPlayerJsx);

var _componentsOverlayJsx = require("./components/overlay.jsx");

var _componentsOverlayJsx2 = _interopRequireDefault(_componentsOverlayJsx);

var _modulesLoadData = require("../../modules/load-data");

var _modulesLoadData2 = _interopRequireDefault(_modulesLoadData);

var _componentsNavJsx = require("./components/nav.jsx");

var _componentsNavJsx2 = _interopRequireDefault(_componentsNavJsx);

var _reactRouter = require('react-router');

var _firebase = require("firebase");

var _firebase2 = _interopRequireDefault(_firebase);

var redirectURI = typeof location === "object" && !location.host.match(/localhost/) ? "https://" + location.host : "http://localhost:8080";
var clientID = redirectURI.match(/http(s)?\:\/\/localhost\:[0-9]{4,5}/) ? "cye2hnlwj24qq7fezcbq9predovf6yy" : "2lbl5iik3q140d45q5bddj3paqekpbi";
console.log(redirectURI, clientID);

// Initialize Firebase

exports["default"] = _react2["default"].createClass({
  displayName: "Layout",
  getInitialState: function getInitialState() {
    return Object.assign({
      authData: this.props.data && this.props.data.authData || null,
      streamersInPlayer: {},
      playerCollapsed: true,
      layout: "",
      playerStreamMax: 6,
      panelDataFor: [],
      panelData: [],
      panelData: [],
      overlay: "",
      askQuestion: {
        to: "",
        from: "",
        body: ""
      },
      answerQuestion: {
        questionData: null,
        answerData: null
      },
      viewQuestion: {
        questionData: null,
        answerData: null
      },
      fireRef: null
    }, this.props.initState || {});
  },
  initFirebase: function initFirebase(data) {
    // console.log("init firebase", data);
    var config = data;
    _firebase2["default"].initializeApp(config);
    var ref = {
      root: _firebase2["default"].database().ref(),
      appConfigRef: _firebase2["default"].database().ref("appConfig"),
      usersRef: _firebase2["default"].database().ref("users"),
      questionsRef: _firebase2["default"].database().ref("questions"),
      answersRef: _firebase2["default"].database().ref("answers"),
      ratingsRef: _firebase2["default"].database().ref("ratings"),
      commentsRef: _firebase2["default"].database().ref("comments"),
      AMAsRef: _firebase2["default"].database().ref("AMAs"),
      pollsRef: _firebase2["default"].database().ref("polls")
    };
    this.setState({
      fireRef: ref
    });
  },
  appendStream: function appendStream(username, displayName) {
    var isSolo = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    username ? username.replace(/\s/g, "") : null;
    displayName ? displayName.replace(/\s/g, "") : null;
    console.log("appending stream", username, isSolo);
    // only append if below the mas
    if (Object.keys(this.state.streamersInPlayer).length < this.state.playerStreamMax) {
      if (!this.state.streamersInPlayer.hasOwnProperty(username)) {
        var streamersInPlayer = JSON.parse(JSON.stringify(this.state.streamersInPlayer));
        streamersInPlayer[username] = displayName || username;
        console.log("New streamersInPlayer:", streamersInPlayer);
        this.setState({
          streamersInPlayer: streamersInPlayer
        });
      }
    }
  },
  appendVOD: function appendVOD(username, displayName, id) {
    var isSolo = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

    console.log("appending VOD", username, isSolo);
    // only append if below the max
    if (Object.keys(this.state.streamersInPlayer).length < this.state.playerStreamMax) {
      if (!this.state.streamersInPlayer.hasOwnProperty(id)) {
        var streamersInPlayer = JSON.parse(JSON.stringify(this.state.streamersInPlayer));
        streamersInPlayer[id] = {
          vod: true,
          id: id,
          username: username,
          displayName: displayName
        };
        console.log("New streamersInPlayer:", streamersInPlayer);
        this.setState({
          streamersInPlayer: streamersInPlayer
        });
      }
    }
  },
  search: function search(query) {
    _reactRouter.browserHistory.push(encodeURI("/search/streams?q=" + query));
  },
  spliceStream: function spliceStream(username) {
    console.log("removing stream", username);
    var streamersInPlayer = JSON.parse(JSON.stringify(this.state.streamersInPlayer));
    delete streamersInPlayer[username];
    console.log("New streamersInPlayer:", streamersInPlayer);

    var stateObj = {
      streamersInPlayer: streamersInPlayer
    };
    if (username === this.state.panelDataFor) {
      stateObj = Object.assign(stateObj, {
        panelData: [],
        panelDataFor: ""
      });
    }
    if (Object.keys(streamersInPlayer).length === 0) {
      stateObj = Object.assign(stateObj, {
        playerCollapsed: true
      });
    }
    this.setState(stateObj);
  },
  clearPlayer: function clearPlayer() {
    this.setState({
      streamersInPlayer: {},
      panelData: [],
      panelDataFor: "",
      playerCollapsed: true
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
      case "collapse":
        this.setState({
          playerCollapsed: true
        });
        break;
      case "expand":
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
        // alert("Feature coming soon (I hope...)")
        _modulesLoadData2["default"].call(this, function (e) {
          console.error(e.stack);
        }, {
          // access_token: this.state.authData.access_token,
          username: name
        }).then(function (methods) {
          methods.getPanels().then(function (data) {
            console.log("panel data", data);
            if (data.length > 0) {
              _this.setState({
                panelDataFor: name,
                panelData: data
              });
            }
          })["catch"](function (e) {
            return console.error(e.stack || e);
          });
        })["catch"](function (e) {
          return console.error(e.stack || e);
        });
        break;
      default:
        this.setState({
          panelDataFor: name,
          panelData: []
        });
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

    // load firebase config
    _modulesLoadData2["default"].call(this, function (e) {
      console.error(e.stack);
    }).then(function (methods) {
      methods.getFirebaseConfig().then(function (data) {
        // console.log("firebase data", data);
        _this2.initFirebase(JSON.parse(atob(data)));
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
  popUpHandler: function popUpHandler(action, options) {
    console.log("pop up handler", action, options);
    var newState = undefined;
    switch (action) {
      case "askQuestion":
        newState = Object.assign({
          overlay: action,
          askQuestion: {
            to: options.recipient.toLowerCase(),
            from: options.sender.toLowerCase()
          }
        }, options.reset ? {
          // reset askQuestion object if options.reset is there
          askQuestion: {
            to: "",
            from: "",
            body: ""
          }
        } : {});
        // console.log("new state:", newState);
        this.setState(newState);
        break;
      case "answerQuestion":
        newState = {
          overlay: action,
          answerQuestion: {
            questionData: options.questionData,
            answerData: options.answerData
          }
        };
        // console.log("new state:", newState);
        this.setState(newState);
        break;
      case "viewQuestion":
        newState = {
          overlay: action,
          viewQuestion: {
            questionData: options.questionData,
            answerData: options.answerData,
            voteToolData: options.voteToolData
          }
        };
        // console.log("new state:", newState);
        this.setState(newState);
        break;
      case "close":
        this.setState({
          overlay: ""
        });
        if (this.props.location.state && this.props.location.state.modal) {
          _reactRouter.browserHistory.push({
            pathname: this.props.location.state.returnTo
          });
        }
    }
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    console.log(nextProps.location);
    if (nextProps.location.state && nextProps.location.state.modal) {
      this.child = this.props.children;
    } else {
      this.child = null;
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
    var overlay = _state.overlay;
    var askQuestion = _state.askQuestion;
    var answerQuestion = _state.answerQuestion;
    var viewQuestion = _state.viewQuestion;
    var fireRef = _state.fireRef;

    var playerHasStreamers = Object.keys(dataObject).length > 0;

    var url = "https://api.twitch.tv/kraken/oauth2/authorize" + "?response_type=token" + ("&client_id=" + clientID) + ("&redirect_uri=" + redirectURI) + "&scope=user_read+user_follows_edit";
    return _react2["default"].createElement(
      "div",
      { className: "root" + (playerHasStreamers ? " player-open" : "") + (playerHasStreamers && playerCollapsed ? " player-collapsed" : "") + " layout-" + (layout || Object.keys(dataObject).length) },
      _react2["default"].createElement(_componentsNavJsx2["default"], { authData: authData, userData: userData, url: url, methods: {
          search: this.search,
          appendStream: this.appendStream,
          logout: this.logout
        } }),
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
        fireRef: fireRef,
        methods: {
          spliceStream: this.spliceStream,
          clearPlayer: this.clearPlayer,
          expandPlayer: this.expandPlayer,
          collapsePlayer: this.collapsePlayer,
          togglePlayer: this.togglePlayer,
          alertAuthNeeded: this.alertAuthNeeded,
          setLayout: this.setLayout,
          panelsHandler: this.panelsHandler,
          popUpHandler: this.popUpHandler
        } }),
      this.child ? _react2["default"].cloneElement(this.child, _extends({
        // this is a top-level-component
        parent: this,
        auth: authData,
        fireRef: this.fireRef,
        overlay: overlay,
        userData: userData
      }, this.props, {
        fireRef: fireRef,
        methods: {
          appendStream: this.appendStream,
          appendVOD: this.appendVOD,
          spliceStream: this.spliceStream,
          loadData: _modulesLoadData2["default"],
          popUpHandler: this.popUpHandler
        }
      })) : this.props.children ? _react2["default"].cloneElement(this.props.children, _extends({
        // this is a top-level-component
        parent: this,
        auth: authData,
        fireRef: this.fireRef,
        overlay: overlay,
        userData: userData
      }, this.props, {
        fireRef: fireRef,
        methods: {
          appendStream: this.appendStream,
          appendVOD: this.appendVOD,
          spliceStream: this.spliceStream,
          loadData: _modulesLoadData2["default"],
          popUpHandler: this.popUpHandler
        }
      })) : null,
      _react2["default"].createElement(_componentsOverlayJsx2["default"], {
        auth: authData,
        userData: userData,
        overlay: overlay,
        askQuestion: askQuestion,
        answerQuestion: answerQuestion,
        viewQuestion: viewQuestion,
        fireRef: fireRef,
        methods: {
          popUpHandler: this.popUpHandler
        } }),
      _react2["default"].createElement(
        "div",
        { className: "created-by" },
        _react2["default"].createElement("div", { className: "separator-4-black" }),
        _react2["default"].createElement(
          "div",
          { className: "by" },
          "Created by ",
          _react2["default"].createElement(
            "a",
            { href: "http://piecedigital.net", rel: "nofollow", target: "_blank" },
            "Piece Digital"
          )
        )
      )
    );
  }
});
module.exports = exports["default"];