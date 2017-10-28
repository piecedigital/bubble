import express from "express";
import http from "http";
import https from "https";
import { renderHTML } from "./render-jsx";
import { initFirebase, getAuthToken } from "./firebase-config";

const app = express();
let fireRef;
try {
  fireRef = initFirebase();
} catch (e) {
  console.error("error initializing firebase", e.stack);
}
app
// .get("*", function (req, res, next) {
//   console.log(req.url);
//   next();
// })
.get("/", function (req, res) {
  let initState = {
    layout: {
      fireRef: true, // to get a certain compunent to render with truthiness
      versionData: {
        major: process.env["V_MAJOR"],
        minor: process.env["V_MINOR"],
        patch: process.env["V_PATCH"],
      }
    }
  };

  new Promise(function(resolve, reject) {
    fireRef.answersRef.orderByKey().limitToLast(10).once("value").then(snap => {
      const answers = snap.val();
      initState.userQuestions = {}
      initState.userQuestions.answers = answers;
      Object.keys(answers).map((questionID, ind, arr) => {
        fireRef.questionsRef.child(questionID).once("value").then(snap => {
          const questionData = snap.val();
          initState.userQuestions.questions = initState.userQuestions.questions || {};
          initState.userQuestions.questions[questionID] = questionData;
          if(ind === arr.length-1) resolve(initState);
        });
      });
    });
  })
  .then(initState => {
    res.send(
      renderHTML("home", {
        auth: {
          access_token: req.cookies["access_token"]
        },
        initState
      })
    );
  });
})
.get("/spit-back-auth", function (req, res) {
  res.send(renderHTML("spit-back-auth"));
})
.get("/about", function (req, res) {
  res.send(renderHTML("about"));
})
.get("/tos", function (req, res) {
  res.redirect("/terms-of-service")
})
.get("/terms", function (req, res) {
  res.redirect("/terms-of-service")
})
.get("/terms-of-service", function (req, res) {
  console.log("git him");
  res.send(renderHTML("tos"));
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
  res.redirect("/");
})
.get("/profile/:username", function (req, res) {
  res.send(renderHTML("profile", {
    params: {
      username: req.params.username
    }
  }));
})
.get("/profile/:username/:q/:questionID", function (req, res) {
  res.send(renderHTML("profile", {
    params: {
      username: req.params.username
    }
  }));
})
.get("/streams", function (req, res) {
  res.send(renderHTML("general-page", {
    params: {
      page: "streams"
    }
  }));
})
.get("/games", function (req, res) {
  res.send(renderHTML("general-page", {
    params: {
      page: "games"
    }
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
.get("/get-auth-token", function (req, res) {
  getAuthToken()
  .then(token => {
    res.send(token);
  })
  .catch((e = {}) => console.error(e.stack || e));
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
  request({
    url: `/api/channels/${req.params.username}/panels?client_id=${req.query.client_id}`
  }, function (buffer) {
    res.send(buffer);
  })
})
.get("/get-host/:userID", function (req, res) {
  // http://tmi.twitch.tv/hosts?include_logins=1&host=83101325
  request({
    protocol: "http",
    host: "tmi.twitch.tv",
    url: `/hosts?include_logins=1&host=${req.params.userID}&client_id=${req.query.client_id}`
  }, function (buffer) {
    res.send(buffer);
  })
})
.get("*", function (req, res) {
  res.status(404).send("Page not found: " + req.url);
});

function request({protocol, host, url}, cb) {
  let options = {
    host: host || "api.twitch.tv",
    port: protocol === "http" ? 80 : 443,
    path: url,
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };
  const proto = protocol === "http" ? http : https;
  var req = proto.request(options, function(XHRResponse) {
    // console.log("statusCode: ", XHRResponse.statusCode);
    // console.log("headers: ", XHRResponse.headers);

    let buffer = "";

    XHRResponse.on('data', function(d) {
      buffer += d;
    });
    XHRResponse.on("end", function () {
      // console.log("res end", buffer);
      cb(buffer);
    })
  });
  req.end();

  req.on('error', function(e) {
    console.error(e);
  });
}

export default app;
