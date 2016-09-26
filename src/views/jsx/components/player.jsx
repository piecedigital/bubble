import React from "react";
import { Link, browserHistory as History } from 'react-router';
import loadData from "../../../modules/load-data";
import FollowButton from "./follow.jsx";

// stream component for player
const PlayerStream = React.createClass({
  displayName: "PlayerStream",
  getInitialState: () => ({ chatOpen: true, menuOpen: false }),
  toggleChat(type) {
    switch (type) {
      case "close":
        this.setState({
          chatOpen: false
        });
        break;
      case "open":
        this.setState({
          chatOpen: true
        });
        break;
      case "toggle":
      default:
        console.log("no type match:", type);
        this.setState({
          chatOpen: !this.state.chatOpen
        });
    }
  },
  toggleMenu(type) {
    switch (type) {
      case "close":
        this.setState({
          menuOpen: false
        });
        break;
      case "open":
        this.setState({
          menuOpen: true
        });
        break;
      case "toggle":
      default:
        console.log("no type match:", type);
        this.setState({
          menuOpen: !this.state.menuOpen
        });
    }
  },
  refresh(iframe) {
    console.log(iframe, this.refs[iframe].src);
    switch (iframe) {
      case "video":
        this.refs.video.src = this.refs.video.src;
        break;
      case "chat":
        this.refs.chat.src = this.refs.chat.src;
        break;
    }
  },
  render() {
    // console.log(this.props);
    const {
      userData,
      name,
      display_name,
      auth,
      inView,
      methods: {
        spliceStream,
        togglePlayer,
        alertAuthNeeded
      }
    } = this.props;
    const {
      chatOpen,
      menuOpen,
    } = this.state;

    return (
      <li className={`player-stream${!chatOpen ? " hide-chat" : ""}`}>
        <div className="video">
          <div className="nested">
            <iframe ref="video" src={`https://player.twitch.tv/?channel=${name}`} frameBorder="0" scrolling="no"></iframe>
          </div>
        </div>
        <div className={`chat${inView ? " in-view" : ""}`}>
          <iframe ref="chat" src={`https://www.twitch.tv/${name}/chat`} frameBorder="0" scrolling="no"></iframe>
        </div>
        <div className="tools-wrapper">
          <div className={`tools${menuOpen ? " menu-open" : ""}`}>
            <div className="mobile">
              <div className="name">
                <Link title={name} to={`/user/${name}`} onClick={togglePlayer.bind(null, "close")}>{display_name}{!display_name.match(/^[a-z0-9\_]+$/i) ? `(${name})` : ""}</Link>
              </div>
              <div className="lines" onClick={this.toggleMenu.bind(this, "toggle")}>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div className="streamer">
              <Link to={`/user/${name}`} onClick={togglePlayer.bind(null, "close")}>{display_name}{!display_name.match(/^[a-z0-9\_]+$/i) ? `(${name})` : ""}</Link>
            </div>
            <div className="closer" onClick={spliceStream.bind(null, name)}>
              Close
            </div>
            <div className="hide" onClick={this.toggleChat.bind(this, "toggle")}>
              {chatOpen ? "Hide" : "Show"} Chat
            </div>
            <div className="refresh-video" onClick={this.refresh.bind(this, "video")}>
              Refresh Video
            </div>
            <div className="refresh-chat" onClick={this.refresh.bind(this, "chat")}>
              Refresh Chat
            </div>
            {
              userData ? (
                <FollowButton name={userData.name} targetName={name} targetDisplay={display_name} auth={auth}/>
              ) : (
                <div className="follow need-auth" onClick={alertAuthNeeded}>
                  Follow {name}
                </div>
              )
            }
          </div>
        </div>
      </li>
    )
  }
})

// player component to house streams
export default React.createClass({
  displayName: "Player",
  getInitialState() {
    return {
      canScroll: true,
      streamInView: 0,
      scrollTop: 0
    }
  },
  layoutTools(type) {
    let l = this.refs.list;
    switch (type) {
      case "setStreamToView":
        l.scrollTop = l.offsetHeight * this.refs.selectStream.value
      break;
      case "setLayout":
        this.props.methods.setLayout(this.refs.selectLayout.value);
      break;
    }
  },
  listScroll(e) {
    // if(this.state.canScroll) {
    //   let streamInView = this.state.streamInView;
    //   switch (this.state.scrollTop > this.refs.list.scrollTop) {
    //     case true:
    //       streamInView++;
    //     break;
    //     case false:
    //       streamInView--;
    //     break;
    //   }
    //   if(streamInView > Object.keys(this.props.data.dataObject).length-1) streamInView = 0;
    //   if(streamInView < 0) streamInView = Object.keys(this.props.data.dataObject).length-1;
    //   console.log(this.state.scrollTop, this.refs.list.scrollTop, streamInView);
    //   this.linearLayout("setStreamToView", streamInView);
    //   this.setState({
    //     canScroll: false,
    //     scrollTop: this.refs.list.scrollTop
    //   }, () => {
    //     setTimeout(() => {
    //       this.setState({
    //         canScroll: true
    //       });
    //     }, 500);
    //   });
    // }
  },
  render() {
    let {
      userData,
      auth,
      playerState,
      methods: {
        spliceStream,
        togglePlayer,
        alertAuthNeeded,
        setLayout,
      },
      data: {
        dataObject
      },
      layout,
    } = this.props;
    const {
      streamInView
    } = this.state;
    var dataArray = Object.keys(dataObject);
    layout = layout || `layout-${Object.keys(dataObject).length}`;
    console.log(layout);
    return (
      <div className="player">
        <div className="wrapper">
          <ul ref="list" onScroll={this.listScroll} className={`list`}>
            {
              dataObject ? (
                dataArray.map((channelName, ind) => {
                  let channelData = dataObject[channelName];
                  return (
                    <PlayerStream key={channelName} name={channelName} display_name={dataObject[channelName]} userData={userData} auth={auth} inView={streamInView === ind} methods={{
                      spliceStream,
                      togglePlayer,
                      alertAuthNeeded
                    }} />
                  );
                })
              ) : null
            }
          </ul>
          <div className={`tools`}>
            <div title="Closing the player will remove all current streams" className="closer" onClick={() => {
              Object.keys(dataObject).map(channelName => {
                spliceStream(channelName);
              });
            }}>
              Close
            </div>
            <div title="Shrink the player to the side of the browser" className="closer" onClick={togglePlayer.bind(null, "toggle")}>
              {playerState.playerCollapsed ? "Expand" : "Collapse"}
            </div>
            <select title="Choose a layout for the streams" ref="selectLayout" className="layout" defaultValue={0} onChange={this.layoutTools.bind(null, "setLayout")}>
              {
                ["", "Linear", "By 3"].map(layoutName => {
                  return (
                    <option key={layoutName} value={layoutName.toLowerCase()}>{layoutName || "Auto"}</option>
                  );
                })
              }
            </select>
            {
              dataObject &&
              layout === "linear" ||
              layout === "layout-4" ? (
                <select title="Choose which stream appears as the main or in-view stream" ref="selectStream" className="layout" defaultValue={0} onChange={this.layoutTools.bind(null, "setStreamToView")}>
                  {
                    dataObject ? (
                      dataArray.map((channelName, ind) => {
                        return (
                          <option key={channelName} value={ind}>{channelName}</option>
                        );
                      })
                    ) : null
                  }
                </select>
              ) : null
            }
          </div>
        </div>
      </div>
    );
  }
})
