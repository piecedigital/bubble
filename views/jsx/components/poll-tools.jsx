"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _firebase = require("firebase");

var _firebase2 = _interopRequireDefault(_firebase);

var _reactRouter = require('react-router');

var _commentToolsJsx = require("./comment-tools.jsx");

// import VoteTool from "./vote-tool.jsx";
// import { ajax } from "../../../modules/client/ajax";

// poll creation related components
var ChoiceInput = _react2["default"].createClass({
  displayName: "ChoiceInput",
  componentDidMount: function componentDidMount() {
    this.refs.input.focus();
  },
  render: function render() {
    var _props = this.props;
    var choiceID = _props.choiceID;
    var choiceData = _props.choiceData;
    var changeCB = _props.changeCB;
    var removeCB = _props.removeCB;

    return _react2["default"].createElement(
      "div",
      { className: "poll-choice" },
      _react2["default"].createElement("input", { ref: "input", type: "text", value: choiceData, onChange: changeCB.bind(null, choiceID) }),
      choiceID > 1 ? _react2["default"].createElement(
        "span",
        { className: "remove", onClick: removeCB.bind(null, choiceID) },
        "x"
      ) : null
    );
  }
});

var MakePoll = _react2["default"].createClass({
  displayName: "MakePoll",
  getInitialState: function getInitialState() {
    return {
      error: false,
      success: false,
      time: "Infinite",
      validation: {
        titleMin: 15,
        titleMax: 500,
        titleCount: 0,
        titleValid: false
      },
      choices: ["", ""]
    };
  },
  submit: function submit(e) {
    var _this = this;

    e.preventDefault();
    var _props2 = this.props;
    var auth = _props2.auth;
    var userData = _props2.userData;
    var fireRef = _props2.fireRef;
    var versionData = _props2.versionData;
    var popUpHandler = _props2.methods.popUpHandler;
    var _refs = this.refs;
    var title = _refs.title;
    var hours = _refs.hours;
    var minutes = _refs.minutes;

    var choices = {};

    this.state.choices.map(function (choiceData, choiceID) {
      choices["vote_" + choiceID] = choiceData;
    });

    console.log(parseInt(hours.value), parseInt(minutes.value));

    var dateNow = Date.now();

    var pollObject = {
      title: title.value,
      creator: userData.name,
      choices: choices,
      // "votes": {
      //   <username>: {
      //     "username": <username>,
      //     "vote": String (vote_<Number>)
      //   }
      // },
      endDate: parseInt(hours.value) || parseInt(minutes.value) ? dateNow + parseInt(hours.value) + parseInt(minutes.value) : null,
      date: dateNow,
      version: versionData
    };

    if (!this.state.validation.titleValid) return;
    console.log("poll object:", pollObject);
    // return console.log("poll object:", pollObject);

    // write question to `questions` node
    var pollID = fireRef.root.push().getKey();
    // console.log(pollID);
    fireRef.pollsRef.child(pollID).set(pollObject)["catch"](function (e) {
      return console.error(e.val ? e.val() : e);
    });

    // close the pop up
    this.setState({
      success: true
    }, function () {
      setTimeout(function () {
        _this.props.methods.popUpHandler("viewPoll", { pollID: pollID });
      }, 2000);
    });
  },
  validate: function validate(name, e) {
    var _Object$assign;

    // name will be the same as a referenced element
    // the name will be used to be validated, matched with a variable "suffix"
    var value = e.target.value;
    var thisMin = this.state.validation[name + "Min"];
    var thisMax = this.state.validation[name + "Max"];
    var thisValid = name + "Valid";
    var thisCount = name + "Count";
    this.setState({
      validation: Object.assign(this.state.validation, (_Object$assign = {}, _defineProperty(_Object$assign, thisValid, value.length >= thisMin && value.length <= thisMax), _defineProperty(_Object$assign, thisCount, value.length), _Object$assign))
    });
  },
  choiceInputChange: function choiceInputChange(choiceID, e) {
    if (!e.target.value) return this.removeChoice(choiceID);
    var newChoices = JSON.parse(JSON.stringify(this.state.choices));
    newChoices[choiceID] = e.target.value;
    this.setState({
      choices: newChoices
    });
  },
  addChoice: function addChoice(e) {
    e.preventDefault();
    var newChoices = JSON.parse(JSON.stringify(this.state.choices));
    if (!newChoices[newChoices.length - 1]) return;
    newChoices.push("");
    this.setState({
      choices: newChoices
    });
  },
  removeChoice: function removeChoice(choiceID) {
    var newChoices = JSON.parse(JSON.stringify(this.state.choices));
    newChoices.splice(choiceID, 1);
    if (newChoices.length < 2) newChoices.push("");
    this.setState({
      choices: newChoices
    });
  },
  updateTimes: function updateTimes() {
    var days = parseInt(this.refs.days.value) / (1000 * 60 * 60 * 24);
    var hours = parseInt(this.refs.hours.value) / (1000 * 60 * 60);
    var minutes = parseInt(this.refs.minutes.value) / (1000 * 60);
    if (!days && !hours && !minutes) {
      this.setState({
        time: "Infinite"
      });
    } else {
      var part1 = days ? days + " day" + (days > 1 ? "s" : "") : null;
      var part2 = hours ? hours + " hour" + (hours > 1 ? "s" : "") : null;
      var part3 = minutes ? minutes + " minute" + (minutes > 1 ? "s" : "") : null;
      var sentence = [];

      part1 ? sentence.push(part1) : null;
      part2 ? sentence.push(part2) : null;
      part3 ? sentence.push(part3) : null;
      sentence.length > 1 ? sentence.push("and " + sentence.pop()) : null;
      this.setState({
        time: sentence.join(", ")
      });
    }
  },
  render: function render() {
    var _this2 = this;

    // console.log(this.props);
    var _props3 = this.props;
    var fireRef = _props3.fireRef;
    var overlay = _props3.overlay;
    var versionData = _props3.versionData;
    var popUpHandler = _props3.methods.popUpHandler;
    var _state = this.state;
    var success = _state.success;
    var error = _state.error;
    var choices = _state.choices;
    var time = _state.time;

    var daysArray = new Uint8Array(8).map(function () {
      return true;
    });
    var hoursArray = new Uint8Array(25).map(function () {
      return true;
    });
    var minutesArray = new Uint8Array(60).map(function () {
      return true;
    });
    var daysOptions = [],
        hoursOptions = [],
        minutesOptions = [];

    daysArray.map(function (_, ind) {
      // console.log(_, ind);
      var elem = _react2["default"].createElement(
        "option",
        { key: ind, value: ind * 1000 * 60 * 60 * 24 },
        ind
      );
      // console.log(elem);
      daysOptions.push(elem);
    });
    hoursArray.map(function (_, ind) {
      // console.log(_, ind);
      var elem = _react2["default"].createElement(
        "option",
        { key: ind, value: ind * 1000 * 60 * 60 },
        ind
      );
      // console.log(elem);
      hoursOptions.push(elem);
    });
    minutesArray.map(function (_, ind) {
      // console.log(_, ind);
      var elem = _react2["default"].createElement(
        "option",
        { key: ind, value: ind * 1000 * 60 },
        ind
      );
      // console.log(elem);
      minutesOptions.push(elem);
    });

    if (!versionData || !fireRef) {
      return _react2["default"].createElement(
        "div",
        { className: "overlay-ui-default make-poll" + (overlay === "makePoll" ? " open" : ""), onClick: function (e) {
            return e.stopPropagation();
          } },
        _react2["default"].createElement(
          "div",
          { className: "title" },
          "Preparing form..."
        )
      );
    }
    if (error) {
      return _react2["default"].createElement(
        "div",
        { className: "overlay-ui-default make-poll" + (overlay === "makePoll" ? " open" : ""), onClick: function (e) {
            return e.stopPropagation();
          } },
        _react2["default"].createElement(
          "div",
          { className: "title" },
          "There was an issue preparing the form :("
        )
      );
    } else if (success) {
      return _react2["default"].createElement(
        "div",
        { className: "overlay-ui-default make-poll" + (overlay === "makePoll" ? " open" : ""), onClick: function (e) {
            return e.stopPropagation();
          } },
        _react2["default"].createElement(
          "div",
          { className: "title" },
          "Poll created successfully!"
        )
      );
    } else return _react2["default"].createElement(
      "div",
      { className: "overlay-ui-default make-poll" + (overlay === "makePoll" ? " open" : ""), onClick: function (e) {
          return e.stopPropagation();
        } },
      _react2["default"].createElement(
        "div",
        { className: "close", onClick: popUpHandler.bind(null, "close") },
        "x"
      ),
      _react2["default"].createElement(
        "div",
        { className: "title" },
        "Create A Poll"
      ),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement(
        "div",
        { className: "scroll" },
        _react2["default"].createElement(
          "form",
          { onSubmit: this.submit },
          _react2["default"].createElement(
            "div",
            { className: "section" },
            _react2["default"].createElement(
              "label",
              null,
              _react2["default"].createElement(
                "div",
                { className: "label bold" },
                "Title/Intro"
              ),
              _react2["default"].createElement("input", { type: "text", ref: "title", className: "" + (this.state.validation["titleValid"] ? " valid" : ""), onChange: this.validate.bind(null, "title") }),
              _react2["default"].createElement(
                "div",
                null,
                this.state.validation["titleCount"],
                "/",
                _react2["default"].createElement(
                  "span",
                  { className: "" + (this.state.validation["titleCount"] < this.state.validation["titleMin"] ? "color-red" : "") },
                  this.state.validation["titleMin"]
                ),
                "-",
                _react2["default"].createElement(
                  "span",
                  { className: "" + (this.state.validation["titleCount"] > this.state.validation["titleMax"] ? "color-red" : "") },
                  this.state.validation["titleMax"]
                )
              )
            )
          ),
          _react2["default"].createElement("div", { className: "separator-1-dim" }),
          _react2["default"].createElement(
            "div",
            { className: "section" },
            _react2["default"].createElement(
              "label",
              null,
              _react2["default"].createElement(
                "div",
                { className: "label bold" },
                "Add Choices"
              ),
              _react2["default"].createElement("div", { className: "separator-1-dim" }),
              _react2["default"].createElement("div", { className: "section" }),
              choices.map(function (choiceData, choiceID) {
                return _react2["default"].createElement(ChoiceInput, _extends({ key: choiceID }, _this2.props, { changeCB: _this2.choiceInputChange, removeCB: _this2.removeChoice, choiceID: choiceID, choiceData: choiceData }));
              }),
              _react2["default"].createElement(
                "div",
                { className: "section column" },
                _react2["default"].createElement("div", { className: "separator-1-dim" })
              ),
              _react2["default"].createElement(
                "button",
                { className: "btn-default", onClick: this.addChoice, tabIndex: "0" },
                "Add Choice"
              )
            )
          ),
          _react2["default"].createElement("div", { className: "separator-1-dim" }),
          _react2["default"].createElement(
            "div",
            { className: "section" },
            _react2["default"].createElement(
              "label",
              null,
              _react2["default"].createElement(
                "div",
                { className: "label bold" },
                "Set TIme Limit"
              ),
              _react2["default"].createElement("div", { className: "separator-1-dim" }),
              _react2["default"].createElement(
                "div",
                { className: "section" },
                _react2["default"].createElement(
                  "div",
                  { className: "label bold" },
                  "Days: "
                ),
                _react2["default"].createElement(
                  "select",
                  { ref: "days", onChange: this.updateTimes },
                  daysOptions
                )
              ),
              _react2["default"].createElement(
                "div",
                { className: "section" },
                _react2["default"].createElement(
                  "div",
                  { className: "label bold" },
                  "Hours: "
                ),
                _react2["default"].createElement(
                  "select",
                  { ref: "hours", onChange: this.updateTimes },
                  hoursOptions
                )
              ),
              _react2["default"].createElement(
                "div",
                { className: "section" },
                _react2["default"].createElement(
                  "div",
                  { className: "label bold" },
                  "Minutes: "
                ),
                _react2["default"].createElement(
                  "select",
                  { ref: "minutes", onChange: this.updateTimes },
                  minutesOptions
                )
              ),
              _react2["default"].createElement(
                "div",
                { className: "section" },
                _react2["default"].createElement(
                  "div",
                  { className: "label" },
                  "Time frame: ",
                  time
                )
              )
            )
          ),
          _react2["default"].createElement(
            "div",
            { className: "section" },
            _react2["default"].createElement(
              "button",
              { className: "submit btn-default" },
              "Submit"
            )
          )
        )
      )
    );
  }
});

