"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _modulesRoutes = require("./modules/routes");

var _modulesRoutes2 = _interopRequireDefault(_modulesRoutes);

var _logOut = require("./log-out");

var app = (0, _express2["default"])();
app.use(_modulesRoutes2["default"]);
var PORT = process.env["PORT"] || 8080;

app.listen(PORT);
// console.log(__dirname);
(0, _logOut.logOut)("Listening on port " + PORT, true);