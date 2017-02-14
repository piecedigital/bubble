"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _modulesClientLoadData = require("../../../modules/client/load-data");

var _modulesClientLoadData2 = _interopRequireDefault(_modulesClientLoadData);

exports["default"] = _react2["default"].createClass({
  displayName: "FollowButton",
  getInitialState: function getInitialState() {
    return {
      isFollowing: false
    };
  },
  checkStatus: function checkStatus() {
    var _this = this;

    var _props = this.props;
    var name = _props.name;
    var targetName = _props.targetName;

    _modulesClientLoadData2["default"].call(this, function (e) {
      console.error(e.stack);
    }, {
      username: name,
      target: targetName.toLowerCase()
    }).then(function (methods) {
      methods.getFollowStatus().then(function (data) {
        _this.setState({
          isFollowing: true
        });
      })["catch"](function (e) {
        if (e) console.error(e.stack || e);
        _this.setState({
          isFollowing: false
        });
      });
    })["catch"](function (e) {
      return console.error(e.stack || e);
    });
  },
  followOrUnfollow: function followOrUnfollow(action, bool) {
    var _this2 = this;

    var _props2 = this.props;
    var auth = _props2.auth;
    var name = _props2.name;
    var targetName = _props2.targetName;
    var callback = _props2.callback;

    var method = action + "Stream";
    console.log(method);
    _modulesClientLoadData2["default"].call(this, function (e) {
      console.error(e.stack);
    }, {
      username: name,
      target: targetName,
      access_token: auth.access_token
    }).then(function (methods) {
      methods[method]().then(function (data) {
        console.log("action", method, "completed");
        _this2.setState({
          isFollowing: bool
        });
        if (typeof callback === "function") callback(bool);
      })["catch"](function (e) {
        return console.error(e.stack || e);
      });
    })["catch"](function (e) {
      return console.error(e.stack || e);
    });
  },
  toggleFollow: function toggleFollow() {
    switch (this.state.isFollowing) {
      case true:
        this.followOrUnfollow("unfollow", false);break;
      case false:
        this.followOrUnfollow("follow", true);break;
    }
  },
  componentDidMount: function componentDidMount() {
    this.checkStatus();
  },
  render: function render() {
    var isFollowing = this.state.isFollowing;
    var _props3 = this.props;
    var targetName = _props3.targetName;
    var targetDisplay = _props3.targetDisplay;

    if (isFollowing === null) return null;
    return _react2["default"].createElement(
      "div",
      { className: this.props.className + " follow" },
      _react2["default"].createElement(
        "a",
        { href: "#", className: this.props.className, onClick: this.toggleFollow },
        isFollowing ? "Unfollow" : "Follow",
        " ",
        targetDisplay || targetName
      )
    );
  }
});
module.exports = exports["default"];