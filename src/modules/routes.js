import express from "express";
import { renderHTML } from "./render-jsx";
import https from "https";

const app = express();

app
.get("/", function (req, res) {
  res.send(renderHTML("home", {
    auth: {
      access_token: req.cookies["access_token"]
    }
  }));
})
.get("/search/:searchtype", function (req, res) {
  res.send(renderHTML("search", {
    location: {
      query: {
        q: req.query.q || req.query.query
      }
    }
  }));
})
.get("/profile", function (req, res) {
  res.send(renderHTML("profile"));
})
.get("/profile/:username", function (req, res) {
  res.send(renderHTML("profile", {
    params: {
      username: req.params.username
    }
  }));
})
.get("/streams", function (req, res) {
  res.send(renderHTML("general-page", {
    page: "streams"
  }));
})
.get("/games", function (req, res) {
  res.send(renderHTML("general-page", {
    page: "games"
  }));
})
.get("/get-test-data", function (req, res) {
  res.json({
    title: "Burst or Blow | Bubble",
    who: "WORLD"
  });
})
.get("/get-firebase-config", function (req, res) {
  const data = {
    apiKey: process.env["API_KEY"],
    authDomain: process.env["AUTH_DOMAIN"],
    databaseURL: process.env["DATABASE_URL"],
    storageBucket: process.env["STORAGE_BUCKET"],
    messagingSenderId: process.env["MESSAGING_SENDER_ID"],
  };
  const stringified = JSON.stringify(data);
  const base64Encoded = new Buffer(stringified).toString("base64");
  res.send(base64Encoded);
})
.get("/get-version", function (req, res) {
  const data = {
    major: process.env["V_MAJOR"],
    minor: process.env["V_MINOR"],
    patch: process.env["V_PATCH"],
  };
  res.json(data);
})
.get("/get-panels/:username", function (req, res) {
  // https://api.twitch.tv/api/channels/${username}/panels`
  let options = {
    host: "api.twitch.tv",
    port: 443,
    path: `/api/channels/${req.params.username}/panels?client_id=${req.query.client_id}`,
    method: "GET"
  };

  var req = https.request(options, function(XHRResponse) {
    // console.log("statusCode: ", XHRResponse.statusCode);
    // console.log("headers: ", XHRResponse.headers);

    let buffer = "";

    XHRResponse.on('data', function(d) {
      buffer += d;
    });
    XHRResponse.on("end", function () {
      // console.log("res end", buffer);
      res.send(buffer);
    })
  });
  req.end();

  req.on('error', function(e) {
    console.error(e);
  });

  // console.log("getting panels for:", req.params.username);
  // res.send(["test"]);
})
.get("*", function (req, res) {
  res.status(404).send("not found");
});

export default app;
