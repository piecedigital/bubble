"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _userSideToolsJsx = require("./user/side-tools.jsx");

var _userSideToolsJsx2 = _interopRequireDefault(_userSideToolsJsx);

var _voteToolJsx = require("./vote-tool.jsx");

var _voteToolJsx2 = _interopRequireDefault(_voteToolJsx);

var _modulesClientHelperTools = require("../../../modules/client/helper-tools");

var _reactRouter = require("react-router");

var QuestionListItem = _react2["default"].createClass({
  displayName: "QuestionListItem",
  getInitialState: function getInitialState() {
    console.log("ques", this.props.initState);
    var questionData = null,
        answerData = null;
    if (this.props.initState) {
      questionData = this.props.initState.userQuestions.questions[this.props.questionID];
      answerData = this.props.initState.userQuestions.answers[this.props.questionID];
    }
    return Object.assign({
      questionData: questionData,
      answerData: answerData,
      commentData: null,
      ratingsData: null,
      calculatedRatings: null
    });
  },
  newAnswer: function newAnswer(snap) {
    var _this = this;

    var _props = this.props;
    var questionID = _props.questionID;
    var fireRef = _props.fireRef;

    var answerKey = snap.getKey();
    // console.log("new answer", answerKey, questionID);
    if (answerKey === questionID) {
      fireRef.answersRef.child(questionID).once("value").then(function (snap) {
        var answerData = snap.val();
        console.log("got new answer", answerData);
        _this.setState({
          answerData: answerData
        });
      });
    }
  },
  setupOverlay: function setupOverlay() {
    if (this.props.pageOverride === "featured") return;
    var _state = this.state;
    var questionData = _state.questionData;
    var answerData = _state.answerData;
    var calculatedRatings = _state.calculatedRatings;
    var _props2 = this.props;
    var myAuth = _props2.myAuth;
    var fireRef = _props2.fireRef;
    var userData = _props2.userData;
    var questionID = _props2.questionID;
    var params = _props2.params;
    var location = _props2.location;
    var popUpHandler = _props2.methods.popUpHandler;
  },
  setupAnswerListeners: function setupAnswerListeners() {
    var _props3 = this.props;
    var questionID = _props3.questionID;
    var fireRef = _props3.fireRef;
    var params = _props3.params;

    // set listener for new question
    var usersRefNode = fireRef.usersRef.child(this.state.questionData.receiver + "/answersFromMe").on("child_added", this.newAnswer);
  },
  setupRatingsListeners: function setupRatingsListeners() {
    var _props4 = this.props;
    var questionID = _props4.questionID;
    var fireRef = _props4.fireRef;
    var params = _props4.params;

    // set listener on ratings data
    // rating added
    fireRef.ratingsRef.child(questionID).on("child_added", this.newRating.bind(null, null)),
    // rating changed
    fireRef.ratingsRef.child(questionID).on("child_changed", this.newRating.bind(null, null));
    // rating removed
    fireRef.ratingsRef.child(questionID).on("child_removed", this.newRating.bind(null, true));
  },
  componentDidMount: function componentDidMount() {
    var _this2 = this;

    var _props5 = this.props;
    var questionID = _props5.questionID;
    var fireRef = _props5.fireRef;
    var params = _props5.params;
    var pageOverride = _props5.pageOverride;

    // get question data
    fireRef.questionsRef.child(questionID).once("value").then(function (snap) {
      var questionData = snap.val();
      _this2.setState({
        questionData: questionData
      }, _this2.setupAnswerListeners);
    });
    // get answer data
    fireRef.answersRef.child(questionID).once("value").then(function (snap) {
      var answerData = snap.val();
      _this2.setState({
        answerData: answerData
      }, function () {
        if (!pageOverride) {
          // do a possible page redirect if pageOverride is not present
          if (params.postID === questionID && !answerData) {
            console.log("no answer data", questionID, _this2.state);
            _reactRouter.browserHistory.push({
              pathname: "/profile/" + (params.username || (questionData ? questionData.receiver : ""))
            });
          }
        }
      });
    });

    this.setupOverlay();
  },
  componentWillUnmount: function componentWillUnmount() {
    var _props6 = this.props;
    var questionID = _props6.questionID;
    var fireRef = _props6.fireRef;

    // remove listener on ratings data
    // answered question added
    if (this.state.questionData) {
      fireRef.usersRef.child(this.state.questionData.receiver + "/answersFromMe").off("child_added", this.newQuestion);
    }
  },
  render: function render() {
    var _props7 = this.props;
    var auth = _props7.auth;
    var userData = _props7.userData;
    var fireRef = _props7.fireRef;
    var questionID = _props7.questionID;
    var _props7$params = _props7.params;
    var params = _props7$params === undefined ? {} : _props7$params;
    var location = _props7.location;
    var pageOverride = _props7.pageOverride;
    var popUpHandler = _props7.methods.popUpHandler;
    var _state2 = this.state;
    var questionData = _state2.questionData;
    var answerData = _state2.answerData;
    var calculatedRatings = _state2.calculatedRatings;

    if (!questionData) return null;
    if (pageOverride && !answerData) return null;

    var URL = pageOverride === "featured" ? "/" : null;

    return _react2["default"].createElement(
      "li",
      { className: "question-list-item " + pageOverride },
      _react2["default"].createElement(
        _reactRouter.Link,
        { to: answerData ? {
            pathname: "/profile/" + (questionData.receiver || (userData ? userData.name : "")) + "/q/" + questionID,
            state: {
              modal: true,
              returnTo: URL || "/profile/" + (questionData.receiver || "")
            }
          } : {
            pathname: URL || "/profile/" + (questionData.receiver || "")
          }, onClick: answerData ? popUpHandler.bind(null, "viewQuestion", {
            questionID: questionID
          }) : popUpHandler.bind(null, "answerQuestion", {
            questionID: questionID
          }) },
        _react2["default"].createElement(
          "div",
          { className: "wrapper" },
          _react2["default"].createElement(
            "div",
            { className: "info question" },
            _react2["default"].createElement(
              "div",
              { className: "title" },
              questionData.title
            ),
            _react2["default"].createElement(
              "div",
              { className: "body" },
              questionData.body.substr(0, 30),
              questionData.body.length > 30 ? "..." : ""
            )
          ),
          _react2["default"].createElement("div", { className: "separator-4-black" }),
          _react2["default"].createElement(
            "div",
            { className: "info answer" },
            _react2["default"].createElement(
              "div",
              { className: "" + (!answerData ? "bold" : "") },
              answerData ? answerData.body : [answerData ? null : _react2["default"].createElement(
                "div",
                { key: "no", className: "no-answer" },
                "!"
              ), "Click here to Answer!"]
            )
          )
        ),
        !pageOverride ? _react2["default"].createElement(
          "div",
          { className: "wrapper votes" },
          _react2["default"].createElement(
            "div",
            { className: "info question" },
            _react2["default"].createElement(_voteToolJsx2["default"], {
              auth: auth,
              userData: userData,
              fireRef: fireRef,
              place: "question",
              calculatedRatings: calculatedRatings,
              questionID: questionID,
              questionData: questionData
            })
          )
        ) : _react2["default"].createElement("div", { className: "separator-4-dim" })
      )
    );
  }
});

