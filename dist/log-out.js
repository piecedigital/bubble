"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var logOut = function logOut(message, logIt) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {
    type: ""
  } : arguments[2];
  var type = options.type;

  var time = "[" + new Date().toUTCString() + "]";
  var milTime = "[" + new Date().getTime() + "]";
  var error = "[" + (type || "0") + "]";
  var msg = "[" + (message.message || message) + "]";
  var outMessage = milTime + " " + time + " " + error + " " + msg + "\r\n";

  new Promise(function (resolve, reject) {
    _fs2["default"].stat(__dirname + "/logs/", function (err, stats) {
      if (stats && stats.isDirectory()) {
        resolve(true);
      } else {
        _fs2["default"].mkdir(__dirname + "/logs", function () {
          resolve(true);
        });
      }
    });
  }).then(function (e) {
    var location = "default.log";
    switch (type) {
      case "error":
        location = "errors.log";
        break;
      default:
        location = "default.log";
    }
    new Promise(function (resolve, reject) {
      _fs2["default"].stat(__dirname + "/logs/" + location, function (err, stats) {
        if (stats && stats.isFile()) {
          resolve(true);
        } else {
          _fs2["default"].writeFile(__dirname + "/logs/" + location, "milliseconds;time;error;message\r\n\r\n", function (err) {
            if (err) return reject(err);
            resolve(true);
          });
        }
      });
    }).then(function (exists) {
      if (exists) {
        _fs2["default"].appendFile(__dirname + "/logs/" + location, outMessage, function (err) {
          if (err) console.error(new Error(e).stack);
        });
      }
      if (logIt) {
        switch (type) {
          case "error":
            console.error(new Error(outMessage).stack);
            break;
          default:
            console.log(outMessage);

        }
      }
    })["catch"](function (e) {
      return console.error(e.stack || new Error(e).stack);
    });
  })["catch"](function (e) {
    return console.error(e.stack || new Error(e).stack);
  });
};
exports.logOut = logOut;