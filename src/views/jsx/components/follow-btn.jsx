import React from "react";
import loadData from "../../../modules/client/load-data";

export default React.createClass({
  displayName: "FollowButton",
  getInitialState: () => ({
    isFollowing: false
  }),
  checkStatus() {
    const {
      name,
      targetName
    } = this.props;
    loadData.call(this, e => {
      console.error(e.stack);
    }, {
      username: name,
      target: targetName.toLowerCase()
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
        // if(e) console.error(e.stack || e);
        this.setState({
          isFollowing: false
        });
      });
    })
    .catch(e => console.error(e.stack || e));
  },
  followOrUnfollow(action, bool) {
    const {
      auth,
      name,
      targetName,
      callback
    } = this.props;
    const method = `${action}Stream`;
    console.log(method);
    loadData.call(this, e => {
      console.error(e.stack);
    }, {
      username: name,
      target: targetName,
      access_token: auth.access_token
    })
    .then(methods => {
      methods
      [method]()
      .then(data => {
        console.log("action", method, "completed");
        this.setState({
          isFollowing: bool
        });
        if(typeof callback === "function") callback(bool);
      });
    });
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
      nbps,
      showname,
      targetName,
      targetDisplay
    } = this.props;
    if(isFollowing === null) return null;

    var text = "follow", color = " bgc-green-priority";

    if(isFollowing) {
      text = "Unfollow";
      color = " bgc-orange-priority";
    }

    return (
      <div className={`${this.props.className} follow${color}`}>
        <a href="#" className={"color-black no-underline"} onClick={this.toggleFollow}>
          {text}
          {
            showname !== false ? (
              nbps ? <span>&nbsp;</span> : " " + (targetDisplay || targetName)
            ) : null
          }
        </a>
      </div>
    );
  }
});
