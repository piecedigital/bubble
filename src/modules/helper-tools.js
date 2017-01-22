export const missingLogo = "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png";

export const browserNotification = function (options) {
  if(!("Notification" in window)) {
    console.log("Notilfications are not supported");
  } else {
    checkPermission(options);
  }
}

function checkPermission(options) {
  if(Notification.permission === "granted") {
    makeNotification(options);
  } else {
    if(Notification.permission !== "denied") {
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
  let title = "TwiQu notification";
  let options = {
    body: "TwiQu.com",
    icon: "/media/logo-png.png"
  };
  switch (data.type) {
    case "stream_online":
      title = "A New Stream Is Live!";
      options.body = `${data.channelName} is live!\n\rClick to watch them now!`
      break;
  }
  var notification = new Notification(title, options);
  notification.onclick = function () {
    notification.close();
    data.callback();
  };
  setTimeout(() => {
    if(typeof notification === "object") {
      if(typeof data.finishCB === "function") data.finishCB();
      notification.close();
    }
  }, (data.timeout || 2) * 1000);
}

export const calculateRatings = function(options, cb) {
  const { ratingsData, userData } = options;
  let calculatedRatings = {};
  // don't continue if there is no ratings data
  if(!ratingsData) return;
  // if(!userData) return setTimeout(options.calculateRatings, 100);

  calculatedRatings = {
    question: {
      upvotes: [],
      downvotes: [],
      overall: 0,
      myVote: false,
      for: true
    },
    answer: {
      upvotes: [],
      downvotes: [],
      overall: 0,
      myVote: false,
      for: true
    },
    comment: {
      upvotes: [],
      downvotes: [],
      overall: 0,
      myVote: false,
      for: true
    }
  };

  Object.keys(ratingsData || {}).map(vote => {
    const voteData = ratingsData[vote];
    const place = voteData.for;

    if(ratingsData[vote].upvote) calculatedRatings[place].upvotes.push(true);
    if(!ratingsData[vote].upvote) calculatedRatings[place].downvotes.push(true);
    if(userData && voteData.username === userData.name) {
      calculatedRatings[place].myVote = voteData.upvote;
      calculatedRatings[place].for = voteData.for;
    }
  });
  ["question", "answer", "comment"].map(place => {
    calculatedRatings[place].upvotes = calculatedRatings[place].upvotes.length;
    calculatedRatings[place].downvotes = calculatedRatings[place].downvotes.length;
    calculatedRatings[place].overall = calculatedRatings[place].upvotes - calculatedRatings[place].downvotes;
  });

  (typeof cb === "function") ? cb(calculatedRatings) : console.log("no function to pass calculated data");
};

export const getQuestionData = function(questionID, fireRef, modCB, cb) {
  let refNode = fireRef.questionsRef
  .child(questionID);
  refNode = typeof modCB === "function" ? modCB : refNode;
  refNode.once("value")
  .then(snap => {
    typeof cb === "function" ? cb(snap.val()) : null;
  });
};

export const getAnswerData = function(questionID, fireRef, modCB, cb) {
  let refNode = fireRef.answersRef
  .child(questionID);
  refNode = typeof modCB === "function" ? modCB(refNode) : refNode;
  refNode.once("value")
  .then(snap => {
    typeof cb === "function" ? cb(snap.val()) : null;
  });
}

export const getCommentsData = function(postID, fireRef, modCB, cb) {
  let refNode = fireRef.commentsRef
  .child(postID);
  refNode = typeof modCB === "function" ? modCB(refNode) : refNode;
  refNode.once("value")
  .then(snap => {
    typeof cb === "function" ? cb(snap.val()) : null;
  });
}

export const getRatingsData = function(postID, fireRef, modCB, cb) {
  let refNode = fireRef.ratingsRef
  .child(postID);
  refNode = typeof modCB === "function" ? modCB(refNode) : refNode;
  refNode.once("value")
  .then(snap => {
    typeof cb === "function" ? cb(snap.val()) : null;
  });
}

export const listenOnNewRatings = function(postID, fireRef, modCB, cb) {
  if(typeof cb !== "function") return console.error("no callback to ratings watch");
  let refNode = fireRef.ratingsRef
  .child(postID);
  refNode = typeof modCB === "function" ? modCB(refNode) : refNode;
  refNode.on("child_added", cb);
  refNode.on("child_changed", cb);
  refNode.on("child_removed", cb);
  return function kill() {
    console.log("killing ratings listeners");
    refNode.off("child_added", cb);
    refNode.off("child_changed", cb);
    refNode.off("child_removed", cb);
  }
}
