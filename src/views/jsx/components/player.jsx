import React from "react";

// list item for featured streams
const ListItem = React.createClass({
  displayName: "stream-ListItem",
  render() {
    console.log(this.props);
    const {
      data: name
    } = this.props;
    return (
      <li className="stream">
        <div className="video">
          <iframe src={`https://player.twitch.tv/?channel=${name}`} frameBorder="0" scrolling="no"></iframe>
        </div>
        <div className="chat">
          <iframe src={`https://www.twitch.tv/${name}/chat`} frameBorder="0" scrolling="no"></iframe>
        </div>
      </li>
    )
  }
})

// primary section for the search component
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
                return <ListItem key={channelName} data={channelName} methods={{
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
