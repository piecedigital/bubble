import React from "react";
// import { Link, browserHistory as History } from 'react-router';
import loadData from "../../../../modules/load-data";
import FollowButton from "../follow-btn.jsx";

const missingLogo = "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png";

// primary section for the search component
export default React.createClass({
  displayName: "UserInfo",
  getInitialState: () => ({ userUserData: null, userChannelData: null }),
  gatherData() {
    [{ place: "userUserData", method: "getUserByName"}, { place: "userChannelData", method: "getChannelByName" }, { place: "userStreamData", method: "getStreamByName" }].map(({place, method}) => {
      const {
        params,
        userData,
      } = this.props;
      let username;
      if(params && params.username) {
        username = params.username;
      } else {
        username = userData.name;
      }
      // console.log(username, this.props.params, this.props.userData);
      if(loadData) {
        // console.log("gathering data");
        // console.log(`Given Channel Name ${method}`, username);
        loadData.call(this, e => {
          console.error(e.stack);
        }, {
          username
        })
        .then(methods => {
          methods
          [method]()
          .then(data => {
            // console.log("data", data);
            this._mounted ? this.setState({
              [place]: data
            }) : null;
          })
          .catch(e => console.error(e.stack));
        })
        .catch(e => console.error(e.stack));
      }
    });
  },
  componentDidMount() {
    this.gatherData();
    this._mounted = true;
  },
  componentDidUpdate(lastProps) {
    if(this.props.params.username !== lastProps.params.username) this.gatherData();
  },
  componentWillUnmount() {
    delete this._mounted;
  },
  render() {
    const {
      auth,
      params,
      userData,
      methods: {
        appendStream,
        popUpHandler,
      }
    } = this.props;
    const {
      userUserData,
      userChannelData,
      userStreamData,
    } = this.state;

    let name = params && params.username ? params.username : userData ? userData.name : null;

    return (
      <div ref="root" className={`user-info`}>
        <div className="title">
          {name ? (
            `${name}'s info`
          ) : null}
        </div>
        <div className="wrapper">
          {
            userChannelData ? (
              <div className="channel">
                <div className="banner">
                  <img src={userChannelData.profile_banner} />
                  <div className="hover">
                    <div className="logo"><a href={`https://twitch.tv/${userChannelData.name}`} target="_blank" rel="nofollow"><img src={userChannelData.logo || missingLogo} /></a></div>
                    <div className="info">
                      <div className="name">{userChannelData.display_name}</div>
                      <div className="views">Views: {userChannelData.views.toLocaleString("en")}</div>
                      <div className="followers">Followers: {userChannelData.followers.toLocaleString("en")}</div>
                      <div className="partner">Partnered?: {userChannelData.partner ? <a href={`https://www.twitch.tv/${userChannelData.name}/subscribe`} className="color-white" target="_blank" rel="nofollow">Yes</a> : "No"}</div>
                      <div className="partner">Live?: {userStreamData && userStreamData.stream ? (
                        <a href={`https://www.twitch.tv/${name}`} className="color-white" target="_blank" rel="nofollow" onClick={e => {
                          e.preventDefault();
                          appendStream(userChannelData.name, userChannelData.display_name);
                        }}>Yes</a>
                      ) : "No"}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null
          }
          <div className="user">
            {
              userUserData ? (
                <div className={`bio${!userUserData.bio ? " no-bio" : ""}`}>
                  {
                    userUserData.bio ? (
                      userUserData.bio
                    ) : (
                      ["This user has no bio ",
                      <img key="img" className="sad-face" src="https://github.com/Ranks/emojione/blob/master/assets/png_512x512/1f61e.png?raw=true" alt="emojione frowny face" />]
                    )
                  }
                </div>
              ) : null
            }
            <div className="separator-4-3" />
            {
              name && userData && userData.name !== name ? (
                [
                  <a key="msg" className="btn-default btn-rect color-black bold no-underline" href={`https://www.twitch.tv/message/compose?to=${name}`} target="_blank">Send Message</a>,
                  " ",
                  <div key="ask" className="btn-default btn-rect color-black bold no-underline" onClick={popUpHandler.bind(null, "askQuestion", {
                    recipient: name.toLowerCase(),
                    sender: userData.name
                  })}>Ask A Question</div>
                ]
              ) : null
            }
            {userData && userData.name !== name ? (
              [
                " ",
                <FollowButton key="follow" name={userData.name} targetName={name} targetDisplay={null} auth={auth} callback={null} className="btn-default btn-rect color-black bold no-underline" />
              ]
            ) : null}
            {
              userChannelData ? (
                [
                  " ",
                  <div key="open" className="btn-default btn-rect color-black bold no-underline" onClick={appendStream.bind(null, userChannelData.name, userChannelData.display_name)}>Open Stream</div>
                ]
              ) : null
            }
            {
              !params || !params.username ||
              params && params.username === userData.name ? (
                [
                  " ",
                  <a key="clips" className="btn-default btn-rect color-black bold no-underline" href={`https://clips.twitch.tv/my-clips`} target="_blank">My Clips</a>
                ]
              ) : null
            }
          </div>
        </div>
      </div>
    );
  }
})
