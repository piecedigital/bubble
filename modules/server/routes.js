"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _https = require("https");

var _https2 = _interopRequireDefault(_https);

var _renderJsx = require("./render-jsx");

var _firebaseConfig = require("./firebase-config");

var app = (0, _express2["default"])();
var fireRef = undefined;
try {
  fireRef = (0, _firebaseConfig.initFirebase)();
} catch (e) {
  console.error("error initializing firebase", e.stack);
}
app.get("/", function (req, res) {
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
}).get("/search/:searchtype", function (req, res) {
  res.send((0, _renderJsx.renderHTML)("search", {
    location: {
      query: {
        q: req.query.q || req.query.query
      }
    }
  }));
}).get("/profile", function (req, res) {
  res.send((0, _renderJsx.renderHTML)("profile"));
}).get("/profile/:username", function (req, res) {
  res.send((0, _renderJsx.renderHTML)("profile", {
    params: {
      username: req.params.username
    }
  }));
}).get("/profile/:username/:q/:questionID", function (req, res) {
  res.send((0, _renderJsx.renderHTML)("profile", {
    params: {
      username: req.params.username
    }
  }));
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
}).get("/get-version", function (req, res) {
  var data = {
    major: process.env["V_MAJOR"],
    minor: process.env["V_MINOR"],
    patch: process.env["V_PATCH"]
  };
  res.json(data);
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