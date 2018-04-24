import React from "react";
import { browserHistory as History } from 'react-router';

const Container = React.createClass({
  displayName: "SyncPlayerContainer",
  getInitialState() {
    return {
      isHost: null,
      lobbyData: null,
      playerReady: false,
      autoSyncTime: true,
      autoSyncPlay: true,
      timeDiff: 1,
      updateInterval: 1,
    }
  },
  makePlayer(overrideName) {
    let options = {
      video: this.state.lobbyData.videoLink,
      width: "100%",
      height: "800",
    };console.log(options);

    const player = new Twitch.Player(this.refs.video, options);
    this.player = player;

    player.addEventListener(Twitch.Player.READY, () => {
      this.setState({
        playerReady: true
      });
      console.log('Player is ready!');
      if(this.props.userData && this.state.lobbyData.hostID === this.props.userData._id) {
        this.setState({
          isHost: true
        });
        console.log("is host");
        this.timestampTimeTicker = () => {
          setInterval(() => {
            const time = player.getCurrentTime();
            // console.log("time", time);
            if(this.props.fireRef) this.props.fireRef.syncLobbyRef.child(`${this.props.params.lobbyID}/videoState/time`).set(time);
          }, 1000 + this.state.updateInterval);
        };
        this.timestampTimeTicker();
      } else {
        console.log("is not host");
        setTimeout(() => {
          this.setState({
            isHost: false
          });
          // listen as non host on lobby data
          this.props.fireRef.syncLobbyRef.child(this.props.params.lobbyID).on("child_changed", snap => {
            var data = snap.val();
            // console.log(data);
            const currentTime = player.getCurrentTime();
            if(data.time && currentTime - data.time >= this.state.timeDiff || currentTime - data.time <= -this.state.timeDiff) {
              if(this.state.autoSyncTime) player.seek(data.time);
            }

            if(data.playing != undefined) {
              if(this.state.autoSyncPlay) {
                if(player.isPaused()) {
                  if(data.playing) player.play();
                } else {
                  if(!data.playing) player.pause();
                }
              }
            }

            if(data.videoLink && data.videoLink != this.state.lobbyData.videoLink) {
              this.setState({
                lobbyData: Object.assign(this.state.lobbyData, {
                  videoLink: data.videoLink,
                  videoType: data.videoType,
                })
              });
              this.player.setVideo(data.videoLink);
            }
          });
        }, 3000);
      }
    });

    if(!this.props.userData || this.state.lobbyData.hostID === this.props.userData._id) {
      player.addEventListener(Twitch.Player.PLAY, () => {
        this.setState({
          playing: true
        });
        console.log('Player is playing!');
        if(this.props.fireRef) this.props.fireRef.syncLobbyRef.child(`${this.props.params.lobbyID}/videoState/playing`).set(true);
      });

      player.addEventListener(Twitch.Player.PAUSE, () => {
        this.setState({
          playing: false
        });
        console.log('Player is paused!');
        if(this.props.fireRef) this.props.fireRef.syncLobbyRef.child(`${this.props.params.lobbyID}/videoState/playing`).set(false);
      });
    }
  },
  changeLink(e) {
    e.preventDefault();
    const lobbyID = this.props.params.lobbyID;
    const vodID = this.refs.newLink.value.split("/").slice(-2).join("");
    this.player.setVideo(vodID);
    this.props.fireRef.syncLobbyRef
    .child(`${lobbyID}/videoLink`)
    .set(vodID);
    this.props.fireRef.syncLobbyRef
    .child(`${lobbyID}/videoType`)
    .set("Twitch");
  },
  updateOptions(key) {
    this.state[key] = this.refs[key].value;
  },
  componentDidMount() {},
  componentWillReceiveProps(nextProps) {
    if(nextProps.fireRef) {
      if(!this.state.lobbyData) {
        nextProps.fireRef.syncLobbyRef
        .child(this.props.params.lobbyID)
        .once("value")
        .then(snap => {
          this.setState({
            lobbyData: snap.val()
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
        <div className="video" ref="video">
        </div>
        <div className="side-panel">
          <div className="controls">
            {
              (this.state.isHost != null) ? (
                (this.state.isHost) ? (
                  <div>
                    <div className="row">
                      <label title="Change the video link for the lobby">Change video link</label>
                      <form onSubmit={this.changeLink}>
                        <input ref="newLink" />
                        <button>Submit</button>
                      </form>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="row">
                      <label>Automatically sync video time?</label>
                      <select ref="autoSyncTime" onChange={this.updateOptions.bind(this, "autoSyncTime")}>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                      </select>
                    </div>
                    <div className="row">
                      <label>Automatically sync play state?</label>
                      <select ref="autoSyncPlay" onChange={this.updateOptions.bind(this, "autoSyncPlay")}>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                      </select>
                    </div>
                    <div className="row">
                      <label title="How big of a time difference you want to allow between viewers">Time offset (in seconds)</label>
                      <input ref="timeDiff" onChange={this.updateOptions.bind(this, "timeDiff")} type="number" min="1" defaultValue={this.state.timeDiff} />
                    </div>
                    {/* <div className="row">
                      <label title="How often the sync times should be checked">Sync Interval (in seconds)</label>
                      <input ref="updateInterval" onChange={this.updateOptions.bind(this, "updateInterval")} type="number" min="1" />
                    </div> */}
                  </div>
                )
              ) : null
            }
          </div>
          <div className="messages">
          </div>
        </div>
      </div>
    );
  }
});

const Form = React.createClass({
  displayName: "SyncPlayerForm",
  createLobby(e) {
    e.preventDefault();
    const vodID = this.refs.linkInput.value.split("/").slice(-2).join("");

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
