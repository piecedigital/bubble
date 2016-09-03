import React from "react";
import { render } from "react-dom";
import { Router, Route, Link, browserHistory as History } from 'react-router';
import Layout from "./jsx/layout.jsx";
import Home from "./jsx/home.jsx";
import Profile from "./jsx/profile.jsx";
import GeneralPage from "./jsx/general-page.jsx";
import SearchPage from "./jsx/search.jsx";

const container = document.querySelector(".react-app");

function checkAuth(Component, props) {
  if(props.auth) {
    if(props.auth.access_token) {
      return (<Component {...props} />);
    } else {
      History.push("/");
      return null;
    }
  } else {
    return (<span>Validating authorization...</span>);
  }
}
render((
  <Router history={History}>
    <Route path="" location="root" component={Layout}>
      <Route path="/" location="home" component={Home}>
      </Route>
      <Route path="/profile" location="profile" component={checkAuth.bind(null, Profile)}>
      </Route>
      <Route path="/:page" location="streams" component={GeneralPage}>
      </Route>
      <Route path="/:page" location="games" component={GeneralPage}>
      </Route>
      <Route path="/search/:searchtype" location="search" component={SearchPage}>
      </Route>
    </Route>
  </Router>
), container);