exports.MakePoll = MakePoll;
// poll voting related components
var ChoiceOption = _react2["default"].createClass({
  displayName: "ChoiceOption",
  vote: function vote() {
    var _props4 = this.props;
    var fireRef = _props4.fireRef;
    var userData = _props4.userData;
    var pollID = _props4.pollID;
    var choiceID = _props4.choiceData.choiceID;
    var popUpHandler = _props4.methods.popUpHandler;

    console.log(this.props);
    fireRef.pollsRef.child(pollID).child("votes").child(userData.name).set({
      username: userData.name,
      vote: choiceID
    });
    fireRef.usersRef.child(userData.name).child("pollsParticipated").child(pollID).set(true);
    popUpHandler("viewPoll", { pollID: pollID });
  },
  render: function render() {
    var _props5 = this.props;
    var fireRef = _props5.fireRef;
    var userData = _props5.userData;
    var choiceData = _props5.choiceData;

    return _react2["default"].createElement(
      "div",
      { className: "section" },
      _react2["default"].createElement(
        "label",
        { className: "choice" },
        _react2["default"].createElement(
          "div",
          { className: "label" },
          _react2["default"].createElement(
            "div",
            { className: "spread" },
            _react2["default"].createElement(
              "div",
              { className: "text" },
              choiceData.text
            ),
            _react2["default"].createElement(
              "div",
              { className: "checkbox", onClick: this.vote },
              "✔"
            )
          )
        )
      )
    );
  }
});

