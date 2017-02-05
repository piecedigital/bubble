import React from "react";
import { Link } from 'react-router';

const UserItem = React.createClass({
  displayName: "UserItem",
  getInitialState: () => ({
    questionData: null,
    pollData: null
  }),
  markRead() {
    const {
      fireRef,
      userData,
      notifID,
      data
    } = this.props;
    fireRef.notificationsRef
    .child(`${userData.name}/${notifID}/read`)
    .set(true);
  },
  getMessage() {
    const {
      data,
      userData,
      location
    } = this.props;
    const {
      questionData,
      pollData
    } = this.state;
    let object = {
      "message": "You have a new notification"
    };

    const postData = questionData || pollData;

    switch (data.type) {
      case "newQuestion":
        object.message = `${data.info.sender} asked a question: "${postData.title}"`;
        object.modal = true;
        object.returnTo = location.pathname;
        object.overlay = "answerQuestion";
      break;
      case "newAnswer":
        object.message = `${data.info.sender} answered your question: "${postData.title}"`;
        object.modal = true;
        object.returnTo = location.pathname;
        object.overlay = "answerQuestion";
      break;
      case "newQuestionComment":
        object.message = `${data.info.sender} commented on a question: "${postData.title}"`;
        object.modal = true;
        object.returnTo = location.pathname;
        object.overlay = questionData ? "viewQuestion" : "viewPoll";
      break;
      case "questionUpvote":
        object.message = `You're question was upvoted: "${postData.title}"`;
        object.modal = true;
        object.returnTo = location.pathname;
        object.overlay = questionData ? "viewQuestion" : "viewPoll";
      break;
      case "answerUpvote":
        object.message = `You're answer was upvoted: "${postData.title}"`;
        object.modal = true;
        object.returnTo = location.pathname;
        object.overlay = questionData ? "viewQuestion" : "viewPoll";
      break;
      case "commentUpvote":
        object.message = `You're comment was upvoted: "${postData.title}"`;
        object.modal = true;
        object.returnTo = location.pathname;
        object.overlay = questionData ? "viewQuestion" : "viewPoll";
      break;
    }
    return object;
  },
  componentDidMount() {
    const {
      fireRef,
      data
    } = this.props;

    if(
      data &&
      data.info &&
      data.info.questionID
    ) {
      fireRef.questionsRef
      .child(data.info.questionID)
      .child("title")
      .once("value")
      .then(snap => {
        this.setState({
          "questionData": {
            "title": snap.val()
          }
        })
      });
    } else
    if(
      data &&
      data.info &&
      data.info.pollID
    ) {
      fireRef.pollsRef
      .child(data.info.pollID)
      .child("title")
      .once("value")
      .then(snap => {
        this.setState({
          "pollData": {
            "title": snap.val()
          }
        })
      });
    }
  },
  render() {
    const {
      notifID,
      data,
      methods: {
        popUpHandler
      }
    } = this.props;

    const {
      questionData,
      pollData
    } = this.state;

    switch (data.type) {
      case "newQuestion":
      case "newAnswer":
      case "newQuestionComment":
      case "questionUpvote":
      case "answerUpvote":
      case "commentUpvote":
        // for the above notification types some question data is required
        if(!questionData && !pollData) return null;
    }
    const message = this.getMessage();

    return (
      <div className={`notif-item${data.read ? " read" : ""}`}>
        <label>
          <Link className="name" to={{
            pathname: data.info.questionURL || data.info.postURL,
            state: {
              modal: message.modal,
              returnTo: message.returnTo
            }
          }} onClick={e => {
            popUpHandler(message.overlay, {
              [questionData ? "questionID" : "pollID"]: data.info[[questionData ? "questionID" : "pollID"]]
            });
            this.markRead();
          }}>{message.message}</Link>{!data.read ? (<span className="mark-read" onClick={this.markRead}>x</span>) : null}
        </label>
      </div>
    );
  }
});

