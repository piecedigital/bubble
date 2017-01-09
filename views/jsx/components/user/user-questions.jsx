"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _sideToolsJsx = require("./side-tools.jsx");

var _sideToolsJsx2 = _interopRequireDefault(_sideToolsJsx);

var _voteToolJsx = require("../vote-tool.jsx");

var _voteToolJsx2 = _interopRequireDefault(_voteToolJsx);

var _reactRouter = require("react-router");

var QuestionListItem = _react2["default"].createClass({
  displayName: "QuestionListItem",
  getInitialState: function getInitialState() {
    return { questionData: null, answerData: null, commentData: null, ratingsData: null, calculatedRatings: null };
  },
  calculateRatings: function calculateRatings() {
    var ratingsData = this.state.ratingsData;
    var userData = this.props.userData;

    var calculatedRatings = {};
    // don't continue if there is no ratings data
    if (!ratingsData) return;
    if (!userData) return setTimeout(this.calculateRatings, 100);

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
      if (voteData.username === userData.name) {
        calculatedRatings[place].myVote = voteData.upvote;
        calculatedRatings[place]["for"] = voteData["for"];
      }
    });
    ["question", "answer", "comment"].map(function (place) {
      calculatedRatings[place].upvotes = calculatedRatings[place].upvotes.length;
      calculatedRatings[place].downvotes = calculatedRatings[place].downvotes.length;
      calculatedRatings[place].overall = calculatedRatings[place].upvotes - calculatedRatings[place].downvotes;
    });

    this.setState({
      calculatedRatings: calculatedRatings
    });
  },
  newQuestion: function newQuestion(snap) {
    var _this = this;

    var _props = this.props;
    var questionID = _props.questionID;
    var fireRef = _props.fireRef;

    var answerKey = snap.getKey();
    console.log("new answer", answerKey, questionID);
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
  newRating: function newRating(dleet, snap) {
    var _this2 = this;

    var ratingsKey = snap.getKey();
    var ratingsData = snap.val();
    // console.log("shit changed", ratingsKey, ratingsData);
    var newData = JSON.parse(JSON.stringify(this.state.ratingsData));
    if (dleet) delete newData[ratingsKey];
    this.setState({
      ratingsData: Object.assign(newData || {}, dleet ? {} : _defineProperty({}, ratingsKey, ratingsData))
    }, function () {
      _this2.calculateRatings();
      if (_this2.props.overlay === "viewQuestion") {
        setTimeout(_this2.setupOverlay, 100);
      }
    });
  },
  checkIfOverlayNeeded: function checkIfOverlayNeeded() {},
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

    // set up pop up overlay for question view if at question URL
    if (params.questionID === questionID && !location.state || location.state && !location.state.modal) {
      _reactRouter.browserHistory.push({
        pathname: "/profile/" + (params.username || userData.name) + "/q/" + questionID,
        state: {
          modal: true,
          returnTo: "/profile/" + (params.username || "")
        }
      });
      // console.log("open pop ");
      popUpHandler("viewQuestion", {
        questionData: Object.assign(questionData, { questionID: questionID }),
        answerData: answerData,
        voteToolData: {
          myAuth: myAuth,
          userData: userData,
          fireRef: fireRef,
          place: "question",
          calculatedRatings: calculatedRatings,
          questionData: questionData
        }
      });
    }
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.setupOverlay();
    }
  },
  setupAnswerListeners: function setupAnswerListeners() {
    var _props3 = this.props;
    var questionID = _props3.questionID;
    var fireRef = _props3.fireRef;
    var params = _props3.params;

    // set listener for new question
    var usersRefNode = fireRef.usersRef.child(this.state.questionData.receiver + "/answersFromMe").on("child_added", this.newQuestion);
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
    var _this3 = this;

    var _props5 = this.props;
    var questionID = _props5.questionID;
    var fireRef = _props5.fireRef;
    var params = _props5.params;
    var pageOverride = _props5.pageOverride;

    // get question data
    fireRef.questionsRef.child(questionID).once("value").then(function (snap) {
      var questionData = snap.val();
      _this3.setState({
        questionData: questionData
      }, _this3.setupAnswerListeners);
    });
    // get answer data
    fireRef.answersRef.child(questionID).once("value").then(function (snap) {
      var answerData = snap.val();
      _this3.setState({
        answerData: answerData
      }, function () {
        if (!pageOverride) {
          // do a possible page redirect if pageOverride is not present
          if (params.questionID === questionID && !answerData) {
            console.log("no answer data", questionID, _this3.state);
            _reactRouter.browserHistory.push({
              pathname: "/profile/" + (questionData.receiver || "")
            });
          }
        }
      });
    });
    // get ratings data
    fireRef.ratingsRef.child(questionID).once("value").then(function (snap) {
      var ratingsData = snap.val();
      _this3.setState({
        ratingsData: ratingsData
      }, function () {
        _this3.calculateRatings();
        _this3.setupOverlay();
      });
    });
    // set listener on ratings data
    // rating added
    fireRef.ratingsRef.child(questionID).on("child_added", this.newRating.bind(null, null)),
    // rating changed
    fireRef.ratingsRef.child(questionID).on("child_changed", this.newRating.bind(null, null));
    // rating removed
    fireRef.ratingsRef.child(questionID).on("child_removed", this.newRating.bind(null, true));
  },
  componentWillUnmount: function componentWillUnmount() {
    var _props6 = this.props;
    var questionID = _props6.questionID;
    var fireRef = _props6.fireRef;

    // remove listener on ratings data
    // rating added
    fireRef.ratingsRef.child(questionID).off("child_added", this.newRating),
    // rating changed
    fireRef.ratingsRef.child(questionID).off("child_changed", this.newRating);
    // rating removed
    fireRef.ratingsRef.child(questionID).off("child_removed", this.newRating);
    // question added
    if (this.state.questionData) {
      fireRef.usersRef.child(this.state.questionData.receiver + "/answersFromMe").off("child_added", this.newQuestion);
    }
  },
  render: function render() {
    var _props7 = this.props;
    var myAuth = _props7.myAuth;
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
            pathname: "/profile/" + (questionData.receiver || userData.name) + "/q/" + questionID,
            state: {
              modal: true,
              returnTo: URL || "/profile/" + (questionData.receiver || "")
            }
          } : {
            pathname: URL || "/profile/" + (questionData.receiver || "")
          }, onClick: answerData ? popUpHandler.bind(null, "viewQuestion", {
            questionData: Object.assign(questionData, { questionID: questionID }),
            answerData: answerData,
            voteToolData: {
              myAuth: myAuth,
              userData: userData,
              fireRef: fireRef,
              place: "question",
              calculatedRatings: calculatedRatings,
              questionData: questionData
            }
          }) : popUpHandler.bind(null, "answerQuestion", {
            questionData: Object.assign(questionData, { questionID: questionID }),
            answerData: answerData
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
              questionData.body
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
              myAuth: myAuth,
              userData: userData,
              fireRef: fireRef,
              place: "question",
              calculatedRatings: calculatedRatings,
              questionData: questionData })
          )
        ) : _react2["default"].createElement("div", { className: "separator-4-dim" })
      )
    );
  }
});

