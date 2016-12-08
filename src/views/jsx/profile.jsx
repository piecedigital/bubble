import React from "react";
import { browserHistory as History } from 'react-router';
import FollowStreams from "./components/user/follow-streams.jsx";
import VideosListing from "./components/user/videos-listing.jsx";
import UserInfo from "./components/user/user-info.jsx";
// import FollowedStreams from "./components/user/followed-streams.jsx";
// import FollowingStreams from "./components/user/following-streams.jsx";

export default React.createClass({
  displayName: "Profile",
  render() {
    const {
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
              {name ? <a target="_blank" rel="nofollow" href={`https://twitch.com/${name}`}>{name}</a> : null}
            </div>
          </div>
          <div className="separator-4-black" />
          <UserInfo {...this.props} />
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

// export default React.createClass({
//   displayName: "Profile",
//   render() {
//     const {
//       userData,
//       params = {}
//     } = this.props;
//     let name = (params.username ? params.username : userData ? userData.name : "").toLowerCase();
//     return (
//       <div className="top-level-component profile">
//         <div className="general-page profile">
//           <div className="page-header">
//             <div className="title">
//               {`Profile: `}
//               {name ? <a target="_blank" rel="nofollow" href={`https://twitch.com/${name}`}>{name}</a> : null}
//             </div>
//           </div>
//           <div className="separator-4-black" />
//           <UserInfo {...this.props} />
//         </div>
//       </div>
//     );
//   }
// });
