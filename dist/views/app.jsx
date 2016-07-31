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

var container = document.querySelector(".react-app");

(0, _reactDom.render)(_react2["default"].createElement(
  _reactRouter.Router,
  { history: _reactRouter.browserHistory },
  _react2["default"].createElement(_reactRouter.Route, { path: "/", component: _jsxLayoutJsx2["default"] })
), container);