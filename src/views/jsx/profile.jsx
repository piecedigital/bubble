import React from "react";
import { browserHistory as History } from 'react-router';
import UserInfo from "./components/user/user-info.jsx";
import UserQuestions from "./components/user-questions.jsx";
import FollowStreams from "./components/user/follow-streams.jsx";
import VideosListing from "./components/user/videos-listing.jsx";

export default React.createClass({
  displayName: "Profile",
  render() {
    const {
      auth,
      fireRef,
      userData,
      params = {}
    } = this.props;
    let name = (params.username ? params.username : userData ? userData.name : "").toLowerCase();

    // don't render without this data
    if(!fireRef) return null;
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
          {
            params.username || userData ? (
              <UserInfo {...this.props} />
            ) : null
          }
          <div className="separator-4-black" />
          <UserQuestions {...this.props} />
          {
            auth && auth.access_token &&
            (userData || params.username) ? (
              [
                <div key="sep-IFollow" className="separator-4-black" />,
                <FollowStreams key="comp-IFollow" follow={"IFollow"} {...this.props} />
              ]
            ) : null
          }
          {
            auth && auth.access_token &&
            (userData || params.username) ? (
              [
                <div key="sep-followMe" className="separator-4-black" />,
                <FollowStreams key="comp-followMe" follow={"followMe"} {...this.props}/>
              ]
            ) : null
          }
          <div className="separator-4-black" />
          {
            params.username || userData ? (
              <VideosListing broadcasts={true} {...this.props} />
            ) : null
          }
        </div>
      </div>
    );
  }
});
