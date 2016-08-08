"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactRouter = require('react-router');

var _jsxLayoutJsx = require("./jsx/layout.jsx");

var _jsxLayoutJsx2 = _interopRequireDefault(_jsxLayoutJsx);

var _jsxProfileJsx = require("./jsx/profile.jsx");

var _jsxProfileJsx2 = _interopRequireDefault(_jsxProfileJsx);

var container = document.querySelector(".react-app");

(0, _reactDom.render)(_react2["default"].createElement(
  _reactRouter.Router,
  { history: _reactRouter.browserHistory },
  _react2["default"].createElement(
    _reactRouter.Route,
    { path: "/", location: "home", component: _jsxLayoutJsx2["default"] },
    _react2["default"].createElement(_reactRouter.Route, { path: "/profile", location: "profile", component: _jsxProfileJsx2["default"] })
  )
), container);