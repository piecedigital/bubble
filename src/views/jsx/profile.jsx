import React from "react";
import { browserHistory as History } from 'react-router';
import FollowStreams from "./components/user/follow-streams.jsx";
import VideosListing from "./components/user/videos-listing.jsx";
// import FollowedStreams from "./components/user/followed-streams.jsx";
// import FollowingStreams from "./components/user/following-streams.jsx";

export default React.createClass({
  displayName: "Profile",
  render() {
    return (
      <div className="top-level-component profile">
        <div className="general-page profile">
          <FollowStreams follow={"IFollow"} {...this.props} />
          <div className="separator-4-black" />
          <FollowStreams follow={"followMe"} {...this.props}/>
          <div className="separator-4-black" />
          <VideosListing broadcasts={true} {...this.props} />
        </div>
      </div>
    );
  }
});
