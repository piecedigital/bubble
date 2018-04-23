import React from "react";

// primary section for the search component
export default React.createClass({
  displayName: "SyncPlayer",
  getInitialState() {
    return {
      playerReady: false
    }
  },
  makePlayer(overrideName) {
    const { link } = this.props;
    let options = {
      video: link || "https://www.twitch.tv/noxidlyrrad/v/253112858".split("/").slice(-2).join(),
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
      this.timestampTimeTicker = setInterval(() => {
        const time = player.getCurrentTime();
        // console.log("time", time);
        if(this.props.fireRef) this.props.fireRef.syncLobbyRef.child("videoState/time").set(time);
      }, 5000);
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
  componentDidMount() {
    this.makePlayer();
  },
  componentWillReceiveProps(nextProps) {
    console.log(this.props);
    if(nextProps.userData != null && nextProps.fireRef != null) {
      console.log("initial lobby commit");
      this.props.fireRef.syncLobbyRef
      .update({
        "hostID": nextProps.userData._id,
        "videoType": "Twitch",
        "videoLink": "https://www.twitch.tv/noxidlyrrad/v/253112858".split("/").slice(-2).join(), // full required for now
        "videoState": {
          "playing": true
        },
        "chatMessages": {},
        "date": Date.now(),
        "version": this.props.versionData
      });
    }
  },
  render() {
    return (
      <div className="top-level-component sync-player">
        <div ref="video">

        </div>
      </div>
    );
  }
})
