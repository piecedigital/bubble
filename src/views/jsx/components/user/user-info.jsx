import React from "react";
// import { Link, browserHistory as History } from 'react-router';
import loadData from "../../../../modules/load-data";

const missingLogo = "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png";

// primary section for the search component
export default React.createClass({
  displayName: "UserInfo",
  getInitialState: () => ({ userUserData: null, userChannelData: null }),
  gatherData() {
    [{ place: "userUserData", method: "getUserByName"}, { place: "userChannelData", method: "getChannelByName" }].map(({place, method}) => {
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
        console.log("gathering data");
        console.log(`Given Channel Name ${method}`, username);
        loadData.call(this, e => {
          console.error(e.stack);
        }, {
          username
        })
        .then(methods => {
          methods
          [method]()
          .then(data => {
            console.log("data", data);
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
  componentWillUnmount() {
    delete this._mounted;
  },
  render() {
    const {
      params,
      userData,
    } = this.props;
    const {
      userUserData,
      userChannelData
    } = this.state;

    return (
      <div ref="root" className={`user-info`}>
        <div className="title">
          {params && params.username ? params.username : userData ? userData.name : null}'s info
        </div>
        <div className="wrapper">
          {
            userChannelData ? (
              <div className="channel">
                <div className="banner">
                  <img src={userChannelData.profile_banner} />
                  <div className="hover">
                    <div className="logo"><img src={userChannelData.logo} /></div>
                    <div className="info">
                      <div className="partner">{userChannelData.display_name}</div>
                      <div className="views">Views: {userChannelData.views}</div>
                      <div className="followers">Followers: {userChannelData.followers}</div>
                      <div className="partner">Partnered?: {userChannelData.partner ? "Yes" : "No"}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null
          }
          {
            userUserData ? (
              <div className="user">
                <div className={`bio${userUserData.bio ? " no-bio" : ""}`}>
                  {
                    userUserData.bio ? (
                      userUserData.bio
                    ) : (
                      ["This user has no bio ",
                      <img className="sad-face" src="https://github.com/Ranks/emojione/blob/master/assets/png_512x512/1f61e.png?raw=true" alt="emojione frowny face" />]
                    )
                  }
                </div>
              </div>
            ) : null
          }
        </div>
      </div>
    );
  }
})
