import React from "react";
import firebase from "firebase";

const BookmarkItem = React.createClass({
  displayName: "BookmarkItem",
  unmark() {
    const {
      fireRef,
      userData,
      username
    } = this.props;
    fireRef.usersRef
    .child(`${userData.name}/bookmarks/users/${username}`)
    .set(null);
  },
  render() {
    const {
      username
    } = this.props;
    return (
      <div className="bookmark-item">
        <label>
          <span className="name">{username}</span><span className="unmark" onClick={this.unmark}>x</span>
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
    this.setState({
      bookmarks: Object.assign({
        [bookmarkKey]: bookmarkData
      }, this.state)
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
  componentDidMount() {
    const {
      fireRef,
      userData,
    } = this.props;

    fireRef.usersRef
    .child(`${userData.name}/bookmarks/users`)
    .once("value")
    .then(snap => {
      this.setState({
        bookmarks: snap.val() || {}
      })
    });

    let refNode = fireRef.usersRef
    .child(`${userData.name}/bookmarks/users`);
    refNode.on("child_added", this.newBookmark)
    refNode.on("child_removed", this.removedBookmark)
  },
  componentWillUnmount() {
    const {
      fireRef,
      userData,
    } = this.props;
    let refNode = fireRef.usersRef
    .child(`${userData.name}/bookmarks/users`);
    refNode.off("child_added", this.newBookmark)
    refNode.off("child_removed", this.removedBookmark)
  },
  render() {
    const {
      fireRef,
      userData,
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
    });

    return (
      <div className={`overlay-ui-default view-bookmarks open`} onClick={e => e.stopPropagation()}>
        <div className="title">
          Bookmarks
        </div>
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="section">
          <div className="list">
          {bookmarkList}
          </div>
        </div>
      </div>
    );
  }
})