var VotePoll = _react2["default"].createClass({
  displayName: "VotePoll",
  getInitialState: function getInitialState() {
    return {
      pollData: null
    };
  },
  getPollData: function getPollData() {
    var _this3 = this;

    var _props6 = this.props;
    var fireRef = _props6.fireRef;
    var userData = _props6.userData;
    var pollID = _props6.pollID;
    var popUpHandler = _props6.methods.popUpHandler;

    fireRef.pollsRef.child(pollID).once("value").then(function (snap) {
      var pollData = snap.val();
      if (!pollData) return;
      if (pollData.votes && pollData.votes[userData.name]) {
        return popUpHandler("viewPoll", {
          pollID: pollID
        });
      }
      _this3.setState({
        pollData: pollData
      });
    });
  },
  componentDidMount: function componentDidMount() {
    this.getPollData();
  },
  render: function render() {
    // console.log(this.props);
    var _props7 = this.props;
    var auth = _props7.auth;
    var overlay = _props7.overlay;
    var fireRef = _props7.fireRef;
    var pollID = _props7.pollID;
    var userData = _props7.userData;
    var methods = _props7.methods;
    var popUpHandler = _props7.methods.popUpHandler;

    // console.log(this.state);
    var pollData = this.state.pollData;

    if (pollData) {
      return _react2["default"].createElement(
        "div",
        { className: "overlay-ui-default vote-poll" + (overlay === "votePoll" ? " open" : ""), onClick: function (e) {
            return e.stopPropagation();
          } },
        _react2["default"].createElement(
          "div",
          { className: "close", onClick: popUpHandler.bind(null, "close") },
          "x"
        ),
        _react2["default"].createElement(
          "div",
          { className: "title" },
          _react2["default"].createElement(
            _reactRouter.Link,
            { to: "/profile/" + pollData.creator },
            pollData.creator
          ),
          "'s Poll: \"",
          pollData.title,
          "\""
        ),
        _react2["default"].createElement("div", { className: "separator-4-dim" }),
        _react2["default"].createElement("div", { className: "separator-4-dim" }),
        _react2["default"].createElement("div", { className: "separator-4-dim" }),
        _react2["default"].createElement("div", { className: "separator-4-dim" }),
        _react2["default"].createElement(
          "div",
          { className: "scroll" },
          _react2["default"].createElement(
            "div",
            { className: "title sub" },
            "Votes:"
          ),
          _react2["default"].createElement(
            "div",
            { className: "section" },
            _react2["default"].createElement(
              "label",
              null,
              _react2["default"].createElement(
                "div",
                { className: "label" },
                Object.keys(pollData.choices).map(function (choiceID) {
                  return _react2["default"].createElement(ChoiceOption, {
                    key: choiceID,
                    userData: userData,
                    fireRef: fireRef,
                    pollID: pollID,
                    choiceData: {
                      text: pollData.choices[choiceID],
                      choiceID: choiceID
                    }, methods: methods });
                })
              )
            )
          ),
          _react2["default"].createElement(
            "div",
            { className: "section" },
            _react2["default"].createElement(
              "label",
              null,
              _react2["default"].createElement(
                "div",
                { className: "label" },
                _react2["default"].createElement(
                  "div",
                  { className: "label bold" },
                  "Copy Link"
                ),
                _react2["default"].createElement("input", { type: "test", value: "http://" + (location ? location.host : "localhost:8080") + "/profile/" + pollData.creator + "/p/" + pollID, onClick: function (e) {
                    return e.target.select();
                  }, readOnly: true })
              )
            )
          )
        )
      );
    } else {
      return _react2["default"].createElement(
        "div",
        { className: "overlay-ui-default vote-poll" + (overlay === "votePoll" ? " open" : ""), onClick: function (e) {
            return e.stopPropagation();
          } },
        _react2["default"].createElement(
          "div",
          { className: "title" },
          "No poll data"
        )
      );
    }
  }
});

