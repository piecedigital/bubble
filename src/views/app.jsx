import React from "react";
import { render } from "react-dom";
import { Router, Route, Link, browserHistory as History } from 'react-router';
import Layout from "./jsx/layout.jsx";
import Profile from "./jsx/profile.jsx";

const container = document.querySelector(".react-app");

render((
  <Router history={History}>
    <Route path="/" component={Layout}>
      <Route path="/profile" component={Profile}>
      </Route>
    </Route>
  </Router>
), container);
