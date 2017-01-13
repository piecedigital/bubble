"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _modulesHelperTools = require("../../../modules/helper-tools");

exports["default"] = _react2["default"].createClass({
  displayName: "VoteTool",
  getInitialState: function getInitialState() {
    return {
      ratings: null,
      calculatedRatings: null
    };
  },
  castVote: function castVote(vote) {
    var _props = this.props;
    var myAuth = _props.myAuth;
    var userData = _props.userData;
    var fireRef = _props.fireRef;
    var place = _props.place;
    var questionID = _props.questionID;
    var questionData = _props.questionData;
    var commentID = _props.commentID;
    var commentData = _props.commentData;

    var voteData = {
      myAuth: myAuth,
      "for": place,
      "username": userData.name,
      "upvote": vote
    };
    // return console.log("vote data:", voteData);
    console.log("vote data:", voteData);
    // check if the user has already voted
    (0, _modulesHelperTools.getRatingsData)(questionID, fireRef, null, function (ratingsData) {
      // console.log(place);
      var votes = ratingsData;
      // console.log(votes);
      // a node within voteType will be the ID of a rating or false
      var voteTypes = {
        question: false,
        answer: false,
        comment: false
      };
      // checks each rating for their place (for)
      Object.keys(votes || {}).map(function (ratingID) {
        var ratingData = votes[ratingID];
        if (ratingData.username !== userData.name) return;
        if (place === "comment") {
          // console.log("comment IDs", ratingData.commentID, commentID, ratingData.commentID === commentID);
          voteTypes[ratingData["for"]] = commentID === ratingData.commentID ? ratingID : voteTypes[ratingData["for"]];
        } else {
          voteTypes[ratingData["for"]] = ratingID;
        }
      });
      // adds rating if one doesn't already exist for the typet
      // updates it if it does
      if (place === "comment") {
        voteData.commentID = commentID;
      }
      if (!voteTypes[place]) {
        fireRef.ratingsRef.child(questionID).push().set(voteData);
      } else {
        fireRef.ratingsRef.child(questionID).child(voteTypes[place]).update(voteData);
      }

      // depending on the `place` determines what kind of rating notification this is
      var placeObject = {
        "question": "questionUpvote",
        "answer": "answerUpvote",
        "comment": "commentUpvote"
      };
      // depending on the `place` gets the username of the question creator, receiver, or commenter
      var receiverObject = {
        "question": questionData.creator,
        "answer": questionData.receiver,
        "comment": commentData ? commentData.username : null
      };

      // send notification
      // create notif obejct
      // console.log("creating object");
      var notifObject = {
        type: placeObject[place],
        info: {
          sender: userData.name,
          questionID: questionID,
          commentID: commentID || null,
          questionURL: "/profile/" + receiverObject[place] + "/q/" + questionID
        },
        read: false,
        date: new Date().getTime()
      };
      // console.log("sending object");
      // send notif
      if (receiverObject[place] !== userData.name) {
        if (voteData.upvote) {
          // check if the user already sent an upvote notification
          fireRef.notificationsRef.child(receiverObject[place]).orderByChild("type").equalTo(placeObject[place]).once("value").then(function (snap) {
            var notifs = snap.val();
            var dupe = false;
            Object.keys(notifs || {}).map(function (notifID) {
              var notifData = notifs[notifID];
              if (notifData.info.questionID === questionID) dupe = true;
              if (notifData.info.commentID) dupe = notifData.info.commentID === commentID ? true : false;
            });

            // don't send a notification if it would be a duplicate
            if (dupe) return;

            fireRef.notificationsRef.child(receiverObject[place]).push().set(notifObject)["catch"](function (e) {
              return console.error(e.val ? e.val() : e);
            });
          });
        }
      }
    });
  },
  newRating: function newRating(snap) {
    var _props2 = this.props;
    var place = _props2.place;
    var commentID = _props2.commentID;

    if (!snap) return;
    var key = snap.getKey();
    var val = snap.val();
    place === "comment" ? console.log("new rating", key, val, commentID) : null;
    // console.log(this.props);
    if (place === "comment" && val.commentID !== commentID) return;
    var ratings = Object.assign(this.state.ratings || {}, _defineProperty({}, key, val));
    this.setState({
      ratings: ratings
    }, this.calc);
  },
  getInitialRatings: function getInitialRatings() {
    var _this = this;

    var _props3 = this.props;
    var place = _props3.place;
    var fireRef = _props3.fireRef;
    var userData = _props3.userData;
    var questionID = _props3.questionID;
    var commentID = _props3.commentID;
    var commentData = _props3.commentData;

    // console.log("init new comment", commentID);
    (0, _modulesHelperTools.getRatingsData)(questionID, fireRef, null, function (ratingsData) {
      // console.log("got ratings", ratingsData, questionID, commentID || "not a comment");
      Object.keys(ratingsData || {}).map(function (ratingID) {
        var voteData = ratingsData[ratingID];
        if (voteData.commentID !== commentID) delete ratingsData[ratingID];
      });
      _this.setState({
        ratings: ratingsData
        // callback to calculate the ratings
      }, _this.calc.bind(null, true));
    });
  },
  // calculates ratings
  calc: function calc(first) {
    var _this2 = this;

    var userData = this.props.userData;

    // console.log("calculation", this.state.ratings, this.props.commentID);
    (0, _modulesHelperTools.calculateRatings)({
      ratingsData: this.state.ratings,
      userData: userData
    }, function (calculatedRatings) {
      // console.log("vote tool got calculated ratings", calculatedRatings);
      _this2.setState({
        calculatedRatings: calculatedRatings
        // starts listener to listen for new ratings
      }, first ? _this2.initListener : null);
    });
  },
  // listen for new ratings
  initListener: function initListener() {
    var _props4 = this.props;
    var place = _props4.place;
    var fireRef = _props4.fireRef;
    var questionID = _props4.questionID;
    var commentID = _props4.commentID;

    this.killRatingsWatch = (0, _modulesHelperTools.listenOnNewRatings)(questionID, fireRef, null, this.newRating);
  },
  componentDidMount: function componentDidMount() {
    var _this3 = this;

    var _props5 = this.props;
    var questionID = _props5.questionID;
    var fireRef = _props5.fireRef;

    var temp = function temp(snap) {
      if (snap.getKey() === questionID) {
        fireRef.ratingsRef.off("child_added", temp);

        // get the initial bulk of ratings and/or initialize listeners
        _this3.getInitialRatings();
      }
    };

    fireRef.ratingsRef.on("child_added", temp);
  },
  componentWillUnmount: function componentWillUnmount() {
    // kill ratings listener on unmount
    if (typeof this.killRatingsWatch === "function") this.killRatingsWatch(this.newRating);
  },
  render: function render() {
    var _props6 = this.props;
    var place = _props6.place;
    var userData = _props6.userData;
    var commentID = _props6.commentID;
    var _state = this.state;
    var ratings = _state.ratings;
    var calculatedRatings = _state.calculatedRatings;

    place === "comment" ? console.log("wher eis itsatfds", this.props) : null;
    if (!calculatedRatings || !calculatedRatings[place]) return _react2["default"].createElement(
      "div",
      { className: "vote-tool", onClick: function (e) {
          e.stopPropagation();
          e.preventDefault();
        } },
      _react2["default"].createElement(
        "div",
        { className: "wrapper" },
        _react2["default"].createElement("div", { className: "upvote-btn", onClick: this.castVote.bind(null, true) }),
        _react2["default"].createElement(
          "div",
          { className: "ratings" },
          _react2["default"].createElement(
            "div",
            { className: "overall" },
            "0"
          ),
          _react2["default"].createElement(
            "div",
            { className: "ups-and-downs" },
            _react2["default"].createElement(
              "div",
              { className: "up" },
              "0"
            ),
            "/",
            _react2["default"].createElement(
              "div",
              { className: "down" },
              "0"
            )
          )
        ),
        _react2["default"].createElement("div", { className: "downvote-btn", onClick: this.castVote.bind(null, false) })
      )
    );

    // console.log("vote tools", place, calculatedRatings);

    // figure out whether the viewing user voted
    // and make a CSS class based on whether it's an up- or downvote
    var myVote = calculatedRatings[place]["for"] === place ? calculatedRatings[place].myVote === true ? " my-vote up" : calculatedRatings[place].myVote === false ? " my-vote down" : "" : "";

    return _react2["default"].createElement(
      "div",
      { className: "vote-tool " + commentID, onClick: function (e) {
          e.stopPropagation();
          e.preventDefault();
        } },
      _react2["default"].createElement(
        "div",
        { className: "wrapper" },
        userData ? _react2["default"].createElement("div", { className: "upvote-btn" + (calculatedRatings[place].myVote ? myVote : ""), onClick: this.castVote.bind(null, true) }) : null,
        _react2["default"].createElement(
          "div",
          { className: "ratings" },
          _react2["default"].createElement(
            "div",
            { className: "overall" },
            calculatedRatings[place].overall || 0
          ),
          _react2["default"].createElement(
            "div",
            { className: "ups-and-downs" },
            _react2["default"].createElement(
              "div",
              { className: "up" },
              calculatedRatings[place].upvotes || 0
            ),
            "/",
            _react2["default"].createElement(
              "div",
              { className: "down" },
              calculatedRatings[place].downvotes || 0
            )
          )
        ),
        userData ? _react2["default"].createElement("div", { className: "downvote-btn" + (!calculatedRatings[place].myVote ? myVote : ""), onClick: this.castVote.bind(null, false) }) : null
      )
    );
  }
});
module.exports = exports["default"];