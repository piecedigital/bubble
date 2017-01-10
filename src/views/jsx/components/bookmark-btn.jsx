import React from "react";
import Firebase from "firebase";

export default React.createClass({
  displayName: "BookmarkButton",
  getInitialState: () => ({
    bookmarked: null
  }),
  checkStatus() {
    const {
      fireRef,
      userData,
      givenUsername,
    } = this.props;

    if(!fireRef || !userData) setTimeout(this.checkStatus, 100);

    fireRef.usersRef
    .child(`${userData.name}/bookmarks/users/${givenUsername}`)
    .once("value")
    .then(snap => {
      this.setState({
        bookmarked: !!snap.val()
      })
    });
  },
  markOrUnmark(action) {
    const {
      fireRef,
      userData,
      givenUsername,
      versionData,
    } = this.props;
    switch (action) {
      case "mark":
        const bookmarkObject = {
          "username": givenUsername,
          "date": Firebase.database.ServerValue.TIMESTAMP,
          "version": versionData
        };

        fireRef.usersRef
        .child(`${userData.name}/bookmarks/users/${givenUsername}`)
        .set(bookmarkObject);
        this.setState({
          bookmarked: true
        });
        break;
      case "unmark":
        fireRef.usersRef
        .child(`${userData.name}/bookmarks/users/${givenUsername}`)
        .set(null);
        this.setState({
          bookmarked: false
        });
        break;
      default:

    }
  },
  toggleBookmark() {
    switch (this.state.bookmarked) {
      case true: this.markOrUnmark("unmark"); break;
      case false: this.markOrUnmark("mark"); break;
    }
  },
  newBookmark(snap) {
    console.log("new mark", snap.getKey());
    if(snap.getKey() === this.props.givenUsername) this.setState({
      bookmarked: true
    });
  },
  removedBookmark(snap) {
    console.log("removed mark", snap.getKey());
    if(snap.getKey() === this.props.givenUsername) this.setState({
      bookmarked: false
    });
  },
  componentDidMount() {
    this.checkStatus();
    const {
      fireRef,
      userData,
      givenUsername,
    } = this.props;
    let refNode = fireRef.usersRef
    .child(`${userData.name}/bookmarks/users`);
    refNode.on("child_added", this.newBookmark);
    refNode.on("child_removed", this.removedBookmark);
  },
  componentWillUnount() {
    const {
      fireRef,
      userData,
      givenUsername,
    } = this.props;
    fireRef.usersRef
    .child(`${userData.name}/bookmarks/users/${givenUsername}`)
    .on("changed", this.removedBookmark);
  },
  render() {
    const {
      bookmarked
    } = this.state
    const {
      fireRef,
      userData,
      givenUsername
    } = this.props;
    if(!userData || !fireRef) return null;
    if(bookmarked === null) return null;
    if(userData.name === givenUsername) return null;
    return (
      <div className="bookmark">
        <a href="#" className={this.props.className} onClick={this.toggleBookmark}>{bookmarked ? "Un-bookmark" : "Bookmark"} {givenUsername}</a>
      </div>
    );
  }
});