exports.VotePoll = VotePoll;
// poll viewing related components
var ChoiceItem = _react2["default"].createClass({
  displayName: "ChoiceItem",
  render: function render() {
    var _props8 = this.props;
    var auth = _props8.auth;
    var fireRef = _props8.fireRef;
    var userData = _props8.userData;
    var choiceData = _props8.choiceData;

    // console.log("vote:", choiceData);
    if (!choiceData.calcData) return null;

    return _react2["default"].createElement(
      "div",
      { className: "section" },
      _react2["default"].createElement(
        "label",
        { className: "choice" },
        _react2["default"].createElement(
          "div",
          { className: "label" },
          _react2["default"].createElement("div", { className: "gauge", style: {
              width: 100 * choiceData.calcData.percentage + "%"
            } }),
          _react2["default"].createElement(
            "div",
            { className: "spread" },
            _react2["default"].createElement(
              "div",
              { className: "text" },
              choiceData.text
            ),
            _react2["default"].createElement(
              "div",
              { className: "number" },
              choiceData.calcData.votes,
              " | ",
              100 * choiceData.calcData.percentage,
              "%"
            )
          )
        )
      )
    );
  }
});

var ViewPoll = _react2["default"].createClass({
  displayName: "ViewPoll",
  getInitialState: function getInitialState() {
    return {
      pollData: null,
      comments: null,
      calculatedData: {
        // <voteID>: Object
      }
    };
  },
  getPollData: function getPollData() {
    var _this4 = this;

    var _props9 = this.props;
    var fireRef = _props9.fireRef;
    var pollID = _props9.pollID;

    fireRef.pollsRef.child(pollID).once("value").then(function (snap) {
      var pollData = snap.val();
      if (!pollData) return;
      _this4.setState({
        pollData: pollData
      }, function () {
        if (pollData) {
          _this4.timeTicker();
          _this4.initVoteListener();
        }
      });
    });
  },
  timeTicker: function timeTicker() {
    var _this5 = this;

    var pollData = this.state.pollData;

    // only initiate the ticker if the end time is finite
    if (pollData.endTime !== Infinity) {
      // this ticker will update the component every 1/10 of a second to update the vote button
      // if the current time surpasses the end time the user can no longer vote
      this.ticker = setInterval(function () {
        if (Date.now() >= pollData.endDate) {
          clearInterval(_this5.ticker);
        }
        _this5._mounted ? _this5.setState({}) : null;
      }, 100);
    }
  },
  initVoteListener: function initVoteListener() {
    var _props10 = this.props;
    var userData = _props10.userData;
    var fireRef = _props10.fireRef;
    var pollID = _props10.pollID;

    this.calculate();
    fireRef.pollsRef.child(pollID).child("votes").on("child_added", this.newVote);
  },
  newVote: function newVote(snap) {
    var username = snap.getKey();
    var voteData = snap.val();

    // console.log("new vote", username, voteData);

    var newPollData = JSON.parse(JSON.stringify(this.state.pollData || {}));

    newPollData.votes = newPollData.votes || {};
    newPollData.votes[username] = voteData;

    this.setState({
      pollData: newPollData
    }, this.calculate);
  },
  uninitListener: function uninitListener() {
    var _props11 = this.props;
    var userData = _props11.userData;
    var fireRef = _props11.fireRef;
    var pollID = _props11.pollID;

    this.calculate();
    fireRef.pollsRef.child(pollID).child("votes").off("child_added", this.newVote);

    fireRef.commentsRef.child(this.props.pollID).orderByChild("reply").equalTo(false).off("child_added", this.newComment);
  },
  calculate: function calculate() {
    var _this6 = this;

    var pollData = this.state.pollData;

    var calculatedData = {};

    if (pollData.votes) {
      (function () {
        var votesArray = Object.keys(pollData.votes);
        votesArray.map(function (username) {
          var voteData = pollData.votes[username];
          if (!calculatedData[voteData.vote]) {
            calculatedData[voteData.vote] = {
              votes: 0,
              percentage: 0
            };
          }
          calculatedData[voteData.vote].votes += 1;
        });
        var totalVotes = votesArray.length;
        // console.log("calculated data", calculatedData);
        Object.keys(pollData.choices).map(function (choiceID) {
          if (!calculatedData[choiceID]) {
            calculatedData[choiceID] = {
              votes: 0,
              percentage: 0
            };
          } else {
            calculatedData[choiceID].percentage = calculatedData[choiceID].votes / totalVotes;
          }
        });
        _this6.setState({
          calculatedData: calculatedData
        });
      })();
    } else {
      Object.keys(pollData.choices).map(function (choiceID) {
        calculatedData[choiceID] = {
          votes: 0,
          percentage: 0
        };
      });
      this.setState({
        calculatedData: calculatedData
      });
    }
  },
  newComment: function newComment(snap) {
    var commentKey = snap.getKey();
    var commentData = snap.val();
    var newComments = JSON.parse(JSON.stringify(this.state.comments));
    // console.log("new comment", commentKey, commentData);
    this.setState({
      comments: Object.assign(_defineProperty({}, commentKey, commentData), newComments || {})
    });
  },
  initCommentListener: function initCommentListener() {
    // console.log("initiating comment listener");
    var _props12 = this.props;
    var pollID = _props12.pollID;
    var fireRef = _props12.fireRef;

    fireRef.commentsRef.child(pollID).orderByChild("reply").equalTo(false).on("child_added", this.newComment);
  },
  componentDidMount: function componentDidMount() {
    var _this7 = this;

    this._mounted = true;
    var _props13 = this.props;
    var pollID = _props13.pollID;
    var fireRef = _props13.fireRef;

    fireRef.commentsRef.child(pollID).orderByChild("reply").equalTo(false).once("value").then(function (snap) {
      var comments = snap.val();

      _this7.setState({
        comments: comments
      }, _this7.initCommentListener);
    });

    this.getPollData();
  },
  componentWillUnmount: function componentWillUnmount() {
    delete this._mounted;
    this.uninitListener();
  },
  render: function render() {
    // console.log(this.props);
    var _props14 = this.props;
    var auth = _props14.auth;
    var overlay = _props14.overlay;
    var fireRef = _props14.fireRef;
    var pollID = _props14.pollID;
    var userData = _props14.userData;
    var popUpHandler = _props14.methods.popUpHandler;
    var calculatedData = this.state.calculatedData;

    // console.log(this.state);
    var _state2 = this.state;
    var pollData = _state2.pollData;
    var comments = _state2.comments;

    if (pollData) {
      // create array of comment items
      var commentList = Object.keys(comments || {}).map(function (commentID) {
        var commentData = comments[commentID];
        return _react2["default"].createElement(_commentToolsJsx.CommentItem, { auth: auth, key: commentID, commentID: commentID, commentData: commentData, pollID: pollID, pollData: pollData, fireRef: fireRef, userData: userData });
      });
      // console.log("date", Date.now(), pollData.endDate, Date.now() < pollData.endDate);
      return _react2["default"].createElement(
        "div",
        { className: "overlay-ui-default view-poll" + (overlay === "viewPoll" ? " open" : ""), onClick: function (e) {
            return e.stopPropagation();
          } },
        _react2["default"].createElement(
          "div",
          { className: "close", onClick: popUpHandler.bind(null, "close") },
          "x"
        ),
        _react2["default"].createElement(
          "div",
          { className: "title" },
          _react2["default"].createElement(
            _reactRouter.Link,
            { to: "/profile/" + pollData.creator },
            pollData.creator
          ),
          "'s Poll: \"",
          pollData.title,
          "\""
        ),
        _react2["default"].createElement("div", { className: "separator-4-dim" }),
        _react2["default"].createElement("div", { className: "separator-4-dim" }),
        _react2["default"].createElement("div", { className: "separator-4-dim" }),
        _react2["default"].createElement("div", { className: "separator-4-dim" }),
        _react2["default"].createElement(
          "div",
          { className: "scroll" },
          _react2["default"].createElement(
            "div",
            { className: "title sub" },
            "Votes:"
          ),
          _react2["default"].createElement(
            "div",
            { className: "section" },
            _react2["default"].createElement(
              "label",
              null,
              _react2["default"].createElement(
                "div",
                { className: "label" },
                Object.keys(pollData.choices).map(function (choiceID) {
                  return _react2["default"].createElement(ChoiceItem, { key: choiceID, choiceData: {
                      text: pollData.choices[choiceID],
                      calcData: calculatedData[choiceID]
                    } });
                })
              )
            )
          ),
          _react2["default"].createElement("div", { className: "separator-4-dim" }),
          _react2["default"].createElement(
            "div",
            { className: "section" },
            _react2["default"].createElement(
              "label",
              null,
              _react2["default"].createElement(
                "div",
                { className: "label" },
                _react2["default"].createElement(
                  "div",
                  { className: "label bold" },
                  "Copy Link"
                ),
                _react2["default"].createElement("input", { type: "test", value: "http://" + (location ? location.host : "localhost:8080") + "/profile/" + pollData.creator + "/p/" + pollID, onClick: function (e) {
                    return e.target.select();
                  }, readOnly: true })
              )
            )
          ),
          _react2["default"].createElement("div", { className: "separator-4-dim" }),
          _react2["default"].createElement("div", { className: "separator-4-dim" }),
          _react2["default"].createElement(
            "div",
            { className: "section" },
            !userData ? "Login to vote!" : Date.now() >= pollData.endDate ? "Voting closed" : !pollData.votes || !pollData.votes[userData.name] ? _react2["default"].createElement(
              "button",
              { className: "submit btn-default", onClick: popUpHandler.bind(null, "votePoll", { pollID: pollID }) },
              "Vote On Poll"
            ) : "You've casted your vote!"
          ),
          _react2["default"].createElement(
            "div",
            { className: "title sub" },
            "Comments:"
          ),
          _react2["default"].createElement(
            "div",
            { className: "section" },
            _react2["default"].createElement(
              "label",
              null,
              _react2["default"].createElement(_commentToolsJsx.CommentTool, _extends({}, this.props, { pollData: pollData }))
            )
          ),
          _react2["default"].createElement(
            "div",
            { className: "section" },
            _react2["default"].createElement(
              "label",
              null,
              _react2["default"].createElement(
                "div",
                { className: "label" },
                commentList.length > 0 ? commentList : "No comments"
              )
            )
          )
        )
      );
    } else {
      return _react2["default"].createElement(
        "div",
        { className: "overlay-ui-default view-poll" + (overlay === "viewPoll" ? " open" : ""), onClick: function (e) {
            return e.stopPropagation();
          } },
        _react2["default"].createElement(
          "div",
          { className: "title" },
          "No poll data"
        )
      );
    }
  }
});

