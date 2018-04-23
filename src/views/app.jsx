import React from "react";
import { render } from "react-dom";
import { Router, Redirect, Route, Link, browserHistory as History } from 'react-router';
import Layout from "./jsx/layout.jsx";
import Home from "./jsx/home.jsx";
import SpitBackAuth from "./jsx/spit-back-auth.jsx";
import About from "./jsx/about.jsx";
import TOS from "./jsx/tos.jsx";
import Profile from "./jsx/profile.jsx";
import Multistream from "./jsx/multistream.jsx";
import SyncPlayer from "./jsx/sync-player.jsx";
import GeneralPage from "./jsx/general-page.jsx";
import SearchPage from "./jsx/search.jsx";

const container = document.querySelector(".react-app");

// unused. keeping for possible future usage
function checkAuth(Component, props) {
  // console.log("check auth", props);
  if(props.auth !== null) {
    if(props.auth.access_token) {
      return (<Component {...props} />);
    } else {
      History.push("/");
      return null;
    }
  } else {
    if(document.cookie.match(/access_token/g)) {
      return (<span>Validating authorization...</span>);
    } else {
      if(props.params.username) {
        return (<Component {...props} />);
      } else {
        History.push("/");
        return null;
      }
    }
  }
}

render((
  <Router history={History}>
    <Route path="" page="root" component={Layout}>
      <Route path="/" page="home" component={Home}/>
      <Route path="/spit-back-auth" page="about" component={SpitBackAuth}/>
      <Route path="/about" page="about" component={About}/>
      <Route path="/tos" page="about" component={TOS}/>
      <Route path="/terms" page="about" component={TOS}/>
      <Route path="/terms-of-service" page="about" component={TOS}/>
      <Route path="/p/:username(/:q/:postID)" page="profile" component={Profile}/>
      <Route path="/profile/:username(/:q/:postID)" page="profile" component={Profile}/>
      <Route path="/search(/:searchtype)" page="search" component={SearchPage}/>
      <Route path="/multistream(/:stream1)(/:stream2)(/:stream3)(/:stream4)(/:stream5)(/:stream6)" page="multistream" component={Multistream}/>
      <Route path="/sync-player(/:lobbyID)" page="sync-player" component={SyncPlayer}/>
      <Route path="/:page" page="general" component={GeneralPage}/>
    </Route>
  </Router>
), container);
