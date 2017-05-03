import React from "react";
import { Link } from 'react-router';
import loadData from "../../../modules/client/load-data";
import { getUserID, getUsername } from "../../../modules/client/helper-tools";

const UserItem = React.createClass({
  displayName: "UserItem",
  getInitialState: () => ({
    username: null
  }),
  updateNote() {
    if(this.refs.note) this.props.methods.updateNote(this.refs.note.value || "");
  },
  componentDidMount() {
    getUsername([this.props.userID])
    .then(dataArr => {
      this.setState({
        username: dataArr[0].name
      });
    });
  },
  render() {
    const {
      list,
      data,
      controls,
      methods: {
        removeFromList,
        moveToList,
        updateNote
      }
    } = this.props;
    const { username } = this.state;

    if(!username) return null;

    return (
      <div className={`user-item`}>
        <label>
          <span className="wrap">
            <Link href={`/profile/${username}`} to={`/profile/${username}`}>{username}</Link>
            <div className="section" />
            <div className="game-id">Gamer ID: {data.gamerID}</div>
            <div className="section" />
            <div className="game-id">Leave a note</div>
          </span>
          {
            controls ? (
              <span className="wrap">
                {
                  list === "queue" ? (
                    [
                      <span key="playing" onClick={moveToList.bind(null, "nowPlaying")} title={`Will move this person to the queue Now Playing`}>Now Playing</span>,
                      <span key="played" onClick={moveToList.bind(null, "alreadyPlayed")} title={`Will move this person to the queue Already Played`}>Already Played</span>
                    ]
                  ) : list === "nowPlaying" ? (
                    [
                      <span key="queue" onClick={moveToList.bind(null, "queue")} title={`Will move this person to the queue Now Playing`}>Queue</span>,
                      <span key="played" onClick={moveToList.bind(null, "alreadyPlayed")} title={`Will move this person to the queue Already Played`}>Already Played</span>
                    ]
                  ) : null
                }
                <span className="danger" onClick={removeFromList} title="Will remove this person from the queue completely">Remove</span>
                <textarea ref="note" onChange={this.updateNote} defaultValue={data.note} placeholder="Write your note here..."></textarea>
              </span>
            ) : null
          }
        </label>
      </div>
    );
  }
});

