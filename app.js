"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _https = require("https");

var _https2 = _interopRequireDefault(_https);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _cookieParser = require("cookie-parser");

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _modulesServerSubdomain = require("./modules/server/subdomain");

var _modulesServerSubdomain2 = _interopRequireDefault(_modulesServerSubdomain);

var _modulesServerRoutes = require("./modules/server/routes");

var _modulesServerRoutes2 = _interopRequireDefault(_modulesServerRoutes);

var _modulesServerSubdomainRoutes = require("./modules/server/subdomain-routes");

var _modulesServerSubdomainRoutes2 = _interopRequireDefault(_modulesServerSubdomainRoutes);

var _logOut = require("./log-out");

require("newrelic");

console.log("Environment:", process.env["NODE_ENV"]);
console.log("App version:", process.env["V_MAJOR"] + "." + process.env["V_MINOR"] + "." + process.env["V_PATCH"]);

var app = (0, _express2["default"])();
var PORT = process.env["PORT"] || 8080;

// // let's encrypt
var letsEncryptReponse = process.env.CERTBOT_RESPONSE;
var letsEncryptReponse2 = process.env.CERTBOT_RESPONSE2;
//
// // Return the Let's Encrypt certbot response:
app.get('/.well-known/acme-challenge/:content', function (req, res) {
  if (req.headers.host.match("www")) {
    // www.amorrius.net
    console.log("challenge", req.headers.host);
    res.send(letsEncryptReponse2);
  } else {
    // amorrius.net
    console.log("challenge", req.headers.host);
    res.send(letsEncryptReponse);
  }
});
// // end let's encrypt

app.use(_express2["default"]["static"](_path2["default"].join(__dirname, "public")));
app.use((0, _cookieParser2["default"])());
app.use((0, _modulesServerSubdomain2["default"])({
  whiteList: ["amorrius.dev", "amorrius.net"],
  blackList: ["www", "twinchill"]
}, _modulesServerSubdomainRoutes2["default"]));
app.use(_modulesServerRoutes2["default"]);

app.listen(PORT);

(0, _logOut.logOut)("Listening on port " + PORT, true);

process.on('uncaughtException', function (err) {
  (0, _logOut.logOut)("**Uncaught Exception event**", true, {
    type: "error"
  });
  (0, _logOut.logOut)(err, true, {
    type: "error"
  });
});