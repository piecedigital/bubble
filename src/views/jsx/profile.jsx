import React from "react";
import { browserHistory as History } from 'react-router';
import UserInfo from "./components/user/user-info.jsx";
import UserQuestions from "./components/user/user-questions.jsx";
import FollowStreams from "./components/user/follow-streams.jsx";
import VideosListing from "./components/user/videos-listing.jsx";

export default React.createClass({
  displayName: "Profile",
  render() {
    const {
      fireRef,
      userData,
      params = {}
    } = this.props;
    let name = (params.username ? params.username : userData ? userData.name : "").toLowerCase();

    // don't render without this data
    if(!fireRef || !userData) return null;
    return (
      <div className="top-level-component profile">
        <div className="general-page profile">
          <div className="page-header">
            <div className="title">
              {`Profile: `}
              {name ? <a target="_blank" rel="nofollow" href={`https://twitch.com/${name}`}>{name}</a> : null}
            </div>
          </div>
          <div className="separator-4-black" />
          <UserInfo {...this.props} />
          <div className="separator-4-black" />
          <UserQuestions {...this.props} />
          <div className="separator-4-black" />
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
