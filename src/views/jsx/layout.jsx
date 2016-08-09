import React from "react";
import Player from "./components/player.jsx";
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
function loadData(errorCB, options = {}) {
  options = Object.assign({}, options);
  options.stream_type = options.stream_type || "live";
  options.limit = options.limit || 20;
  let baseURL = "https://api.twitch.tv/kraken/";
  const makeRequest = function(okayCB, path) {
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
  };
  return new Promise((resolve, reject) => {
    resolve({
      featured: (okayCB) => {
        // console.log(this);
        options.limit = 25;
        options.offset = 0;
        return makeRequest(okayCB, "streams/featured");
      },
      topGames: (okayCB) => {
        // console.log(this);
        options.offset = options.offset || this.state.requestOffset;
        return makeRequest(okayCB, "games/top");
      },
      getUser: (okayCB, username) => {
        delete options.stream_type;
        delete options.limit;
        return makeRequest(okayCB, `users/${username}`);
      },
      followedStreams: (okayCB) => {
        options.offset = options.offset || this.state.requestOffset;
        return makeRequest(okayCB, "search/followed");
      },
      followedVideos: (okayCB) => {
        options.offset = options.offset || this.state.requestOffset;
        return makeRequest(okayCB, "videos/followed");
      },
      searchChannels: (okayCB) => {
        options.offset = options.offset || this.state.requestOffset;
        return makeRequest(okayCB, "search/channels");
      },
      searchStreams: (okayCB) => {
        options.offset = options.offset || this.state.requestOffset;
        return makeRequest(okayCB, "search/streams");
      },
      searchGames: (okayCB) => {
        options.offset = options.offset || this.state.requestOffset;
        return makeRequest(okayCB, "search/games");
      }
    });
  });
};

export default React.createClass({
  displayName: "Layout",
  getInitialState() {
    return {
      authData: (this.props.data && this.props.data.authData) || null,
      streamersInPlayer: {}
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
      authData,
      streamersInPlayer: dataObject
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
        {
          <Player data={{
            dataObject
          }} methods={{
            spliceStream: this.spliceStream
          }}/>
        }
        {
          this.props.children ? (
            React.cloneElement(this.props.children, {
              parent: this,
              auth: authData,
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
