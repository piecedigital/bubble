"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

exports["default"] = _react2["default"].createClass({
  displayName: "VoteTool",
  getInitialState: function getInitialState() {
    return {
      ratings: null,
      uniqueCommentRatings: null
    };
  },
  calculateRatings: function calculateRatings() {
    var ratings = this.state.ratings;
    var userData = this.props.userData;

    var calculatedRatings = {};

    calculatedRatings = {
      comment: {
        upvotes: [],
        downvotes: [],
        overall: 0,
        myVote: false,
        "for": true
      }
    };

    Object.keys(ratings || {}).map(function (vote) {
      var voteData = ratings[vote];
      var place = voteData["for"];

      if (ratings[vote].upvote) calculatedRatings[place].upvotes.push(true);
      if (!ratings[vote].upvote) calculatedRatings[place].downvotes.push(true);
      if (voteData.username === userData.name) {
        calculatedRatings[place].myVote = voteData.upvote;
        calculatedRatings[place]["for"] = voteData["for"];
      }
    });
    ["comment"].map(function (place) {
      calculatedRatings[place].upvotes = calculatedRatings[place].upvotes.length;
      calculatedRatings[place].downvotes = calculatedRatings[place].downvotes.length;
      calculatedRatings[place].overall = calculatedRatings[place].upvotes - calculatedRatings[place].downvotes;
    });

    this.setState({
      uniqueCommentRatings: calculatedRatings
    });
  },
  castVote: function castVote(vote) {
    var _props = this.props;
    var myAuth = _props.myAuth;
    var userData = _props.userData;
    var fireRef = _props.fireRef;
    var place = _props.place;
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
    // console.log("vote data:", voteData);
    // check if the user has already voted
    // gets data for answers and questions
    fireRef.ratingsRef.child(questionData.questionID).orderByChild("username").equalTo(userData.name).once("value").then(function (snap) {
      console.log(place);
      var votes = snap.val();
      console.log(votes);
      // a node within voteType will be the ID of a rating or false
      var voteTypes = {
        question: false,
        answer: false,
        comment: false
      };
      // checks each rating for their place (for)
      Object.keys(votes || {}).map(function (ratingID) {
        var ratingData = votes[ratingID];
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
        fireRef.ratingsRef.child(questionData.questionID).push().set(voteData);
      } else {
        fireRef.ratingsRef.child(questionData.questionID).child(voteTypes[place]).update(voteData);
      }
    });
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    if (this.props.place === "comment") {
      this.props.fireRef.ratingsRef.child(this.props.questionData.questionID).orderByChild("commentID").equalTo(this.props.commentID).once("value").then(function (snap) {
        var ratings = snap.val();
        console.log("got ratings", ratings, _this.props.commentID);
        _this.setState({
          ratings: ratings
        }, _this.calculateRatings);
      });

      // listen on new ratings
      var refNode = this.props.fireRef.ratingsRef.child(this.props.questionData.questionID).orderByChild("commentID").equalTo(this.props.commentID);
      refNode.on("child_added", function (snap) {
        var ratingsKey = snap.getKey();
        var ratingsData = snap.val();
        console.log("got unique ratings", ratingsKey, ratingsData);
        var newRatings = JSON.parse(JSON.stringify(_this.state.ratings || {}));
        _this.setState({
          ratings: Object.assign(newRatings || {}, _defineProperty({}, ratingsKey, ratingsData))
        }, _this.calculateRatings);
      });
      refNode.on("child_changed", function (snap) {
        var ratingsKey = snap.getKey();
        var ratingsData = snap.val();
        console.log("got unique ratings", ratingsKey, ratingsData);
        var newRatings = JSON.parse(JSON.stringify(_this.state.ratings || {}));
        _this.setState({
          ratings: Object.assign(newRatings || {}, _defineProperty({}, ratingsKey, ratingsData))
        }, _this.calculateRatings);
      });
    }
  },
  render: function render() {
    var _props2 = this.props;
    var place = _props2.place;
    var commentID = _props2.commentID;
    var calculatedRatings = _props2.calculatedRatings;
    var _state = this.state;
    var ratings = _state.ratings;
    var uniqueCommentRatings = _state.uniqueCommentRatings;

    // console.log("wher eis itsatfds", ratings);
    if (!calculatedRatings || !calculatedRatings[place] || place === "comment" && !uniqueCommentRatings) return _react2["default"].createElement(
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

    var usedRatings = place === "comment" ? uniqueCommentRatings : calculatedRatings;
    // console.log("vote tools", place, usedRatings);

    // figure out whether the viewing user voted
    // and make a CSS class based on whether it's an up- or downvote
    var myVote = usedRatings[place]["for"] === place ? usedRatings[place].myVote === true ? " my-vote up" : usedRatings[place].myVote === false ? " my-vote down" : "" : "";

    return _react2["default"].createElement(
      "div",
      { className: "vote-tool", onClick: function (e) {
          e.stopPropagation();
          e.preventDefault();
        } },
      _react2["default"].createElement(
        "div",
        { className: "wrapper" },
        _react2["default"].createElement("div", { className: "upvote-btn" + (usedRatings[place].myVote ? myVote : ""), onClick: this.castVote.bind(null, true) }),
        _react2["default"].createElement(
          "div",
          { className: "ratings" },
          _react2["default"].createElement(
            "div",
            { className: "overall" },
            usedRatings[place].overall || 0
          ),
          _react2["default"].createElement(
            "div",
            { className: "ups-and-downs" },
            _react2["default"].createElement(
              "div",
              { className: "up" },
              usedRatings[place].upvotes || 0
            ),
            "/",
            _react2["default"].createElement(
              "div",
              { className: "down" },
              usedRatings[place].downvotes || 0
            )
          )
        ),
        _react2["default"].createElement("div", { className: "downvote-btn" + (!usedRatings[place].myVote ? myVote : ""), onClick: this.castVote.bind(null, false) })
      )
    );
  }
});
module.exports = exports["default"];