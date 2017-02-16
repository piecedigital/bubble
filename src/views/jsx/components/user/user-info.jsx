import React from "react";
// import { Link, browserHistory as History } from 'react-router';
import loadData from "../../../../modules/client/load-data";
import FollowButton from "../follow-btn.jsx";
import BookmarkButton from "../bookmark-btn.jsx";
import { CImg } from "../../../../modules/client/helper-tools";

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
      // console.log("userdata", userData);
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
      fireRef,
      params,
      userData,
      versionData,
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
                <div className="banner" style={{
                  backgroundImage: `url(${userChannelData.profile_banner})`,
                  backgroundPosition: "50% 50%",
                  backgroundSize: "100% auto",
                  backgroundRepeat: "no-repeat",
                }}>
                  <CImg
                    for="banner"
                    style={{
                      opacity: 0,
                      pointerEvents: "none",
                    }}
                    noImgRequest={true} />
                  <div className="hover">
                    <div className="logo"><a href={`https://twitch.tv/${userChannelData.name}`} target="_blank" rel="nofollow"><CImg
                      for="fill"
                      style={{
                        width: 96,
                        height: 96,
                      }}
                      src={userChannelData.logo || missingLogo} /></a></div>
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
            <div className="button-wrapper">
              {
                name && userData && userData.name !== name ? (
                  [
                    <a key="msg" className="btn-default color-black bold no-underline" href={`https://www.twitch.tv/message/compose?to=${name}`} target="_blank">Send Message</a>,
                    " ",
                    <div key="ask" className="btn-default color-black bold no-underline" onClick={popUpHandler.bind(null, "askQuestion", {
                      receiver: name.toLowerCase(),
                      sender: userData.name
                    })}>Ask A Question</div>,
                    <BookmarkButton
                      key="bookmark"
                      className="btn-default color-black bold no-underline"
                      fireRef={fireRef}
                      userData={userData}
                      givenUsername={name}
                      versionData={versionData}/>
                  ]
                ) : null
              }
              {
                userData && userData.name !== name ? (
                  [
                    " ",
                    <FollowButton key="follow" name={userData.name} targetName={name} targetDisplay={null} auth={auth} callback={null} className="btn-default color-black bold no-underline" />
                  ]
                ) : null
              }
              {
                userChannelData ? (
                  [
                    " ",
                    <div key="open" className="btn-default color-black bold no-underline" onClick={appendStream.bind(null, userChannelData.name, userChannelData.display_name)}>Open Stream</div>,
                    <div key="gamequeue" className="btn-default color-black bold no-underline" onClick={popUpHandler.bind(null, "viewGameQueue", { queueHost: userChannelData.name })}>Open Game Queue</div>,
                  ]
                ) : null
              }
              {
                function() {
                  let give = false;
                  if(userData) {
                    if(params && params.username === userData.name) {
                      give = true
                    }
                  }
                  return give ? ([
                    " ",
                    <a key="clips" className="btn-default color-black bold no-underline" href={`https://clips.twitch.tv/my-clips`} target="_blank">My Clips</a>
                  ]) : null;
                }()
              }
            </div>
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
          </div>
        </div>
      </div>
    );
  }
})
