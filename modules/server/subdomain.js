"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (_ref, routes) {
  var whiteList = _ref.whiteList;
  var blackList = _ref.blackList;

  return function (req, res, next) {
    var blackListClear = true;

    // console.log(req.headers);
    var host = req.headers.host;

    // console.log("\n\r\n\r");
    // console.log("host", host);

    var whiteListCheck = whiteList.map(function (str) {
      var regMatch = new RegExp("(.)?" + str + "$", "i");
      host = host.replace(regMatch, "");
      // console.log("regMatch", regMatch);
    });
    // console.log("new host", `"${host}"`);

    var subdomainExists = !!host;
    // console.log("subdomain exists", subdomainExists);
    // console.log("blacklist checking");
    var blackListCheck = blackList.map(function (str) {
      var regMatch = new RegExp("" + str, "i");
      var theMatch = !!host.match(regMatch);
      // console.log("regMatch", regMatch);
      // console.log("theMatch", theMatch);
      return theMatch;
    });
    // console.log(blackListCheck);
    if (blackListCheck.indexOf(true) > -1) blackListClear = false;
    // console.log("blacklist clear", blackListClear);

    if (subdomainExists && blackListClear) {
      // console.log("lists cleared");
      console.log("headed to subdomain:", host);
      return routes(req, res, next);
    } else {
      // console.log("normal routes");
      next();
    }
  };
};

module.exports = exports["default"];