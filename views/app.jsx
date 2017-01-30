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
  // console.log("check auth", props);
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
      if (props.params.username) {
        return _react2["default"].createElement(Component, props);
      } else {
        _reactRouter.browserHistory.push("/");
        return null;
      }
    }
  }
}
_jsxLayoutJsx2["default"].prototype.setNewState = function () {
  console.log(this);
  return this;
};
console.log(_jsxLayoutJsx2["default"]);
_reactDom.render.call({
  thisIsGlobal: true
}, _react2["default"].createElement(
  _reactRouter.Router,
  { history: _reactRouter.browserHistory },
  _react2["default"].createElement(
    _reactRouter.Route,
    { foooolish: true, path: "", page: "root", component: _jsxLayoutJsx2["default"] },
    _react2["default"].createElement(_reactRouter.Route, { path: "/", page: "home", component: _jsxHomeJsx2["default"] }),
    _react2["default"].createElement(_reactRouter.Route, { path: "/profile(/:username(/:q/:postID))", page: "profile", component: checkAuth.bind(null, _jsxProfileJsx2["default"]) }),
    _react2["default"].createElement(_reactRouter.Route, { path: "/:page", page: "streams", component: _jsxGeneralPageJsx2["default"] }),
    _react2["default"].createElement(_reactRouter.Route, { path: "/:page", page: "games", component: _jsxGeneralPageJsx2["default"] }),
    _react2["default"].createElement(_reactRouter.Route, { path: "/search/:searchtype", page: "search", component: _jsxSearchJsx2["default"] })
  )
), container);