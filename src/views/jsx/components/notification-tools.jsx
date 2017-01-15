import React from "react";
import { Link } from 'react-router';

const NotifItem = React.createClass({
  displayName: "NotifItem",
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
    let object = {
      "message": "You have a new notification"
    };

    switch (data.type) {
      case "newQuestion":
        object.message = `${data.info.sender} has asked you a question`;
        object.modal = true;
        object.returnTo = location.pathname;
        object.overlay = "answerQuestion";
      break;
      case "newQuestionComment":
        object.message = `${data.info.sender} has commented on a question`;
        object.modal = true;
        object.returnTo = location.pathname;
        object.overlay = "viewQuestion";
      break;
      case "questionUpvote":
        object.message = `You're question has been upvoted`;
        object.modal = true;
        object.returnTo = location.pathname;
        object.overlay = "viewQuestion";
      break;
      case "answerUpvote":
        object.message = `You're answer has been upvoted`;
        object.modal = true;
        object.returnTo = location.pathname;
        object.overlay = "viewQuestion";
      break;
      case "commentUpvote":
        object.message = `You're comment has been upvoted`;
        object.modal = true;
        object.returnTo = location.pathname;
        object.overlay = "viewQuestion";
      break;
    }
    return object;
  },
  render() {
    const {
      notifID,
      data,
      methods: {
        popUpHandler
      }
    } = this.props;
    const message = this.getMessage();

    return (
      <div className={`notif-item${data.read ? " read" : ""}`}>
        <label>
          <Link className="name" to={{
            pathname: data.info.questionURL,
            state: {
              modal: message.modal,
              returnTo: message.returnTo
            }
          }} onClick={e => {
            e.preventDefault();
            popUpHandler(message.overlay, {
              questionID: data.info.questionID
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
    console.log(propsPresent);
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
      if(key === userData.name) {
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
    .child(userData.name);
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
    console.log("new notif", key, val);
    const newNotifications = Object.assign(JSON.parse(JSON.stringify(this.state.notifications)) || {}, {
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
    console.log(propsPresent, notifCount);
    if(!propsPresent) return null;

    const notifList = Object.keys(notifications).map(notifID => {
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
