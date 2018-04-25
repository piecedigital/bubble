import React from "react";
import { Link, browserHistory as History } from 'react-router';
import { formatDate } from "../../modules/client/helper-tools.js";

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
      chatMessages: []
    }
  },
  makePlayer(overrideName) {
    let options = {
      video: this.state.lobbyData.videoLink,
      width: "100%",
      height: "100%",
    };

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
            var dataKey = snap.getKey();
            var data = snap.val();

            const currentTime = player.getCurrentTime();
            if(dataKey === "videoState") {
              if(currentTime - data.time >= this.state.timeDiff || currentTime - data.time <= -this.state.timeDiff) {
                if(this.state.autoSyncTime) player.seek(data.time);
              }

              if(this.state.autoSyncPlay) {
                if(player.isPaused()) {
                  if(data.playing) player.play();
                } else {
                  if(!data.playing) player.pause();
                }
              }
            }

            if(dataKey === "videoLink" && data.videoLink != this.state.lobbyData.videoLink) {
              this.setState({
                lobbyData: Object.assign(this.state.lobbyData, {
                  videoLink: data,
                  // videoType: data,
                })
              });
              this.player.setVideo(data);
            }
          });
        }, 1000);
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
    var value = this.refs[key].value;
    if(value === "false") value = false;
    if(value === "true") value = true;
    console.log(key, value);
    value = parseInt(value) || value;

    this.state[key] = value;
  },
  sendChatMessage(e) {
    e.preventDefault();
    this.props.fireRef.syncLobbyRef
    .child(this.props.params.lobbyID)
    .child("chatMessages")
    .push()
    .set({
      username: this.props.userData.display_name,
      userID: this.props.userData._id,
      message: this.refs.chatMessageInput.value,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    });

    this.refs.chatMessageInput.value = "";
  },
  formatTime(time) {
    var formattedTime = formatDate(time);
    return formattedTime.formatted;
  },
  scrollChat() {
    console.log("scroll");
    this.refs.messages.scrollTop = this.refs.messages.scrollHeight - this.refs.messages.offsetHeight;
  },
  componentDidMount() {},
  componentWillReceiveProps(nextProps) {
    if(!this._fireRefMounted && nextProps.fireRef) {
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

      //
      nextProps.fireRef.syncLobbyRef
      .child(this.props.params.lobbyID)
      .child("chatMessages")
      .on("child_added", snap => {
        const dataKey = snap.getKey();
        const data = snap.val();

        var newChatMessages = Array.from(this.state.chatMessages);
        newChatMessages.push(data);
        this.setState({
          chatMessages: newChatMessages
        }, this.scrollChat);
      });
    }
    if(nextProps.fireRef) {
      this._fireRefMounted = true;
    }
  },
  render() {
    return (
      <div className="sync-lobby-container">
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
          <div className="chat-messages">
            <div className="messages" ref="messages">
              {
                this.state.chatMessages.map((msg, ind) => {
                  return (
                    <div key={ind} className="chat-msg">
                      <p>
                        <span className="timestamp">[{this.formatTime(msg.timestamp)}]</span><span>&nbsp;</span>
                        <Link to={`/profile/${msg.username.toLowerCase()}`} className="name">{msg.username}</Link><span>:&nbsp;</span>
                        <span className="body">{msg.message}</span>
                      </p>
                    </div>
                  );
                })
              }
            </div>
            <div className="form">
              <form onSubmit={this.sendChatMessage}>
                <input ref="chatMessageInput" />
                <button>Send</button>
              </form>
            </div>
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
    if(!vodID) return;

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
      "date": firebase.database.ServerValue.TIMESTAMP,
      "version": this.props.versionData
    });

    History.push(`sync-lobby/${lobbyID}`);
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
      <div className="top-level-component sync-lobby">
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