exports.ViewPoll = ViewPoll;
// all polls viewing related components
var CreatedItem = _react2["default"].createClass({
  displayName: "CreatedItem",
  getInitialState: function getInitialState() {
    return {
      pollData: null
    };
  },
  render: function render() {
    var _props15 = this.props;
    var pollID = _props15.pollID;
    var pollData = _props15.pollData;
    var locations = _props15.locations;
    var popUpHandler = _props15.methods.popUpHandler;

    _objectDestructuringEmpty(
    // pollData
    this.state);

    var completed = undefined,
        symbol = "&#x2716;";

    if (Date.now() >= pollData.endDate) {
      completed = "completed";
      symbol = "&#x2714";
    }

    return _react2["default"].createElement(
      "div",
      { className: "poll-item" },
      _react2["default"].createElement(
        "label",
        null,
        _react2["default"].createElement(
          _reactRouter.Link,
          { className: "name", to: {
              pathname: "/profile/" + pollData.creator + "/p/" + pollID,
              state: {
                modal: true,
                returnTo: location.pathname
              }
            }, onClick: function (e) {
              popUpHandler("viewPoll", {
                pollID: pollID
              });
            } },
          pollData.title
        ),
        _react2["default"].createElement("span", { className: completed, dangerouslySetInnerHTML: { __html: symbol } })
      )
    );
  }
});

