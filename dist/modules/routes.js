"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _renderJsx = require("./render-jsx");

var app = (0, _express2["default"])();

app.get("/", function (req, res) {
  res.send((0, _renderJsx.renderHTML)("home"));
}).get("/get-test-data", function (req, res) {
  res.json({
    title: "Burst or Blow | Bubble",
    who: "WORLD"
  });
});

exports["default"] = app;
module.exports = exports["default"];