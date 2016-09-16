import React from "react";
import loadData from "../../../modules/load-data";

export default React.createClass({
  displayName: "FollowButton",
  getInitialState: () => ({
    isFollowing: null
  }),
  checkStatus() {
    const {
      name,
      target
    } = this.props;
    loadData.call(this, e => {
      console.error(e.stack);
    }, {
      username: name,
      target: target.toLowerCase()
    })
    .then(methods => {
      methods
      .getFollowStatus()
      .then(data => {
        this.setState({
          isFollowing: true
        });
      })
      .catch(e => {
        if(e) console.error(e.stack || e);
        this.setState({
          isFollowing: false
        });
      });
    })
    .catch(e => console.error(e.stack || e));
  },
  followOrUnfollow(action, bool) {
    const {
      name,
      target
    } = this.props;
    const method = `${action}Stream`;
    console.log(method);
    loadData.call(this, e => {
      console.error(e.stack);
    }, {
      username: name,
      target: target.toLowerCase()
    })
    .then(methods => {
      methods
      [method]()
      .then(data => {
        console.log("action", method, "completed");
        this.setState({
          isFollowing: bool
        });
      })
      .catch(e => console.error(e.stack || e));
    })
    .catch(e => console.error(e.stack || e));
  },
  toggleFollow() {
    switch (this.state.isFollowing) {
      case true: this.followOrUnfollow("unfollow", false); break;
      case false: this.followOrUnfollow("follow", true); break;
    }
  },
  componentDidMount() {
    this.checkStatus();
  },
  render() {
    const {
      isFollowing
    } = this.state
    const {
      target
    } = this.props;
    if(isFollowing === null) return null;
    return (
      <div className="follow">
        <div onClick={this.toggleFollow}>{isFollowing ? "Unfollow" : "Follow"} {target}</div>
      </div>
    );
  }
});
