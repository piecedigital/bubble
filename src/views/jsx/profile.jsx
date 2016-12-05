import React from "react";
import { browserHistory as History } from 'react-router';
import FollowStreams from "./components/user/follow-streams.jsx";
import VideosListing from "./components/user/videos-listing.jsx";
// import FollowedStreams from "./components/user/followed-streams.jsx";
// import FollowingStreams from "./components/user/following-streams.jsx";

export default React.createClass({
  displayName: "Profile",
  render() {
    const {
      userData,
      params
    } = this.props;
    return (
      <div className="top-level-component profile">
        <div className="general-page profile">
          <div className="page-header">
            <div className="title">
              {params.username ? <a target="_blank" rel="nofollow" href={`https://twitch.com/${params.username}`}>Page Of {params.username}</a> : userData ? <a target="_blank" rel="nofollow" href={`https://twitch.com/${userData.name}`}>Page Of {userData.username}</a> : null}
            </div>
          </div>
          <div className="separator-4-black" />
          <VideosListing broadcasts={true} {...this.props} />
        </div>
      </div>
    );
  }
});
