"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var missingLogo = "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png";

exports.missingLogo = missingLogo;
var browserNotification = function browserNotification(options) {
  if (!("Notification" in window)) {
    console.log("Notilfications are not supported");
  } else {
    checkPermission(options);
  }
};

exports.browserNotification = browserNotification;
function checkPermission(options) {
  if (Notification.permission === "granted") {
    makeNotification(options);
  } else {
    if (Notification.permission !== "denied") {
      Notification.requestPermission(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          makeNotification(options);
        }
      });
    }
  }
}

function makeNotification(data) {
  var title = "TwiQu notification";
  var options = {
    body: "TwiQu.com",
    icon: "/media/logo-png.png"
  };
  switch (data.type) {
    case "stream_online":
      title = "A New Stream Is Live!";
      options.body = data.channelName + " is live!\n\rClick to watch them now!";
      break;
  }
  var notification = new Notification(title, options);
  notification.onclick = function () {
    notification.close();
    data.callback();
  };
  setTimeout(function () {
    if (typeof notification === "object") {
      if (typeof data.finishCB === "function") data.finishCB();
      notification.close();
    }
  }, (data.timeout || 2) * 1000);
}

var calculateRatings = function calculateRatings(options, cb) {
  var ratingsData = options.ratingsData;
  var userData = options.userData;

  var calculatedRatings = {};
  // don't continue if there is no ratings data
  if (!ratingsData) return;
  // if(!userData) return setTimeout(options.calculateRatings, 100);

  calculatedRatings = {
    question: {
      upvotes: [],
      downvotes: [],
      overall: 0,
      myVote: false,
      "for": true
    },
    answer: {
      upvotes: [],
      downvotes: [],
      overall: 0,
      myVote: false,
      "for": true
    },
    comment: {
      upvotes: [],
      downvotes: [],
      overall: 0,
      myVote: false,
      "for": true
    }
  };

  Object.keys(ratingsData || {}).map(function (vote) {
    var voteData = ratingsData[vote];
    var place = voteData["for"];

    if (ratingsData[vote].upvote) calculatedRatings[place].upvotes.push(true);
    if (!ratingsData[vote].upvote) calculatedRatings[place].downvotes.push(true);
    if (userData && voteData.username === userData.name) {
      calculatedRatings[place].myVote = voteData.upvote;
      calculatedRatings[place]["for"] = voteData["for"];
    }
  });
  ["question", "answer", "comment"].map(function (place) {
    calculatedRatings[place].upvotes = calculatedRatings[place].upvotes.length;
    calculatedRatings[place].downvotes = calculatedRatings[place].downvotes.length;
    calculatedRatings[place].overall = calculatedRatings[place].upvotes - calculatedRatings[place].downvotes;
  });

  typeof cb === "function" ? cb(calculatedRatings) : console.log("no function to pass calculated data");
};

exports.calculateRatings = calculateRatings;
var getQuestionData = function getQuestionData(questionID, fireRef, modCB, cb) {
  var refNode = fireRef.questionsRef.child(questionID);
  refNode = typeof modCB === "function" ? modCB : refNode;
  refNode.once("value").then(function (snap) {
    typeof cb === "function" ? cb(snap.val()) : null;
  });
};

exports.getQuestionData = getQuestionData;
var getAnswerData = function getAnswerData(questionID, fireRef, modCB, cb) {
  var refNode = fireRef.answersRef.child(questionID);
  refNode = typeof modCB === "function" ? modCB(refNode) : refNode;
  refNode.once("value").then(function (snap) {
    typeof cb === "function" ? cb(snap.val()) : null;
  });
};

exports.getAnswerData = getAnswerData;
var getCommentsData = function getCommentsData(postID, fireRef, modCB, cb) {
  var refNode = fireRef.commentsRef.child(postID);
  refNode = typeof modCB === "function" ? modCB(refNode) : refNode;
  refNode.once("value").then(function (snap) {
    typeof cb === "function" ? cb(snap.val()) : null;
  });
};

exports.getCommentsData = getCommentsData;
var getRatingsData = function getRatingsData(postID, fireRef, modCB, cb) {
  var refNode = fireRef.ratingsRef.child(postID);
  refNode = typeof modCB === "function" ? modCB(refNode) : refNode;
  refNode.once("value").then(function (snap) {
    typeof cb === "function" ? cb(snap.val()) : null;
  });
};

exports.getRatingsData = getRatingsData;
var listenOnNewRatings = function listenOnNewRatings(postID, fireRef, modCB, cb) {
  if (typeof cb !== "function") return console.error("no callback to ratings watch");
  var refNode = fireRef.ratingsRef.child(postID);
  refNode = typeof modCB === "function" ? modCB(refNode) : refNode;
  refNode.on("child_added", cb);
  refNode.on("child_changed", cb);
  refNode.on("child_removed", cb);
  return function kill() {
    console.log("killing ratings listeners");
    refNode.off("child_added", cb);
    refNode.off("child_changed", cb);
    refNode.off("child_removed", cb);
  };
};
exports.listenOnNewRatings = listenOnNewRatings;