import React from "react";
import { browserHistory as History } from 'react-router';
import FollowedStreams from "./components/user/followed-streams.jsx";
import FollowingStreams from "./components/user/following-streams.jsx";

export default React.createClass({
  displayName: "Profile",
  render() {
    return (
      <div className="top-level-component profile">
        <div className="general-page profile">
          {<FollowedStreams {...this.props} />}
          <div className="separator-4-black" />
          <FollowingStreams {...this.props} />
        </div>
      </div>
    );
  }
});
