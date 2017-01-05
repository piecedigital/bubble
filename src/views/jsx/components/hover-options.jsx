import React from "react";
import FollowButton from "./follow-btn.jsx";
import { Link } from 'react-router';

export const ListItemHoverOptions = React.createClass({
  displayName: "ListItemTools",
  render() {
    const {
      auth,
      name,
      stream,
      vod,
      display_name,
      userData,
      callback: followCallback,
      clickCallback
    } = this.props;
    return (
      <div className={`hover-options`}>
        <div className="go-to-channel">
          <Link to={`/profile/${name}`}>View Profile</Link>
        </div>
        {userData ? <FollowButton name={userData.name} targetName={name} targetDisplay={display_name} auth={auth} callback={followCallback}/> : null}
        <div className="append-stream">
          <a href={vod ? `https://www.twitch.tv/${name}/v/${vod}` : `https://www.twitch.tv/${name}`} target="_blank" rel="nofollow" onClick={e => {
            e.preventDefault();
            clickCallback(name, display_name, vod);
          }}>{stream || vod ? "Watch" : "Open"} {vod ? "VOD" : "Stream"}</a>
        </div>
        <div className="send-message">
          <a className="btn-default btn-rect btn-no-pad color-black no-underline" href={`https://www.twitch.tv/message/compose?to=${name}`} target="_blank">Send Message</a>
        </div>
      </div>
    );
  }
});
