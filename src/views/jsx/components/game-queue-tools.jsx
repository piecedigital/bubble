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
      // console.log(snap.getKey(), snap.val());
      this.setState({
        queueInfo: snap.val()
      }, () => {
        nodeRef.on("child_added", this.infoChange);
        nodeRef.on("child_changed", this.infoChange);
        this.killListener = function () {
          nodeRef.off("child_added", this.infoChange);
          nodeRef.off("child_changed", this.infoChange);
        }
      });
    });
  },
  infoChange(snap) {
    const key = snap.getKey();
    const val = snap.val();
    switch (key) {
      case "title":
      case "game":
      case "queueLimit":
        this.setState({
          queueInfo: Object.assign(this.state.queueInfo, {
            [key]: val
          })
        });
        break;
      case "queue":
      case "nowPlaying":
      case "alreadyPlayed":
        this.setState({
          queueInfo: Object.assign(this.state.queueInfo, {
            [key]: typeof val === "object" ? Object.assign(this.state.queueInfo[key], val) : val
          })
        });
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
        [thisCount]: value.length,
      })
    });
  },
  submit(type) {
    const {
      fireRef,
      userData
    } = this.props;

    switch (type) {
      case update:
        fireRef.gameQueuesRef
        .child(userData.name)
        break;
      default:

    }
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
      propsPresent
    } = this.state;
    // console.log(propsPresent, notifCount);
    if(!propsPresent) return null;

    if(!queueInfo) return (
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
    } = queueInfo;
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
          Queue for {queueInfo.queueHost}
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
                    <input key="input" type="text" ref="title" className={`${this.state.validation["titleValid"] ? " valid" : ""}`} onChange={this.validate.bind(null, "title")}/>,
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
                    <input key="input" type="text" ref="game" className={`${this.state.validation["titleValid"] ? " valid" : ""}`} onChange={this.validate.bind(null, "game")}/>,
                    <div key="validity">{this.state.validation["gameCount"]}/<span className={`${this.state.validation["gameCount"] < this.state.validation["gameMin"] ? "color-red" : ""}`}>{this.state.validation["gameMin"]}</span>-<span className={`${this.state.validation["gameCount"] > this.state.validation["gameMax"] ? "color-red" : ""}`}>{this.state.validation["gameMax"]}</span></div>
                  ]
                ) : <span>{queueInfo.game}</span>
              }
            </label>
          </div>
          <div className="separator-1-dim" />
          {
            userData && userData === queueHost ? (
              <form onSubmit={this.submit.bind(this, "update")}>
                <div className="section">
                  <button className="submit btn-default">Update Game Queue</button>
                </div>
              </form>
            ) : null
          }
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
