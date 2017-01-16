"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var NotifItem = _react2["default"].createClass({
  displayName: "NotifItem",
  getInitialState: function getInitialState() {
    return {
      questionData: null
    };
  },
  markRead: function markRead() {
    var _props = this.props;
    var fireRef = _props.fireRef;
    var userData = _props.userData;
    var notifID = _props.notifID;
    var data = _props.data;

    fireRef.notificationsRef.child(userData.name + "/" + notifID + "/read").set(true);
  },
  getMessage: function getMessage() {
    var _props2 = this.props;
    var data = _props2.data;
    var userData = _props2.userData;
    var location = _props2.location;
    var questionData = this.state.questionData;

    var object = {
      "message": "You have a new notification"
    };

    switch (data.type) {
      case "newQuestion":
        object.message = data.info.sender + " asked a question: " + questionData.title;
        object.modal = true;
        object.returnTo = location.pathname;
        object.overlay = "answerQuestion";
        break;
      case "newAnswer":
        object.message = data.info.sender + " answered your question: " + questionData.title;
        object.modal = true;
        object.returnTo = location.pathname;
        object.overlay = "answerQuestion";
        break;
      case "newQuestionComment":
        object.message = data.info.sender + " commented on a question: " + questionData.title;
        object.modal = true;
        object.returnTo = location.pathname;
        object.overlay = "viewQuestion";
        break;
      case "questionUpvote":
        object.message = "You're question was upvoted: " + questionData.title;
        object.modal = true;
        object.returnTo = location.pathname;
        object.overlay = "viewQuestion";
        break;
      case "answerUpvote":
        object.message = "You're answer was upvoted: " + questionData.title;
        object.modal = true;
        object.returnTo = location.pathname;
        object.overlay = "viewQuestion";
        break;
      case "commentUpvote":
        object.message = "You're comment was upvoted: " + questionData.title;
        object.modal = true;
        object.returnTo = location.pathname;
        object.overlay = "viewQuestion";
        break;
    }
    return object;
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    var _props3 = this.props;
    var fireRef = _props3.fireRef;
    var data = _props3.data;

    if (data && data.info && data.info.questionID) {
      fireRef.questionsRef.child(data.info.questionID).child("title").once("value").then(function (snap) {
        _this.setState({
          "questionData": {
            "title": snap.val()
          }
        });
      });
    }
  },
  render: function render() {
    var _this2 = this;

    var _props4 = this.props;
    var notifID = _props4.notifID;
    var data = _props4.data;
    var popUpHandler = _props4.methods.popUpHandler;
    var questionData = this.state.questionData;

    switch (data.type) {
      case "newQuestion":
      case "newAnswer":
      case "newQuestionComment":
      case "questionUpvote":
      case "answerUpvote":
      case "commentUpvote":
        // for the above notification types some question data is required
        if (!questionData) return null;
    }

    var message = this.getMessage();

    return _react2["default"].createElement(
      "div",
      { className: "notif-item" + (data.read ? " read" : "") },
      _react2["default"].createElement(
        "label",
        null,
        _react2["default"].createElement(
          _reactRouter.Link,
          { className: "name", to: {
              pathname: data.info.questionURL,
              state: {
                modal: message.modal,
                returnTo: message.returnTo
              }
            }, onClick: function (e) {
              popUpHandler(message.overlay, {
                questionID: data.info.questionID
              });
              _this2.markRead();
            } },
          message.message
        ),
        !data.read ? _react2["default"].createElement(
          "span",
          { className: "mark-read", onClick: this.markRead },
          "x"
        ) : null
      )
    );
  }
});

var ViewNotifications = _react2["default"].createClass({
  displayName: "ViewNotifications",
  getInitialState: function getInitialState() {
    return {
      userDataPresent: false,
      fireRefPresent: false,
      propsPresent: false,
      notifications: null,
      notifCount: 0
    };
  },
  checkForProps: function checkForProps() {
    var _props5 = this.props;
    var userData = _props5.userData;
    var fireRef = _props5.fireRef;

    var propsPresent = !!userData && !!fireRef;
    // console.log(propsPresent);
    if (propsPresent) {
      this.setState({
        userDataPresent: !!userData,
        fireRefPresent: !!fireRef,
        propsPresent: propsPresent
      });

      this.prepListener();
    }
  },
  prepListener: function prepListener() {
    var _this3 = this;

    // console.log("init prep 2");
    var _props6 = this.props;
    var fireRef = _props6.fireRef;
    var userData = _props6.userData;

    var temp = function temp(snap) {
      // console.log("prep 2");
      var key = snap.getKey();
      var val = snap.val();
      if (key === userData.name) {
        fireRef.notificationsRef.off("child_added", temp);
        _this3.initListener();
      }
    };

    fireRef.notificationsRef.on("child_added", temp);
  },
  initListener: function initListener() {
    var _this4 = this;

    var _props7 = this.props;
    var fireRef = _props7.fireRef;
    var userData = _props7.userData;

    var nodeRef = fireRef.notificationsRef.child(userData.name);
    nodeRef.once("value").then(function (snap) {
      _this4.setState({
        notifications: snap.val()
      }, function () {
        nodeRef.on("child_added", _this4.newNotif);
        nodeRef.on("child_changed", _this4.newNotif);
        _this4.killListener = function () {
          nodeRef.off("child_added", this.newNotif);
          nodeRef.off("child_changed", this.newNotif);
        };
      });
    });
  },
  newNotif: function newNotif(snap) {
    var key = snap.getKey();
    var val = snap.val();
    console.log("new notif", key, val);
    var newNotifications = Object.assign(JSON.parse(JSON.stringify(this.state.notifications || {})), _defineProperty({}, key, val));

    var notifCount = Object.keys(newNotifications).filter(function (notifID) {
      var notifData = newNotifications[notifID];

      return !notifData.read || null;
    }).length;

    this.setState({
      notifications: newNotifications,
      notifCount: notifCount
    });
  },
  componentDidMount: function componentDidMount() {
    if (!this.state.propsPresent) this.checkForProps();
  },
  componentDidUpdate: function componentDidUpdate() {
    if (!this.state.propsPresent) this.checkForProps();
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this.killListener === "function") this.killListener();
  },
  render: function render() {
    var _props8 = this.props;
    var fireRef = _props8.fireRef;
    var userData = _props8.userData;
    var location = _props8.location;
    var methods = _props8.methods;
    var popUpHandler = _props8.methods.popUpHandler;
    var _state = this.state;
    var notifications = _state.notifications;
    var notifCount = _state.notifCount;
    var propsPresent = _state.propsPresent;

    // console.log(propsPresent, notifCount);
    if (!propsPresent) return null;

    var notifList = Object.keys(notifications || {}).map(function (notifID) {
      return _react2["default"].createElement(NotifItem, _extends({
        key: notifID
      }, {
        fireRef: fireRef,
        userData: userData,
        notifID: notifID,
        location: location,
        data: notifications[notifID],
        methods: methods
      }));
    }).reverse();

    return _react2["default"].createElement(
      "div",
      { className: "overlay-ui-default view-notifications open", onClick: function (e) {
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
        "Notifications"
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
          notifList.length > 0 ? notifList : "You have no notifications"
        )
      )
    );
  }
});
exports.ViewNotifications = ViewNotifications;