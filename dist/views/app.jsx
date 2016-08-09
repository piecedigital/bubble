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

var _jsxSearchJsx = require("./jsx/search.jsx");

var _jsxSearchJsx2 = _interopRequireDefault(_jsxSearchJsx);

var container = document.querySelector(".react-app");

(0, _reactDom.render)(_react2["default"].createElement(
  _reactRouter.Router,
  { history: _reactRouter.browserHistory },
  _react2["default"].createElement(
    _reactRouter.Route,
    { path: "", location: "root", component: _jsxLayoutJsx2["default"] },
    _react2["default"].createElement(_reactRouter.Route, { path: "/", location: "home", component: _jsxHomeJsx2["default"] }),
    _react2["default"].createElement(_reactRouter.Route, { path: "/profile", location: "profile", component: _jsxProfileJsx2["default"] }),
    _react2["default"].createElement(_reactRouter.Route, { path: "/search/:searchtype", location: "search", component: _jsxSearchJsx2["default"] })
  )
), container);