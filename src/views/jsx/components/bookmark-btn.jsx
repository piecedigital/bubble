import React from "react";
import Firebase from "firebase";

export default React.createClass({
  // required props
  // fireRef
  // userData
  // givenUsername (username)
  // versionData
  displayName: "BookmarkButton",
  getInitialState: () => ({
    bookmarked: null,
    userDataPresent: false,
    fireRefPresent: false,
    propsPresent: false,
    init: false
  }),
  checkForProps() {
    const {
      userData,
      fireRef
    } = this.props;
    const propsPresent = !!userData && !!fireRef;
    // console.log(propsPresent);
    if(propsPresent) {
      this.setState({
        userDataPresent: !!userData,
        fireRefPresent: !!fireRef,
        propsPresent
      });

      this.checkStatus();
      this.initListener();
    }
  },
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
        .child(`${userData._id}/bookmarks/users/${givenUsername}`)
        .set(bookmarkObject);
        this.setState({
          bookmarked: true
        });
        break;
      case "unmark":
        fireRef.usersRef
        .child(`${userData._id}/bookmarks/users/${givenUsername}`)
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
    // console.log("new mark", snap.getKey());
    if(snap.getKey() === this.props.givenUsername) this.setState({
      bookmarked: true
    });
  },
  removedBookmark(snap) {
    // console.log("removed mark", snap.getKey());
    if(snap.getKey() === this.props.givenUsername) this.setState({
      bookmarked: false
    });
  },
  initListener() {
    const {
      fireRef,
      userData,
      givenUsername,
    } = this.props;
    let refNode = fireRef.usersRef
    .child(`${userData._id}/bookmarks/users`);
    refNode.on("child_added", this.newBookmark);
    refNode.on("child_removed", this.removedBookmark);
  },
  componentDidMount() {
    if(!this.state.propsPresent) this.checkForProps();
  },
  componentDidUpdate() {
    if(!this.state.propsPresent) this.checkForProps();
  },
  componentWillUnount() {
    const {
      fireRef,
      userData,
      givenUsername,
    } = this.props;
    let refNode = fireRef.usersRef
    .child(`${userData._id}/bookmarks/users`);
    refNode.off("child_added", this.newBookmark);
    refNode.off("child_removed", this.removedBookmark);
  },
  render() {
    const {
      bookmarked
    } = this.state
    const {
      fireRef,
      userData,
      givenUsername,
      named,
      versionData
    } = this.props;
    // console.log(userData, fireRef, bookmarked);
    if(!userData || !fireRef) return null;
    if(!versionData) return null;
    if(bookmarked === null) return null;
    if(userData.name === givenUsername) return null;
    return (
      <div className="bookmark">
        <a href="#" className={this.props.className} onClick={this.toggleBookmark}>{bookmarked ? "Un-bookmark" : "Bookmark"} {!named ? givenUsername : ""}</a>
      </div>
    );
  }
});