export const ViewGameQueue = React.createClass({
  displayName: "ViewGameQueue",
  getInitialState: () => ({
    queueHostID: null,
    userDataPresent: false,
    fireRefPresent: false,
    propsPresent: false,
    queueInfo: null,
    icon: ("PC/Steam").toLowerCase(),
    confirmedSub: false,
    partnered: false,
    queueAvailable: false,
    validation: {
      // title
      titleMin: 2,
      titleMax: 60,
      titleCount: 0,
      titleValid: false,
      // game
      gameMin: 2,
      gameMax: 40,
      gameCount: 0,
      gameValid: false,
      // gamerID
      gamerIDMin: 2,
      gamerIDMax: 32,
      gamerIDCount: 0,
      gamerIDValid: false,
      // rank
      rankMin: 2,
      rankMax: 32,
      rankCount: 0,
      rankValid: false,
      // queueLimit
      queueLimitMin: 1,
      queueLimitMax: 64,
      queueLimitCount: 64,
      queueLimitValid: false,
    },
  }),
  checkForProps() {
    const {
      userData,
      fireRef,
    } = this.props;
    const { queueHostID } = this.state;
    // console.log(queueHostID);
    const propsPresent =
      // !!userData &&
      !!fireRef &&
      !!queueHostID;
    // console.log(propsPresent);
    if(propsPresent && !this.state.propsPresent) {
      this.setState({
        fireRefPresent: !!fireRef,
        propsPresent
      });
      // console.log(propsPresent, fireRef, queueHostID);
      if(!this.state.propsPresent) this.prepListener();
    }
    if(!!userData) {
      this.setState({
        userDataPresent: !!userData,
      });
      this.checkSub();
    }
  },
  checkSub() {
    const {
      userData,
      queueHost,
      auth
    } = this.props;

    // for the viewer, check if they are subbed to the channel
    if(userData && (userData.name !== queueHost)) {
      // console.log(userData.name, queueHost);
      loadData.call(this, e => {
        console.error(e.stack);
      }, {
        target: queueHost,
        username: userData.name,
        access_token: auth.access_token,
      })
      .then(methods => {
        methods
        .getSubscriptionStatus()
        .then(data => {
          // if they're a sub then set confirmedSub to true
          // otherwise this will trigger a bad request response and we don't have to do anything else
          console.log("subscribed");
          this.setState({
            confirmedSub: true
          });
        })
        .catch((e = {}) => console.error(e.stack || e));
      })
      .catch((e = {}) => console.error(e.stack || e));
    } else {
      // for the channel, check if they are partnered
      loadData.call(this, e => {
        console.error(e.stack);
      }, {
        target: queueHost,
        username: userData.name,
        access_token: auth.access_token,
      })
      .then(methods => {
        methods
        .getChannelByName()
        .then(data => {
          // if they're a sub then set confirmedSub to true
          // otherwise this will trigger a bad request response and we don't have to do anything else
          // console.log("partnered", data.partner);
          this.setState({
            partnered: data.partner
          });
        })
        .catch((e = {}) => console.error(e.stack || e));
      })
      .catch((e = {}) => console.error(e.stack || e));
    }
  },
  prepListener() {
    // console.log("init prep 2");
    const {
      fireRef,
      queueHost,
    } = this.props;
    const { queueHostID } = this.state;

    const temp = (snap) => {
      // console.log("prep 2");
      const key = snap.getKey();
      const val = snap.val();
      if(key === queueHostID) {
        fireRef.gameQueuesRef
        .off("child_added", temp);
      }
    }

    this.initListener();
    // fireRef.gameQueuesRef
    // .on("child_added", temp);
  },
  initListener() {
    const {
      fireRef,
      userData,
      queueHost,
    } = this.props;
    const { queueHostID } = this.state;

    // console.log(queueHostID);
    const nodeRef = fireRef.gameQueuesRef
    .child(queueHostID);
    nodeRef.once("value")
    .then(snap => {
      if(snap.val()) {
        this.setState({
          queueAvailable: true
        });
      }
      const queueInfo = snap.val() || {
        title: (``),
        game: (``),
        rank: (``),
        queueLimit: this.state.validation.queueLimitMax
      };
      // console.log(queueInfo);
      // console.log(snap.getKey(), snap.val());
      // set some initial value for the count in validation
      // not doing this would leave the inputs false since the validation woud not otherise be up todate
      this.setState({
        queueInfo,
        validation: Object.assign(this.state.validation, {
          titleCount: queueInfo.title.length,
          gameCount: queueInfo.game.length,
          rankCount: queueInfo.rank.length,
        })
      }, () => {
        nodeRef.on( "child_added", this.infoChange.bind(this, "added") );
        nodeRef.on( "child_changed", this.infoChange.bind(this, "changed") );
        nodeRef.on( "child_removed", this.infoChange.bind(this, "removed") );
        this.killListener = function () {
          nodeRef.off( "child_added", this.infoChange.bind(this, "added") );
          nodeRef.off( "child_changed", this.infoChange.bind(this, "changed") );
          nodeRef.off( "child_removed", this.infoChange.bind(this, "removed") );
        }
      });
    });
  },
  infoChange(type, snap) {
    const key = snap.getKey();
    const val = snap.val();
    let newQueueInfo = JSON.parse(JSON.stringify(this.state.queueInfo || {}))
    // console.log(type, key, val);
    switch (key) {
      case "title":
      case "game":
      case "queueLimit":
      case "rank":
      case "platform":
      case "subOnly":
        this.setState({
          queueInfo: Object.assign(newQueueInfo, {
            [key]: val
          })
        });
        if(key === "platform") this.changeIcon();
        break;
      case "queue":
      case "nowPlaying":
      case "alreadyPlayed":
      default:
        // remove the entire node
        if(type === "removed") {
          delete newQueueInfo[key]
          this.setState({
            queueInfo: newQueueInfo
          });
        } else {
          const removedOne = Object.keys(val).length <= Object.keys(newQueueInfo[key] || {}).length;
          // if `removedOne`
          if(removedOne) {
            // console.log("removedOne", removedOne);
            // set the new object to the node in state
            this.setState({
              queueInfo: Object.assign(newQueueInfo, {
                [key]: val
              })
            });
          } else {
            // console.log("just a change");
            // else, this is an add or change
            // console.log(newQueueInfo, newQueueInfo[key]);
            this.setState({
              queueInfo: Object.assign(newQueueInfo, {
                [key]: Object.assign(newQueueInfo[key] || {}, val)
              })
            });
          }
        }
        break;
    }
  },
  validate(e, name) {
    // name will be the same as a referenced element
    // the name will be used to be validated, matched with a variable "suffix"
    let value = e.target.value;
    let thisMin = this.state.validation[`${name}Min`];
    let thisMax = this.state.validation[`${name}Max`];
    let thisValid = `${name}Valid`;
    let thisCount = `${name}Count`;
    this.setState({
      validation: Object.assign(this.state.validation, {
        [thisValid]: value.length >= thisMin && value.length <= thisMax,
        [thisCount]: e.target.type === "number" ? value : value.length,
      })
    });
  },
  submit(type, e) {
    e.preventDefault();
    const {
      fireRef,
      userData,
      queueHost
    } = this.props;
    const { queueHostID } = this.state;

    switch (type) {
      case "update":
        fireRef.gameQueuesRef
        .child(userData._id)
        .update({
          title: this.refs.title.value,
          game: this.refs.game.value,
          rank: this.refs.rank.value,
          queueLimit: parseInt(this.refs.queueLimit.value),
          platform: this.refs.platform.value,
          subOnly: this.state.partnered ? this.refs.subOnly.checked : false,
          queueOpen: this.refs.queueOpen.checked,
        })
        this.setState({
          queueAvailable: true
        });
      break;
      case "reset":
        fireRef.gameQueuesRef
        .child(userData._id)
        .update({
          queue: null,
          nowPlaying: null,
          alreadyPlayed: null
        })
      break;
      case "queueUp":
        if(this.refs.gamerID.value) {
          fireRef.gameQueuesRef
          .child(queueHostID)
          .child("queue")
          .child(userData._id)
          .update({
            gamerID: this.refs.gamerID.value,
            date: Date.now()
          });
        }
      break;
    }
  },
  getPlatformLogo(platform = ("PC/Steam").toLowerCase()) {
    const obj = {
      "none": {
        name: "none",
        displayName: "None",
        url: "http://amorrius.net"
      },
      [("PC/Steam").toLowerCase()]: {
        name: "steam",
        displayName: "PC/Steam",
        url: "http://steampowered.com"
      },
      [("PC/Uplay").toLowerCase()]: {
        name: "uplay",
        displayName: "PC/Uplay",
        url: "http://uplay.ubi.com"
      },
      [("PC/Origin").toLowerCase()]: {
        name: "origin",
        displayName: "PC/Origin",
        url: "http://origin.com"
      },
      [("PS4/PSN").toLowerCase()]: {
        name: "psn",
        displayName: "PS4/PSN",
        url: "http://playstation.com"
      },
      [("XBox/XBL").toLowerCase()]: {
        name: "xbox",
        displayName: "XBox/XBL",
        url: "http://xbox.com"
      },
      [("Wii/NN").toLowerCase()]: {
        name: "nintendo",
        displayName: "Wii/NN",
        url: "http://nintendo.com"
      },
    }
    // console.log(obj, platform, obj[platform]);
    return obj[platform];
  },
  changeIcon() {
    // console.log("change icon", this.refs.platform.value);
    this.setState({
      icon: this.refs.platform ? this.refs.platform.value : this.state.queueInfo.platform
    });
  },
  removeFromList(username, list) {
    const {
      fireRef,
      queueHost
    } = this.props;
    const { queueHostID } = this.state;

    fireRef.gameQueuesRef
    .child(queueHostID)
    .child(list)
    .update({
      [username]: null
    })
  },
  moveToList(username, userData, currList, nextList) {
    const {
      fireRef,
      queueHost
    } = this.props;
    const { queueHostID } = this.state;

    fireRef.gameQueuesRef
    .child(queueHostID)
    .child(nextList)
    .update({
      [username]: userData
    })
    .catch((e = {}) => console.error(e.stack || e))

    setTimeout(() => {
      fireRef.gameQueuesRef
      .child(queueHostID)
      .child(currList)
      .update({
        [username]: null
      })
      .catch((e = {}) => console.error(e.stack || e))
    });
  },
  updateNote(username, data) {
    const {
      fireRef,
      queueHost
    } = this.props;
    const { queueHostID } = this.state;

    fireRef.gameQueuesRef
    .child(queueHostID)
    .child("notes")
    .update({
      [username]: data
    })
    .catch((e = {}) => console.error(e.stack || e));
  },
  setChange(e, ref) {
    // console.log("change");
    // console.log(e.target.value, e.target.checked, ref);
    let checkInput = false;
    switch (ref) {
      case "subOnly":
      case "queueOpen":
        checkInput = true;
        break;
    }
    this.setState({
      queueInfo: Object.assign(this.state.queueInfo || {}, {
        [ref]: e.target[checkInput ? "checked" : "value"]
      })
    });
  },
  killListener() {
    console.log("If you're sing this, the game queue listeners we're not properly killed.");
  },
  componentDidMount() {
    if(!this.state.queueHostID) {
      getUserID([this.props.queueHost])
      .then(dataArr => {
        // console.log(dataArr[0]._id);
        this.setState({
          queueHostID: dataArr[0]._id
        });
      });
    }
    // if(!this.state.propsPresent || !this.state.userDataPresent || !this.state.queueHostID) this.checkForProps();
  },
  componentDidUpdate() {
    if(this.state.queueHostID) {
      if(!this.state.propsPresent || !this.state.userDataPresent) this.checkForProps();
    }
  },
  componentWillUnmount() {
    if(this.killListener === "function") this.killListener();
  },
  render() {
    const {
      fireRef,
      userData,
      location,
      queueHost,
      methods: {
        popUpHandler
      }
    } = this.props;
    const {
      queueInfo,
      propsPresent,
      icon,
      confirmedSub,
      partnered,
      queueAvailable,
    } = this.state;

    if(!propsPresent) return null;

    if(
      !queueInfo && (!userData || userData.name !== queueHost)
    ) return (
      <div className={`overlay-ui-default view-game-queue open`} onClick={e => e.stopPropagation()}>
        <div className="close" onClick={popUpHandler.bind(null, "close")}>x</div>
        <div className="title">
          There is no queue info ready
        </div>
      </div>
    );

    if(
      queueInfo && (!userData || userData.name !== queueHost) && !queueInfo.queueOpen
    ) return (
      <div className={`overlay-ui-default view-game-queue open`} onClick={e => e.stopPropagation()}>
        <div className="close" onClick={popUpHandler.bind(null, "close")}>x</div>
        <div className="title">
          {queueHost}'s game queue is currently closed
        </div>
      </div>
    );

    const {
      queue,
      nowPlaying,
      alreadyPlayed,
    } = queueInfo || {};
    const queueList = queue ? Object.keys(queue).sort((user1, user2) => {
      const data1 = queue[user1];
      const data2 = queue[user2];
      return data1.date > date2.date;
    }).map(userID => {
      const data = queue[userID];
      if(queueInfo.notes) data.note = queueInfo.notes[userID]
      return (
        <UserItem
          controls={userData && (userData.name === queueHost)}
          key={userID}
          userID={userID}
          data={data}
          list="queue"
          methods={{
            removeFromList: this.removeFromList.bind(this, userID, "queue"),
            moveToList: this.moveToList.bind(this, userID, data, "queue"),
            updateNote: this.updateNote.bind(this, userID),
          }} />
      );
    }) : <span className="bold">No one in this queue</span>;
    const nowPlayingList = nowPlaying ? Object.keys(nowPlaying).sort((user1, user2) => {
      const data1 = nowPlaying[user1];
      const data2 = nowPlaying[user2];
      return data1.date > date2.date;
    }).map(userID => {
      const data = nowPlaying[userID];
      if(queueInfo.notes) data.note = queueInfo.notes[userID]
      return (
        <UserItem
          controls={userData && (userData.name === queueHost)}
          key={userID}
          userID={userID}
          data={data}
          list="nowPlaying"
          methods={{
            removeFromList: this.removeFromList.bind(this, userID, "nowPlaying"),
            moveToList: this.moveToList.bind(this, userID, data, "nowPlaying"),
            updateNote: this.updateNote.bind(this, userID),
          }} />
      );
    }) : <span className="bold">No one in this queue</span>;
    const alreadyPlayedList = alreadyPlayed ? Object.keys(alreadyPlayed).sort((user1, user2) => {
      const data1 = alreadyPlayed[user1];
      const data2 = alreadyPlayed[user2];
      return data1.date > date2.date;
        }).map(userID => {
      const data = alreadyPlayed[userID];
      if(queueInfo.notes) data.note = queueInfo.notes[userID]
        return (
          <UserItem
            controls={userData && (userData.name === queueHost)}
            key={userID}
            userID={userID}
            data={data}
            list="alreadyPlayed"
            methods={{
              removeFromList: this.removeFromList.bind(this, userID, "alreadyPlayed"),
              moveToList: this.moveToList.bind(this, userID, data, "alreadyPlayed"),
              updateNote: this.updateNote.bind(this, userID),
            }} />
      );
    }) : <span className="bold">No one in this queue</span>;
    const queueLimitMet = queueInfo && queueInfo.queue ? ( Object.keys(queueInfo.queue).length >= (queueInfo.queueLimit || 1) ) : false;


    // console.log( !queueLimitMet )
    // console.log( !queueInfo.queue || !queueInfo.queue[userData._id] )
    // console.log( !queueInfo.nowPlaying || !queueInfo.nowPlaying[userData._id] )
    // console.log( !queueInfo.alreadyPlayed || !queueInfo.alreadyPlayed[userData._id] )
    // console.log(
    //   ( !queueLimitMet ) &&
    //   ( !queueInfo.queue || !queueInfo.queue[userData.name] ) &&
    //   ( !queueInfo.nowPlaying || !queueInfo.nowPlaying[userData.name] ) &&
    //   ( !queueInfo.alreadyPlayed || !queueInfo.alreadyPlayed[userData.name] )
    // );

    return (
      <div className={`overlay-ui-default view-game-queue open`} onClick={e => e.stopPropagation()}>
        <div className="close" onClick={popUpHandler.bind(null, "close")}>x</div>
        <div className="title">
          Queue for {queueHost}
        </div>
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="scroll">
          <div className="section">
            <label>
              <div className="label bold">Title</div>
              {
                userData && userData.name === queueHost ? (
                  [
                    <input key="input" type="text" ref="title" className={`${this.state.validation["titleValid"] ? " valid" : ""}`} value={queueInfo ? queueInfo.title : ""}
                      onChange={e => {
                        this.setChange(e, "title");
                        this.validate(e, "title");
                      }}/>,
                    <div key="validity">{this.state.validation["titleCount"]}/<span className={`${this.state.validation["titleCount"] < this.state.validation["titleMin"] ? "color-red" : ""}`}>{this.state.validation["titleMin"]}</span>-<span className={`${this.state.validation["titleCount"] > this.state.validation["titleMax"] ? "color-red" : ""}`}>{this.state.validation["titleMax"]}</span></div>
                  ]
                ) : <span>{queueInfo.title}</span>
              }
            </label>
          </div>
          <div className="separator-1-dim" />
          <div className="section">
            <label>
              <div className="label bold">Game</div>
              {
                userData && userData.name === queueHost ? (
                  [
                    <input key="input" type="text" ref="game" className={`${this.state.validation["gameValid"] ? " valid" : ""}`} value={queueInfo ? queueInfo.game : ""}
                      onChange={e => {
                        this.setChange(e, "game");
                        this.validate(e, "game");
                      }}/>,
                    <div key="validity">{this.state.validation["gameCount"]}/<span className={`${this.state.validation["gameCount"] < this.state.validation["gameMin"] ? "color-red" : ""}`}>{this.state.validation["gameMin"]}</span>-<span className={`${this.state.validation["gameCount"] > this.state.validation["gameMax"] ? "color-red" : ""}`}>{this.state.validation["gameMax"]}</span></div>
                  ]
                ) : <span>{queueInfo.game}</span>
              }
            </label>
          </div>
          <div className="separator-1-dim" />
          <div className="section">
            <label>
              <div className="label bold">Rank</div>
              {
                userData && userData.name === queueHost ? (
                  [
                    <input key="input" type="text" ref="rank" className={`${this.state.validation["rankValid"] ? " valid" : ""}`} value={queueInfo ? queueInfo.rank : ""}
                      onChange={e => {
                        this.setChange(e, "rank");
                        this.validate(e, "rank");
                      }}/>,
                    <div key="validity">{this.state.validation["rankCount"]}/<span className={`${this.state.validation["rankCount"] < this.state.validation["rankMin"] ? "color-red" : ""}`}>{this.state.validation["rankMin"]}</span>-<span className={`${this.state.validation["rankCount"] > this.state.validation["rankMax"] ? "color-red" : ""}`}>{this.state.validation["rankMax"]}</span></div>
                  ]
                ) : <span>{queueInfo.rank}</span>
              }
            </label>
          </div>
          <div className="separator-1-dim" />
          <div className="section">
            <label>
              <div className="label bold">Queue Limit</div>
              {
                userData && userData.name === queueHost ? (
                  [
                    <input key="input" type="number" min={this.state.validation["queueLimitMin"]} max={this.state.validation["queueLimitMax"]} ref="queueLimit" className={`${this.state.validation["queueLimitValid"] ? " valid" : ""}`} value={queueInfo ? queueInfo.queueLimit : this.state.validation["queueLimitMax"]}
                      onChange={e => {
                        this.setChange(e, "queueLimit");
                        this.validate(e, "queueLimit");
                      }}/>,
                    <div key="validity">{this.state.validation["queueLimitCount"]}/<span className={`${this.state.validation["queueLimitCount"] < this.state.validation["queueLimitMin"] ? "color-red" : ""}`}>{this.state.validation["queueLimitMin"]}</span>-<span className={`${this.state.validation["queueLimitCount"] > this.state.validation["queueLimitMax"] ? "color-red" : ""}`}>{this.state.validation["queueLimitMax"]}</span></div>
                  ]
                ) : <span>{queueInfo.queueLimit}</span>
              }
            </label>
          </div>
          <div className="separator-1-dim" />
          <div className="section">
            <label>
              <div className="label bold">Platform</div>
              <span className="align">
                <a href={this.getPlatformLogo(icon).url} target="_blank"><img className="cr-logo" src={`/media/cr-logos/${this.getPlatformLogo(icon).name}.png`} /></a>
                {
                  userData && userData.name === queueHost ? (
                    <select ref="platform" value={queueInfo ? queueInfo.platform : "PC/Steam"}
                    onChange={e => {
                      this.setChange(e, "platform");
                      this.changeIcon();
                    }}>
                      {
                        ["None", "PC/Steam", "PC/Uplay", "PC/Origin", "PS4/PSN", "XBox/XBL", "Wii/NN"].map(text => {
                          return (
                            <option key={text.toLowerCase()} value={text.toLowerCase()}>{text}</option>
                          );
                        })
                      }
                    </select>
                  ) : <span>{queueInfo ? this.getPlatformLogo(queueInfo.platform).displayName : "PC/Steam"}</span>
                }
              </span>
            </label>
          </div>
          <div className="separator-1-dim" />
          <div className="section">
            <label>
              <span className="label bold">Subscriber Only? </span>
              {
                (userData && userData.name === queueHost) ? (
                  partnered ? (
                    <input key="input" type="checkbox" ref="subOnly" onChange={e => {
                      this.setChange(e, "subOnly");
                    }} checked={queueInfo ? queueInfo.subOnly : false} />
                  ) : "You must be a Twitch partner to change this option"
                ) : (
                  queueInfo ? ( queueInfo.subOnly ? "Yes" : "No" ) : "No"
                )
              }
            </label>
          </div>
          <div className="separator-1-dim" />
          <div className="section">
            <label>
              <span className="label bold">Queue Is Open </span>
              {
                (userData && userData.name === queueHost) ? (
                  <input key="input" type="checkbox" ref="queueOpen" onChange={e => {
                    this.setChange(e, "queueOpen");
                  }} checked={queueInfo ? queueInfo.queueOpen : true} />
                ) : (
                  queueInfo ? ( queueInfo.subOnly ? "Yes" : "No" ) : "No"
                )
              }
            </label>
          </div>
          <div className="separator-1-dim" />
          {
            !queueAvailable ? (
              <div className="section">
                <div className="label bold color-red">The queue is closed</div>
              </div>
            ) : null
          }
          {
            userData && userData.name === queueHost ? (
              <div className="section">
                <div className="align wide">
                  <form onSubmit={this.submit.bind(this, "update")}>
                    <div className="section">
                      <button className="submit btn-default">Update Game Queue</button>
                    </div>
                  </form>
                  <form onSubmit={this.submit.bind(this, "reset")}>
                    <div className="section">
                      <button className="submit btn-default">Reset Game Queue</button>
                    </div>
                  </form>
                </div>
              </div>
            ) : null
          }
          <div className="separator-1-dim" />
          <div className="separator-1-dim" />
          {
            queueInfo && userData && userData.name !== queueHost ? (
              ( queueInfo.subOnly && !confirmedSub) ? (
                <div className="section">
                  <label>
                    <div className="label bold">Sorry! You have to be a subscriber to join this queue. <a href={`http://twitch.tv/${queueHost}/subscribe`} target="_blank" rel="nofollow">Click here to subscribe to {queueHost}</a></div>
                  </label>
                </div>
              ) :
              ( !queueLimitMet ) &&
              ( !queueInfo.queue || !queueInfo.queue[userData._id] ) &&
              ( !queueInfo.nowPlaying || !queueInfo.nowPlaying[userData._id] ) &&
              ( !queueInfo.alreadyPlayed || !queueInfo.alreadyPlayed[userData._id] ) ? (
                <div className="section">
                  <label>
                    <div className="label bold">Queue Up</div>
                    <div className="section">
                      <label>
                        <div className="label bold">Gamer ID (Steam, PSN, XBL, etc.)</div>
                        <input key="input" type="text" ref="gamerID" className={`${this.state.validation["gamerIDValid"] ? " valid" : ""}`} defaultValue={queueInfo.gamerID} onChange={e => {
                          this.validate(e, "gamerID")
                        }}/>
                        <div key="validity">{this.state.validation["gamerIDCount"]}/<span className={`${this.state.validation["gamerIDCount"] < this.state.validation["gamerIDMin"] ? "color-red" : ""}`}>{this.state.validation["gamerIDMin"]}</span>-<span className={`${this.state.validation["gamerIDCount"] > this.state.validation["gamerIDMax"] ? "color-red" : ""}`}>{this.state.validation["gamerIDMax"]}</span></div>
                      </label>
                    </div>
                    <form key="update" onSubmit={this.submit.bind(this, "queueUp")}>
                      <div className="section">
                        <button className="submit btn-default">Queue Up</button>
                      </div>
                    </form>
                  </label>
                </div>
              ) : (
                <div className="section">
                  <label>
                    <div className="label bold">Can't queue up right now. It's either full, you're already queued up, or you already played.</div>
                  </label>
                </div>
              )
            ) : !userData ? (
              <div className="section">
                <label>
                  <div className="label bold">Connect with Twitch to queue up</div>
                </label>
              </div>
            ) : null
          }
          <div className="separator-1-dim" />
          <div className="separator-1-dim" />
          <div className="section">
            {/* now playing queue */}
            <label>
              <div className="label bold">Now Playing: ({queueInfo && queueInfo.nowPlaying ? Object.keys(queueInfo.nowPlaying).length : 0})</div>
              <div className="section">
                <label>
                  <div className="list">
                    {nowPlayingList}
                  </div>
                </label>
              </div>
            </label>
          </div>
          <div className="section">
            {/* waiting queue */}
            <label>
              <div className="label bold">In Queue: ({queueInfo && queueInfo.queue ? Object.keys(queueInfo.queue).length : 0})</div>
              <div className="section">
                <label>
                  <div className="list">
                    {queueList}
                  </div>
                </label>
              </div>
            </label>
          </div>
          <div className="section">
            {/* already played */}
            <label>
              <div className="label bold">Already Played: ({queueInfo && queueInfo.alreadyPlayed ? Object.keys(queueInfo.alreadyPlayed).length : 0})</div>
              <div className="section">
                <label>
                  <div className="list">
                    {alreadyPlayedList}
                  </div>
                </label>
              </div>
            </label>
          </div>
        </div>
      </div>
    );
  }
});
