import React from "react";

export default React.createClass({
  displayName: "Notifications",
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
      userData
    } = this.props;
    const {
      notifCount
    } = this.state;
    if(!userData || !fireRef) return null;
    if(!notifCount) return null;
    return (
      <div className="notif">{notifCount}</div>
    );
  }
})
