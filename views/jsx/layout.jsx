"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _componentsPlayerJsx = require("./components/player.jsx");

var _componentsPlayerJsx2 = _interopRequireDefault(_componentsPlayerJsx);

var _componentsOverlayJsx = require("./components/overlay.jsx");

var _componentsOverlayJsx2 = _interopRequireDefault(_componentsOverlayJsx);

var _componentsAlertJsx = require("./components/alert.jsx");

var _componentsAlertJsx2 = _interopRequireDefault(_componentsAlertJsx);

var _modulesClientLoadData = require("../../modules/client/load-data");

var _modulesClientLoadData2 = _interopRequireDefault(_modulesClientLoadData);

var _modulesUniversalAjax = require("../../modules/universal/ajax");

var _modulesUniversalAjax2 = _interopRequireDefault(_modulesUniversalAjax);

var _componentsNavJsx = require("./components/nav.jsx");

var _componentsNavJsx2 = _interopRequireDefault(_componentsNavJsx);

var _reactRouter = require('react-router');

var _firebase = require("firebase");

var _firebase2 = _interopRequireDefault(_firebase);

var redirectURI = undefined,
    clientID = undefined;
if (typeof location === "object" && location.host.match("amorrius.net")) {
  redirectURI = "http://" + location.host + "/spit-back-auth";
  clientID = "2lbl5iik3q140d45q5bddj3paqekpbi";
} else {
  redirectURI = "http://amorrius." + (process.env["NODE_ENV"] === "prod" ? "net" : "dev") + "/spit-back-auth";
  clientID = "cye2hnlwj24qq7fezcbq9predovf6yy";
}
// console.log(redirectURI, clientID);