var ParticipatedItem = _react2["default"].createClass({
  displayName: "ParticipatedItem",
  getInitialState: function getInitialState() {
    return {
      pollData: null
    };
  },
  componentDidMount: function componentDidMount() {
    var _this8 = this;

    var _props16 = this.props;
    var pollID = _props16.pollID;
    var fireRef = _props16.fireRef;

    fireRef.pollsRef.child(pollID).once("value").then(function (snap) {
      var pollData = snap.val();
      console.log("got poll data", pollData);
      _this8.setState({
        pollData: pollData
      });
    });
  },
  render: function render() {
    var _props17 = this.props;
    var pollID = _props17.pollID;
    var locations = _props17.locations;
    var popUpHandler = _props17.methods.popUpHandler;
    var pollData = this.state.pollData;

    if (!pollData) return null;

    var completed = undefined,
        symbol = "&#x2716;";

    if (Date.now() >= pollData.endDate) {
      completed = "completed";
      symbol = "&#x2714";
    }

    return _react2["default"].createElement(
      "div",
      { className: "participated-poll-item" },
      _react2["default"].createElement(
        "label",
        null,
        _react2["default"].createElement(
          _reactRouter.Link,
          { className: "name", to: {
              pathname: "/profile/" + pollData.creator + "/p/" + pollID,
              state: {
                modal: true,
                returnTo: location.pathname
              }
            }, onClick: function (e) {
              popUpHandler("viewPoll", {
                pollID: pollID
              });
            } },
          pollData.title
        ),
        _react2["default"].createElement("span", { className: completed, dangerouslySetInnerHTML: { __html: symbol } })
      )
    );
  }
});

