import React from "react";
import { browserHistory as History } from 'react-router';

const Container = React.createClass({
  displayName: "SyncPlayerContainer",
  getInitialState() {
    return {
      lobbyData: null,
      playerReady: false
    }
  },
  makePlayer(overrideName) {
    let options = {
      video: this.state.lobbyData.videoLink,
      width: "100%",
      height: "800",
    };

    const player = new Twitch.Player(this.refs.video, options);
    this.player = player;

    player.addEventListener(Twitch.Player.READY, () => {
      this.setState({
        playerReady: true
      });
      console.log('Player is ready!');
      if(this.state.lobbyData.hostID === this.props.userData._id) {
        console.log("is host");
        this.timestampTimeTicker = setInterval(() => {
          const time = player.getCurrentTime();
          // console.log("time", time);
          if(this.props.fireRef) this.props.fireRef.syncLobbyRef.child(`${this.state.lobbyKey}/videoState/time`).set(time);
        }, 5000);
      }
    });

    player.addEventListener(Twitch.Player.PLAY, () => {
      this.setState({
        playing: true
      });
      console.log('Player is playing!');
    });

    player.addEventListener(Twitch.Player.PAUSE, () => {
      this.setState({
        playing: false
      });
      console.log('Player is paused!');
    });
  },
  componentDidMount() {},
  componentWillReceiveProps(nextProps) {
    if(!this.props.fireRef) {
      if(nextProps.fireRef) {
        nextProps.fireRef.syncLobbyRef
        .child(this.props.params.lobbyID)
        .once("value")
        .then(snap => {
          this.setState({
            lobbyData: snap.val(),
            lobbyKey: snap.getKey()
          }, () => {
            this.makePlayer();
          });
        });
      }
    }
  },
  render() {
    return (
      <div className="sync-player-container">
        <div ref="video">

        </div>
      </div>
    );
  }
});

const Form = React.createClass({
  displayName: "SyncPlayerForm",
  createLobby(e) {
    e.preventDefault();
    const vodID = this.refs.linkInput.value.split("/").slice(-2).join();

    var lobbyID = this.props.fireRef.syncLobbyRef.push().getKey();
    // https://www.twitch.tv/noxidlyrrad/v/253112858
    console.log(lobbyID);
    this.props.fireRef.syncLobbyRef
    .child(lobbyID)
    .update({
      "hostID": this.props.userData._id,
      "videoType": "Twitch",
      "videoLink": vodID,
      "videoState": {
        "time": 0,
        "playing": true
      },
      "chatMessages": {},
      "date": Date.now(),
      "version": this.props.versionData
    });

    History.push(`sync-player/${lobbyID}`);
  },
  render() {
    if(!this.props.userData) return (
      <div className="general-form">
        <div className="box">
          <h3 className="title">Loading user auth...</h3>
        </div>
      </div>
    );
    return (
      <div className="general-form">
        <div className="box">
          <h3 className="title">Create a new lobby</h3>
          <br />
          <div className="separator-2-dimmer"></div>
          <br />
          <label>Link to Twitch VOD</label>
          <form onSubmit={this.createLobby}>
            <input ref="linkInput" type="text" placeholder="link to twitch VOD"/>
            <br /><br />
            <button>Create Lobby</button>
          </form>
        </div>
      </div>
    );
  }
});

// primary section for the search component
export default React.createClass({
  displayName: "SyncPlayer",
  render() {
    return (
      <div className="top-level-component sync-player">
        {
          (this.props.params && this.props.params.lobbyID) ? (
            <Container {...this.props} />
          ) : (
            <Form {...this.props} />
          )
        }
      </div>
    );
  }
})
