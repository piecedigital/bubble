"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

exports["default"] = _react2["default"].createClass({
  displayName: "Notifications",
  getInitialState: function getInitialState() {
    return {
      userDataPresent: false,
      fireRefPresent: false,
      propsPresent: false,
      notifications: null,
      notifCount: 0
    };
  },
  checkForProps: function checkForProps() {
    var _props = this.props;
    var userData = _props.userData;
    var fireRef = _props.fireRef;

    var propsPresent = !!userData && !!fireRef;
    // console.log(propsPresent);
    if (propsPresent) {
      this.setState({
        userDataPresent: !!userData,
        fireRefPresent: !!fireRef,
        propsPresent: propsPresent
      });

      this.prepListener();
    }
  },
  prepListener: function prepListener() {
    var _this = this;

    // console.log("init prep 2");
    var _props2 = this.props;
    var fireRef = _props2.fireRef;
    var userData = _props2.userData;

    var temp = function temp(snap) {
      // console.log("prep 2");
      var key = snap.getKey();
      var val = snap.val();
      if (key === userData._id) {
        fireRef.notificationsRef.off("child_added", temp);
        _this.initListener();
      }
    };

    fireRef.notificationsRef.on("child_added", temp);
  },
  initListener: function initListener() {
    var _this2 = this;

    var _props3 = this.props;
    var fireRef = _props3.fireRef;
    var userData = _props3.userData;

    var nodeRef = fireRef.notificationsRef.child(userData._id);
    nodeRef.once("value").then(function (snap) {
      _this2.setState({
        notifications: snap.val()
      }, function () {
        nodeRef.on("child_added", _this2.newNotif);
        nodeRef.on("child_changed", _this2.newNotif);
        _this2.killListener = function () {
          nodeRef.off("child_added", this.newNotif);
          nodeRef.off("child_changed", this.newNotif);
        };
      });
    });
  },
  newNotif: function newNotif(snap) {
    var key = snap.getKey();
    var val = snap.val();
    // console.log("new notif", key, val);
    var newNotifications = Object.assign(JSON.parse(JSON.stringify(this.state.notifications)) || {}, _defineProperty({}, key, val));

    var notifCount = Object.keys(newNotifications).filter(function (notifID) {
      var notifData = newNotifications[notifID];

      return !notifData.read || null;
    }).length;

    this.setState({
      notifications: newNotifications,
      notifCount: notifCount
    });
  },
  componentDidMount: function componentDidMount() {
    if (!this.state.propsPresent) this.checkForProps();
  },
  componentDidUpdate: function componentDidUpdate() {
    if (!this.state.propsPresent) this.checkForProps();
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this.killListener === "function") this.killListener();
  },
  render: function render() {
    var _props4 = this.props;
    var fireRef = _props4.fireRef;
    var userData = _props4.userData;
    var notifCount = this.state.notifCount;

    if (!userData || !fireRef) return null;
    if (!notifCount) return null;
    return _react2["default"].createElement(
      "div",
      { className: "notif" },
      notifCount
    );
  }
});
module.exports = exports["default"];