export const ViewGameQueue = React.createClass({
  displayName: "ViewGameQueue",
  getInitialState: () => ({
    userDataPresent: false,
    fireRefPresent: false,
    propsPresent: false,
    queueInfo: null,
    icon: ("PC/Steam").toLowerCase(),
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
      queueLimitCount: 1,
      queueLimitValid: false,
    },
  }),
  checkForProps() {
    const {
      // userData,
      fireRef
    } = this.props;
    const propsPresent =
      // !!userData &&
      !!fireRef;
    // console.log(propsPresent);
    if(propsPresent) {
      this.setState({
        // userDataPresent: !!userData,
        fireRefPresent: !!fireRef,
        propsPresent
      });

      this.prepListener();
    }
  },
  prepListener() {
    // console.log("init prep 2");
    const {
      fireRef,
      queueHost,
    } = this.props;

    const temp = (snap) => {
      // console.log("prep 2");
      const key = snap.getKey();
      const val = snap.val();
      if(key === queueHost) {
        fireRef.gameQueuesRef
        .off("child_added", temp);
        this.initListener();
      }
    }

    fireRef.gameQueuesRef
    .on("child_added", temp);
  },
  initListener() {
    const {
      fireRef,
      userData,
      queueHost,
    } = this.props;

    const nodeRef = fireRef.gameQueuesRef
    .child(queueHost);
    nodeRef.once("value")
    .then(snap => {
      const queueInfo = snap.val();
      // console.log(snap.getKey(), snap.val());
      this.setState({
        queueInfo,
        validation: Object.assign(this.state.validation, {
          titleCount: queueInfo.title.length,
          gameCount: queueInfo.game.length,
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
      case "subOnly":
      case "rank":
        this.setState({
          queueInfo: Object.assign(newQueueInfo, {
            [key]: val
          })
        });
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
  validate(name, e) {
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

    switch (type) {
      case "update":
        fireRef.gameQueuesRef
        .child(userData.name)
        .update({
          title: this.refs.title.value,
          game: this.refs.game.value,
          rank: this.refs.rank.value,
          queueLimit: parseInt(this.refs.queueLimit.value),
          subOnly: this.refs.subOnly.checked,
        })
      break;
      case "reset":
        fireRef.gameQueuesRef
        .child(userData.name)
        .update({
          queue: null,
          nowPlaying: null,
          alreadyPlayed: null
        })
      break;
      case "queueUp":
        fireRef.gameQueuesRef
        .child(queueHost)
        .child("queue")
        .child(userData.name)
        .update({
          gamerID: this.refs.gamerID.value,
          date: Date.now()
        })
      break;
    }
  },
  getPlatformLogo(platform = ("PC/Steam").toLowerCase()) {
    const obj = {
      [("PC/Steam").toLowerCase()]: {
        name: "steam",
        url: "http://steampowered.com"
      },
      [("PC/Uplay").toLowerCase()]: {
        name: "uplay",
        url: "http://uplay.ubi.com"
      },
      [("PC/Origin").toLowerCase()]: {
        name: "origin",
        url: "http://origin.com"
      },
      [("PS4/PSN").toLowerCase()]: {
        name: "psn",
        url: "http://playstation.com"
      },
      [("XBox/XBL").toLowerCase()]: {
        name: "xbox",
        url: "http://xbox.com"
      },
      [("Wii/NN").toLowerCase()]: {
        name: "nintendo",
        url: "http://nintendo.com"
      },
    }
    // console.log(obj, platform, obj[platform]);
    return obj[platform];
  },
  changeIcon() {
    console.log("change icon", this.refs.platform.value);
    this.setState({
      icon: this.refs.platform.value
    });
  },
  componentDidMount() {
    if(!this.state.propsPresent) this.checkForProps();
  },
  componentDidUpdate() {
    if(!this.state.propsPresent) this.checkForProps();
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
    } = this.state;

    if(!propsPresent) return null;

    if(!queueInfo && (!userData || userData.name !== queueHost)) return (
      <div className={`overlay-ui-default view-game-queue open`} onClick={e => e.stopPropagation()}>
        <div className="close" onClick={popUpHandler.bind(null, "close")}>x</div>
        <div className="title">
          There is no queue info ready
        </div>
      </div>
    );

    const {
      queue,
      nowPlaying,
      alreadyPlayed,
    } = queueInfo || {};
    const queueList = queue ? Object.keys(queue).map(username => {
      const data = queue[username];
      return (
        <span key={username}>{username}</span>
      );
    }) : <span className="bold">No one in this queue</span>;
    const nowPlayingList = nowPlaying ? Object.keys(nowPlaying).map(username => {
      const data = nowPlaying[username];
      return (
        <span key={username}>{username}</span>
      );
    }) : <span className="bold">No one in this queue</span>;
    const alreadyPlayedList = alreadyPlayed ? Object.keys(alreadyPlayed).map(username => {
      const data = alreadyPlayed[username];
      return (
        <span key={username}>{username}</span>
      );
    }) : <span className="bold">No one in this queue</span>;

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
                    <input key="input" type="text" ref="title" className={`${this.state.validation["titleValid"] ? " valid" : ""}`} defaultValue={queueInfo ? queueInfo.title : ""} onChange={this.validate.bind(null, "title")}/>,
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
                    <input key="input" type="text" ref="game" className={`${this.state.validation["gameValid"] ? " valid" : ""}`} defaultValue={queueInfo ? queueInfo.game : ""} onChange={this.validate.bind(null, "game")}/>,
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
                    <input key="input" type="text" ref="rank" className={`${this.state.validation["rankValid"] ? " valid" : ""}`} defaultValue={queueInfo ? queueInfo.rank : ""} onChange={this.validate.bind(null, "rank")}/>,
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
                    <input key="input" type="number" min={this.state.validation["queueLimitMin"]} max={this.state.validation["queueLimitMax"]} ref="queueLimit" className={`${this.state.validation["queueLimitValid"] ? " valid" : ""}`} defaultValue={queueInfo ? queueInfo.queueLimit : 1} onChange={this.validate.bind(null, "queueLimit")}/>,
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
                    <select ref="platform" defaultValue={queueInfo ? queueInfo.platform : "PC/Steam"} onChange={this.changeIcon}>
                      {
                        ["PC/Steam", "PC/Uplay", "PC/Origin", "PS4/PSN", "XBox/XBL", "Wii/NN"].map(text => {
                          return (
                            <option key={text.toLowerCase()} value={text.toLowerCase()}>{text}</option>
                          );
                        })
                      }
                    </select>
                  ) : <span>{queueInfo ? queueInfo.platform : "PC/Steam"}</span>
                }
              </span>
            </label>
          </div>
          <div className="separator-1-dim" />
          <div className="section">
            <label>
              <span className="label bold">Subscriber Only? </span>
              {
                userData && userData.name === queueHost ? (
                  <input key="input" type="checkbox" ref="subOnly" defaultChecked={queueInfo ? queueInfo.subOnly : false} />
                ) : (
                  queueInfo ? ( queueInfo.subOnly ? "Yes" : "No" ) : "No"
                )
              }
            </label>
          </div>
          <div className="separator-1-dim" />
          {
            userData && userData.name === queueHost ? (
              [
                <form key="update" onSubmit={this.submit.bind(this, "update")}>
                  <div className="section">
                    <button className="submit btn-default">Update Game Queue</button>
                  </div>
                </form>,
                <form key="reset" onSubmit={this.submit.bind(this, "reset")}>
                  <div className="section">
                    <button className="submit btn-default">Reset Game Queue</button>
                  </div>
                </form>
              ]
            ) : null
          }
          <div className="separator-1-dim" />
          <div className="separator-1-dim" />
          {
            queueInfo && userData && userData.name !== queueHost ? (
              ( !queueInfo.queue || !queueInfo.queue[userData.name] ) &&
              ( !queueInfo.nowPlaying || !queueInfo.nowPlaying[userData.name] ) &&
              ( !queueInfo.alreadyPlayed || !queueInfo.alreadyPlayed[userData.name] ) ? (
                <div className="section">
                  <label>
                    <div className="label bold">Queue Up</div>
                    <div className="section">
                      <label>
                        <div className="label bold">Gamer ID (Steam, PSN, XBL, etc.)</div>
                        <input key="input" type="text" ref="gamerID" className={`${this.state.validation["gamerIDValid"] ? " valid" : ""}`} defaultValue={queueInfo.gamerID} onChange={this.validate.bind(null, "gamerID")}/>
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
              ) : null
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
            {/* waiting queue */}
            <label>
              <div className="label bold">Now Playing</div>
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
            {/* now playing queue */}
            <label>
              <div className="label bold">In Queue</div>
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
              <div className="label bold">Already Played</div>
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
