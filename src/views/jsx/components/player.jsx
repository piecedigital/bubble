import React from "react";
import loadData from "../../../modules/load-data";
import { Link, browserHistory as History } from 'react-router';

// stream component for player
const PlayerStream = React.createClass({
  displayName: "PlayerStream",
  render() {
    // console.log(this.props);
    const {
      name,
      display_name,
      methods: {
        spliceStream
      }
    } = this.props;
    console.log(name, display_name, this.props);
    return (
      <li className="player-stream">
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
            <Link to={`/user/${name}`}>{display_name}</Link>
          </div>
          <div className="closer" onClick={spliceStream.bind(null, name)}>
            Close
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
    return {}
  },
  render() {
    const {
      methods: {
        spliceStream
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
                  return <PlayerStream key={channelName} name={channelName} display_name={dataObject[channelName]} methods={{
                    spliceStream
                  }} />
                })
              ) : null
            }
          </ul>
          <div className="tools">
            <div title="Closing the player will remove all current streams" className="closer" onClick={() => {
              Object.keys(dataObject).map(channelName => {
                spliceStream(channelName)
              });
            }}>
              Close Player
            </div>
          </div>
        </div>
      </div>
    );
  }
})
