import React from "react";
import firebase from "firebase";
import { Link } from 'react-router';

const SyncLobbyItem = React.createClass({
  displayName: "SyncLobbyItem",
  remove() {
    const {
      fireRef,
      lobbyID
    } = this.props;
    fireRef.syncLobbyRef
    .child(lobbyID)
    .set(null);
  },
  render() {
    const {
      lobbyID,
    } = this.props;

    return (
      <div className="lobby-item">
        <label>
          <Link className="name" to={`/sync-lobby/${lobbyID}`}>{lobbyID}</Link>
          <div className="tools">
            <span className="unmark warning" onClick={this.remove}>x</span>
          </div>
        </label>
      </div>
    );
  }
});

export const ViewSyncLobby = React.createClass({
  displayName: "ViewSyncLobby",
  getInitialState: () => ({
    lobbies: {}
  }),
  newLobby(snap) {
    const lobbyKey = snap.getKey();
    const lobbyData = snap.val();
    const newLobbies = JSON.parse(JSON.stringify(this.state.lobbies));
    // appends the new lobby to the top of the lobby list
    this.setState({
      lobbies: Object.assign(newLobbies, {
        [lobbyKey]: lobbyData
      })
    })
  },
  removedLobby(snap) {
    const lobbyKey = snap.getKey();
    const lobbyData = snap.val();
    console.log(lobbyKey, lobbyData);
    const newLobbies = JSON.parse(JSON.stringify(this.state.lobbies));
    delete newLobbies[lobbyKey];
    this.setState({
      lobbys: newLobbies
    })
  },
  addLobby(e) {
    e.preventDefault();
    const {
      fireRef,
      userData,
      versionData,
    } = this.props;
    const vodID = this.refs["new-lobby"].value.split("/").slice(-2).join("");

    if(!vodID) return;

    fireRef.syncLobbyRef
    .push()
    .set({
      "hostID": userData._id,
      "videoType": "Twitch",
      "videoLink": vodID,
      "videoState": {
        "time": 0,
        "playing": true
      },
      "chatMessages": {},
      "date": firebase.database.ServerValue.TIMESTAMP,
      "version": versionData
    });

    this.refs["new-lobby"].value = "";
  },
  componentDidMount() {
    const {
      fireRef,
      userData,
    } = this.props;

    fireRef.syncLobbyRef
    .orderByChild("hostID").equalTo(userData._id)
    .once("value")
    .then(snap => {
      this.setState({
        lobbies: snap.val() || {}
      })
    });

    let refNode = fireRef.syncLobbyRef
    .orderByChild("hostID").equalTo(userData._id);
    refNode.on("child_added", this.newLobby)
    refNode.on("child_removed", this.removedLobby)
  },
  componentWillUnmount() {
    const {
      fireRef,
      userData,
    } = this.props;
    let refNode = fireRef.syncLobbyRef
    .orderByChild("hostID").equalTo(userData._id);
    refNode.off("child_added", this.newLobby)
    refNode.off("child_removed", this.removedLobby)
  },
  render() {
    const {
      fireRef,
      userData,
      methods: {
        popUpHandler
      }
    } = this.props;

    const syncLobbyList = Object.keys(this.state.lobbies).map(lobbyID => {
      return (
        <SyncLobbyItem
          key={lobbyID}
          {...{
            fireRef,
            userData,
            lobbyID,
          }}
        />
      );
    }).reverse();

    return (
      <div className={`overlay-ui-default view-sync-lobbies open`} onClick={e => e.stopPropagation()}>
        <div className="close" onClick={popUpHandler.bind(null, "close")}>x</div>
        <div className="title">
          Sync Lobbies
        </div>
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="scroll">
          <div className="section">
            <div className="list">
              {syncLobbyList}
            </div>
          </div>
        </div>
        <div className="separator-4-dim" />
        <div className="section">
          <form onSubmit={this.addLobby}>
            <div className="section">
              <label>
                <div className="label bold">Add Lobby</div>
                <input type="text" ref="new-lobby" />
              </label>
            </div>
            <div className="section">
              <button className="submit btn-default">Submit</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
})
