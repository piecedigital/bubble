"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _firebase = require("firebase");

var _firebase2 = _interopRequireDefault(_firebase);

var _reactRouter = require('react-router');

var BookmarkItem = _react2["default"].createClass({
  displayName: "BookmarkItem",
  unmark: function unmark() {
    var _props = this.props;
    var fireRef = _props.fireRef;
    var userData = _props.userData;
    var username = _props.username;

    fireRef.usersRef.child(userData.name + "/bookmarks/users/" + username).set(null);
  },
  render: function render() {
    var username = this.props.username;

    return _react2["default"].createElement(
      "div",
      { className: "bookmark-item" },
      _react2["default"].createElement(
        "label",
        null,
        _react2["default"].createElement(
          _reactRouter.Link,
          { className: "name", to: "/profile/" + username },
          username
        ),
        _react2["default"].createElement(
          "span",
          { className: "unmark", onClick: this.unmark },
          "x"
        )
      )
    );
  }
});

var ViewBookmarks = _react2["default"].createClass({
  displayName: "ViewBookmarks",
  getInitialState: function getInitialState() {
    return {
      bookmarks: {}
    };
  },
  newBookmark: function newBookmark(snap) {
    var bookmarkKey = snap.getKey();
    var bookmarkData = snap.val();
    var newBookmarks = JSON.parse(JSON.stringify(this.state.bookmarks));
    // console.log("new bookmark", bookmarkKey, bookmarkData);
    // appends the new bookmark to the top of the bookmark list
    this.setState({
      bookmarks: Object.assign(newBookmarks, _defineProperty({}, bookmarkKey, bookmarkData))
    });
  },
  removedBookmark: function removedBookmark(snap) {
    var bookmarkKey = snap.getKey();
    var bookmarkData = snap.val();
    var newBookmarks = JSON.parse(JSON.stringify(this.state.bookmarks));
    delete newBookmarks[bookmarkKey];
    this.setState({
      bookmarks: newBookmarks
    });
  },
  addBookmark: function addBookmark(e) {
    e.preventDefault();
    var _props2 = this.props;
    var fireRef = _props2.fireRef;
    var userData = _props2.userData;
    var versionData = _props2.versionData;

    var username = this.refs["new-bookmark"].value;

    if (!username) return;

    var bookmarkObject = {
      username: username,
      "date": _firebase2["default"].database.ServerValue.TIMESTAMP,
      "version": versionData
    };

    fireRef.usersRef.child(userData.name + "/bookmarks/users/" + username).set(bookmarkObject);

    this.refs["new-bookmark"].value = "";
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    var _props3 = this.props;
    var fireRef = _props3.fireRef;
    var userData = _props3.userData;

    fireRef.usersRef.child(userData.name + "/bookmarks/users").once("value").then(function (snap) {
      _this.setState({
        bookmarks: snap.val() || {}
      });
    });

    var refNode = fireRef.usersRef.child(userData.name + "/bookmarks/users");
    refNode.on("child_added", this.newBookmark);
    refNode.on("child_removed", this.removedBookmark);
  },
  componentWillUnmount: function componentWillUnmount() {
    var _props4 = this.props;
    var fireRef = _props4.fireRef;
    var userData = _props4.userData;

    var refNode = fireRef.usersRef.child(userData.name + "/bookmarks/users");
    refNode.off("child_added", this.newBookmark);
    refNode.off("child_removed", this.removedBookmark);
  },
  render: function render() {
    var _props5 = this.props;
    var fireRef = _props5.fireRef;
    var userData = _props5.userData;
    var popUpHandler = _props5.methods.popUpHandler;

    var bookmarkList = Object.keys(this.state.bookmarks).map(function (bookmarkID) {
      return _react2["default"].createElement(BookmarkItem, _extends({
        key: bookmarkID
      }, {
        fireRef: fireRef,
        userData: userData,
        username: bookmarkID
      }));
    }).reverse();

    return _react2["default"].createElement(
      "div",
      { className: "overlay-ui-default view-bookmarks open", onClick: function (e) {
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
        "Bookmarks"
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
          bookmarkList
        )
      ),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement(
        "div",
        { className: "section" },
        _react2["default"].createElement(
          "form",
          { onSubmit: this.addBookmark },
          _react2["default"].createElement(
            "div",
            { className: "section" },
            _react2["default"].createElement(
              "label",
              null,
              _react2["default"].createElement(
                "div",
                { className: "label bold" },
                "Add Bookmark"
              ),
              _react2["default"].createElement("input", { type: "text", ref: "new-bookmark" })
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
exports.ViewBookmarks = ViewBookmarks;