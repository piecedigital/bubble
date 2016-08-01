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
      authData: (this.props.data && this.props.data.authData) || null
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
          <Link className="nav-item" to={"/"}>Home</Link>
          {
            authData && authData.access_token ? (
              <Link className="nav-item" to={"/profile"}>Profile</Link>
            ) : (
              <a className="nav-item login" href={url}>Login to Twitch</a>
            )
          }
        </nav>
        <Home auth={authData}/>
      </div>
    )
  }
});
