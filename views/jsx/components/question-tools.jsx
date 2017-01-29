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

var _modulesClientHelperTools = require("../../../modules/client/helper-tools");

var _voteToolJsx = require("./vote-tool.jsx");

var _voteToolJsx2 = _interopRequireDefault(_voteToolJsx);

var _commentToolsJsx = require("./comment-tools.jsx");

var _modulesClientAjax = require("../../../modules/client/ajax");

// for asking a question
var AskQuestion = _react2["default"].createClass({
  displayName: "AskQuestion",
  getInitialState: function getInitialState() {
    return {
      error: false,
      success: false,
      validation: {
        titleMin: 3,
        titleMax: 60,
        titleCount: 0,
        titleValid: false,
        bodyMin: 30,
        bodyMax: 2000,
        bodyCount: 0,
        bodyValid: false
      }
    };
  },
  submit: function submit(e) {
    var _this = this;

    e.preventDefault();
    var _props = this.props;
    var auth = _props.auth;
    var fireRef = _props.fireRef;
    var overlay = _props.overlay;
    var versionData = _props.versionData;
    var to = _props.to;
    var from = _props.from;
    var popUpHandler = _props.methods.popUpHandler;
    var _refs = this.refs;
    var title = _refs.title;
    var body = _refs.body;

    var questionObject = {
      // true if `access_token` exists
      creator: from,
      receiver: to,
      title: title.value,
      body: body.value,
      date: new Date().getTime(),
      sentStatuses: {
        "email": false,
        "notification": false
      },
      version: versionData
    };

    if (!this.state.validation.titleValid && !this.state.validation.bodyValid) return;
    // console.log("question object:", questionObject);
    // write question to `questions` node
    var questionID = fireRef.root.push().getKey();
    // console.log(questionID);
    fireRef.questionsRef.child(questionID).setWithPriority(questionObject, 0 - Date.now())["catch"](function (e) {
      return console.error(e.val ? e.val() : e);
    });

    // send notification
    // create notif obejct
    var notifObject = {
      type: "newQuestion",
      info: {
        sender: from,
        questionID: questionID,
        questionURL: "/profile/" + to + "/a/" + questionID
      },
      read: false,
      date: new Date().getTime(),
      version: versionData
    };
    // send notif
    fireRef.notificationsRef.child(to).push().set(notifObject)["catch"](function (e) {
      return console.error(e.val ? e.val() : e);
    });
    // write question ID reference to user.<username>.questionsForMe
    fireRef.usersRef.child(to + "/questionsForMe/" + questionID).setWithPriority(questionObject.date, 0 - Date.now())["catch"](function (e) {
      return console.error(e.val ? e.val() : e);
    });
    // write question ID reference to user.<username>.questionsForThem
    fireRef.usersRef.child(from + "/questionsForThem/" + questionID).setWithPriority(questionObject.date, 0 - Date.now())["catch"](function (e) {
      return console.error(e.val ? e.val() : e);
    });

    // close the pop up
    this.setState({
      success: true
    }, function () {
      setTimeout(function () {
        _this.props.methods.popUpHandler("close");
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
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.overlay === "askQuestion" && this.props.overlay !== "askQuestion") this.setState({
      success: false
    });
  },
  render: function render() {
    // console.log(this.props);
    var _props2 = this.props;
    var fireRef = _props2.fireRef;
    var overlay = _props2.overlay;
    var versionData = _props2.versionData;
    var to = _props2.to;
    var from = _props2.from;
    var body = _props2.body;
    var popUpHandler = _props2.methods.popUpHandler;
    var _state = this.state;
    var success = _state.success;
    var error = _state.error;

    if (!versionData || !fireRef) {
      return _react2["default"].createElement(
        "div",
        { className: "overlay-ui-default ask-question" + (overlay === "askQuestion" ? " open" : ""), onClick: function (e) {
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
        { className: "overlay-ui-default ask-question" + (overlay === "askQuestion" ? " open" : ""), onClick: function (e) {
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
        { className: "overlay-ui-default ask-question" + (overlay === "askQuestion" ? " open" : ""), onClick: function (e) {
            return e.stopPropagation();
          } },
        _react2["default"].createElement(
          "div",
          { className: "title" },
          "Question submitted to ",
          to,
          " successfully!"
        )
      );
    } else return _react2["default"].createElement(
      "div",
      { className: "overlay-ui-default ask-question" + (overlay === "askQuestion" ? " open" : ""), onClick: function (e) {
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
        "Ask ",
        to,
        " A Question"
      ),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement(
        "form",
        { onSubmit: this.submit },
        _react2["default"].createElement(
          "div",
          { className: "section" },
          _react2["default"].createElement(
            "span",
            { className: "label" },
            "To: "
          ),
          _react2["default"].createElement(
            "span",
            { className: "to" },
            to
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
              "What Do You Have To Ask?"
            ),
            _react2["default"].createElement("textarea", { ref: "body", className: "" + (this.state.validation["bodyValid"] ? " valid" : ""), onChange: this.validate.bind(null, "body") }),
            _react2["default"].createElement(
              "div",
              null,
              this.state.validation["bodyCount"],
              "/",
              _react2["default"].createElement(
                "span",
                { className: "" + (this.state.validation["bodyCount"] < this.state.validation["bodyMin"] ? "color-red" : "") },
                this.state.validation["bodyMin"]
              ),
              "-",
              _react2["default"].createElement(
                "span",
                { className: "" + (this.state.validation["bodyCount"] > this.state.validation["bodyMax"] ? "color-red" : "") },
                this.state.validation["bodyMax"]
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
    );
  }
});

exports.AskQuestion = AskQuestion;
// for answering a question
var AnswerQuestion = _react2["default"].createClass({
  displayName: "AnswerQuestion",
  getInitialState: function getInitialState() {
    return {
      error: false,
      success: false,
      versionData: null,
      questionData: null,
      validation: {
        titleMin: 3,
        titleMax: 60,
        titleCount: 0,
        titleValid: false,
        bodyMin: 30,
        bodyMax: 2000,
        bodyCount: 0,
        bodyValid: false
      }
    };
  },
  submit: function submit(e) {
    var _this2 = this;

    e.preventDefault();
    var _props3 = this.props;
    var auth = _props3.auth;
    var userData = _props3.userData;
    var fireRef = _props3.fireRef;
    var overlay = _props3.overlay;
    var questionID = _props3.questionID;
    var versionData = _props3.versionData;
    var popUpHandler = _props3.methods.popUpHandler;
    var questionData = this.state.questionData;
    var _refs2 = this.refs;
    var title = _refs2.title;
    var body = _refs2.body;

    var answerObject = {
      "username": userData.name,
      "body": body.value,
      "questionID": questionID,
      "date": new Date().getTime(),
      "sentStatuses": {
        "email": false,
        "notification": false
      },
      "version": this.state.versionData
    };
    if (!this.state.validation.bodyValid) return;
    // return console.log("question object:", answerObject);
    // write answer to `answers` node
    fireRef.answersRef.child(questionID).setWithPriority(answerObject, 0 - Date.now())["catch"](function (e) {
      return console.error(e.val ? e.val() : e);
    });
    // write answer reference to user account
    fireRef.usersRef.child(questionData.receiver).child("answersFromMe").child(questionID).setWithPriority(answerObject.date, 0 - Date.now())["catch"](function (e) {
      return console.error(e.val ? e.val() : e);
    });

    // send notification
    // create notif obejct
    var notifObject = {
      type: "newAnswer",
      info: {
        sender: userData.name,
        questionID: questionID,
        questionURL: "/profile/" + userData.name + "/q/" + questionID
      },
      read: false,
      date: new Date().getTime(),
      version: versionData
    };
    // send notif
    fireRef.notificationsRef.child(questionData.creator).push().set(notifObject)["catch"](function (e) {
      return console.error(e.val ? e.val() : e);
    });

    // close the pop up
    this.setState({
      success: true
    }, function () {
      setTimeout(function () {
        _this2.props.methods.popUpHandler("close");
      }, 2000);
    });
  },
  validate: function validate(name, e) {
    var _Object$assign2;

    // name will be the same as a referenced element
    // the name will be used to be validated, matched with a variable "suffix"
    var value = e.target.value;
    var thisMin = this.state.validation[name + "Min"];
    var thisMax = this.state.validation[name + "Max"];
    var thisValid = name + "Valid";
    var thisCount = name + "Count";
    this.setState({
      validation: Object.assign(this.state.validation, (_Object$assign2 = {}, _defineProperty(_Object$assign2, thisValid, value.length >= thisMin && value.length <= thisMax), _defineProperty(_Object$assign2, thisCount, value.length), _Object$assign2))
    });
  },
  componentDidMount: function componentDidMount() {
    var _this3 = this;

    var _props4 = this.props;
    var questionID = _props4.questionID;
    var fireRef = _props4.fireRef;
    var popUpHandler = _props4.methods.popUpHandler;

    (0, _modulesClientHelperTools.getQuestionData)(questionID, fireRef, null, function (questionData) {
      console.log("got question data", questionData);
      (0, _modulesClientHelperTools.getAnswerData)(questionID, fireRef, null, function (answerData) {
        console.log("got answer data", answerData);

        if (answerData) {
          popUpHandler("viewQuestion", {
            questionID: questionID
          });
        } else {
          _this3.setState({
            questionData: questionData
          });
        }
      });
    });
  },
  render: function render() {
    // console.log(this.props);
    var _props5 = this.props;
    var fireRef = _props5.fireRef;
    var overlay = _props5.overlay;
    var versionData = _props5.versionData;
    var popUpHandler = _props5.methods.popUpHandler;

    _objectDestructuringEmpty(this.props);

    var _state2 = this.state;
    var success = _state2.success;
    var error = _state2.error;
    var questionData = _state2.questionData;

    if (!versionData || !fireRef) {
      return _react2["default"].createElement(
        "div",
        { className: "overlay-ui-default answer-question" + (overlay === "answerQuestion" ? " open" : ""), onClick: function (e) {
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
        { className: "overlay-ui-default answer-question" + (overlay === "answerQuestion" ? " open" : ""), onClick: function (e) {
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
        { className: "overlay-ui-default answer-question" + (overlay === "answerQuestion" ? " open" : ""), onClick: function (e) {
            return e.stopPropagation();
          } },
        _react2["default"].createElement(
          "div",
          { className: "title" },
          "Question submitted to ",
          questionData.creator,
          " successfully!"
        )
      );
    } else if (questionData) {
      return _react2["default"].createElement(
        "div",
        { className: "overlay-ui-default answer-question" + (overlay === "answerQuestion" ? " open" : ""), onClick: function (e) {
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
          "Answer ",
          questionData.creator,
          "'s Question To You"
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
                  { className: "label title bold" },
                  questionData.title
                ),
                _react2["default"].createElement("div", { className: "separator-1-black" }),
                _react2["default"].createElement(
                  "div",
                  { className: "label body" },
                  _react2["default"].createElement(
                    "p",
                    null,
                    questionData.body
                  )
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
                  { className: "label bold" },
                  "What's Your Answer?"
                ),
                _react2["default"].createElement("textarea", { ref: "body", className: "" + (this.state.validation["bodyValid"] ? " valid" : ""), onChange: this.validate.bind(null, "body") }),
                _react2["default"].createElement(
                  "div",
                  null,
                  this.state.validation["bodyCount"],
                  "/",
                  _react2["default"].createElement(
                    "span",
                    { className: "" + (this.state.validation["bodyCount"] < this.state.validation["bodyMin"] ? "color-red" : "") },
                    this.state.validation["bodyMin"]
                  ),
                  "-",
                  _react2["default"].createElement(
                    "span",
                    { className: "" + (this.state.validation["bodyCount"] > this.state.validation["bodyMax"] ? "color-red" : "") },
                    this.state.validation["bodyMax"]
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
    } else {
      return _react2["default"].createElement(
        "div",
        { className: "overlay-ui-default answer-question" + (overlay === "answerQuestion" ? " open" : ""), onClick: function (e) {
            return e.stopPropagation();
          } },
        _react2["default"].createElement(
          "div",
          { className: "title" },
          "No question data"
        )
      );
    }
  }
});

exports.AnswerQuestion = AnswerQuestion;
// for viewing a question
var ViewQuestion = _react2["default"].createClass({
  displayName: "ViewQuestion",
  getInitialState: function getInitialState() {
    return {
      questionData: null,
      answerData: null,
      comments: null
    };
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
  initListener: function initListener() {
    // console.log("initiating comment listener");
    var _props6 = this.props;
    var questionID = _props6.questionID;
    var fireRef = _props6.fireRef;

    fireRef.commentsRef.child(questionID).orderByChild("reply").equalTo(false).on("child_added", this.newComment);
  },
  componentDidMount: function componentDidMount() {
    var _this4 = this;

    var _props7 = this.props;
    var questionID = _props7.questionID;
    var fireRef = _props7.fireRef;

    // console.log("viewing", this.props);

    // get question data
    (0, _modulesClientHelperTools.getQuestionData)(questionID, fireRef, null, function (questionData) {
      _this4.setState({
        questionData: questionData
      });
    });
    (0, _modulesClientHelperTools.getAnswerData)(questionID, fireRef, null, function (answerData) {
      _this4.setState({
        answerData: answerData
      });
    });
    (0, _modulesClientHelperTools.getCommentsData)(questionID, fireRef, function (refNode) {
      return refNode.orderByChild("reply").equalTo(false);
    }, function (commentsData) {
      // console.log("got commentsData", commentsData);
      _this4.setState({
        comments: commentsData
      }, _this4.initListener);
    });
  },
  componentWillUnmount: function componentWillUnmount() {
    var fireRef = this.props.fireRef;

    fireRef.commentsRef.child(this.props.questionID).orderByChild("reply").equalTo(false).off("child_added", this.newComment);
  },
  render: function render() {
    // console.log(this.props);
    var _props8 = this.props;
    var auth = _props8.auth;
    var overlay = _props8.overlay;
    var fireRef = _props8.fireRef;
    var questionID = _props8.questionID;
    var userData = _props8.userData;
    var popUpHandler = _props8.methods.popUpHandler;
    var _state3 = this.state;
    var questionData = _state3.questionData;
    var answerData = _state3.answerData;
    var comments = this.state.comments;

    var commentList = Object.keys(comments || {}).map(function (commentID) {
      var commentData = comments[commentID];
      return _react2["default"].createElement(_commentToolsJsx.CommentItem, { auth: auth, key: commentID, commentID: commentID, commentData: commentData, questionID: questionID, questionData: questionData, fireRef: fireRef, userData: userData });
    });

    if (questionData && answerData) {
      return _react2["default"].createElement(
        "div",
        { className: "overlay-ui-default view-question" + (overlay === "viewQuestion" ? " open" : ""), onClick: function (e) {
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
          questionData.creator,
          "'s Question To ",
          questionData.receiver
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
            "Question:"
          ),
          _react2["default"].createElement(
            "div",
            { className: "section" },
            _react2["default"].createElement(
              "label",
              null,
              _react2["default"].createElement(
                "div",
                { className: "label title bold" },
                questionData.title
              ),
              _react2["default"].createElement("div", { className: "separator-1-black" }),
              _react2["default"].createElement(
                "div",
                { className: "label" },
                questionData.body
              )
            ),
            _react2["default"].createElement(
              "label",
              { className: "vote" },
              _react2["default"].createElement(_voteToolJsx2["default"], { place: "question", auth: auth, questionID: questionID, questionData: questionData, fireRef: fireRef, userData: userData })
            )
          ),
          _react2["default"].createElement("div", { className: "separator-4-dim" }),
          _react2["default"].createElement(
            "div",
            { className: "title sub" },
            "Answer:"
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
                  "p",
                  null,
                  answerData.body
                )
              )
            ),
            _react2["default"].createElement(
              "label",
              { className: "vote" },
              _react2["default"].createElement(_voteToolJsx2["default"], { place: "answer", auth: auth, questionID: questionID, questionData: questionData, fireRef: fireRef, userData: userData })
            )
          ),
          _react2["default"].createElement("div", { className: "separator-4-dim" }),
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
              _react2["default"].createElement(_commentToolsJsx.CommentTool, _extends({}, this.props, { questionData: questionData }))
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
        { className: "overlay-ui-default view-question" + (overlay === "viewQuestion" ? " open" : ""), onClick: function (e) {
            return e.stopPropagation();
          } },
        _react2["default"].createElement(
          "div",
          { className: "title" },
          "No question data"
        )
      );
    }
  }
});

exports.ViewQuestion = ViewQuestion;
// for viewing a list of created questions
var QuestionItem = _react2["default"].createClass({
  displayName: "QuestionItem",
  getInitialState: function getInitialState() {
    return {
      answerData: null
    };
  },
  componentDidMount: function componentDidMount() {
    var _this5 = this;

    var _props9 = this.props;
    var questionID = _props9.questionID;
    var fireRef = _props9.fireRef;

    (0, _modulesClientHelperTools.getAnswerData)(questionID, fireRef, null, function (answerData) {
      console.log("got answer data");
      _this5.setState({
        answerData: answerData
      });
    });
  },
  render: function render() {
    var _props10 = this.props;
    var questionID = _props10.questionID;
    var questionData = _props10.questionData;
    var locations = _props10.locations;
    var popUpHandler = _props10.methods.popUpHandler;
    var answerData = this.state.answerData;

    return _react2["default"].createElement(
      "div",
      { className: "question-item" },
      answerData ? _react2["default"].createElement(
        "label",
        null,
        _react2["default"].createElement(
          _reactRouter.Link,
          { className: "name", to: {
              pathname: "/profile/" + questionData.receiver + "/q/" + questionID,
              state: {
                modal: true,
                returnTo: location.pathname
              }
            }, onClick: function (e) {
              popUpHandler("viewQuestion", {
                questionID: questionID
              });
            } },
          questionData.title
        ),
        _react2["default"].createElement(
          "span",
          { className: "answered" },
          "✔"
        )
      ) : _react2["default"].createElement(
        "label",
        null,
        _react2["default"].createElement(
          "a",
          { className: "name", href: "#" },
          questionData.title
        ),
        _react2["default"].createElement(
          "span",
          { className: "" },
          "✖"
        )
      )
    );
  }
});

var AnswerItem = _react2["default"].createClass({
  displayName: "AnswerItem",
  getInitialState: function getInitialState() {
    return {
      questionData: null
    };
  },
  componentDidMount: function componentDidMount() {
    var _this6 = this;

    var _props11 = this.props;
    var questionID = _props11.questionID;
    var fireRef = _props11.fireRef;

    (0, _modulesClientHelperTools.getQuestionData)(questionID, fireRef, null, function (questionData) {
      console.log("got question data");
      _this6.setState({
        questionData: questionData
      });
    });
  },
  render: function render() {
    var _props12 = this.props;
    var questionID = _props12.questionID;
    var answerData = _props12.answerData;
    var locations = _props12.locations;
    var popUpHandler = _props12.methods.popUpHandler;
    var questionData = this.state.questionData;

    if (!questionData) return null;

    return _react2["default"].createElement(
      "div",
      { className: "answer-item" },
      _react2["default"].createElement(
        "label",
        null,
        _react2["default"].createElement(
          _reactRouter.Link,
          { className: "name", to: {
              pathname: "/profile/" + questionData.receiver + "/q/" + questionID,
              state: {
                modal: true,
                returnTo: location.pathname
              }
            }, onClick: function (e) {
              popUpHandler("viewQuestion", {
                questionID: questionID
              });
            } },
          questionData.title
        ),
        _react2["default"].createElement(
          "span",
          { className: "answered" },
          "✔"
        )
      )
    );
  }
});

var ViewAskedQuestions = _react2["default"].createClass({
  displayName: "ViewAskedQuestions",
  getInitialState: function getInitialState() {
    return {
      questionData: null,
      answerData: null,
      toggle: "asked"
    };
  },
  componentDidMount: function componentDidMount() {
    var _this7 = this;

    var _props13 = this.props;
    var fireRef = _props13.fireRef;
    var userData = _props13.userData;

    fireRef.questionsRef.orderByChild("creator").equalTo(userData.name).once("value").then(function (snap) {
      var questionData = snap.val();
      _this7.setState({
        questionData: questionData
      });
    });
    fireRef.answersRef.orderByChild("username").equalTo(userData.name).once("value").then(function (snap) {
      var answerData = snap.val();
      _this7.setState({
        answerData: answerData
      });
    });
  },
  toggleView: function toggleView(toggle) {
    this.setState({
      toggle: toggle
    });
  },
  render: function render() {
    var _props14 = this.props;
    var fireRef = _props14.fireRef;
    var userData = _props14.userData;
    var methods = _props14.methods;
    var popUpHandler = _props14.methods.popUpHandler;
    var _state4 = this.state;
    var questionData = _state4.questionData;
    var answerData = _state4.answerData;
    var toggle = _state4.toggle;

    var data = toggle === "asked" ? questionData : answerData;
    var Component = toggle === "asked" ? QuestionItem : AnswerItem;

    var list = data ? Object.keys(data).map(function (questionID) {
      var thisData = data[questionID];
      return _react2["default"].createElement(Component, _extends({ key: questionID }, {
        fireRef: fireRef,
        questionID: questionID,
        questionData: thisData,
        AnswerData: thisData,
        location: location,
        methods: methods
      }));
    }) : [];

    return _react2["default"].createElement(
      "div",
      { className: "overlay-ui-default view-questions open", onClick: function (e) {
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
          { className: "asked", onClick: this.toggleView.bind(null, "asked") },
          "Asked"
        ),
        "|",
        _react2["default"].createElement(
          "div",
          { className: "answered", onClick: this.toggleView.bind(null, "answered") },
          "Answered"
        )
      ),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement(
        "div",
        { className: "title" },
        "Questions You've ",
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
        { className: "section" },
        _react2["default"].createElement(
          "div",
          { className: "list" },
          list.length > 0 ? list : "You haven't asked any questions yet."
        )
      )
    );
  }
});
exports.ViewAskedQuestions = ViewAskedQuestions;