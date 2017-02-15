"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _ajax = require("./ajax");

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
var CImg = _react2["default"].createClass({
  displayName: "CImg",
  getInitialState: function getInitialState() {
    var style = undefined,
        src = undefined;
    switch (this.props["for"]) {
      case "channel-list-item":
        style = {
          width: 136,
          height: 136
        };
        break;
      case "video-list-item":
        style = {
          width: 136,
          height: 102
        };
        break;
      case "banner":
      case undefined:
        style = {
          width: 880,
          height: 380
        };
        break;
      case "fill":
        style = this.props.style;
        break;
      default:
        src = this.props.src;
    }
    return {
      style: style,
      src: src
    };
  },
  makeBlankImage: function makeBlankImage() {
    // http://stackoverflow.com/a/22824493/4107851
    // create canvas and canvas context
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    // set dimensions of the canvas
    if (!this.state.style) console.log(this.props, this.state);
    canvas.width = this.state.style.width;
    canvas.height = this.state.style.height;

    // get image data from the canvas
    var imageData = ctx.getImageData(0, 0, this.state.style.width, this.state.style.height);
    var data = imageData.data;

    // set pixel color data
    for (var i = 0; i < data.length; i += 4) {
      data[i] = 0; // set R pixel to 0
      data[i + 2] = 0; // set G pixel to 0
      data[i + 2] = 0; // set B pixel to 0
      data[i + 3] = 255; // set opacity to full
    }
    ctx.putImageData(imageData, 0, 0);

    // set image
    this.setState({
      src: canvas.toDataURL()
    });
  },
  getImage: function getImage() {
    (0, _ajax.ajax)({
      url: this.props.src,
      success: function success(data) {
        // console.log(data);
        // this.makeImageBlob(data);
      },
      error: function error(data) {
        console.error(data);
      }
    });
  },
  makeImageBlob: function makeImageBlob(response) {
    var urlCreator = window.URL || window.webkitURL;
    var blob = new Blob([response]);
    var imageUrl = urlCreator.createObjectURL(blob);
    console.log("blob", blob);
    console.log("image URL", imageUrl);
    // this.setImage(imageUrl);
    // http://stackoverflow.com/a/27737668/4107851
  },
  setImage: function setImage(src) {
    this.setState({
      src: src
    });
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    this.makeBlankImage();
    if (!this.props.noImgRequest) {
      setTimeout(function () {
        _this.setImage(_this.props.src);
      }, 100);
    }
    // none of the below-related code is working
    // setTimeout(() => {
    //   console.log("getting image");
    //   this.getImage();
    // }, 3000);
  },
  render: function render() {
    if (!this.state.src) return null;
    var purgedStyle = this.props.style;
    delete purgedStyle.width;
    delete purgedStyle.height;
    return _react2["default"].createElement("img", _extends({
      src: this.state.src
    }, {
      className: (this.props.className || "") + " CImg",
      alt: this.props.alt,
      style: purgedStyle
    }));
  }
});
exports.CImg = CImg;