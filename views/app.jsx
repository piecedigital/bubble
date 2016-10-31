"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactRouter = require('react-router');

var _jsxLayoutJsx = require("./jsx/layout.jsx");

var _jsxLayoutJsx2 = _interopRequireDefault(_jsxLayoutJsx);

var _jsxHomeJsx = require("./jsx/home.jsx");

var _jsxHomeJsx2 = _interopRequireDefault(_jsxHomeJsx);

var _jsxProfileJsx = require("./jsx/profile.jsx");

var _jsxProfileJsx2 = _interopRequireDefault(_jsxProfileJsx);

var _jsxGeneralPageJsx = require("./jsx/general-page.jsx");

var _jsxGeneralPageJsx2 = _interopRequireDefault(_jsxGeneralPageJsx);

var _jsxSearchJsx = require("./jsx/search.jsx");

var _jsxSearchJsx2 = _interopRequireDefault(_jsxSearchJsx);

var container = document.querySelector(".react-app");

function checkAuth(Component, props) {
  console.log("check auth", props.auth);
  if (props.auth !== null) {
    if (props.auth.access_token) {
      return _react2["default"].createElement(Component, props);
    } else {
      _reactRouter.browserHistory.push("/");
      return null;
    }
  } else {
    if (document.cookie.match(/access_token/g)) {
      return _react2["default"].createElement(
        "span",
        null,
        "Validating authorization..."
      );
    } else {
      _reactRouter.browserHistory.push("/");
      return null;
    }
  }
}
(0, _reactDom.render)(_react2["default"].createElement(
  _reactRouter.Router,
  { history: _reactRouter.browserHistory },
  _react2["default"].createElement(
    _reactRouter.Route,
    { path: "", location: "root", component: _jsxLayoutJsx2["default"] },
    _react2["default"].createElement(_reactRouter.Route, { path: "/", location: "home", component: _jsxHomeJsx2["default"] }),
    _react2["default"].createElement(_reactRouter.Route, { path: "/profile", location: "profile", component: checkAuth.bind(null, _jsxProfileJsx2["default"]) }),
    _react2["default"].createElement(_reactRouter.Route, { path: "/:page", location: "streams", component: _jsxGeneralPageJsx2["default"] }),
    _react2["default"].createElement(_reactRouter.Route, { path: "/:page", location: "games", component: _jsxGeneralPageJsx2["default"] }),
    _react2["default"].createElement(_reactRouter.Route, { path: "/search/:searchtype", location: "search", component: _jsxSearchJsx2["default"] })
  )
), container);