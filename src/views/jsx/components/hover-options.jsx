import React from "react";
import FollowButton from "./follow.jsx";

export const ListItemHoverOptions = React.createClass({
  displayName: "ListItemTools",
  render() {
    const {
      auth,
      name,
      stream,
      display_name,
      userData,
      callback: followCallback,
      clickCallback: appendStream
    } = this.props;
    return (
      <div className={`hover-options`}>
        <div className="go-to-channel">
          <a href={`https://twitch.tv/${name}`} target="_blank">Visit On Twitch</a>
        </div>
        {userData ? <FollowButton name={userData.name} targetName={name} targetDisplay={display_name} auth={auth} callback={followCallback}/> : null}
        {
          stream ? (
            <div className="append-stream">
              <a href="#" onClick={appendStream.bind(null, name, display_name)}>Watch Stream</a>
            </div>
          ) : <div className="append-stream">
            <a href="#" onClick={appendStream.bind(null, name, display_name)}>Open Stream</a>
          </div>
        }
      </div>
    );
  }
});
