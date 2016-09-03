import React from "react";
import { browserHistory as History } from 'react-router';
import FollowedStreams from "./components/user/followed-streams.jsx";

export default React.createClass({
  displayName: "Profile",
  checkAuth() {
    console.log(this.props);
    if(this.props.auth && !this.props.auth.access_token) {
      History.push("/");
    }
  },
  componentDidMount() { this.checkAuth(); },
  componentDidUpdate() { this.checkAuth(); },
  render() {
    return (
      <div className="profile">
        <div className="followed-streams">
        {
          this.props.auth && this.props.auth.access_token ? (
            <FollowedStreams {...this.props} />
          ) : null
        }
        </div>
      </div>
    );
  }
});
