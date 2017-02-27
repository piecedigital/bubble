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
              rewriteRatings();
              rewriteComments();
              rewriteUsers();
              rewriteGameQueues();
              rewriteNotifications();
              rewritePolls();
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
  // console.log("usersToReplace", usersToReplace);
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
        // console.log("questions", questions);
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
  // console.log("usersToReplace", usersToReplace);
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

function rewriteRatings() {
  console.log("usersToReplace", usersToReplace);
  fireRef
  .ratingsRef
  .once("value")
  .then(function (snap) {
    var questions = snap.val();

    if(questions) {
      Object.keys(questions).map(function (QID) {

        Object.keys(usersToReplace).map(function (name) {
          var id = usersToReplace[name];
          fireRef
          .ratingsRef
          .child(QID)
          .orderByChild("username")
          .equalTo(name)
          .once("value")
          .then(function (snap) {
            var ratings = snap.val();

            if(ratings) {
              Object.keys(ratings).map(function (RID) {
                fireRef
                .ratingsRef
                .child(QID)
                .child(RID)
                .update({
                  userID: id
                });
              });
            }

          });
        });

      });
    }
  });

}

function rewriteComments() {
  // console.log("usersToReplace", usersToReplace);
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

function rewriteUsers() {
  // console.log("usersToReplace", usersToReplace);
  Object.keys(usersToReplace).map(function (name) {
    var id = usersToReplace[name];

    fireRef
    .usersRef
    .child(name)
    .once("value")
    .then(function (snap) {

      // move user data to id
      fireRef
      .usersRef
      .child(id)
      .update(snap.val())

      // delete user data on name
      fireRef
      .usersRef
      .child(name)
      .set(null)

    });

  });
}

function rewriteGameQueues() {
  // console.log("usersToReplace", usersToReplace);
  Object.keys(usersToReplace).map(function (name) {
    var id = usersToReplace[name];

    fireRef
    .gameQueuesRef
    .child(name)
    .once("value")
    .then(function (snap) {

      // move user data to id
      fireRef
      .gameQueuesRef
      .child(id)
      .update(snap.val())

      // delete user data on name
      fireRef
      .gameQueuesRef
      .child(name)
      .set(null)

    });

  });
}

function rewriteNotifications() {
  // console.log("usersToReplace", usersToReplace);
  Object.keys(usersToReplace).map(function (name) {
    // console.log("replacing", name);
    var id = usersToReplace[name];

    fireRef
    .notificationsRef
    .child(name)
    .once("value")
    .then(function (snap) {
      console.log(snap.exists(), name);
      var notifs = snap.val();

      Object.keys(notifs).map(function (notifID, ind, arr) {
        var sender = notifs[notifID].info.sender;
        var questionURL = notifs[notifID].info.questionURL || "";
        notifs[notifID].info.sender = usersToReplace[sender] || sender;
        notifs[notifID].info.questionURL = usersToReplace[sender] ? (
          questionURL.replace(/^\/profile\/([a-z0-9]+)/, function(_, n) {
            return _.replace(n, usersToReplace[n]);
          })
        ) : questionURL;
        console.log("map", name, ind, arr.length - 1);
      });
      console.log("finishing", name);

      // move user data to id
      fireRef
      .notificationsRef
      .child(id)
      .update(notifs)

      // delete user data on name
      fireRef
      .notificationsRef
      .child(name)
      .set(null)

    });

  });
}

function rewritePolls() {
  // console.log("usersToReplace", usersToReplace);
  Object.keys(usersToReplace).map(function (name) {
    // console.log("replacing", name);
    var id = usersToReplace[name];

    fireRef
    .pollsRef
    .once("value")
    .then(function (snap) {
      var polls = snap.val()

      if(polls) {
        Object.keys(polls).map(function (pollID) {
          var pollData = polls[pollID];

          fireRef
          .pollsRef
          .child(pollID)
          .update({
            auth: null,
            creator: usersToReplace[pollData.creator] || pollData.creator,
            votes: null
          })
        });
      }
    });
  });
}
