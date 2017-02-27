// @flow
import React from "react";
import ReactDOM from "react-dom";
import Player from "./components/player.jsx";
import Overlay from "./components/overlay.jsx";
import loadData from "../../modules/client/load-data";
import { ajax } from "../../modules/client/ajax";
import Nav from "./components/nav.jsx";
import { Link, browserHistory as History } from 'react-router';
import Firebase from "firebase";

let redirectURI, clientID;
if( typeof location === "object" && location.host.match("amorrius.net") ) {
  redirectURI =`http://${location.host}`;
  clientID = "2lbl5iik3q140d45q5bddj3paqekpbi";
} else {
  redirectURI = "http://amorrius.dev";
  clientID ="cye2hnlwj24qq7fezcbq9predovf6yy"
}
console.log(redirectURI, clientID);

// Initialize Firebase


export default React.createClass({
  displayName: "Layout",
  getInitialState() {
    // console.log(this.props);
    let overlay, overlayState;
    // let overlay = "viewGameQueue", overlayState = { queueHost: "piecedigital" };
    if(this.props.params && this.props.params.q) {
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
      authData: (this.props.data && this.props.data.authData) || null,
      userData: null,
      streamersInPlayer: {},
      playerCollapsed: true,
      layout: "",
      playerStreamMax: 6,
      panelDataFor: [],
      panelData: [],
      overlay,
      overlayState,
      fireRef: null,
      versionData: null,
      registeredAuth: false,
    }, this.props.initState ? this.props.initState.layout || {} : {});
  },
  getHashData() {
    let queryData = {};
    // console.log(window.location.hash);
    window.location.hash.replace(/(\#|\&)([\w\d\_\-]+)=([\w\d\_\-]+)/g, (_, symbol, key, value) => {
      queryData[key] = value;
      // set token for 2 hours
      document.cookie = `${key}=${value}; expires=${new Date(new Date().getTime() * 1000 * 60 * 60 * 2).toUTCString()}`
    });
    document.cookie.replace(/([\w\d\_\-]+)=([\w\d\_\-]+)(;)/g, (_, key, value, symbol) => {
      queryData[key] = value;
    });
    window.location.hash = "";
    return queryData;
  },
  initAuthAndFirebase(data, token) {
    let authData = this.getHashData();
    // console.log("init firebase", this.state.fireRef);
    this.setState({
      authData
    });
    var config = data;
    Firebase.initializeApp(config);
    const ref = {
      root: Firebase.database().ref(),
      authTokensRef: Firebase.database().ref("authTokens"),
      appConfigRef: Firebase.database().ref("appConfig"),
      usersRef: Firebase.database().ref("users"),
      notificationsRef: Firebase.database().ref("notifications"),
      questionsRef: Firebase.database().ref("questions"),
      answersRef: Firebase.database().ref("answers"),
      ratingsRef: Firebase.database().ref("ratings"),
      commentsRef: Firebase.database().ref("comments"),
      AMAsRef: Firebase.database().ref("AMAs"),
      pollsRef: Firebase.database().ref("polls"),
      gameQueuesRef: Firebase.database().ref("gameQueues"),
    };
    // console.log("got auth token", token, typeof token);
    Firebase.auth().signInWithCustomToken(token)
    .catch(e => {
      console.error("login error:", e.message, e.code);
    });
    // contantly check for current user
    const interval = setInterval(() => {
      // console.log("current user:", Firebase.auth().currentUser);
      // finish getting user data once the Firebase auth is confirmed
      if(Firebase.auth().currentUser) {
        console.log("current user is authed with Firebase");
        clearInterval(interval);

        loadData.call(this, e => {
          console.error(e.stack);
        }, {
          access_token: authData.access_token
        })
        .then(methods => {
          methods
          .getCurrentUser()
          .then(data => {
            this.setState({
              userData: data,
            });
          })
          .catch(e => console.error(e.stack || e));
        })
        .catch(e => console.error(e.stack || e));
      }
    }, 100);

    this.setState({
      fireRef: ref
    });
  },
  appendStream(username, displayName, isSolo = false) {
    username ? username.replace(/\s/g, "") : null;
    displayName ? displayName.replace(/\s/g, "") : null;
    console.log("appending stream", username, isSolo);
    // only append if below the mas
    if(Object.keys(this.state.streamersInPlayer).length < this.state.playerStreamMax) {
      if(!this.state.streamersInPlayer.hasOwnProperty(username)) {
        let streamersInPlayer = JSON.parse(JSON.stringify(this.state.streamersInPlayer));
        streamersInPlayer[username] = displayName || username;
        console.log("New streamersInPlayer:", streamersInPlayer);
        this.setState({
          streamersInPlayer
        });
      }
    }
  },
  appendVOD(username, displayName, id, isSolo = false) {
    console.log("appending VOD", username, isSolo);
    // only append if below the max
    if(Object.keys(this.state.streamersInPlayer).length < this.state.playerStreamMax) {
      if(!this.state.streamersInPlayer.hasOwnProperty(id)) {
        let streamersInPlayer = JSON.parse(JSON.stringify(this.state.streamersInPlayer));
        streamersInPlayer[id] = {
          vod: true,
          id,
          username,
          displayName
        };
        console.log("New streamersInPlayer:", streamersInPlayer);
        this.setState({
          streamersInPlayer
        });
      }
    }
  },
  search(query) {
    History.push(encodeURI(`/search/streams?q=${query}`));
  },
  spliceStream(username, id) {
    console.log("removing stream", username);
    let streamersInPlayer = JSON.parse(JSON.stringify(this.state.streamersInPlayer));
    delete streamersInPlayer[id || username];
    console.log("New streamersInPlayer:", streamersInPlayer);

    let stateObj = {
      streamersInPlayer
    };
    if(username === this.state.panelDataFor) {
      stateObj = Object.assign(stateObj, {
        panelData: [],
        panelDataFor: ""
      });
    }
    if(Object.keys(streamersInPlayer).length === 0) {
      stateObj = Object.assign(stateObj, {
        playerCollapsed: true
      });
    }
    this.setState(stateObj);
  },
  clearPlayer() {
    this.setState({
      streamersInPlayer: {},
      panelData: [],
      panelDataFor: "",
      playerCollapsed: true
    });
  },
  logout() {
    var newAuthData = Object.assign({}, this.state.authData);
    delete newAuthData.access_token;
    this.setState({
      authData: newAuthData,
      userData: null,
      registeredAuth: false
    });
    document.cookie = "access_token=; expires=" + new Date(0).toUTCString() + ";";
  },
  togglePlayer(type) {
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
  panelsHandler(type, name) {
    switch (type) {
      case "open":
        console.log("This would open panels for:", name);
        // alert("Feature coming soon (I hope...)")
        loadData.call(this, e => {
          console.error(e.stack);
        }, {
          // access_token: this.state.authData.access_token,
          username: name
        })
        .then(methods => {
          methods
          .getPanels()
          .then(data => {
            console.log("panel data", data);
            if(data.length > 0) {
              this.setState({
                panelDataFor: name,
                panelData: data,
              });
            }
          })
          .catch(e => console.error(e.stack || e));
        })
        .catch(e => console.error(e.stack || e));
        break;
      default:
      this.setState({
        panelDataFor: name,
        panelData: [],
      });
    }
  },
  alertAuthNeeded() {
    console.log("Auth needed");
    alert("You must connect with Twitch to perform this action");
  },
  setLayout(layout) {
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
  popUpHandler(action, options = {}) {
    // console.log("pop up handler", action, options);
    let newState;
    switch (action) {
      case "close":
        this.setState({
          overlay: ""
        });
        // console.log(this.props.location);
        if(this.props.location.state && this.props.location.state.modal) {
          // console.log("returnTo");
          History[options.newReturn ? "replace" : "push"]({
            pathname: options.newReturn || this.props.location.state.returnTo
          });
        }
      break;
      case "askQuestion":
        newState = Object.assign({
          overlay: action,
          overlayState: {
            to: options.receiver.toLowerCase(),
            from: options.sender.toLowerCase(),
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
  checkURL(nextProps, nextState) {
    // console.log("Surly this gives us something", this.state.overlay || "empty", nextState.overlay || "empty");
    const changeOverlay = (overlay, q, postID) => {
      // console.log(overlay);
      switch (q) {
        case "q":
        this.popUpHandler(overlay || "viewQuestion", {
          questionID: postID
        })
        break;
        case "p":
        this.popUpHandler(overlay || "viewPoll", {
          pollID: postID
        })
        break;
        default:
        // console.log(nextProps.location.state);
        if(!overlay) this.popUpHandler("close", {
          newReturn: (nextProps.location.state && nextProps.location.state.returnTo) ? nextProps.location.state.returnTo : null
        });
      }
    }

    if(nextProps.params.q) {
      // console.log(nextProps.location);
    }

    // if the overlay is different
    if(nextState.overlay !== this.state.overlay) {
      // if the next state doest not have a truthy value for overlay
      if(!nextState.overlay) {
        changeOverlay(null, null, null);
      } else {
        // console.log("push history");
        History.push({
          pathname: nextProps.location.pathname,
          state: {
            modal: true,
            returnTo: nextProps.location.state ? nextProps.location.state.returnTo : nextProps.params.username ? `/profile/${nextProps.params.username}` : nextProps.location.pathname
          }
        })
        // console.log("change overlay");
        changeOverlay(nextState.overlay, nextProps.params.q, nextProps.params.postID);
      }
    } else
    // if the url changes
    if(nextProps.location.pathname !== this.props.location.pathname) {
      // console.log("push history");
      // if this is a post (question, poll, etc)
      if(nextProps.params.q) {
        History.push({
          pathname: nextProps.location.pathname,
          state: {
            modal: true,
            returnTo: nextProps.location.state ? nextProps.location.state.returnTo : nextProps.params.username ? `/profile/${nextProps.params.username}` : nextProps.location.pathname
          }
        })
        // console.log("change overlay");
        changeOverlay(null, nextProps.params.q, nextProps.params.postID);
      } else {
        changeOverlay(null, null, null);
      }
    }
  },
  componentDidMount() {
    // get auth token
    ajax({
      url: "/get-auth-token",
      success: (authToken) => {
        // load firebase config
        // console.log("auth token", authToken);
        loadData.call(this, e => {
          console.error(e.stack);
        })
        .then(methods => {
          methods
          .getFirebaseConfig()
          .then(data => {
            // console.log("firebase data", data);
            this.initAuthAndFirebase(JSON.parse(atob(data)), authToken);
          })
          .catch(e => console.error(e.stack || e));
        })
        .catch(e => console.error(e.stack || e));
      },
      error: (err) => {
        console.error(err);
        this.setState({
          error: true
        });
      }
    });

    ajax({
      url: "/get-version",
      success: (data) => {
        this.setState({
          versionData: JSON.parse(data)
        });
      },
      error: (err) => {
        console.error(err);
        this.setState({
          error: true
        });
      }
    });

    // console.log(this.refs.page);
    // console.log(ReactDOM.findDOMNode(this.refs.page));
    const topLevelComponent = ReactDOM.findDOMNode(this.refs.page);
    if(topLevelComponent) {
      topLevelComponent.setAttribute("tabindex", -1);
      topLevelComponent.focus();
    }
  },
  componentWillUpdate(nextProps, nextState) {
    // console.log(nextProps.location);
    if(nextProps.location.state && nextProps.location.state.modal) {
      this.child = this.child || this.props.children;
    } else {
      this.child = null;
    }
    this.checkURL(nextProps, nextState);
  },
  render() {
    const {
      authData,
      userData,
      streamersInPlayer: dataObject,
      playerCollapsed,
      layout,
      panelData,
      overlay,
      overlayState,
      fireRef,
      versionData,

      // server unique
    } = this.state;

    const {
      initState
    } = this.props;

    var playerHasStreamers = Object.keys(dataObject).length > 0;

    let url = "https://api.twitch.tv/kraken/oauth2/authorize"+
    "?response_type=token"+
    `&client_id=${clientID}`+
    `&redirect_uri=${redirectURI}`+
    "&scope=user_read+user_follows_edit+channel_check_subscription+user_subscriptions";

    return (
      <div className={`root${playerHasStreamers ? " player-open" : ""}${playerHasStreamers && playerCollapsed ? " player-collapsed" : ""} layout-${layout || Object.keys(dataObject).length}`}>
        <Nav
          fireRef={fireRef}
          authData={authData}
          userData={userData}
          url={url}
          initState={initState}
          methods={{
            search: this.search,
            appendStream: this.appendStream,
            logout: this.logout,
            popUpHandler: this.popUpHandler,
          }} />
        {
          <Player
            fireRef={fireRef}
            versionData={versionData}
            data={{
              dataObject
            }}
            userData={userData}
            auth={authData}
            panelData={panelData}
            playerState={{
              playerCollapsed
            }}
            layout={layout}
            fireRef={fireRef}
            versionData={versionData}
            initState={initState}
            methods={{
              spliceStream: this.spliceStream,
              clearPlayer: this.clearPlayer,
              expandPlayer: this.expandPlayer,
              collapsePlayer: this.collapsePlayer,
              togglePlayer: this.togglePlayer,
              alertAuthNeeded: this.alertAuthNeeded,
              setLayout: this.setLayout,
              panelsHandler: this.panelsHandler,
              popUpHandler: this.popUpHandler,
            }}/>
        }
        {
          this.child ? (
            React.cloneElement(this.child, {
              ref: "page",
              // this is a top-level-component
              parent: this,
              auth: authData,
              fireRef: this.fireRef,
              overlay: overlay,
              userData,
              ...this.props,
              fireRef,
              versionData,
              initState,
              methods: {
                appendStream: this.appendStream,
                appendVOD: this.appendVOD,
                spliceStream: this.spliceStream,
                loadData: loadData,
                popUpHandler: this.popUpHandler,
              }
            })
          ) : this.props.children ? (
              React.cloneElement(this.props.children, {
              ref: "page",
              // this is a top-level-component
              parent: this,
              auth: authData,
              fireRef: this.fireRef,
              overlay: overlay,
              userData,
              ...this.props,
              fireRef,
              versionData,
              initState,
              methods: {
                appendStream: this.appendStream,
                appendVOD: this.appendVOD,
                spliceStream: this.spliceStream,
                loadData: loadData,
                popUpHandler: this.popUpHandler,
              }
            })
          ) : (
            null
          )
        }
        <Overlay
        auth={authData}
        userData={userData}
        overlay={overlay}
        overlayState={overlayState}
        fireRef={fireRef}
        versionData={versionData}
        params={this.props.params}
        location={this.props.location}
        initState={initState}
        methods={{
          popUpHandler: this.popUpHandler
        }} />
        <div className="separator-4-black" />
        <div className="created-by">
          <div className="by">
            Created by <a href="http://piecedigital.net" rel="nofollow" target="_blank">Piece Digital</a>
            {" | "}
            <Link href="/about" to="/about">About Amorrius</Link>
            {" | "}
            <Link href="/terms-of-service" to="/terms-of-service">Terms of Service and Privacy Policy</Link>
            {" | "}
            {
              versionData ? (
                <span className="version">App version: {versionData.major}.{versionData.minor}.{versionData.patch}</span>
              ) : null
            }
          </div>
        </div>
      </div>
    )
  }
});
