"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDomServer = require("react-dom/server");

var _reactDomServer2 = _interopRequireDefault(_reactDomServer);

var renderHTML = function renderHTML(fileName) {
  var prePlaceData = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  prePlaceData.title = prePlaceData.title || "Q&A Aggregator for Twitch streamers | TwiQuA";
  var Layout = require("../views/jsx/layout.jsx");
  var Page = require("../views/jsx/" + fileName + ".jsx");

  var data = _reactDomServer2["default"].renderToStaticMarkup(_react2["default"].createElement(
    "html",
    null,
    _react2["default"].createElement(
      "head",
      null,
      _react2["default"].createElement("meta", { charSet: "utf-8" }),
      _react2["default"].createElement("meta", { httpEquiv: "Content-Type", content: "text/html", charSet: "UTF-8" }),
      _react2["default"].createElement("meta", { name: "language", content: "en-us" }),
      _react2["default"].createElement("meta", { name: "publisher", content: "Piece Digital Studios" }),
      _react2["default"].createElement("meta", { name: "classification", content: "multistream, multiple stream, multiple broadcast viewing, question and answer aggregation" }),
      _react2["default"].createElement("meta", { property: "og:description", content: "Watch your favorite Twitch.tv livestreams, multistream various Twitch streams, and aggregate questions for a great Q&A session." }),
      _react2["default"].createElement("link", { rel: "stylesheet", href: "/css/style.css", media: "screen", title: "no title", charSet: "utf-8" }),
      _react2["default"].createElement("link", { rel: "shortcut icon", type: "image/x-icon", href: "/media/logo-ico.ico" }),
      _react2["default"].createElement("link", { rel: "apple-touch-icon", type: "image/x-icon", href: "/media/logo-ico.ico" }),
      _react2["default"].createElement(
        "title",
        null,
        prePlaceData.title
      )
    ),
    _react2["default"].createElement(
      "body",
      null,
      _react2["default"].createElement(
        "div",
        { className: "react-app" },
        _react2["default"].createElement(
          Layout,
          prePlaceData,
          _react2["default"].createElement(Page, null)
        )
      ),
      _react2["default"].createElement("script", { src: "/js/bundle" + (process.env["NODE_ENV"] === "prod" ? "-live" : "") + ".js" })
    )
  ));
  return "<!DOCTYPE html>" + data;
};
exports.renderHTML = renderHTML;
// console.log(renderHTML("home"));

// <meta name="creator" content="Darryl Dixon, Piece Digital" />
// <meta name="robots" content="index, follow" />
// <meta name="revisit-after" content="21 days" />
// <meta property="og:url" content="http://piecedigital.net/"/>
// <meta property="og:title" content="Piece Digital"/>
// <meta property="og:image" content="http://piecedigital.net/public/images/1logo.png"/>
// <meta property="og:site_name" content="Piece Digital Studios"/>