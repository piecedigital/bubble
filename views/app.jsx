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

var _jsxSpitBackAuthJsx = require("./jsx/spit-back-auth.jsx");

var _jsxSpitBackAuthJsx2 = _interopRequireDefault(_jsxSpitBackAuthJsx);

var _jsxAboutJsx = require("./jsx/about.jsx");

var _jsxAboutJsx2 = _interopRequireDefault(_jsxAboutJsx);

var _jsxTosJsx = require("./jsx/tos.jsx");

var _jsxTosJsx2 = _interopRequireDefault(_jsxTosJsx);

var _jsxProfileJsx = require("./jsx/profile.jsx");

var _jsxProfileJsx2 = _interopRequireDefault(_jsxProfileJsx);

var _jsxMultistreamJsx = require("./jsx/multistream.jsx");

var _jsxMultistreamJsx2 = _interopRequireDefault(_jsxMultistreamJsx);

var _jsxSyncLobbyJsx = require("./jsx/sync-lobby.jsx");

var _jsxSyncLobbyJsx2 = _interopRequireDefault(_jsxSyncLobbyJsx);

var _jsxGeneralPageJsx = require("./jsx/general-page.jsx");

var _jsxGeneralPageJsx2 = _interopRequireDefault(_jsxGeneralPageJsx);

var _jsxSearchJsx = require("./jsx/search.jsx");

var _jsxSearchJsx2 = _interopRequireDefault(_jsxSearchJsx);

var container = document.querySelector(".react-app");

// unused. keeping for possible future usage
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

(0, _reactDom.render)(_react2["default"].createElement(
  _reactRouter.Router,
  { history: _reactRouter.browserHistory },
  _react2["default"].createElement(
    _reactRouter.Route,
    { path: "", page: "root", component: _jsxLayoutJsx2["default"] },
    _react2["default"].createElement(_reactRouter.Route, { path: "/", page: "home", component: _jsxHomeJsx2["default"] }),
    _react2["default"].createElement(_reactRouter.Route, { path: "/spit-back-auth", page: "about", component: _jsxSpitBackAuthJsx2["default"] }),
    _react2["default"].createElement(_reactRouter.Route, { path: "/about", page: "about", component: _jsxAboutJsx2["default"] }),
    _react2["default"].createElement(_reactRouter.Route, { path: "/tos", page: "about", component: _jsxTosJsx2["default"] }),
    _react2["default"].createElement(_reactRouter.Route, { path: "/terms", page: "about", component: _jsxTosJsx2["default"] }),
    _react2["default"].createElement(_reactRouter.Route, { path: "/terms-of-service", page: "about", component: _jsxTosJsx2["default"] }),
    _react2["default"].createElement(_reactRouter.Route, { path: "/p/:username(/:q/:postID)", page: "profile", component: _jsxProfileJsx2["default"] }),
    _react2["default"].createElement(_reactRouter.Route, { path: "/profile/:username(/:q/:postID)", page: "profile", component: _jsxProfileJsx2["default"] }),
    _react2["default"].createElement(_reactRouter.Route, { path: "/search(/:searchtype)", page: "search", component: _jsxSearchJsx2["default"] }),
    _react2["default"].createElement(_reactRouter.Route, { path: "/multistream(/:stream1)(/:stream2)(/:stream3)(/:stream4)(/:stream5)(/:stream6)", page: "multistream", component: _jsxMultistreamJsx2["default"] }),
    _react2["default"].createElement(_reactRouter.Route, { path: "/sync-lobby(/:lobbyID)", page: "sync-lobby", component: _jsxSyncLobbyJsx2["default"] }),
    _react2["default"].createElement(_reactRouter.Route, { path: "/:page", page: "general", component: _jsxGeneralPageJsx2["default"] })
  )
), container);