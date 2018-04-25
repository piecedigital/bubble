"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _universalAjax = require("../universal/ajax");

var _loadData = require("./load-data");

var _loadData2 = _interopRequireDefault(_loadData);

// export const missingLogo = "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png";
var missingLogo = "/media/big-logo-png.png";

exports.missingLogo = missingLogo;
var imageDefaults = {
  "channel-list-item-DefaultImg": "",
  "video-list-item-DefaultImg": "",
  "banner-DefaultImg": "",
  "undefined-DefaultImg": ""
};

var dimensions = [{
  name: "channel-list-item-DefaultImg",
  width: 136,
  height: 136
}, {
  name: "video-list-item-DefaultImg",
  width: 136,
  height: 102
}, {
  name: "banner-DefaultImg",
  width: 880,
  height: 380
}, {
  name: "undefined-DefaultImg",
  width: 880,
  height: 380
}];

if (typeof document !== "undefined") {
  dimensions.map(function (obj) {
    // console.log("making image for", obj.name);
    var value = makeBlankImage(obj);
    // console.log(value);
    imageDefaults[obj.name] = value;
  });
}

function makeBlankImage(optionsObj) {
  if (typeof document !== "undefined") {
    // don't bother continuing without style
    // console.log(this.state.style);
    if (!optionsObj || !optionsObj.width || !optionsObj.height) return;
    // http://stackoverflow.com/a/22824493/4107851
    // create canvas and canvas context
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    // set dimensions of the canvas
    if (!optionsObj) console.log(this.props, this.state);
    canvas.width = optionsObj.width;
    canvas.height = optionsObj.height;

    // get image data from the canvas
    var imageData = ctx.getImageData(0, 0, optionsObj.width, optionsObj.height);
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
    return canvas.toDataURL();
  }
}
module.exports.makeBlankImage = makeBlankImage;

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
    if (userData && voteData.userID === userData._id) {
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
    // console.log("killing ratings listeners");
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
    // switch (this.props.for) {
    //   case "channel-list-item":
    //     style = {
    //       width: 136,
    //       height: 136,
    //     };
    //   break;
    //   case "video-list-item":
    //     style = {
    //       width: 136,
    //       height: 102,
    //     };
    //   break;
    //   case "banner":
    //   case undefined:
    //     style = {
    //       width: 880,
    //       height: 380,
    //     };
    //   break;
    //   case "fill":
    //     style = this.props.style;
    //   break;
    //   default: src = imageDefaults[`${this.props.for}-DefaultImg`] || this.props.src;
    // }
    src = imageDefaults[this.props["for"] + "-DefaultImg"] || this.props.src;

    return {
      // style,
      src: src
    };
  },
  init: function init() {
    var _this = this;

    var src = arguments.length <= 0 || arguments[0] === undefined ? this.props.src : arguments[0];

    // this.makeBlankImage();
    // console.log(this.props.for, imageDefaults[`${this.props.for}-DefaultImg`]);
    this.setState({
      src: imageDefaults[this.props["for"] + "-DefaultImg"]
    });
    if (!this.props.noImgRequest) {
      setTimeout(function () {
        if (src) _this.setImage(src);
      }, 100);
    }
  },
  setImage: function setImage(src) {
    this.setState({
      src: src
    });
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.src !== this.props.src) {
      this.init(nextProps.src);
    }
  },
  componentDidMount: function componentDidMount() {
    this.init();
  },
  render: function render() {
    if (!this.state.src) return null;
    var purgedStyle = this.props.style;
    if (purgedStyle) {
      delete purgedStyle.width;
      delete purgedStyle.height;
    }
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
var getUsername = function getUsername(userIDList, needIDInstead) {
  return new Promise(function (resolve, reject) {
    var _this2 = this;

    // only want to work with an array
    // if it's a string, put it in an array
    if (!Array.isArray(userIDList)) {
      userIDList = [userIDList];
    }

    var users = [];

    userIDList.map(function (userText, ind) {
      var username = undefined,
          userID = undefined;
      if (needIDInstead) {
        username = userText;
      } else {
        userID = userText;
      }

      _loadData2["default"].call(_this2, function (e) {
        console.error(e.stack);
      }, {
        userID: userID,
        username: username
      }).then(function (methods) {
        methods.getUserByName().then(function (data) {
          users.push(data);

          // resolve
          if (ind >= userIDList.length - 1) resolve(users);
        })["catch"](function () {
          var e = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
          return console.error(e);
        });
      })["catch"](function () {
        var e = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
        return console.error(e);
      });
    });
  });
};

exports.getUsername = getUsername;
var getUserID = function getUserID(data) {
  return getUsername(data, true);
};

exports.getUserID = getUserID;
var makeTime = function makeTime(time) {
  // http://stackoverflow.com/a/11486026/4107851
  var hour = Math.floor(time / 3600);
  var minute = Math.floor(time % 3600 / 60);
  var second = Math.floor(time % 60);
  var formatted = "";

  if (hour > 0) {
    formatted += hour + ":" + (minute < 10 ? "0" : "");
  }
  formatted += minute + ":" + (second < 10 ? "0" : "") + second;
  // console.log(formatted);
  return {
    raw: time,
    hour: hour,
    minute: minute,
    second: second,
    formatted: formatted
  };
};

exports.makeTime = makeTime;
var formatDate = function formatDate(time) {
  var date = new Date(time);
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var formatted = "";
  var formattedWithSeconds = "";

  if (hour > 12) {
    hour = hour - 12;
  }
  if (hour === 0) hour = 12;

  formatted += hour + ":" + (minute < 10 ? "0" : "") + minute;
  formattedWithSeconds += formatted + ":" + (second < 10 ? "0" : "") + second;
  // console.log(formatted);
  return {
    raw: time,
    hour: hour,
    minute: minute,
    second: second,
    formatted: formatted,
    formattedWithSeconds: formattedWithSeconds
  };
};
exports.formatDate = formatDate;