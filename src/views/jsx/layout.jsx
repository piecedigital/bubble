import React from "react";
import Player from "./components/player.jsx";
import loadData from "../../modules/load-data";
import { Link, browserHistory as History } from 'react-router';
import Firebase from "firebase";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCKZDymYonde07sD7vMu7RukYhGwau1mm4",
  authDomain: "bubble-13387.firebaseapp.com",
  databaseURL: "https://bubble-13387.firebaseio.com",
  storageBucket: "bubble-13387.appspot.com",
};
Firebase.initializeApp(config);
const ref = Firebase.database().ref;

export default React.createClass({
  displayName: "Layout",
  getInitialState() {
    return {
      authData: (this.props.data && this.props.data.authData) || null,
      streamersInPlayer: {},
      playerCollapsed: false,
      layout: "",
      playerStreamMax: 6
    }
  },
  appendStream(username, displayName, isSolo = true) {
    console.log("appending stream", username, isSolo);
    // only append if below the mas
    if(Object.keys(this.state.streamersInPlayer).length < this.state.playerStreamMax) {
      if(!this.state.streamersInPlayer.hasOwnProperty(username)) {
        let streamersInPlayer = JSON.parse(JSON.stringify(this.state.streamersInPlayer));
        streamersInPlayer[username] = displayName;
        console.log("New streamersInPlayer:", streamersInPlayer);
        this.setState({
          streamersInPlayer
        });
      }
    }
  },
  spliceStream(username) {
    console.log("removing stream", username);
    let streamersInPlayer = JSON.parse(JSON.stringify(this.state.streamersInPlayer));
    delete streamersInPlayer[username];
    console.log("New streamersInPlayer:", streamersInPlayer);
    this.setState({
      streamersInPlayer
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
  componentDidMount() {
    let authData = {};
    window.location.hash.replace(/(\#|\&)([\w\d\_\-]+)=([\w\d\_\-]+)/g, (_, symbol, key, value) => {
      authData[key] = value;
      document.cookie = `${key}=${value}; expires=${new Date(new Date().getTime() * 1000 * 60 * 60 * 12).toUTCString()}`
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

    window.location.hash = "";
  },
  alertAuthNeeded() {
    console.log("Auth needed");
    alert("You must connect with Twitch to perform this action");
  },
  setLayout(layout) {
    switch (layout) {
      case "linear":
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
  render() {
    const {
      authData,
      userData,
      streamersInPlayer: dataObject,
      playerCollapsed,
      layout,
    } = this.state;
    const {
      data
    } = this.props;
    var playerHasStreamers = Object.keys(dataObject).length > 0;

    let url = "https://api.twitch.tv/kraken/oauth2/authorize"+
    "?response_type=token"+
    "&client_id=cye2hnlwj24qq7fezcbq9predovf6yy"+
    "&redirect_uri=http://localhost:8080"+
    "&scope=user_read user_follows_edit";
    return (
      <div className={`root${playerHasStreamers ? " player-open" : ""}${playerHasStreamers && playerCollapsed ? " player-collapsed" : ""} layout-${layout || Object.keys(dataObject).length}`}>
        <nav>
          <div>
            <Link className="nav-item" to={"/"}>Home</Link>
            <Link className="nav-item" to={"/streams"}>Streams</Link>
            <Link className="nav-item" to={"/games"}>Games</Link>
            {
              authData && authData.access_token ? (
                <span>
                  { userData ? <Link className="nav-item" to={`/user/${userData.name}`}>Profile</Link> : null }
                  <a className="nav-item" href="#" onClick={this.logout}>Disconnect</a>
                </span>
              ) : (
                <a className="nav-item login" href={url}>Connect to Twitch</a>
              )
            }
          </div>
        </nav>
        {
          <Player data={{
            dataObject
          }}
          userData={userData}
          auth={authData}
          playerState={{
            playerCollapsed
          }}
          layout={layout}
          methods={{
            spliceStream: this.spliceStream,
            expandPlayer: this.expandPlayer,
            collapsePlayer: this.collapsePlayer,
            togglePlayer: this.togglePlayer,
            alertAuthNeeded: this.alertAuthNeeded,
            setLayout: this.setLayout,
          }}/>
        }
        {
          this.props.children ? (
            React.cloneElement(this.props.children, {
              parent: this,
              auth: authData,
              userData,
              data,
              methods: {
                appendStream: this.appendStream,
                loadData: loadData
              }
            })
          ) : (
            null
          )
        }
      </div>
    )
  }
});
