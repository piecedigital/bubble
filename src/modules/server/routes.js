import express from "express";
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
.get("/about", function (req, res) {
  res.send(renderHTML("about"));
})
.get(["/tos", "/terms", "/terms-of-service"], function (req, res) {
  res.send(renderHTML("terms-of-service"));
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
