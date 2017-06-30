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

    return (
      <div className="top-level-component profile">
        <div className="general-page profile">
          <div className="page-header">
            <div className="title">
              {`Profile: `}
              {name ? <a target="_blank" rel="nofollow" href={`http://twitch.com/${name}`}>{name}</a> : null}
            </div>
          </div>
          {
            fireRef ? (
              [
                <div key="1" className="separator-4-black" />,

                params.username || userData ? (
                  <UserInfo key="2" {...this.props} />
                ) : null,

                <div key="3" className="separator-4-black" />,
                (userData || params.username) ? (
                  <UserQuestions key="4" {...this.props} />
                ) : null,

                <div key="sep-IFollow" className="separator-4-black" />,
                <FollowStreams key="comp-IFollow" follow={"IFollow"} {...this.props} />,

                <div key="sep-followMe" className="separator-4-black" />,
                <FollowStreams key="comp-followMe" follow={"followMe"} {...this.props}/>,

                <div key="5" className="separator-4-black" />,

                params.username || userData ? (
                  <VideosListing key="6" archive={true} {...this.props} />
                ) : null,
              ]
            ) : null
          }
        </div>
      </div>
    );
  }
});
