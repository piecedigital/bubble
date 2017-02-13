"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _expressSubdomain = require("express-subdomain");

var _expressSubdomain2 = _interopRequireDefault(_expressSubdomain);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _cookieParser = require("cookie-parser");

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _modulesServerRoutes = require("./modules/server/routes");

var _modulesServerRoutes2 = _interopRequireDefault(_modulesServerRoutes);

var _modulesServerSubdomainRoutes = require("./modules/server/subdomain-routes");

var _modulesServerSubdomainRoutes2 = _interopRequireDefault(_modulesServerSubdomainRoutes);

var _logOut = require("./log-out");

console.log("Environment:", process.env["NODE_ENV"]);
console.log("App version:", process.env["V_MAJOR"] + "." + process.env["V_MINOR"] + "." + process.env["V_PATCH"]);

var app = (0, _express2["default"])();
var PORT = process.env["PORT"] || 8080;

app.use(_express2["default"]["static"](_path2["default"].join(__dirname, "public")));
app.use((0, _cookieParser2["default"])());
// app.use(subdomain("www", routes));
// app.use(subdomain("twinchill", routes));
// app.use(subdomain("amorrius", routes));
// app.use(subdomain("localhost", routes));
// app.use(subdomain("*.amorrius", subdomainRoutes));
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