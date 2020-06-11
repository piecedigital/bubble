"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (_ref, routes) {
  var whiteList = _ref.whiteList;
  var blackList = _ref.blackList;

  return function (req, res, next) {
    var blackListClear = true;

    var host = req.headers.host;

    var whiteListCheck = whiteList.map(function (str) {
      var regMatch = new RegExp("(.)?" + str + "$", "i");
      host = host.replace(regMatch, "");
      console.log(host);
    });

    var subdomainExists = !!host;
    var blackListCheck = blackList.map(function (str) {
      var regMatch = new RegExp("" + str, "i");
      var theMatch = !!host.match(regMatch);
      return theMatch;
    });

    if (blackListCheck.indexOf(true) > -1) blackListClear = false;

    if (subdomainExists && blackListClear) {
      console.log("headed to subdomain:", host);
      return routes(req, res, next);
    } else {
      next();
    }
  };
};

module.exports = exports["default"];