exports["default"] = _react2["default"].createClass({
  displayName: "UserQuestions",
  getInitialState: function getInitialState() {
    return {
      questions: {},
      lastID: null,
      locked: true,
      lockedTop: true,
      loadData: false,
      queryLimit: 10
    };
  },
  scrollEvent: function scrollEvent(e) {
    var _this4 = this;

    setTimeout(function () {
      var _refs = _this4.refs;
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
          _this4.setState({
            locked: true,
            lockedTop: true
          });
        } else
          // lock the tools menu to the bottom of it's parent
          // if the top of the page root is lower than or equal to the top of the app root
          if (trueRoot.scrollTop >= bottom) {
            _this4.setState({
              locked: true,
              lockedTop: false
            });
          } else {
            // don't lock anything; fix it to the page scrolling
            _this4.setState({
              locked: false,
              lockedTop: false
            });
          }
      }
    }, 200);
  },
  getQuestions: function getQuestions() {
    var _this5 = this;

    console.log("tryna get questions", this.props);
    this.setState({
      loadingData: true
    }, function () {
      var queryLimit = _this5.state.queryLimit;
      var _props8 = _this5.props;
      var fireRef = _props8.fireRef;
      var userData = _props8.userData;
      var _props8$params = _props8.params;
      var params = _props8$params === undefined ? {} : _props8$params;

      if (!userData) return;
      console.log("search params", params.username, userData.name, _this5.state.lastID);
      var refNode = fireRef.usersRef.child((params.username || userData.name) + "/" + (params.username && params.username !== userData.name ? "answersFromMe" : "questionsForMe"));
      if (_this5.state.lastID) {
        refNode = refNode.orderByKey().endAt(_this5.state.lastID || 0).limitToLast(queryLimit + 1);
      } else {
        refNode = refNode.orderByKey().limitToLast(queryLimit);
      }
      refNode.once("value").then(function (snap) {
        var questions = snap.val();
        var newQuestions = JSON.parse(JSON.stringify(_this5.state.questions));
        console.log("questions", questions);
        _this5.setState({
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
          signedIn = this.props.userData.name;
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
    var _this6 = this;

    console.log("mounted user quesions");
    var _props9 = this.props;
    var fireRef = _props9.fireRef;
    var userData = _props9.userData;
    var params = _props9.params;
    var pageOverride = _props9.pageOverride;

    if (fireRef && userData) {
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
          _this6.setState({
            questions: questions
          });
        });
      });
    } else {
      fireRef.usersRef.child((params.username || userData.name) + "/" + (params.username && params.username !== userData.name ? "answersFromMe" : "questionsForMe")).on("child_added", this.newAnswer);
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    console.log("unounting question");
    var _props10 = this.props;
    var fireRef = _props10.fireRef;
    var userData = _props10.userData;
    var _props10$params = _props10.params;
    var params = _props10$params === undefined ? {} : _props10$params;

    fireRef.usersRef.child((params.username || userData.name) + "/" + (params.username && params.username !== userData.name ? "answersFromMe" : "questionsForMe")).off("child_added", this.newAnswer);
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
    var fireRef = _props11.fireRef;
    var overlay = _props11.overlay;
    var methods = _props11.methods;
    var pageOverride = _props11.pageOverride;

    // make an array of questions
    var list = questions ? Object.keys(questions).map(function (questionID) {
      return _react2["default"].createElement(QuestionListItem, { key: questionID, userData: userData, questionID: questionID, location: location, params: params, fireRef: fireRef, myAuth: auth ? !!auth.access_token : false, overlay: overlay, pageOverride: pageOverride, methods: methods });
    }).reverse() : null;
    return _react2["default"].createElement(
      "div",
      { ref: "root", className: "user-questions tool-assisted" + (locked ? " locked" : "") },
      !pageOverride ? _react2["default"].createElement(
        "div",
        { className: "title" },
        "Questions"
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
      !pageOverride ? _react2["default"].createElement(_sideToolsJsx2["default"], {
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