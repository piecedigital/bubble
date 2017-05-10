import React from "react";
import { Link } from 'react-router';
import { getUsername } from "../../../modules/client/helper-tools";

const StreamerItem = React.createClass({
  displayName: "StreamerItem",
  getInitialState: () => ({
  }),
  move(direction) {
    this.props.methods.move(direction, this.props.index);
  },
  render() {
    const {
      data,
      canMoveUp,
      canMoveDown
    } = this.props;

    let displayName;
    if(typeof data === "object") {
      displayName = data.displayName;
    } else {
      displayName = data;
    }

    return (
      <div className={`streamer-item`}>
        <label>
          <span className="name">{displayName}</span>
          <span className="tools">
            {
              canMoveUp ? (
                <span className="move-up" onClick={this.move.bind(this, "up")}>&#8593;</span>
              ) : (
                <span className="move-up still" style={{ opacity: .5 }}>&#8593;</span>
              )
            }
            {
              canMoveDown ? (
                <span className="move-down" onClick={this.move.bind(this, "down")}>&#8595;</span>
              ) : (
                <span className="move-down still" style={{ opacity: .5 }}>&#8595;</span>
              )
            }
          </span>
        </label>
      </div>
    );
  }
});

export const StreamReorderer = React.createClass({
  displayName: "StreamReorderer",
  getInitialState: () => ({
    streamersArray: []
  }),
  move(direction, index = 0) {
    const newStreamersArray = JSON.parse(JSON.stringify(this.state.streamersArray));

    if( index === 0  && direction === "up") {
      return;
    } else
    if( index === (newStreamersArray.length - 1) && direction === "down" ) {
      return;
    } else {
      const dir = direction === "up" ? -1 : 1;
      const mover = newStreamersArray[index];
      const moverPlace = index + (dir);
      const movee = newStreamersArray[index + (dir)];
      const moveePlace = index;

      newStreamersArray[moverPlace] = mover;
      newStreamersArray[moveePlace] = movee;

      this.props.methods.reorderStreams(newStreamersArray, moverPlace);

      this.setState({
        streamersArray: newStreamersArray
      });
    }
  },
  componentDidMount() {
    this.setState({
      streamersArray: Object.keys(this.props.streamersInPlayer)
    });
  },
  render() {
    const {
      streamersInPlayer,
      methods: {
        popUpHandler
      }
    } = this.props;
    const {
      streamersArray
    } = this.state;

    const list = streamersArray.map((nameOrID, ind) => {
      return (
        <StreamerItem
          key={nameOrID}
          index={ind}
          name={nameOrID}
          id={nameOrID}
          data={streamersInPlayer[nameOrID]}
          canMoveUp={ind > 0}
          canMoveDown={ind < (streamersArray.length - 1)}
          methods={{
            move: this.move
          }}
        />
      );
    });

    return (
      <div className={`overlay-ui-default view-stream-reorderer open`} onClick={e => e.stopPropagation()}>
        <div className="close" onClick={popUpHandler.bind(null, "close")}>x</div>
        <div className="title">
          Re-Order Streams In Player
        </div>
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="section">
          <div className="list">
            {list.length > 0 ? list : "You aren't watching anyone"}
          </div>
        </div>
      </div>
    );
  }
});
