import React from "react";
import { Link, browserHistory as History } from 'react-router';
import loadData from "../../../modules/load-data";
import FollowButton from "./follow.jsx";

// stream component for player
const PlayerStream = React.createClass({
  displayName: "PlayerStream",
  getInitialState: () => ({ chatOpen: true }),
  openChat() {
    this.setState({
      chatOpen: true
    });
  },
  closeChat() {
    this.setState({
      chatOpen: false
    });
  },
  toggleChat() {
    console.log("toggling chat", this.state.chatOpen, !this.state.chatOpen);
    this.setState({
      chatOpen: !this.state.chatOpen
    });
  },
  render() {
    // console.log(this.props);
    const {
      userData,
      name,
      display_name,
      auth,
      methods: {
        spliceStream,
        collapsePlayer,
        alertAuthNeeded
      }
    } = this.props;
    const {
      chatOpen
    } = this.state;
    // console.log(name, display_name, this.props);
    return (
      <li className={`player-stream${!chatOpen ? " hide-chat" : ""}`}>
        <div className="video">
          <div className="nested">
            <iframe src={`https://player.twitch.tv/?channel=${name}`} frameBorder="0" scrolling="no"></iframe>
          </div>
        </div>
        <div className="chat">
          <iframe src={`https://www.twitch.tv/${name}/chat`} frameBorder="0" scrolling="no"></iframe>
        </div>
        <div className="tools">
          <div className="streamer">
            <Link to={`/user/${name}`} onClick={collapsePlayer}>{display_name}</Link>
          </div>
          <div className="closer" onClick={spliceStream.bind(null, name)}>
            Close
          </div>
          <div className="hide" onClick={this.toggleChat}>
            {chatOpen ? "Hide" : "Show"} Chat
          </div>
          {
            userData ? (
              <FollowButton name={userData.name} target={display_name} auth={auth}/>
            ) : (
              <div className="follow need-auth" onClick={alertAuthNeeded}>
                Follow {name}
              </div>
            )
          }
        </div>
      </li>
    )
  }
})

// player component to house streams
export default React.createClass({
  displayName: "Player",
  getInitialState() {
    return {}
  },
  render() {
    const {
      userData,
      auth,
      methods: {
        spliceStream,
        collapsePlayer,
        alertAuthNeeded
      },
      data: {
        dataObject
      }
    } = this.props;
    return (
      <div className="player">
        <div className="wrapper">
          <ul className="list">
            {
              dataObject ? (
                Object.keys(dataObject).map(channelName => {
                  let channelData = dataObject[channelName];
                  return (
                    <PlayerStream key={channelName} name={channelName} display_name={dataObject[channelName]} userData={userData} auth={auth} methods={{
                      spliceStream,
                      collapsePlayer,
                      alertAuthNeeded
                    }} />
                  );
                })
              ) : null
            }
          </ul>
          <div className="tools">
            <div title="Closing the player will remove all current streams" className="closer" onClick={() => {
              Object.keys(dataObject).map(channelName => {
                spliceStream(channelName);
              });
            }}>
              Close Player
            </div>
            <div title="Shrink the player to the side of the browser" className="closer" onClick={collapsePlayer}>
              Collapse Player
            </div>
          </div>
        </div>
      </div>
    );
  }
})
