import React from "react";
import firebase from "firebase";
import { Link } from 'react-router';

const BookmarkItem = React.createClass({
  displayName: "BookmarkItem",
  unmark() {
    const {
      fireRef,
      userData,
      username
    } = this.props;
    fireRef.usersRef
    .child(`${userData._id}/bookmarks/users/${username}`)
    .set(null);
  },
  render() {
    const {
      username
    } = this.props;
    return (
      <div className="bookmark-item">
        <label>
          <Link className="name" to={`/profile/${username}`}>{username}</Link><span className="unmark" onClick={this.unmark}>x</span>
        </label>
      </div>
    );
  }
});

export const ViewBookmarks = React.createClass({
  displayName: "ViewBookmarks",
  getInitialState: () => ({
    bookmarks: {}
  }),
  newBookmark(snap) {
    const bookmarkKey = snap.getKey();
    const bookmarkData = snap.val();
    const newBookmarks = JSON.parse(JSON.stringify(this.state.bookmarks));
    // console.log("new bookmark", bookmarkKey, bookmarkData);
    // appends the new bookmark to the top of the bookmark list
    this.setState({
      bookmarks: Object.assign(newBookmarks, {
        [bookmarkKey]: bookmarkData
      })
    })
  },
  removedBookmark(snap) {
    const bookmarkKey = snap.getKey();
    const bookmarkData = snap.val();
    const newBookmarks = JSON.parse(JSON.stringify(this.state.bookmarks));
    delete newBookmarks[bookmarkKey];
    this.setState({
      bookmarks: newBookmarks
    })
  },
  addBookmark(e) {
    e.preventDefault();
    const {
      fireRef,
      userData,
      versionData,
    } = this.props;
    const username = this.refs["new-bookmark"].value;

    if(!username) return;

    const bookmarkObject = {
      username,
      "date": firebase.database.ServerValue.TIMESTAMP,
      "version": versionData,
    };

    fireRef.usersRef
    .child(`${userData._id}/bookmarks/users/${username}`)
    .set(bookmarkObject);

    this.refs["new-bookmark"].value = "";
  },
  componentDidMount() {
    const {
      fireRef,
      userData,
    } = this.props;

    fireRef.usersRef
    .child(`${userData._id}/bookmarks/users`)
    .once("value")
    .then(snap => {
      this.setState({
        bookmarks: snap.val() || {}
      })
    });

    let refNode = fireRef.usersRef
    .child(`${userData._id}/bookmarks/users`);
    refNode.on("child_added", this.newBookmark)
    refNode.on("child_removed", this.removedBookmark)
  },
  componentWillUnmount() {
    const {
      fireRef,
      userData,
    } = this.props;
    let refNode = fireRef.usersRef
    .child(`${userData._id}/bookmarks/users`);
    refNode.off("child_added", this.newBookmark)
    refNode.off("child_removed", this.removedBookmark)
  },
  render() {
    const {
      fireRef,
      userData,
      methods: {
        popUpHandler
      }
    } = this.props;

    const bookmarkList = Object.keys(this.state.bookmarks).map(bookmarkID => {
      return (
        <BookmarkItem
        key={bookmarkID}
        {...{
          fireRef,
          userData,
          username: bookmarkID
        }}
        />
      );
    }).reverse();

    return (
      <div className={`overlay-ui-default view-bookmarks open`} onClick={e => e.stopPropagation()}>
        <div className="close" onClick={popUpHandler.bind(null, "close")}>x</div>
        <div className="title">
          Bookmarks
        </div>
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="scroll">
          <div className="section">
            <div className="list">
              {bookmarkList}
            </div>
          </div>
        </div>
        <div className="separator-4-dim" />
        <div className="section">
          <form onSubmit={this.addBookmark}>
            <div className="section">
              <label>
                <div className="label bold">Add Bookmark</div>
                <input type="text" ref="new-bookmark" />
              </label>
            </div>
            <div className="section">
              <button className="submit btn-default">Submit</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
})
