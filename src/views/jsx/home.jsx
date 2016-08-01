import React from "react";

export default React.createClass({
  displayName: "Home",
  getInitialState() {
    return {
      posts: this.props.userData && this.props.userData.posts || {}
    }
  },
  render() {
    const {
      auth
    } = this.props;
    if(auth && this.props.userData) {
      const {
        posts
      } = this.props.userData;
    } else {
      return (
        <ul>
          <div className="not-logged-in">You must log in to see your feed</div>
        </ul>
      );
    }
  }
})
