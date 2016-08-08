import React from "react";
import Home from "./home.jsx";
import { ajax } from "../../modules/ajax";
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
      featuredRequestOffset: 0,
      streamRequestOffset: 0,
      gameRequestOffset: 0,
      featuredArray: [],
      streamsArray: [],
      gamesArray: [],
    }
  },
  loadData(errorCB, options = {}) {
    options.stream_type = options.stream_type || "live";
    options.limit = options.limit || 20;
    let baseURL = "https://api.twitch.tv/kraken/";
    return {
      featured(okayCB) {
        options.limit = 25;
        options.offset = 0;
        return this.makeRequest(okayCB, "streams/featured");
      },
      streams(okayCB) {
        options.offset = options.offset || this.state.streamRequestOffset;
        return this.makeRequest(okayCB, "streams");
      },
      games(okayCB) {
        options.offset = options.offset || this.state.gameRequestOffset;
        return this.makeRequest(okayCB, "games");
      },
      makeRequest(okayCB, path) {
        return new Promise((resolve, reject) => {
          let requestURL = `${baseURL}${path}?`;
          Object.keys(options).map(key => {
            let value = options[key];
            requestURL += `${key}=${value}&`
          });
          requestURL.replace(/&$/, "");
          ajax({
            url: requestURL,
            success(data) {
              data = JSON.parse(data);
              resolve(data);
              if(typeof okayCB === "function") okayCB(data);
            },
            error(error) {
              console.error(error);
            }
          })
        });
      }
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
    if(!Object.keys(authData).length) {
      authData = null;
    }
    console.log(authData);
    this.setState({
      authData
    });
    window.location.hash = "";
  },
  render() {
    const {
      authData
    } = this.state;
    let url = "https://api.twitch.tv/kraken/oauth2/authorize"+
    "?response_type=token"+
    "&client_id=cye2hnlwj24qq7fezcbq9predovf6yy"+
    "&redirect_uri=http://localhost:8080"+
    "&scope=user_read;";
    return (
      <div>
        <nav>
          <div>
            <Link className="nav-item" to={"/"}>Home</Link>
            {
              authData && authData.access_token ? (
                <Link className="nav-item" to={"/profile"}>Profile</Link>
              ) : (
                <a className="nav-item login" href={url}>Login to Twitch</a>
              )
            }
          </div>
        </nav>
        <Home parent={this} auth={authData} methods={{
          loadData: this.loadData
        }}/>
      </div>
    )
  }
});