// Initialize Firebase
exports["default"] = _react2["default"].createClass({
  displayName: "Layout",
  getInitialState: function getInitialState() {
    // console.log(this.props);
    var overlay = undefined,
        overlayState = undefined;
    // let overlay = "viewGameQueue", overlayState = { queueHost: "piecedigital" };
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
      userData: this.props.params.userData || null,
      streamersInPlayer: {},
      streamOrderMap: [],
      playerCollapsed: true,
      layout: "",
      playerStreamMax: 6,
      panelDataFor: [],
      panelData: [],
      overlay: overlay,
      overlayState: overlayState,
      alert: null,
      fireRef: this.props.fireRef,
      versionData: null,
      registeredAuth: false
    }, this.props.initState ? this.props.initState.layout || {} : {});
  },
  getHashAndAuthData: function getHashAndAuthData() {
    var queryData = {};
    // console.log(window.location.hash);
    // get hash data
    window.location.hash.replace(/(\#|\&)([\w\d\_\-,]+)=([\w\d\_\-,]+)/g, function (_, symbol, key, value) {
      queryData[key] = value;
      // set token for 2 hours
      if (["access_token"].indexOf(key) >= 0) {
        document.cookie = key + "=" + value + "; expires=" + new Date(new Date().getTime() * 1000 * 60 * 60 * 2).toUTCString();
      }
    });
    // get queries
    window.location.search.replace(/(\?|\&)([\w\d\_\-]+)=([\w\d\_\-,\+]+)/g, function (_, symbol, key, value) {
      queryData[key] = value;
    });
    document.cookie.replace(/([\w\d\_\-]+)=([\w\d\_\-,\+]+)(;)?/g, function (_, key, value, symbol) {
      queryData[key] = value;
    });
    // window.location.hash = "";
    // console.log("queryData", queryData);
    return queryData;
  },
  getMultiStream: function getMultiStream() {
    var _this = this;

    var hashData = this.getHashAndAuthData();
    // console.log("hash Data", hashData);

    var MSObject = {};

    ["ms", "multistream", "multitwitch"].map(function (prop) {
      if (hashData[prop]) {
        hashData[prop].split("+").map(function (name) {
          console.log(name);
          if (name) {
            name = name.replace(" ", "");
            MSObject[name] = name;
          }
        });
      }
    });

    // console.log(MSObject);
    Object.keys(MSObject).map(function (name) {
      _this.decideStreamAppend(name);
    });
  },
  initAuthAndFirebase: function initAuthAndFirebase(data, token) {
    var _this2 = this;

    var authData = this.getHashAndAuthData();
    // console.log("init firebase", this.state.fireRef);
    this.setState({
      authData: authData
    });
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
      pollsRef: _firebase2["default"].database().ref("polls"),
      gameQueuesRef: _firebase2["default"].database().ref("gameQueues"),
      feedbackRef: _firebase2["default"].database().ref("feedback")
    };
    // console.log("got auth token", token, typeof token);
    _firebase2["default"].auth().signInWithCustomToken(token)["catch"](function (e) {
      console.error("login error:", e.message, e.code);
    });
    // contantly check for current user
    var interval = setInterval(function () {
      // console.log("current user:", Firebase.auth().currentUser);
      // finish getting user data once the Firebase auth is confirmed
      if (_firebase2["default"].auth().currentUser) {
        // console.log("current user is authed with Firebase");
        clearInterval(interval);

        _modulesClientLoadData2["default"].call(_this2, function (e) {
          console.error(e.stack);
        }, {
          access_token: authData.access_token
        }).then(function (methods) {
          methods.getCurrentUser().then(function (data) {
            _this2.setState({
              userData: data
            });
          })["catch"](function (e) {
            return console.error(e.stack || e);
          });
        })["catch"](function (e) {
          return console.error(e.stack || e);
        });
      }
    }, 100);

    this.setState({
      fireRef: ref
    });
  },
  openAuthWindow: function openAuthWindow(url) {
    var authWin = window.open(url, "TwitchAuth", "menubar,width=500,height=500,centerscreen");

    var msgCB = (function (event) {
      var data = JSON.parse(event.data);

      if (data.res === "auth") {
        delete data.res;
        this.setState(data);

        authWin.close();
        window.removeEventListener("message", msgCB);
      }
    }).bind(this);

    window.addEventListener("message", msgCB);
  },
  decideStreamAppend: function decideStreamAppend(name) {
    var _this3 = this;

    if (name.match(/^v[0-9]+/)) {
      setTimeout(function () {
        _this3.appendVOD(null, null, name);
      });
    } else {
      setTimeout(function () {
        _this3.appendStream(name, name);
      });
    }
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
    var _this4 = this;

    var isSolo = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

    console.log("appending VOD", username, isSolo);
    // only append if below the max
    new Promise(function (resolve, reject) {
      if (!username && !displayName) {

        console.log("no name for VOD. getting it");
        _modulesClientLoadData2["default"].call(this, function (e) {
          console.error(e.stack);
        }, {
          id: id
        }).then(function (methods) {
          methods.getVODData().then(function (data) {
            console.log("got data for VOD", data);
            resolve({
              username: data.channel.name,
              displayName: data.channel.display_name,
              id: id
            });
          })["catch"](function (e) {
            return console.error(e.stack || e);
          });
        })["catch"](function (e) {
          return console.error(e.stack || e);
        });
      } else {
        resolve({
          username: username,
          displayName: displayName,
          id: id
        });
      }
    }).then(function (_ref) {
      var username = _ref.username;
      var displayName = _ref.displayName;
      var id = _ref.id;

      if (Object.keys(_this4.state.streamersInPlayer).length < _this4.state.playerStreamMax) {
        if (!_this4.state.streamersInPlayer.hasOwnProperty(id)) {
          var streamersInPlayer = JSON.parse(JSON.stringify(_this4.state.streamersInPlayer));
          streamersInPlayer[id] = {
            vod: true,
            id: id,
            username: username,
            displayName: displayName
          };
          console.log("New streamersInPlayer:", streamersInPlayer);
          _this4.setState({
            streamersInPlayer: streamersInPlayer
          });
        }
      }
    })["catch"](function (e) {
      return console.error(e);
    });
  },
  spliceStream: function spliceStream(username, id) {
    console.log("removing stream", id || username);
    var streamersInPlayer = JSON.parse(JSON.stringify(this.state.streamersInPlayer));
    var streamOrderMap = JSON.parse(JSON.stringify(this.state.streamOrderMap));
    delete streamersInPlayer[id || username];

    var indexOfStream = streamOrderMap.indexOf(id || username);
    indexOfStream = indexOfStream >= 0 ? indexOfStream : null;
    if (indexOfStream !== null) streamOrderMap.splice(indexOfStream, 1);

    console.log("New streamersInPlayer:", streamersInPlayer);
    console.log("\"" + (id || username) + "\"", streamOrderMap);

    var stateObj = {
      streamersInPlayer: streamersInPlayer,
      streamOrderMap: streamOrderMap
    };
    if (username === this.state.panelDataFor) {
      stateObj = Object.assign(stateObj, {
        panelData: [],
        panelDataFor: ""
      });
    }
    if (Object.keys(streamersInPlayer).length === 0) {
      console.log("no streams in player. collapsing");
      stateObj = Object.assign(stateObj, {
        playerCollapsed: true
      });
    }
    this.setState(stateObj);
  },
  replaceStream: function replaceStream(username, id, replaceUsername, replaceDisplayName) {
    console.log("removing stream", username);
    var streamersInPlayer = JSON.parse(JSON.stringify(this.state.streamersInPlayer));
    var streamersInPlayerArray = Object.keys(streamersInPlayer);
    var streamOrderMap = JSON.parse(JSON.stringify(this.state.streamOrderMap));
    var indexOfOld = streamersInPlayerArray.indexOf(username);
    delete streamersInPlayer[id || username];

    var indexOfStream = streamOrderMap.indexOf(id || username);
    indexOfStream = indexOfStream >= 0 ? indexOfStream : null;
    if (indexOfStream !== null) streamOrderMap.splice(indexOfStream, 1, replaceUsername);

    streamersInPlayer[replaceUsername] = replaceDisplayName || replaceUsername;
    streamersInPlayerArray.splice(indexOfOld, 1, replaceUsername);
    var newObject = {};
    streamersInPlayerArray.map(function (usernameOrID) {
      newObject[usernameOrID] = streamersInPlayer[usernameOrID];
    });
    console.log("New streamersInPlayer:", newObject);

    var stateObj = {
      streamersInPlayer: newObject,
      streamOrderMap: streamOrderMap
    };
    if (username === this.state.panelDataFor) {
      stateObj = Object.assign(stateObj, {
        panelData: [],
        panelDataFor: ""
      });
    }

    this.setState(stateObj);
  },
  reorderStreams: function reorderStreams(array, moverPlace) {
    var streamersInPlayer = JSON.parse(JSON.stringify(this.state.streamersInPlayer));
    // const streamOrderMap = JSON.parse(JSON.stringify(this.state.streamOrderMap));
    // const newStreamersInPlayer = {};
    //
    // array.map(nameOrID => {
    //   newStreamersInPlayer[nameOrID] = streamersInPlayer[nameOrID];
    // });
    //
    // this.refs.player.putInView(moverPlace);

    console.log(streamersInPlayer, array);

    this.setState({
      // streamersInPlayer: newStreamersInPlayer,
      streamOrderMap: array
    });
  },
  search: function search(query) {
    _reactRouter.browserHistory.push(encodeURI("/search?q=" + query));
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
    var _this5 = this;

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
              _this5.setState({
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
  popUpHandler: function popUpHandler(action) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    // console.log("pop up handler", action, options);
    var newState = undefined;
    switch (action) {
      case "close":
        this.setState({
          overlay: ""
        });
        // console.log(this.props.location);
        if (this.props.location.state && this.props.location.state.modal) {
          // console.log("returnTo");
          _reactRouter.browserHistory[options.newReturn ? "replace" : "push"]({
            pathname: options.newReturn || this.props.location.state.returnTo
          });
        }
        break;
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
      case "viewGameQueue":
      case "feedback":
      case "streamReorderer":
      default:
        newState = {
          overlay: action,
          overlayState: options
        };
        // console.log("new state:", newState);
        this.setState(newState);
        break;
    }
  },
  alertHandler: function alertHandler(data) {
    if (data === null || data.message && data.options) {
      this.setState({
        alert: data
      });
    } else {
      console.error("alert component requires missing data: " + (!data.message ? "message" : "options"));
    }
  },
  checkURL: function checkURL(nextProps, nextState) {
    var _this6 = this;

    // console.log("Surly this gives us something", this.state.overlay || "empty", nextState.overlay || "empty");
    var changeOverlay = function changeOverlay(overlay, q, postID) {
      // console.log(overlay);
      switch (q) {
        case "q":
          _this6.popUpHandler(overlay || "viewQuestion", {
            questionID: postID
          });
          break;
        case "p":
          _this6.popUpHandler(overlay || "viewPoll", {
            pollID: postID
          });
          break;
        default:
          // console.log(nextProps.location.state);
          if (!overlay) _this6.popUpHandler("close", {
            newReturn: nextProps.location.state && nextProps.location.state.returnTo ? nextProps.location.state.returnTo : null
          });
      }
    };

    if (nextProps.params.q) {}
    // console.log(nextProps.location);

    // if the overlay is different
    if (nextState.overlay !== this.state.overlay) {
      // if the next state doest not have a truthy value for overlay
      if (!nextState.overlay) {
        changeOverlay(null, null, null);
      } else {
        // console.log("push history");
        _reactRouter.browserHistory.push({
          pathname: nextProps.location.pathname,
          state: {
            modal: true,
            returnTo: nextProps.location.state ? nextProps.location.state.returnTo : nextProps.params.username ? "/profile/" + nextProps.params.username : nextProps.location.pathname
          }
        });
        // console.log("change overlay");
        changeOverlay(nextState.overlay, nextProps.params.q, nextProps.params.postID);
      }
    } else
      // if the url changes
      if (nextProps.location.pathname !== this.props.location.pathname) {
        // console.log("push history");
        // if this is a post (question, poll, etc)
        if (nextProps.params.q) {
          _reactRouter.browserHistory.push({
            pathname: nextProps.location.pathname,
            state: {
              modal: true,
              returnTo: nextProps.location.state ? nextProps.location.state.returnTo : nextProps.params.username ? "/profile/" + nextProps.params.username : nextProps.location.pathname
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
    var _this7 = this;

    // check hash for multistream stuff
    this.getMultiStream();

    // get auth token
    (0, _modulesUniversalAjax2["default"])({
      url: "/get-auth-token",
      success: function success(authToken) {
        // load firebase config
        // console.log("auth token", authToken);
        _modulesClientLoadData2["default"].call(_this7, function (e) {
          console.error(e.stack);
        }).then(function (methods) {
          methods.getFirebaseConfig().then(function (data) {
            // console.log("firebase data", data);
            _this7.initAuthAndFirebase(JSON.parse(atob(data)), authToken);
          })["catch"](function (e) {
            return console.error(e.stack || e);
          });
        })["catch"](function (e) {
          return console.error(e.stack || e);
        });
      },
      error: function error(err) {
        console.error(err);
        _this7.setState({
          error: true
        });
      }
    });

    (0, _modulesUniversalAjax2["default"])({
      url: "/get-version",
      success: function success(data) {
        _this7.setState({
          versionData: JSON.parse(data)
        });
      },
      error: function error(err) {
        console.error(err);
        _this7.setState({
          error: true
        });
      }
    });

    // console.log(this.refs.page);
    // console.log(ReactDOM.findDOMNode(this.refs.page));
    var topLevelComponent = _reactDom2["default"].findDOMNode(this.refs.page);
    if (topLevelComponent) {
      topLevelComponent.setAttribute("tabindex", -1);
      topLevelComponent.focus();
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
  render: function render() {
    var _state =
    // server unique
    this.state;
    var authData = _state.authData;
    var userData = _state.userData;
    var dataObject = _state.streamersInPlayer;
    var streamOrderMap = _state.streamOrderMap;
    var playerCollapsed = _state.playerCollapsed;
    var layout = _state.layout;
    var panelData = _state.panelData;
    var overlay = _state.overlay;
    var overlayState = _state.overlayState;
    var fireRef = _state.fireRef;
    var versionData = _state.versionData;
    var alert = _state.alert;
    var initState = this.props.initState;

    var playerHasStreamers = Object.keys(dataObject).length > 0;

    var url = "https://api.twitch.tv/kraken/oauth2/authorize" + "?response_type=token" + ("&client_id=" + clientID) + ("&redirect_uri=" + redirectURI) + "&scope=user_read+user_follows_edit+channel_check_subscription+user_subscriptions";

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
          decideStreamAppend: this.decideStreamAppend,
          logout: this.logout,
          popUpHandler: this.popUpHandler,
          openAuthWindow: this.openAuthWindow
        } }),
      _react2["default"].createElement(_componentsPlayerJsx2["default"], {
        ref: "player",
        fireRef: fireRef,
        versionData: versionData,
        data: {
          dataObject: dataObject,
          streamOrderMap: streamOrderMap
        },
        userData: userData,
        auth: authData,
        panelData: panelData,
        streamersInPlayer: dataObject,
        playerState: {
          playerCollapsed: playerCollapsed
        },
        layout: layout,
        fireRef: fireRef,
        versionData: versionData,
        initState: initState,
        methods: {
          appendStream: this.appendStream,
          spliceStream: this.spliceStream,
          replaceStream: this.replaceStream,
          clearPlayer: this.clearPlayer,
          expandPlayer: this.expandPlayer,
          collapsePlayer: this.collapsePlayer,
          togglePlayer: this.togglePlayer,
          alertAuthNeeded: this.alertAuthNeeded,
          setLayout: this.setLayout,
          panelsHandler: this.panelsHandler,
          popUpHandler: this.popUpHandler,
          alertHandler: this.alertHandler
        } }),
      this.child ? _react2["default"].cloneElement(this.child, {
        ref: "page",
        // this is a top-level-component
        parent: this,
        auth: authData,
        fireRef: this.fireRef,
        overlay: overlay,
        userData: userData,
        // ...this.props,
        userData: this.props.userData,
        channelData: this.props.channelData,
        params: this.props.params,
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
      }) : this.props.children ? _react2["default"].cloneElement(this.props.children, {
        ref: "page",
        // this is a top-level-component
        parent: this,
        auth: authData,
        fireRef: this.fireRef,
        overlay: overlay,
        userData: userData,
        // ...this.props,
        userData: this.props.userData,
        channelData: this.props.channelData,
        params: this.props.params,
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
      }) : null,
      _react2["default"].createElement(_componentsOverlayJsx2["default"], {
        auth: authData,
        userData: userData,
        overlay: overlay,
        overlayState: overlayState,
        streamersInPlayer: dataObject,
        streamOrderMap: streamOrderMap,
        fireRef: fireRef,
        versionData: versionData,
        params: this.props.params,
        location: this.props.location,
        initState: initState,
        methods: {
          appendStream: this.appendStream,
          popUpHandler: this.popUpHandler,
          reorderStreams: this.reorderStreams
        }
      }),
      _react2["default"].createElement(_componentsAlertJsx2["default"], {
        data: alert,
        methods: {
          alertHandler: this.alertHandler
        }
      }),
      _react2["default"].createElement("div", { className: "separator-4-black" }),
      _react2["default"].createElement(
        "div",
        { className: "created-by" },
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
          _react2["default"].createElement(
            "a",
            { href: "https://twitter.com/amorrius", target: "_blank", rel: "nofollow" },
            "Twitter"
          ),
          " | ",
          _react2["default"].createElement(
            _reactRouter.Link,
            { href: "/about", to: "/about" },
            "About Amorrius"
          ),
          " | ",
          _react2["default"].createElement(
            _reactRouter.Link,
            { href: "/terms-of-service", to: "/terms-of-service" },
            "Terms of Service and Privacy Policy"
          ),
          " | ",
          versionData ? _react2["default"].createElement(
            "span",
            { className: "version" },
            "App version: ",
            versionData.major,
            ".",
            versionData.minor,
            ".",
            versionData.patch
          ) : null,
          " | ",
          _react2["default"].createElement(
            "a",
            { href: "#", onClick: this.popUpHandler.bind(this, "feedback") },
            "Feedback"
          )
        )
      )
    );
  }
});
module.exports = exports["default"];