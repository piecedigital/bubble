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
  displayName: "BookmarkButton",
  getInitialState: function getInitialState() {
    return {
      bookmarked: null
    };
  },
  checkStatus: function checkStatus() {
    var _this = this;

    var _props = this.props;
    var fireRef = _props.fireRef;
    var userData = _props.userData;
    var givenUsername = _props.givenUsername;

    if (!fireRef || !userData) setTimeout(this.checkStatus, 100);

    fireRef.usersRef.child(userData.name + "/bookmarks/users/" + givenUsername).once("value").then(function (snap) {
      _this.setState({
        bookmarked: !!snap.val()
      });
    });
  },
  markOrUnmark: function markOrUnmark(action) {
    var _props2 = this.props;
    var fireRef = _props2.fireRef;
    var userData = _props2.userData;
    var givenUsername = _props2.givenUsername;
    var versionData = _props2.versionData;

    switch (action) {
      case "mark":
        var bookmarkObject = {
          "username": givenUsername,
          "date": _firebase2["default"].database.ServerValue.TIMESTAMP,
          "version": versionData
        };

        fireRef.usersRef.child(userData.name + "/bookmarks/users/" + givenUsername).set(bookmarkObject);
        this.setState({
          bookmarked: true
        });
        break;
      case "unmark":
        fireRef.usersRef.child(userData.name + "/bookmarks/users/" + givenUsername).set(null);
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
  componentDidMount: function componentDidMount() {
    this.checkStatus();
    var _props3 = this.props;
    var fireRef = _props3.fireRef;
    var userData = _props3.userData;
    var givenUsername = _props3.givenUsername;

    var refNode = fireRef.usersRef.child(userData.name + "/bookmarks/users");
    refNode.on("child_added", this.newBookmark);
    refNode.on("child_removed", this.removedBookmark);
  },
  componentWillUnount: function componentWillUnount() {
    var _props4 = this.props;
    var fireRef = _props4.fireRef;
    var userData = _props4.userData;
    var givenUsername = _props4.givenUsername;

    fireRef.usersRef.child(userData.name + "/bookmarks/users/" + givenUsername).on("changed", this.removedBookmark);
  },
  render: function render() {
    var bookmarked = this.state.bookmarked;
    var _props5 = this.props;
    var fireRef = _props5.fireRef;
    var userData = _props5.userData;
    var givenUsername = _props5.givenUsername;

    if (!userData || !fireRef) return null;
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
        givenUsername
      )
    );
  }
});
module.exports = exports["default"];