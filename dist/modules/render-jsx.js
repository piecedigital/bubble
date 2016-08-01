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
  var prePlaceData = arguments.length <= 1 || arguments[1] === undefined ? {
    title: "Burst or Blow | Bubble",
    who: "WORLD"
  } : arguments[1];

  console.log(prePlaceData);
  var Layout = require("../views/jsx/layout.jsx");
  var Page = require("../views/jsx/" + fileName + ".jsx");

  var data = _reactDomServer2["default"].renderToStaticMarkup(_react2["default"].createElement(
    "html",
    null,
    _react2["default"].createElement(
      "head",
      null,
      _react2["default"].createElement("meta", { charSet: "utf-8" }),
      _react2["default"].createElement("link", { rel: "stylesheet", href: "/css/style.css", media: "screen", title: "no title", charSet: "utf-8" }),
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
          { data: prePlaceData },
          _react2["default"].createElement(Page, null)
        )
      ),
      _react2["default"].createElement("script", { src: "/js/bundle.js" })
    )
  ));
  return "<!DOCTYPE html>" + data;
};
exports.renderHTML = renderHTML;
// console.log(renderHTML("home"));