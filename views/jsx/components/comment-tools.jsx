"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _firebase = require("firebase");

var _firebase2 = _interopRequireDefault(_firebase);

var _reactRouter = require('react-router');

var _modulesClientHelperTools = require("../../../modules/client/helper-tools");

var _voteToolJsx = require("./vote-tool.jsx");

var _voteToolJsx2 = _interopRequireDefault(_voteToolJsx);

var _modulesClientAjax = require("../../../modules/client/ajax");

var _modulesClientLoadData = require("../../../modules/client/load-data");

var _modulesClientLoadData2 = _interopRequireDefault(_modulesClientLoadData);

var CommentTool = _react2["default"].createClass({
  displayName: "CommentTool",
  getInitialState: function getInitialState() {
    return {
      error: false,
      success: false,
      validation: {
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
    var userData = _props.userData;
    var fireRef = _props.fireRef;
    var overlay = _props.overlay;
    var versionData = _props.versionData;
    var
    // if question post
    questionID = _props.questionID;
    var questionData = _props.questionData;
    var
    // if poll post
    pollID = _props.pollID;
    var pollData = _props.pollData;
    var commentID = _props.commentID;
    var popUpHandler = _props.methods.popUpHandler;
    var _refs = this.refs;
    var title = _refs.title;
    var body = _refs.body;

    new Promise(function (resolve, reject) {
      _modulesClientLoadData2["default"].call(this, function (e) {
        console.error(e.stack);
      }, {
        username: questionData.receiver
      }).then(function (methods) {
        methods.getUserID().then(function (data) {
          // console.log("feature data", data);
          var receiverID = data.users[0]._id;
          resolve(receiverID);
        })["catch"](function () {
          var e = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
          return console.error(e);
        });
      })["catch"](function () {
        var e = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
        return console.error(e);
      });
    }).then(function (receiverID) {
      // if for a question post
      if (questionID) {
        var commentObject = {
          "userID": userData._id,
          // to be truthy only if this is a comment reply
          "reply": !!commentID,
          "commentID": commentID || null,
          //----------------------------------------
          "body": body.value,
          questionID: questionID,
          "date": new Date().getTime(),
          "sentStatuses": {
            "email": false,
            "notification": false
          },
          "version": versionData
        };
        if (!_this.state.validation.bodyValid) return;
        console.log("comment object:", commentObject);
        // write answer to `answers` node
        fireRef.commentsRef.child(questionID).push().setWithPriority(commentObject, 0 - Date.now())["catch"](function (e) {
          return console.error(e.val ? e.val() : e);
        });
        body.value = "";

        // send notification
        // create notif obejct
        var notifObject = {
          type: "newQuestionComment",
          info: {
            sender: userData._id,
            questionID: questionID,
            questionURL: "/profile/" + receiverID + "/q/" + questionID
          },
          read: false,
          date: new Date().getTime(),
          version: versionData
        };
        // send notif
        // to creator
        if (questionData.creator !== userData._id) {
          fireRef.notificationsRef.child(questionData.creator).push().set(notifObject)["catch"](function (e) {
            return console.error(e.val ? e.val() : e);
          });
        }
        // to receiver
        if (receiverID !== userData._id) {
          fireRef.notificationsRef.child(receiverID).push().set(notifObject)["catch"](function (e) {
            return console.error(e.val ? e.val() : e);
          });
        }
      }

      // if for a poll post
      if (pollID) {
        var commentObject = {
          "userID": userData._id,
          // to be truthy only if this is a comment reply
          "reply": !!commentID,
          "commentID": commentID || null,
          //----------------------------------------
          "body": body.value,
          pollID: pollID,
          "date": new Date().getTime(),
          "sentStatuses": {
            "email": false,
            "notification": false
          },
          "version": versionData
        };
        if (!_this.state.validation.bodyValid) return;
        console.log("comment object:", commentObject);
        // write answer to `answers` node
        fireRef.commentsRef.child(pollID).push().setWithPriority(commentObject, 0 - Date.now())["catch"](function (e) {
          return console.error(e.val ? e.val() : e);
        });
        body.value = "";

        // send notification
        // create notif obejct
        var notifObject = {
          type: "newPollComment",
          info: {
            senderID: userData._id,
            pollID: pollID,
            pollURL: "/profile/" + pollData.creator + "/p/" + pollID
          },
          read: false,
          date: new Date().getTime(),
          version: versionData
        };
        // send notif
        // to creator
        if (pollData.creator !== userData._id) {
          fireRef.notificationsRef.child(pollData.creator).push().set(notifObject)["catch"](function (e) {
            return console.error(e.val ? e.val() : e);
          });
        }
      }
    })["catch"](function (e) {
      return console.error(e);
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
  render: function render() {
    var _props2 = this.props;
    var fireRef = _props2.fireRef;
    var commentData = _props2.commentData;
    var versionData = _props2.versionData;
    var userData = _props2.userData;

    if (!versionData || !fireRef) {
      return _react2["default"].createElement(
        "form",
        { onSubmit: this.submit },
        _react2["default"].createElement(
          "div",
          { className: "section bold" },
          "Preparing Form..."
        )
      );
    }
    if (!userData) {
      return _react2["default"].createElement(
        "form",
        { onSubmit: this.submit },
        _react2["default"].createElement(
          "div",
          { className: "section bold" },
          "Login to leave a comment"
        )
      );
    }
    return _react2["default"].createElement(
      "form",
      { onSubmit: this.submit },
      _react2["default"].createElement(
        "div",
        { className: "section bold" },
        "Leave a comment"
      ),
      _react2["default"].createElement(
        "div",
        { className: "section" },
        _react2["default"].createElement(
          "label",
          null,
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
    );
  }
});

exports.CommentTool = CommentTool;
var CommentItem = _react2["default"].createClass({
  displayName: "CommentItem",
  getInitialState: function getInitialState() {
    return { username: null };
  },
  componentDidMount: function componentDidMount() {
    var _this2 = this;

    var commentData = this.props.commentData;

    _modulesClientLoadData2["default"].call(this, function (e) {
      console.error(e.stack);
    }, {
      userID: commentData.userID
    }).then(function (methods) {
      methods.getUserByName().then(function (data) {
        _this2.setState({
          username: data.name
        });
      })["catch"](function () {
        var e = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
        return console.error(e);
      });
    })["catch"](function () {
      var e = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
      return console.error(e);
    });
  },
  render: function render() {
    var _props3 = this.props;
    var auth = _props3.auth;
    var fireRef = _props3.fireRef;
    var userData = _props3.userData;
    var
    // for question comments
    questionID = _props3.questionID;
    var questionData = _props3.questionData;
    var
    // for poll comments
    pollID = _props3.pollID;
    var pollData = _props3.pollData;
    var commentID = _props3.commentID;
    var commentData = _props3.commentData;
    var username = this.state.username;

    if (!username) return null;
    // console.log("commentitem", commentID);
    return _react2["default"].createElement(
      "div",
      { className: "section" },
      _react2["default"].createElement(
        "label",
        { className: "comment" },
        _react2["default"].createElement(
          "div",
          { className: "label" },
          _react2["default"].createElement(
            "div",
            { className: "label username" },
            _react2["default"].createElement(
              _reactRouter.Link,
              { to: "/profile/" + username },
              username
            )
          ),
          _react2["default"].createElement(
            "p",
            null,
            commentData.body
          )
        )
      ),
      _react2["default"].createElement(
        "label",
        { className: "vote" },
        _react2["default"].createElement(_voteToolJsx2["default"], { place: "comment", auth: auth, questionID: questionID, questionData: questionData, pollID: pollID, pollData: pollData, commentID: commentID, commentData: commentData, fireRef: fireRef, userData: userData })
      )
    );
  }
});
exports.CommentItem = CommentItem;

// <div className="tools">
//   <div className="tool reply">
//     Reply
//   </div>
// </div>