var ViewCreatedPolls = _react2["default"].createClass({
  displayName: "ViewCreatedPolls",
  getInitialState: function getInitialState() {
    return {
      polls: null,
      participated: null,
      toggle: "created"
    };
  },
  componentDidMount: function componentDidMount() {
    var _this9 = this;

    var _props18 = this.props;
    var fireRef = _props18.fireRef;
    var userData = _props18.userData;

    fireRef.pollsRef.orderByChild("creator").equalTo(userData.name).once("value").then(function (snap) {
      var polls = snap.val();
      _this9.setState({
        polls: polls
      });
    });
    fireRef.usersRef.child(userData.name).child("pollsParticipated").once("value").then(function (snap) {
      var participated = snap.val();
      _this9.setState({
        participated: participated
      });
    });
  },
  toggleView: function toggleView(toggle) {
    this.setState({
      toggle: toggle
    });
  },
  render: function render() {
    var _props19 = this.props;
    var fireRef = _props19.fireRef;
    var userData = _props19.userData;
    var methods = _props19.methods;
    var popUpHandler = _props19.methods.popUpHandler;
    var _state3 = this.state;
    var polls = _state3.polls;
    var participated = _state3.participated;
    var toggle = _state3.toggle;

    var data = toggle === "created" ? polls : participated;
    // const data = polls;
    var Component = toggle === "created" ? CreatedItem : ParticipatedItem;
    // const Component = CreatedItem;

    var list = data ? Object.keys(data).map(function (pollID) {
      var thisData = data[pollID];
      return _react2["default"].createElement(Component, _extends({ key: pollID }, {
        fireRef: fireRef,
        pollID: pollID,
        pollData: thisData,
        location: location,
        methods: methods
      }));
    }) : [];

    return _react2["default"].createElement(
      "div",
      { className: "overlay-ui-default view-created-polls open", onClick: function (e) {
          return e.stopPropagation();
        } },
      _react2["default"].createElement(
        "div",
        { className: "close", onClick: popUpHandler.bind(null, "close") },
        "x"
      ),
      _react2["default"].createElement(
        "div",
        { className: "tabs" },
        _react2["default"].createElement(
          "div",
          { className: "asked", onClick: this.toggleView.bind(null, "created") },
          "Created"
        ),
        "|",
        _react2["default"].createElement(
          "div",
          { className: "answered", onClick: this.toggleView.bind(null, "voted On") },
          "Voted On"
        )
      ),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement(
        "div",
        { className: "title" },
        "Polls You've ",
        toggle.replace(/^(.)/, function (_, letter) {
          return letter.toUpperCase();
        })
      ),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement(
        "div",
        { className: "scroll" },
        _react2["default"].createElement(
          "div",
          { className: "section" },
          _react2["default"].createElement(
            "div",
            { className: "list" },
            list.length > 0 ? list : "You haven't " + toggle + " any polls yet."
          )
        ),
        _react2["default"].createElement("div", { className: "separator-4-dim" }),
        _react2["default"].createElement("div", { className: "separator-4-dim" }),
        _react2["default"].createElement(
          "div",
          { className: "section" },
          _react2["default"].createElement(
            "button",
            { className: "submit btn-default", onClick: popUpHandler.bind(null, "makePoll") },
            "Make New Poll"
          )
        )
      )
    );
  }
});
exports.ViewCreatedPolls = ViewCreatedPolls;