exports["default"] = _react2["default"].createClass({
  displayName: "UserQuestions",
  getInitialState: function getInitialState() {
    return Object.assign({
      questions: {},
      lastID: null,
      locked: true,
      lockedTop: true,
      loadData: false,
      queryLimit: this.props.pageOverride === "featured" ? 10 : 5
    }, this.props.initState ? this.props.initState.userQuestions || {} : {});
  },
  scrollEvent: function scrollEvent(e) {
    var _this3 = this;

    setTimeout(function () {
      var _refs = _this3.refs;
      var root = _refs.root;
      var tools = _refs.tools;

      if (root && tools) {
        var trueRoot = document.body.querySelector(".react-app .root");
        // console.log("root", root.offsetTop + root.offsetHeight);
        // console.log("trueRoot", trueRoot.scrollTop);
        var bottom = root.offsetTop + root.offsetHeight - tools.offsetHeight - 16 * 4.75;
        // console.log("bottom", bottom);

        // lock the tools menu to the top of it's parent
        // if the top of the page root is higher than or equal to the top of the app root
        if (trueRoot.scrollTop <= root.offsetTop) {
          _this3.setState({
            locked: true,
            lockedTop: true
          });
        } else
          // lock the tools menu to the bottom of it's parent
          // if the top of the page root is lower than or equal to the top of the app root
          if (trueRoot.scrollTop >= bottom) {
            _this3.setState({
              locked: true,
              lockedTop: false
            });
          } else {
            // don't lock anything; fix it to the page scrolling
            _this3.setState({
              locked: false,
              lockedTop: false
            });
          }
      }
    }, 200);
  },
  getQuestions: function getQuestions() {
    var _this4 = this;

    console.log("tryna get questions", this.props);
    this.setState({
      loadingData: true
    }, function () {
      var queryLimit = _this4.state.queryLimit;
      var _props8 = _this4.props;
      var fireRef = _props8.fireRef;
      var userData = _props8.userData;
      var _props8$params = _props8.params;
      var params = _props8$params === undefined ? {} : _props8$params;
      var pageOverride = _props8.pageOverride;

      // if(!userData) return;
      // console.log("search params", params.username, userData, this.state.lastID);
      var refNode = fireRef;
      // for the featured component we want to get all recent questions
      if (pageOverride === "Featured") {
        refNode = refNode.answersRef;
      } else {
        // if we're on a profile we just want questions for a specific user
        // if we're on the signed in user's profile we'll get all questions for them
        // else, we'll get answered questions
        refNode = refNode.usersRef.child((params.username || (userData ? userData.name : undefined)) + "/" + (!userData || params.username && params.username !== userData.name ? "answersFromMe" : "questionsForMe"));
      }
      if (_this4.state.lastID) {
        refNode = refNode.orderByKey().endAt(_this4.state.lastID || 0).limitToLast(queryLimit + 1);
      } else {
        refNode = refNode.orderByKey().limitToLast(queryLimit);
      }
      refNode.once("value").then(function (snap) {
        var questions = snap.val();
        var newQuestions = JSON.parse(JSON.stringify(_this4.state.questions));
        // console.log("questions", questions);
        _this4.setState({
          questions: Object.assign(newQuestions, questions),
          lastID: questions ? Object.keys(questions).pop() : null,
          loadingData: false
        }, function () {
          // console.log(this.state);
        });
      });
    });
  },
  xrefresh: function xrefresh() {},
  refreshList: function refreshList() {
    this.setState({
      questions: {},
      lastID: null
    }, this.getQuestions);
  },
  gatherData: function gatherData() {
    this.getQuestions();
  },
  xapplyFilter: function xapplyFilter() {},
  newAnswer: function newAnswer(snap) {
    var questionKey = snap.getKey();
    var questionData = snap.val();
    console.log("new question", questionKey, questionData);
    var newQuestions = JSON.parse(JSON.stringify(this.state.questions || {}));

    this.setState({
      questions: Object.assign(newQuestions, _defineProperty({}, questionKey, questionData)),
      lastID: questionKey,
      loadingData: false
    });
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (this.props.params) {
      var last = this.props.params.username,
          curr = nextProps.params.username,
          signedIn = this.props.userData ? this.props.userData.name : "";
      if (last || curr) {
        if (last !== signedIn && curr !== signedIn && last !== curr) {
          this.setState({
            questions: {},
            lastID: null
          }, this.getQuestions);
        }
      }
    }
  },
  componentDidMount: function componentDidMount(prevProps) {
    var _this5 = this;

    console.log("mounted user quesions");
    var _props9 = this.props;
    var fireRef = _props9.fireRef;
    var userData = _props9.userData;
    var params = _props9.params;
    var pageOverride = _props9.pageOverride;

    if (fireRef) {
      this.getQuestions();
    }

    // set listener on questions or answers
    if (pageOverride === "featured") {
      fireRef.answersRef.orderByKey().limitToFirst(10).once("value").then(function (snap) {
        var answers = snap.val();

        var questions = {};

        new Promise(function (resolve, reject) {
          Object.keys(answers || {}).map(function (questionID, ind, arr) {
            var answerData = answers[questionID];

            fireRef.questionsRef.child(questionID).once("value").then(function (snap) {
              var questionData = snap.val();
              questions[questionID] = {
                questionData: questionData,
                answerData: answerData
              };
              if (ind === arr.length - 1) {
                resolve();
              }
            });
          });
        }).then(function () {
          _this5.setState({
            questions: questions
          });
        });
      });
    } else {
      // fireRef.usersRef
      // .child(`${params.username || userData.name}/${params.username && params.username !== userData.name ? "answersFromMe" : "questionsForMe"}`)
      // .on("child_added", this.newAnswer);
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    console.log("unounting question");
    var _props10 = this.props;
    var fireRef = _props10.fireRef;
    var userData = _props10.userData;
    var _props10$params = _props10.params;
    var params = _props10$params === undefined ? {} : _props10$params;

    fireRef.usersRef.child((params.username || (userData ? userData.name : "")) + "/" + (!userData || params.username && params.username !== userData.name ? "answersFromMe" : "questionsForMe")).off("child_added", this.newAnswer);
  },
  render: function render() {
    var _state3 = this.state;
    var locked = _state3.locked;
    var lockedTop = _state3.lockedTop;
    var loadingData = _state3.loadingData;
    var questions = _state3.questions;
    var _props11 = this.props;
    var auth = _props11.auth;
    var userData = _props11.userData;
    var params = _props11.params;
    var location = _props11.location;
    var fireRef = _props11.fireRef;
    var overlay = _props11.overlay;
    var methods = _props11.methods;
    var pageOverride = _props11.pageOverride;
    var initState = _props11.initState;

    // make an array of questions
    var list = questions ? Object.keys(questions).map(function (questionID) {
      return _react2["default"].createElement(QuestionListItem, { key: questionID, userData: userData, questionID: questionID, location: location, params: params, fireRef: fireRef, auth: auth, overlay: overlay, pageOverride: pageOverride, methods: methods, initState: initState });
    }) : null;
    return _react2["default"].createElement(
      "div",
      { ref: "root", className: "user-questions tool-assisted" + (locked ? " locked" : "") },
      !pageOverride ? _react2["default"].createElement(
        "div",
        { className: "title" },
        "Questions"
      ) : null,
      pageOverride === "featured" ? _react2["default"].createElement(
        "div",
        { className: "section-title" },
        "Top Questions"
      ) : null,
      _react2["default"].createElement(
        "div",
        { className: "wrapper" },
        _react2["default"].createElement(
          "div",
          { className: "list" },
          list
        )
      ),
      !pageOverride ? _react2["default"].createElement(_userSideToolsJsx2["default"], {
        refresh: this.refresh,
        refreshList: this.refreshList,
        gatherData: this.gatherData,
        applyFilter: this.applyFilter,
        locked: locked,
        lockedTop: lockedTop,
        loadingData: loadingData
      }) : null
    );
  }
});
module.exports = exports["default"];