import React from "react";
import Player from "./components/player.jsx";
import { ajax } from "../../modules/ajax";
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
      playerCollapsed: false
    }
  },
  appendStream(username, isSolo = true) {
    console.log("appending stream", username, isSolo);
    if(!this.state.streamersInPlayer.hasOwnProperty(username)) {
      let streamersInPlayer = JSON.parse(JSON.stringify(this.state.streamersInPlayer));
      streamersInPlayer[username] = username;
      console.log("New streamersInPlayer:", streamersInPlayer);
      this.setState({
        streamersInPlayer
      });
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
      authData: newAuthData
    });
    document.cookie = "access_token=; expires=" + new Date(0).toUTCString() + ";";
  },
  expandPlayer() {
    this.setState({
      playerCollapsed: false
    });
  },
  collapsePlayer() {
    this.setState({
      playerCollapsed: true
    });
  },
  togglePlayer() {
    this.setState({
      playerCollapsed: !this.state.playerCollapsed
    });
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
    console.log(authData, "auth data");
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
  render() {
    const {
      authData,
      userData,
      collapsed,
      streamersInPlayer: dataObject
    } = this.state;
    const {
      data
    } = this.props;
    var playerHasStreamers = Object.keys(dataObject).length > 0;
    let url = "https://api.twitch.tv/kraken/oauth2/authorize"+
    "?response_type=token"+
    "&client_id=cye2hnlwj24qq7fezcbq9predovf6yy"+
    "&redirect_uri=http://localhost:8080"+
    "&scope=user_read;";
    return (
      <div className={`root${playerHasStreamers && playerCollapsed ? " player-collapsed" : ""}`}>
        <nav>
          <div>
            <Link className="nav-item" to={"/"}>Home</Link>
            <Link className="nav-item" to={"/streams"}>Streams</Link>
            <Link className="nav-item" to={"/games"}>Games</Link>
            {
              authData && authData.access_token ? (
                <span>
                  <Link className="nav-item" to={"/profile"}>Profile</Link>
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
          }} methods={{
            spliceStream: this.spliceStream,
            expandPlayer: this.expandPlayer,
            collapsePlayer: this.collapsePlayer,
            togglePlayer: this.togglePlayer,
          }}/>
        }
        {
          this.props.children ? (
            React.cloneElement(this.props.children, {
              parent: this,
              auth: authData,
              userData: userData,
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
