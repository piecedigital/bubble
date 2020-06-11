"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _https = require("https");

var _https2 = _interopRequireDefault(_https);

var _renderJsx = require("./render-jsx");

var app = (0, _express2["default"])();

app.get("/", function (req, res) {
  var subdomain = req.headers.host.match(/^([a-z0-9]*)/i)[1];

  console.log("Sub Domain:", subdomain);
  res.send("Sub Domain Test: " + subdomain);
});

exports["default"] = app;
module.exports = exports["default"];