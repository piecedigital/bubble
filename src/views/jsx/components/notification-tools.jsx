import React from "react";
import { Link } from 'react-router';
import { getUsername } from "../../../modules/client/helper-tools";

const NotifItem = React.createClass({
  displayName: "NotifItem",
  getInitialState: () => ({
    questionData: null,
    pollData: null,
    senderName: null
  }),
  markRead() {
    const {
      fireRef,
      userData,
      notifID,
      data
    } = this.props;
    fireRef.notificationsRef
    .child(`${userData._id}/${notifID}/read`)
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
      pollData,
      senderName
    } = this.state;
    let object = {
      "message": "You have a new notification"
    };

    const postData = questionData || pollData;

    switch (data.type) {
      case "newQuestion":
        object.message = `${senderName} asked a question: "${postData.title}"`;
        object.modal = true;
        object.returnTo = location.pathname;
        object.overlay = "answerQuestion";
      break;
      case "newAnswer":
        object.message = `${senderName} answered your question: "${postData.title}"`;
        object.modal = true;
        object.returnTo = location.pathname;
        object.overlay = "answerQuestion";
      break;
      case "newQuestionComment":
        object.message = `${senderName} commented on a question: "${postData.title}"`;
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

    getUsername([data.info.sender])
    .then(dataArr => {
      this.setState({
        senderName: dataArr[0].name
      })
    });

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
      pollData,
      senderName
    } = this.state;

    if(!questionData || !senderName) return null;

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

export const ViewNotifications = React.createClass({
  displayName: "ViewNotifications",
  getInitialState: () => ({
    userDataPresent: false,
    fireRefPresent: false,
    propsPresent: false,
    notifications: null,
    notifCount: 0
  }),
  checkForProps() {
    const {
      userData,
      fireRef
    } = this.props;
    const propsPresent = !!userData && !!fireRef;
    // console.log(propsPresent);
    if(propsPresent) {
      this.setState({
        userDataPresent: !!userData,
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
      userData,
    } = this.props;

    const temp = (snap) => {
      // console.log("prep 2");
      const key = snap.getKey();
      const val = snap.val();
      if(key === userData._id) {
        fireRef.notificationsRef
        .off("child_added", temp);
        this.initListener();
      }
    }

    fireRef.notificationsRef
    .on("child_added", temp);
  },
  initListener() {
    const {
      fireRef,
      userData,
    } = this.props;

    const nodeRef = fireRef.notificationsRef
    .child(userData._id);
    nodeRef.once("value")
    .then(snap => {
      this.setState({
        notifications: snap.val()
      }, () => {
        nodeRef.on("child_added", this.newNotif);
        nodeRef.on("child_changed", this.newNotif);
        this.killListener = function () {
          nodeRef.off("child_added", this.newNotif);
          nodeRef.off("child_changed", this.newNotif);
        }
      });
    });
  },
  newNotif(snap) {
    const key = snap.getKey();
    const val = snap.val();
    // console.log("new notif", key, val);
    const newNotifications = Object.assign(JSON.parse(JSON.stringify(this.state.notifications || {})), {
      [key]: val
    });

    const notifCount = Object.keys(newNotifications).filter(notifID => {
      const notifData = newNotifications[notifID];

      return !notifData.read || null;
    }).length;

    this.setState({
      notifications: newNotifications,
      notifCount
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
      methods,
      methods: {
        popUpHandler
      }
    } = this.props;
    const {
      notifications,
      notifCount,
      propsPresent
    } = this.state;
    // console.log(propsPresent, notifCount);
    if(!propsPresent) return null;

    const notifList = Object.keys(notifications || {}).map(notifID => {
      return (
        <NotifItem
        key={notifID}
        {...{
          fireRef,
          userData,
          notifID,
          location,
          data: notifications[notifID],
          methods
        }}
        />
      );
    }).reverse();

    return (
      <div className={`overlay-ui-default view-notifications open`} onClick={e => e.stopPropagation()}>
        <div className="close" onClick={popUpHandler.bind(null, "close")}>x</div>
        <div className="title">
          Notifications
        </div>
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="section">
          <div className="list">
          {notifList.length > 0 ? notifList : "You have no notifications"}
          </div>
        </div>
      </div>
    );
  }
});
