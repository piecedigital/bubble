var https = require("https");

var fireConf = require("./dist/modules/server/firebase-config");
initFirebase = fireConf.initFirebase;
getAuthToken = fireConf.getAuthToken;

var options = {
  protocol: "https:",
  hostname: 'api.twitch.tv',
  port: 443,
  path: "/kraken",
  method: 'GET',
  headers: {
    "Client-ID": "cye2hnlwj24qq7fezcbq9predovf6yy",
    "Accept": "application/vnd.twitchtv.v5+json",
    "Content-Type": "Application/json"
  }
}


var fireRef;
try {
  fireRef = initFirebase();
} catch (e) {
  console.error("error initializing firebase", e.stack);
}

var usersToReplace = {};

// get users
fireRef
.usersRef
.once("value")
.then(snap => {
  // console.log(snap.val());
  var userList = Object.keys(snap.val());
  // console.log("list", userList);

  var uniqueOptions = JSON.parse(JSON.stringify(options))
  var opt = Object.assign(uniqueOptions, {
    path: options.path + "/users?login=" + userList.join(",")
  });
  // console.log(opt);
  try {
    var req = https.get(
      opt,
      function(res) {
        // console.log(res.statusCode);
        if(res.statusCode >= 400) {
          console.log("error", res);
        } else {
          // console.log("ok");
          var data = ""
          res.setEncoding("utf8");
          res.on("data", function (chunk) {
            data += chunk;
            // console.log("chunk", chunk);
          });
          res.on("end", function () {
            // console.log("end", data);
            try {
              var userData = JSON.parse(data);
              // console.log(userData);
              userData.users.map(function (user) {
                usersToReplace[user.name] = user._id;
              });
              rewriteQuestions();
              rewriteAnswers();
              rewriteComments();
            } catch (e) {
              console.error(e);
            }
          });
        }
      }
    )
    req.on("error", function (e) {
      console.log("execution error:", e);
    });
  } catch (e) {
    console.log("problem", e.stack);
  }
  // usersToReplace[name] = id
});

function rewriteQuestions() {
  console.log("usersToReplace", usersToReplace);
  Object.keys(usersToReplace).map(function (name) {
    var id = usersToReplace[name];
    ["creator", "receiver"].map(function (place) {

      fireRef
      .questionsRef
      .orderByChild(place)
      .equalTo(name)
      .once("value")
      .then(function (snap) {
        var questions = snap.val();
        console.log("questions", questions);
        if(questions) {
          var up = {};
          up[place + "ID"] = id;
          Object.keys(questions).map(function (QID) {
            fireRef
            .questionsRef
            .child(QID)
            .update(up);
          });
        }
      })

    });
  });
}

function rewriteAnswers() {
  console.log("usersToReplace", usersToReplace);
  Object.keys(usersToReplace).map(function (name) {
    var id = usersToReplace[name];
    fireRef
    .answersRef
    .orderByChild("username")
    .equalTo(name)
    .once("value")
    .then(function (snap) {
      var answers = snap.val();

      if(answers) {
        Object.keys(answers).map(function (QID) {
          fireRef
          .answersRef
          .child(QID)
          .update({
            userID: id
          });
        });
      }
    })
  });
}

function rewriteComments() {
  console.log("usersToReplace", usersToReplace);
  fireRef
  .commentsRef
  .once("value")
  .then(function (snap) {
    var questions = snap.val();

    if(questions) {
      Object.keys(questions).map(function (QID) {

        Object.keys(usersToReplace).map(function (name) {
          var id = usersToReplace[name];
          fireRef
          .commentsRef
          .child(QID)
          .orderByChild("username")
          .equalTo(name)
          .once("value")
          .then(function (snap) {
            var comments = snap.val();

            if(comments) {
              Object.keys(comments).map(function (CID) {
                fireRef
                .commentsRef
                .child(QID)
                .child(CID)
                .update({
                  userID: id
                });
              });
            }

          })
        });

      });
    }
  });

}
