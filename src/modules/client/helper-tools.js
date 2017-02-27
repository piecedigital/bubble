import React from "react";
import { ajax } from "./ajax";
import loadData from "./load-data";

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
    if(userData && voteData.userID === userData._id) {
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
    // console.log("killing ratings listeners");
    refNode.off("child_added", cb);
    refNode.off("child_changed", cb);
    refNode.off("child_removed", cb);
  }
}

export const CImg = React.createClass({
  displayName: "CImg",
  getInitialState() {
    let style, src;
    switch (this.props.for) {
      case "channel-list-item":
        style = {
          width: 136,
          height: 136,
        };
      break;
      case "video-list-item":
        style = {
          width: 136,
          height: 102,
        };
      break;
      case "banner":
      case undefined:
        style = {
          width: 880,
          height: 380,
        };
      break;
      case "fill":
        style = this.props.style;
      break;
      default: src = this.props.src;
    }
    return {
      style,
      src
    }
  },
  init(src = this.props.src) {
    this.makeBlankImage();
    if(!this.props.noImgRequest) {
      setTimeout(() => {
        if(src) this.setImage(src);
      }, 100);
    }
  },
  makeBlankImage() {
    // don't bother continuing without style
    // console.log(this.state.style);
    if(!this.state.style || !this.state.style.width || !this.state.style.height) return;
    // http://stackoverflow.com/a/22824493/4107851
    // create canvas and canvas context
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // set dimensions of the canvas
    if(!this.state.style) console.log(this.props, this.state);
    canvas.width = this.state.style.width;
    canvas.height = this.state.style.height;

    // get image data from the canvas
    const imageData = ctx.getImageData(0,0,this.state.style.width,this.state.style.height);
    const data = imageData.data;

    // set pixel color data
    for(let i = 0; i < data.length; i+=4) {
      data[i] = 0; // set R pixel to 0
      data[i+2] = 0; // set G pixel to 0
      data[i+2] = 0; // set B pixel to 0
      data[i+3] = 255; // set opacity to full
    }
    ctx.putImageData(imageData, 0, 0);

    // set image
    this.setState({
      src: canvas.toDataURL()
    });
  },
  getImage() {
    ajax({
      url: this.props.src,
      success: (data) => {
        // console.log(data);
        // this.makeImageBlob(data);
      },
      error(data) {
        console.error(data);
      },
    })
  },
  makeImageBlob(response) {
    const urlCreator = window.URL || window.webkitURL;
    const blob = new Blob([response]);
    const imageUrl = urlCreator.createObjectURL(blob);
    // console.log("blob", blob);
    // console.log("image URL", imageUrl);
    // this.setImage(imageUrl);
    // http://stackoverflow.com/a/27737668/4107851
  },
  setImage(src) {
    this.setState({
      src
    });
  },
  componentWillReceiveProps(nextProps) {
    if(nextProps.src !== this.props.src) {
      this.init(nextProps.src);
    }
  },
  componentDidMount() {
    this.init();
    // none of the below-related code is working
    // setTimeout(() => {
    //   console.log("getting image");
    //   this.getImage();
    // }, 3000);
  },
  render() {
    if(!this.state.src) return null;
    const purgedStyle = this.props.style;
    if(purgedStyle) {
      delete purgedStyle.width;
      delete purgedStyle.height;
    }
    return (
      <img
        src={this.state.src}
        {...{
          className: (this.props.className || "") + " CImg",
          alt: this.props.alt,
          style: purgedStyle,
        }} />
    );
  }
});

export const getUsername = function (userIDList, needIDInstead) {
  return new Promise(function(resolve, reject) {

    // only want to work with an array
    // if it's a string, put it in an array
    if(!Array.isArray(userIDList)) {
      userIDList = [userIDList];
    }

    let users = [];

    userIDList.map((userText, ind) => {
      let username, userID;
      if(needIDInstead) {
        username = userText;
      } else {
        userID = userText;
      }

      loadData.call(this, e => {
        console.error(e.stack);
      }, {
        userID,
        username
      })
      .then(methods => {
        methods
        .getUserByName()
        .then(data => {
          users.push(data);

          // resolve
          if(ind >= (userIDList.length - 1)) resolve(users);
        })
        .catch((e = null) => console.error(e));
      })
      .catch((e = null) => console.error(e));

    });

  });
}

export const getUserID = function(data) {
  return getUsername(data, true);
}
