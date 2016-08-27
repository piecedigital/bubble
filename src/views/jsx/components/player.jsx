import React from "react";

// stream component for player
const PlayerStream = React.createClass({
  displayName: "PlayerStream",
  render() {
    // console.log(this.props);
    const {
      data: name,
      methods: {
        spliceStream
      }
    } = this.props;
    return (
      <li className="stream">
        <div className="video">
          <iframe src={`https://player.twitch.tv/?channel=${name}`} frameBorder="0" scrolling="no"></iframe>
        </div>
        <div className="chat">
          <iframe src={`https://www.twitch.tv/${name}/chat`} frameBorder="0" scrolling="no"></iframe>
        </div>
        <div className="tools" onClick={spliceStream.bind(null, name)}>
          <div className="closer">
            x
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
              dataObject ? Object.keys(dataObject).map(channelName => {
                let channelData = dataObject[channelName];
                return <PlayerStream key={channelName} data={channelName} methods={{
                  spliceStream
                }} />
              }) : null
            }
          </ul>
        </div>
      </div>
    );
  }
})
