"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _firebase = require("firebase");

var _firebase2 = _interopRequireDefault(_firebase);

exports["default"] = _react2["default"].createClass({
  // required props
  // fireRef
  // userData
  // givenUsername (username)
  // versionData
  displayName: "BookmarkButton",
  getInitialState: function getInitialState() {
    return {
      bookmarked: null,
      userDataPresent: false,
      fireRefPresent: false,
      propsPresent: false,
      init: false
    };
  },
  checkForProps: function checkForProps() {
    var _props = this.props;
    var userData = _props.userData;
    var fireRef = _props.fireRef;

    var propsPresent = !!userData && !!fireRef;
    // console.log(propsPresent);
    if (propsPresent) {
      this.setState({
        userDataPresent: !!userData,
        fireRefPresent: !!fireRef,
        propsPresent: propsPresent
      });

      this.checkStatus();
      this.initListener();
    }
  },
  checkStatus: function checkStatus() {
    var _this = this;

    var _props2 = this.props;
    var fireRef = _props2.fireRef;
    var userData = _props2.userData;
    var givenUsername = _props2.givenUsername;

    if (!fireRef || !userData) setTimeout(this.checkStatus, 100);

    fireRef.usersRef.child(userData.name + "/bookmarks/users/" + givenUsername).once("value").then(function (snap) {
      _this.setState({
        bookmarked: !!snap.val()
      });
    });
  },
  markOrUnmark: function markOrUnmark(action) {
    var _props3 = this.props;
    var fireRef = _props3.fireRef;
    var userData = _props3.userData;
    var givenUsername = _props3.givenUsername;
    var versionData = _props3.versionData;

    switch (action) {
      case "mark":
        var bookmarkObject = {
          "username": givenUsername,
          "date": _firebase2["default"].database.ServerValue.TIMESTAMP,
          "version": versionData
        };

        fireRef.usersRef.child(userData._id + "/bookmarks/users/" + givenUsername).set(bookmarkObject);
        this.setState({
          bookmarked: true
        });
        break;
      case "unmark":
        fireRef.usersRef.child(userData._id + "/bookmarks/users/" + givenUsername).set(null);
        this.setState({
          bookmarked: false
        });
        break;
      default:

    }
  },
  toggleBookmark: function toggleBookmark() {
    switch (this.state.bookmarked) {
      case true:
        this.markOrUnmark("unmark");break;
      case false:
        this.markOrUnmark("mark");break;
    }
  },
  newBookmark: function newBookmark(snap) {
    // console.log("new mark", snap.getKey());
    if (snap.getKey() === this.props.givenUsername) this.setState({
      bookmarked: true
    });
  },
  removedBookmark: function removedBookmark(snap) {
    // console.log("removed mark", snap.getKey());
    if (snap.getKey() === this.props.givenUsername) this.setState({
      bookmarked: false
    });
  },
  initListener: function initListener() {
    var _props4 = this.props;
    var fireRef = _props4.fireRef;
    var userData = _props4.userData;
    var givenUsername = _props4.givenUsername;

    var refNode = fireRef.usersRef.child(userData._id + "/bookmarks/users");
    refNode.on("child_added", this.newBookmark);
    refNode.on("child_removed", this.removedBookmark);
  },
  componentDidMount: function componentDidMount() {
    if (!this.state.propsPresent) this.checkForProps();
  },
  componentDidUpdate: function componentDidUpdate() {
    if (!this.state.propsPresent) this.checkForProps();
  },
  componentWillUnount: function componentWillUnount() {
    var _props5 = this.props;
    var fireRef = _props5.fireRef;
    var userData = _props5.userData;
    var givenUsername = _props5.givenUsername;

    var refNode = fireRef.usersRef.child(userData._id + "/bookmarks/users");
    refNode.off("child_added", this.newBookmark);
    refNode.off("child_removed", this.removedBookmark);
  },
  render: function render() {
    var bookmarked = this.state.bookmarked;
    var _props6 = this.props;
    var fireRef = _props6.fireRef;
    var userData = _props6.userData;
    var givenUsername = _props6.givenUsername;
    var named = _props6.named;
    var versionData = _props6.versionData;

    // console.log(userData, fireRef, bookmarked);
    if (!userData || !fireRef) return null;
    if (!versionData) return null;
    if (bookmarked === null) return null;
    if (userData.name === givenUsername) return null;
    return _react2["default"].createElement(
      "div",
      { className: "bookmark" },
      _react2["default"].createElement(
        "a",
        { href: "#", className: this.props.className, onClick: this.toggleBookmark },
        bookmarked ? "Un-bookmark" : "Bookmark",
        " ",
        !named ? givenUsername : ""
      )
    );
  }
});
module.exports = exports["default"];