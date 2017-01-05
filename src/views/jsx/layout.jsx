import React from "react";
import Player from "./components/player.jsx";
import Overlay from "./components/overlay.jsx";
import loadData from "../../modules/load-data";
import Nav from "./components/nav.jsx";
import { Link, browserHistory as History } from 'react-router';
import Firebase from "firebase";

const redirectURI = typeof location === "object" && !location.host.match(/localhost/) ? `https://${location.host}` : "http://localhost:8080";
const clientID = redirectURI.match(/http(s)?\:\/\/localhost\:[0-9]{4,5}/) ? "cye2hnlwj24qq7fezcbq9predovf6yy" : "2lbl5iik3q140d45q5bddj3paqekpbi";
console.log(redirectURI, clientID);

// Initialize Firebase


export default React.createClass({
  displayName: "Layout",
  getInitialState() {
    return Object.assign({
      authData: (this.props.data && this.props.data.authData) || null,
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
      fireRef: null
    }, this.props.initState || {});
  },
  initFirebase(data) {
    // console.log("init firebase", data);
    var config = data;
    Firebase.initializeApp(config);
    const ref = {
      root: Firebase.database().ref(),
      appConfigRef: Firebase.database().ref("appConfig"),
      usersRef: Firebase.database().ref("users"),
      questionsRef: Firebase.database().ref("questions"),
      ansersRef: Firebase.database().ref("ansers"),
      ratingsRef: Firebase.database().ref("ratings"),
      commentsRef: Firebase.database().ref("comments"),
      pollsRef: Firebase.database().ref("polls"),
    };
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
  spliceStream(username) {
    console.log("removing stream", username);
    let streamersInPlayer = JSON.parse(JSON.stringify(this.state.streamersInPlayer));
    delete streamersInPlayer[username];
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
      userData: null
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
  componentDidMount() {
    let authData = {};
    window.location.hash.replace(/(\#|\&)([\w\d\_\-]+)=([\w\d\_\-]+)/g, (_, symbol, key, value) => {
      authData[key] = value;
      document.cookie = `${key}=${value}; expires=${new Date(new Date().getTime() * 1000 * 60 * 60 * 2).toUTCString()}`
    });
    document.cookie.replace(/([\w\d\_\-]+)=([\w\d\_\-]+)(;)/g, (_, key, value, symbol) => {
      authData[key] = value;
    });
    // console.log(authData, "auth data");
    // load user data
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
          authData
        });
      })
      .catch(e => console.error(e.stack || e));
    })
    .catch(e => console.error(e.stack || e));

    // load firebase config
    loadData.call(this, e => {
      console.error(e.stack);
    })
    .then(methods => {
      methods
      .getFirebaseConfig()
      .then(data => {
        // console.log("firebase data", data);
        this.initFirebase(JSON.parse(atob(data)))
      })
      .catch(e => console.error(e.stack || e));
    })
    .catch(e => console.error(e.stack || e));

    window.location.hash = "";
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
  popUpHandler(action, options) {
    console.log("pop up handler", action, options);
    switch (action) {
      case "askQuestion":
          let newState = Object.assign({
            overlay: action,
            askQuestion: {
              to: options.recipient.toLowerCase(),
              from: options.sender.toLowerCase(),
            }
          }, options.reset ? {
            // reset askQuestion object if options.reset is there
            askQuestion: {
              to: "",
              from: "",
              body: ""
            }
          } : {});
          console.log("new state:", newState);
          this.setState(newState);
        break;
      case "close":
        this.setState({
          overlay: ""
        });
    }
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
      askQuestion,
      fireRef
    } = this.state;
    var playerHasStreamers = Object.keys(dataObject).length > 0;

    let url = "https://api.twitch.tv/kraken/oauth2/authorize"+
    "?response_type=token"+
    `&client_id=${clientID}`+
    `&redirect_uri=${redirectURI}`+
    "&scope=user_read+user_follows_edit";
    return (
      <div className={`root${playerHasStreamers ? " player-open" : ""}${playerHasStreamers && playerCollapsed ? " player-collapsed" : ""} layout-${layout || Object.keys(dataObject).length}`}>
        <Nav authData={authData} userData={userData} url={url} methods={{
          search: this.search,
          appendStream: this.appendStream,
          logout: this.logout
        }} />
        {
          <Player data={{
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
          this.props.children ? (
            React.cloneElement(this.props.children, {
              parent: this,
              auth: authData,
              fireRef: this.fireRef,
              userData,
              ...this.props,
              fireRef,
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
        overlay={overlay}
        askQuestion={askQuestion}
        fireRef={fireRef}
        auth={authData}
        methods={{
          popUpHandler: this.popUpHandler
        }} />
        <div className="created-by">
          <div className="separator-4-black" />
          <div className="by">Created by <a href="http://piecedigital.net" rel="nofollow" target="_blank">Piece Digital</a></div>
        </div>
      </div>
    )
  }
});
