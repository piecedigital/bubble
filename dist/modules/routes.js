"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _renderJsx = require("./render-jsx");

var _https = require("https");

var _https2 = _interopRequireDefault(_https);

var app = (0, _express2["default"])();

app.get("/", function (req, res) {
  res.send((0, _renderJsx.renderHTML)("home", {
    auth: {
      access_token: req.cookies["access_token"]
    }
  }));
}).get("/search/:searchtype", function (req, res) {
  res.send((0, _renderJsx.renderHTML)("search", {
    query: {
      q: req.query.q || req.query.query
    }
  }));
}).get("/profile", function (req, res) {
  res.send((0, _renderJsx.renderHTML)("profile"));
}).get("/profile/:username", function (req, res) {
  res.send((0, _renderJsx.renderHTML)("profile", {
    username: req.params.username
  }));
}).get("/streams", function (req, res) {
  res.send((0, _renderJsx.renderHTML)("general-page", {
    page: "streams"
  }));
}).get("/games", function (req, res) {
  res.send((0, _renderJsx.renderHTML)("general-page", {
    page: "games"
  }));
}).get("/get-test-data", function (req, res) {
  res.json({
    title: "Burst or Blow | Bubble",
    who: "WORLD"
  });
}).get("/get-panels/:username", function (req, res) {
  // https://api.twitch.tv/api/channels/${username}/panels`
  var options = {
    host: "api.twitch.tv",
    port: 443,
    path: "/api/channels/" + req.params.username + "/panels?client_id=" + req.query.client_id,
    method: "GET"
  };

  var req = _https2["default"].request(options, function (XHRResponse) {
    // console.log("statusCode: ", XHRResponse.statusCode);
    // console.log("headers: ", XHRResponse.headers);

    var buffer = "";

    XHRResponse.on('data', function (d) {
      buffer += d;
    });
    XHRResponse.on("end", function () {
      // console.log("res end", buffer);
      res.send(buffer);
    });
  });
  req.end();

  req.on('error', function (e) {
    console.error(e);
  });

  // console.log("getting panels for:", req.params.username);
  // res.send(["test"]);
}).get("*", function (req, res) {
  res.status(404).send("not found");
});

exports["default"] = app;
module.exports = exports["default"];