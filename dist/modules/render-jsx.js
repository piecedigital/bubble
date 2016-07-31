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

  var Layout = require("../views/jsx/layout.jsx");
  var Page = require("../views/jsx/" + fileName + ".jsx");

  var data = _reactDomServer2["default"].renderToString(_react2["default"].createElement(
    Layout,
    { data: prePlaceData },
    _react2["default"].createElement(Page, { data: prePlaceData })
  ));
  return "<!DOCTYPE html><html><head><meta charSet=\"utf-8\" /><title>" + prePlaceData.title + "</title></head><body><div class=\"react-app\">" + data + "</div><script src=\"/js/bundle.js\"></script></body></html>";
};
exports.renderHTML = renderHTML;
// console.log(renderHTML("home"));