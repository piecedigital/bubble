"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _https = require("https");

var _https2 = _interopRequireDefault(_https);

var _renderJsx = require("./render-jsx");

var _firebaseConfig = require("./firebase-config");

var _clientLoadData = require("../client/load-data");

var _clientLoadData2 = _interopRequireDefault(_clientLoadData);

var app = (0, _express2["default"])();
var fireRef = undefined;
try {
  fireRef = (0, _firebaseConfig.initFirebase)();
} catch (e) {
  console.error("error initializing firebase", e.stack);
}
app
// .get("*", function (req, res, next) {
//   console.log(req.url);
//   next();
// })
.get("/", function (req, res) {
  var initState = {
    layout: {
      fireRef: true, // to get a certain compunent to render with truthiness
      versionData: {
        major: process.env["V_MAJOR"],
        minor: process.env["V_MINOR"],
        patch: process.env["V_PATCH"]
      }
    }
  };

  new Promise(function (resolve, reject) {
    fireRef.answersRef.orderByKey().limitToLast(10).once("value").then(function (snap) {
      var answers = snap.val();
      initState.userQuestions = {};
      initState.userQuestions.answers = answers;
      Object.keys(answers).map(function (questionID, ind, arr) {
        fireRef.questionsRef.child(questionID).once("value").then(function (snap) {
          var questionData = snap.val();
          initState.userQuestions.questions = initState.userQuestions.questions || {};
          initState.userQuestions.questions[questionID] = questionData;
          if (ind === arr.length - 1) resolve(initState);
        });
      });
    });
  }).then(function (initState) {
    res.send((0, _renderJsx.renderHTML)("home", {
      auth: {
        access_token: req.cookies["access_token"]
      },
      initState: initState
    }));
  });
}).get("/spit-back-auth", function (req, res) {
  res.send((0, _renderJsx.renderHTML)("spit-back-auth"));
}).get("/about", function (req, res) {
  res.send((0, _renderJsx.renderHTML)("about"));
}).get("/tos", function (req, res) {
  res.redirect("/terms-of-service");
}).get("/terms", function (req, res) {
  res.redirect("/terms-of-service");
}).get("/terms-of-service", function (req, res) {
  console.log("git him");
  res.send((0, _renderJsx.renderHTML)("tos"));
}).get("/search/:searchtype?", function (req, res) {
  res.send((0, _renderJsx.renderHTML)("search", {
    location: {
      query: {
        q: req.query.q || req.query.query
      }
    }
  }));
}).get(["/p", "/profile"], function (req, res) {
  res.redirect("/");
}).get("/p/:username", function (req, res) {
  res.redirect("/profile/" + req.params.username);
}).get("/p(rofile)?/:username", function (req, res) {
  var _this = this;

  var prePlaceData = {
    fireRef: fireRef,
    params: {
      username: req.params.username
    }
  };

  // get user data
  _clientLoadData2["default"].call(this, function (e) {
    console.error(e.stack);
  }, {
    username: req.params.username.toLowerCase()
  }). // access_token: authData.access_token,
  then(function (methods) {
    methods.getUserByName().then(function (data) {
      // console.log("user data:", data);
      prePlaceData.title = data.display_name + "'s profile | Amorrius";
      prePlaceData.image = data.logo;
      prePlaceData.description = data.bio;

      // prePlaceData.title = data.display_name + "'s profile | Amorrius";
      prePlaceData.userData = data;

      // get channel data
      _clientLoadData2["default"].call(_this, function (e) {
        console.error(e.stack);
      }, {
        username: req.params.username.toLowerCase()
      }). // access_token: authData.access_token,
      then(function (methods) {
        methods.getChannelByName().then(function (data2) {
          // console.log("channel data:", data);

          // prePlaceData.title = data.display_name + "'s profile | Amorrius";
          prePlaceData.channelData = data2;
          res.send((0, _renderJsx.renderHTML)("profile", prePlaceData));
        })["catch"](function (e) {
          console.error(e.stack || e);
          res.send((0, _renderJsx.renderHTML)("profile", prePlaceData));
        });
      })["catch"](function (e) {
        console.error(e.stack || e);
        res.send((0, _renderJsx.renderHTML)("profile", prePlaceData));
      });
    })["catch"](function (e) {
      console.error(e.stack || e);
      res.send((0, _renderJsx.renderHTML)("profile", prePlaceData));
    });
  })["catch"](function (e) {
    console.error(e.stack || e);
    res.send((0, _renderJsx.renderHTML)("profile", prePlaceData));
  });
}).get("/p(rofile)?/:username/:q/:questionID", function (req, res) {
  var prePlaceData = {
    fireRef: fireRef,
    params: {
      username: req.params.username
    }
  };

  _clientLoadData2["default"].call(this, function (e) {
    console.error(e.stack);
  }, {
    username: req.params.username.toLowerCase()
  }). // access_token: authData.access_token,
  then(function (methods) {
    methods.getUserByName().then(function (data) {
      // console.log("channel data:", data);
      prePlaceData.title = data.display_name + "'s profile | Amorrius";
      prePlaceData.image = data.logo;
      prePlaceData.description = data.bio;

      // prePlaceData.title = data.display_name + "'s profile | Amorrius";
      prePlaceData.params.userData = data;
      res.send((0, _renderJsx.renderHTML)("profile", prePlaceData));
    })["catch"](function (e) {
      console.error(e.stack || e);
      res.send((0, _renderJsx.renderHTML)("profile", prePlaceData));
    });
  })["catch"](function (e) {
    console.error(e.stack || e);
    res.send((0, _renderJsx.renderHTML)("profile", prePlaceData));
  });
}).get("/streams", function (req, res) {
  res.send((0, _renderJsx.renderHTML)("general-page", {
    params: {
      page: "streams"
    }
  }));
}).get("/games", function (req, res) {
  res.send((0, _renderJsx.renderHTML)("general-page", {
    params: {
      page: "games"
    }
  }));
}).get("/get-test-data", function (req, res) {
  res.json({
    title: "Burst or Blow | Bubble",
    who: "WORLD"
  });
}).get("/get-firebase-config", function (req, res) {
  var data = {
    apiKey: process.env["API_KEY"],
    authDomain: process.env["AUTH_DOMAIN"],
    databaseURL: process.env["DATABASE_URL"],
    storageBucket: process.env["STORAGE_BUCKET"],
    messagingSenderId: process.env["MESSAGING_SENDER_ID"]
  };
  var stringified = JSON.stringify(data);
  var base64Encoded = new Buffer(stringified).toString("base64");
  res.send(base64Encoded);
}).get("/get-auth-token", function (req, res) {
  (0, _firebaseConfig.getAuthToken)().then(function (token) {
    res.send(token);
  })["catch"](function () {
    var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    return console.error(e.stack || e);
  });
}).get("/get-version", function (req, res) {
  var data = {
    major: process.env["V_MAJOR"],
    minor: process.env["V_MINOR"],
    patch: process.env["V_PATCH"]
  };
  res.json(data);
}).get("/get-panels/:username", function (req, res) {
  // https://api.twitch.tv/api/channels/${username}/panels`
  request({
    url: "/api/channels/" + req.params.username + "/panels?client_id=" + req.query.client_id
  }, function (buffer) {
    res.send(buffer);
  });
}).get("/get-host/:userID", function (req, res) {
  // http://tmi.twitch.tv/hosts?include_logins=1&host=83101325
  request({
    protocol: "http",
    host: "tmi.twitch.tv",
    url: "/hosts?include_logins=1&host=" + req.params.userID + "&client_id=" + req.query.client_id
  }, function (buffer) {
    res.send(buffer);
  });
}).get(["/ms(/*)?", "/multi(/*)?"], function (req, res, next) {
  var strippedPath = req.path.replace(/^\/(ms|multi)/i, "");
  res.redirect("/multistream" + strippedPath);
}).get("/multistream(/:stream1)?(/:stream2)?(/:stream3)?(/:stream4)?(/:stream5)?(/:stream6)?", function (req, res) {
  res.send((0, _renderJsx.renderHTML)("multistream", {
    title: "Multistream | Amorrius",
    description: "Watch multiple livestreams here!"
  }));
}).get("*", function (req, res) {
  res.status(404).send("Page not found: " + req.url);
});

function request(_ref, cb) {
  var protocol = _ref.protocol;
  var host = _ref.host;
  var url = _ref.url;

  var options = {
    host: host || "api.twitch.tv",
    port: protocol === "http" ? 80 : 443,
    path: url,
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };
  var proto = protocol === "http" ? _http2["default"] : _https2["default"];
  var req = proto.request(options, function (XHRResponse) {
    // console.log("statusCode: ", XHRResponse.statusCode);
    // console.log("headers: ", XHRResponse.headers);

    var buffer = "";

    XHRResponse.on('data', function (d) {
      buffer += d;
    });
    XHRResponse.on("end", function () {
      // console.log("res end", buffer);
      cb(buffer);
    });
  });
  req.end();

  req.on('error', function (e) {
    console.error(e);
  });
}

exports["default"] = app;
module.exports = exports["default"];