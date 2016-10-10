import React from "react";
import { browserHistory as History } from 'react-router';
import FollowedStreams from "./components/user/followed-streams.jsx";

export default React.createClass({
  displayName: "Profile",
  render() {
    return (
      <div className="top-level-component profile">
        <div className="followed-streams">
          <FollowedStreams {...this.props} />
        </div>
      </div>
    );
  }
});
