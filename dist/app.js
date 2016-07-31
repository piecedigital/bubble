"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _modulesRoutes = require("./modules/routes");

var _modulesRoutes2 = _interopRequireDefault(_modulesRoutes);

var _logOut = require("./log-out");

var app = (0, _express2["default"])();
app.use(_express2["default"]["static"](_path2["default"].join(__dirname, "public")));
app.use(_modulesRoutes2["default"]);
var PORT = process.env["PORT"] || 8080;

app.listen(PORT);
(0, _logOut.logOut)("Listening on port " + PORT, true);