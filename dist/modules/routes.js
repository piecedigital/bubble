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
  res.send((0, _renderJsx.renderHTML)("home", {
    auth: {
      access_token: req.cookies["access_token"]
    }
  }));
}).get("/search/:searchtype", function (req, res) {
  res.send((0, _renderJsx.renderHTML)("profile"));
}).get("/profile", function (req, res) {
  res.send((0, _renderJsx.renderHTML)("profile"));
}).get("/get-test-data", function (req, res) {
  res.json({
    title: "Burst or Blow | Bubble",
    who: "WORLD"
  });
}).get("*", function (req, res) {
  res.status(404).send("not found");
});

exports["default"] = app;
module.exports = exports["default"];