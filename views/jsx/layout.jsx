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

var _modulesClientLoadData = require("../../modules/client/load-data");

var _modulesClientLoadData2 = _interopRequireDefault(_modulesClientLoadData);

var _modulesClientAjax = require("../../modules/client/ajax");

var _componentsNavJsx = require("./components/nav.jsx");

var _componentsNavJsx2 = _interopRequireDefault(_componentsNavJsx);

var _reactRouter = require('react-router');

var _firebase = require("firebase");

var _firebase2 = _interopRequireDefault(_firebase);

var redirectURI = typeof location === "object" && !location.host.match(/localhost/) ? "https://" + location.host : "http://localhost:8080";
var clientID = redirectURI.match(/http(s)?\:\/\/localhost\:[0-9]{4,5}/) ? "cye2hnlwj24qq7fezcbq9predovf6yy" : "2lbl5iik3q140d45q5bddj3paqekpbi";
// console.log(redirectURI, clientID);

// Initialize Firebase

exports["default"] = _react2["default"].createClass({
  displayName: "Layout",
  getInitialState: function getInitialState() {
    var overlay = undefined,
        overlayState = undefined;
    if (this.props.params && this.props.params.q) {
      switch (this.props.params.q) {
        case "q":
          overlay = "viewQuestion";
          overlayState = { questionID: this.props.params.postID };
          break;
        case "a":
          overlay = "viewAnswer";
          overlayState = { questionID: this.props.params.postID };
          break;
        case "p":
          overlay = "viewPoll";
          overlayState = { pollID: this.props.params.postID };
          break;
        default:
          overlay = "";
      }
    }
    return Object.assign({
      authData: this.props.data && this.props.data.authData || null,
      userData: null,
      streamersInPlayer: {},
      playerCollapsed: true,
      layout: "",
      playerStreamMax: 6,
      panelDataFor: [],
      panelData: [],
      overlay: overlay,
      overlayState: overlayState,
      fireRef: null,
      versionData: null,
      registeredAuth: false
    }, this.props.initState ? this.props.initState.layout || {} : {});
  },
  getHashData: function getHashData() {
    var queryData = {};
    console.log(window.location.hash);
    window.location.hash.replace(/(\#|\&)([\w\d\_\-]+)=([\w\d\_\-]+)/g, function (_, symbol, key, value) {
      queryData[key] = value;
      // set token for 2 hours
      document.cookie = key + "=" + value + "; expires=" + new Date(new Date().getTime() * 1000 * 60 * 60 * 2).toUTCString();
    });
    document.cookie.replace(/([\w\d\_\-]+)=([\w\d\_\-]+)(;)/g, function (_, key, value, symbol) {
      queryData[key] = value;
    });
    window.location.hash = "";
    return queryData;
  },
  initFirebase: function initFirebase(data) {
    var _this = this;

    var authData = this.getHashData();
    // console.log("init firebase", this.state.fireRef);
    var config = data;
    _firebase2["default"].initializeApp(config);
    var ref = {
      root: _firebase2["default"].database().ref(),
      authTokensRef: _firebase2["default"].database().ref("authTokens"),
      appConfigRef: _firebase2["default"].database().ref("appConfig"),
      usersRef: _firebase2["default"].database().ref("users"),
      notificationsRef: _firebase2["default"].database().ref("notifications"),
      questionsRef: _firebase2["default"].database().ref("questions"),
      answersRef: _firebase2["default"].database().ref("answers"),
      ratingsRef: _firebase2["default"].database().ref("ratings"),
      commentsRef: _firebase2["default"].database().ref("comments"),
      AMAsRef: _firebase2["default"].database().ref("AMAs"),
      pollsRef: _firebase2["default"].database().ref("polls")
    };
    _firebase2["default"].auth().signInAnonymously()["catch"](function (e) {
      console.error("login error:", e.message, e.code);
    });
    _firebase2["default"].auth().onAuthStateChanged(function (user) {
      _modulesClientLoadData2["default"].call(_this, function (e) {
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
          return console.error(e.stack || e);
        });
      })["catch"](function (e) {
        return console.error(e.stack || e);
      });
    });
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
  spliceStream: function spliceStream(username, id) {
    console.log("removing stream", username);
    var streamersInPlayer = JSON.parse(JSON.stringify(this.state.streamersInPlayer));
    delete streamersInPlayer[id || username];
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
      userData: null,
      registeredAuth: false
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
    var _this2 = this;

    switch (type) {
      case "open":
        console.log("This would open panels for:", name);
        // alert("Feature coming soon (I hope...)")
        _modulesClientLoadData2["default"].call(this, function (e) {
          console.error(e.stack);
        }, {
          // access_token: this.state.authData.access_token,
          username: name
        }).then(function (methods) {
          methods.getPanels().then(function (data) {
            console.log("panel data", data);
            if (data.length > 0) {
              _this2.setState({
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
    // console.log("pop up handler", action, options);
    var newState = undefined;
    switch (action) {
      case "askQuestion":
        newState = Object.assign({
          overlay: action,
          overlayState: {
            to: options.receiver.toLowerCase(),
            from: options.sender.toLowerCase()
          }
        }, options.reset ? {
          // reset askQuestion object if options.reset is there
          overlayState: {
            to: "",
            from: "",
            body: ""
          }
        } : {});
        // console.log("new state:", newState);
        this.setState(newState);
        break;
      case "answerQuestion":
      case "viewQuestion":
      case "viewAskedQuestions":
      case "viewBookmarks":
      case "viewNotifications":
      case "makePoll":
      case "votePoll":
      case "viewPoll":
      case "viewCreatedPolls":
        newState = {
          overlay: action,
          overlayState: options
        };
        // console.log("new state:", newState);
        this.setState(newState);
        break;
      case "close":
        this.setState({
          overlay: ""
        });
        // console.log(this.props.location);
        if (this.props.location.state && this.props.location.state.modal) {
          _reactRouter.browserHistory.push({
            pathname: this.props.location.state.returnTo
          });
        }
    }
  },
  checkURL: function checkURL(nextProps, nextState) {
    var _this3 = this;

    // console.log("Surly this gives us something", this.state.overlay || "empty", nextState.overlay || "empty");

    var changeOverlay = function changeOverlay(overlay, q, postID) {
      // console.log(overlay);
      switch (q) {
        case "q":
          _this3.popUpHandler(overlay || "viewQuestion", {
            questionID: postID
          });
          break;
        case "p":
          _this3.popUpHandler(overlay || "viewPoll", {
            pollID: postID
          });
          break;
        default:
          if (!overlay) _this3.popUpHandler("close", null);
      }
    };

    if (nextProps.params.q) {
      // console.log(nextProps.location);
    }

    if (nextState.overlay !== this.state.overlay) {
      if (!nextState.overlay) {
        changeOverlay(null, null, null);
      } else {
        // console.log("push history");
        _reactRouter.browserHistory.push({
          pathname: nextProps.location.pathname,
          state: {
            modal: true,
            returnTo: nextProps.location.state ? nextProps.location.state.returnTo || "/profile/" + nextProps.params.username : "/profile/" + nextProps.params.username
          }
        });
        // console.log("change overlay");
        changeOverlay(nextState.overlay, nextProps.params.q, nextProps.params.postID);
      }
    } else if (nextProps.location.pathname !== this.props.location.pathname) {
      // console.log("push history");
      if (nextProps.params.q) {
        _reactRouter.browserHistory.push({
          pathname: nextProps.location.pathname,
          state: {
            modal: true,
            returnTo: nextProps.location.state ? nextProps.location.state.returnTo || "/profile/" + nextProps.params.username : "/profile/" + nextProps.params.username
          }
        });
        // console.log("change overlay");
        changeOverlay(null, nextProps.params.q, nextProps.params.postID);
      } else {
        changeOverlay(null, null, null);
      }
    }
  },
  componentDidMount: function componentDidMount() {
    var _this4 = this;

    // load firebase config
    _modulesClientLoadData2["default"].call(this, function (e) {
      console.error(e.stack);
    }).then(function (methods) {
      methods.getFirebaseConfig().then(function (data) {
        // console.log("firebase data", data);
        _this4.initFirebase(JSON.parse(atob(data)));
      })["catch"](function (e) {
        return console.error(e.stack || e);
      });
    })["catch"](function (e) {
      return console.error(e.stack || e);
    });

    (0, _modulesClientAjax.ajax)({
      url: "/get-version",
      success: function success(data) {
        _this4.setState({
          versionData: JSON.parse(data)
        });
      },
      error: function error(err) {
        console.error(err);
        _this4.setState({
          error: true
        });
      }
    });
  },
  componentDidUpdate: function componentDidUpdate() {
    var _state = this.state;
    var registeredAuth = _state.registeredAuth;
    var fireRef = _state.fireRef;
    var userData = _state.userData;
    var authData = _state.authData;

    // console.log(registeredAuth, !!fireRef, !!authData, !!userData);
    if (!registeredAuth && fireRef && authData && authData.access_token && userData) {
      console.log("register auth. should only happen once");
      this.setState({
        registeredAuth: true
      }, function () {
        fireRef.authTokensRef.child(userData.name).set(authData.access_token);
      });
    }
  },
  componentWillUpdate: function componentWillUpdate(nextProps, nextState) {
    // console.log(nextProps.location);
    if (nextProps.location.state && nextProps.location.state.modal) {
      this.child = this.child || this.props.children;
    } else {
      this.child = null;
    }
    this.checkURL(nextProps, nextState);
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {},
  render: function render() {
    var _state2 =

    // server unique
    this.state;
    var authData = _state2.authData;
    var userData = _state2.userData;
    var dataObject = _state2.streamersInPlayer;
    var playerCollapsed = _state2.playerCollapsed;
    var layout = _state2.layout;
    var panelData = _state2.panelData;
    var overlay = _state2.overlay;
    var overlayState = _state2.overlayState;
    var fireRef = _state2.fireRef;
    var versionData = _state2.versionData;
    var initState = this.props.initState;

    var playerHasStreamers = Object.keys(dataObject).length > 0;

    var url = "https://api.twitch.tv/kraken/oauth2/authorize" + "?response_type=token" + ("&client_id=" + clientID) + ("&redirect_uri=" + redirectURI) + "&scope=user_read+user_follows_edit";

    return _react2["default"].createElement(
      "div",
      { className: "root" + (playerHasStreamers ? " player-open" : "") + (playerHasStreamers && playerCollapsed ? " player-collapsed" : "") + " layout-" + (layout || Object.keys(dataObject).length) },
      _react2["default"].createElement(_componentsNavJsx2["default"], {
        fireRef: fireRef,
        authData: authData,
        userData: userData,
        url: url,
        initState: initState,
        methods: {
          search: this.search,
          appendStream: this.appendStream,
          logout: this.logout,
          popUpHandler: this.popUpHandler
        } }),
      _react2["default"].createElement(_componentsPlayerJsx2["default"], {
        fireRef: fireRef,
        versionData: versionData,
        data: {
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
        versionData: versionData,
        initState: initState,
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
        versionData: versionData,
        initState: initState,
        methods: {
          appendStream: this.appendStream,
          appendVOD: this.appendVOD,
          spliceStream: this.spliceStream,
          loadData: _modulesClientLoadData2["default"],
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
        versionData: versionData,
        initState: initState,
        methods: {
          appendStream: this.appendStream,
          appendVOD: this.appendVOD,
          spliceStream: this.spliceStream,
          loadData: _modulesClientLoadData2["default"],
          popUpHandler: this.popUpHandler
        }
      })) : null,
      _react2["default"].createElement(_componentsOverlayJsx2["default"], {
        auth: authData,
        userData: userData,
        overlay: overlay,
        overlayState: overlayState,
        fireRef: fireRef,
        versionData: versionData,
        params: this.props.params,
        location: this.props.location,
        initState: initState,
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
          ),
          " | ",
          versionData ? _react2["default"].createElement(
            "span",
            { className: "version" },
            "Current version: ",
            versionData.major,
            ".",
            versionData.minor,
            ".",
            versionData.patch
          ) : null
        )
      )
    );
  }
});
module.exports = exports["default"];