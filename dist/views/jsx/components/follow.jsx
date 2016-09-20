"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _modulesLoadData = require("../../../modules/load-data");

var _modulesLoadData2 = _interopRequireDefault(_modulesLoadData);

exports["default"] = _react2["default"].createClass({
  displayName: "FollowButton",
  getInitialState: function getInitialState() {
    return {
      isFollowing: null
    };
  },
  checkStatus: function checkStatus() {
    var _this = this;

    var _props = this.props;
    var name = _props.name;
    var targetName = _props.targetName;

    _modulesLoadData2["default"].call(this, function (e) {
      console.error(e.stack);
    }, {
      username: name,
      targetName: targetName.toLowerCase()
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
    var name = _props2.name;
    var targetName = _props2.targetName;

    var method = action + "Stream";
    console.log(method);
    _modulesLoadData2["default"].call(this, function (e) {
      console.error(e.stack);
    }, {
      username: name,
      target: targetName
    }).then(function (methods) {
      methods[method]().then(function (data) {
        console.log("action", method, "completed");
        _this2.setState({
          isFollowing: bool
        });
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
    var targetDisplay = this.props.targetDisplay;

    if (isFollowing === null) return null;
    return _react2["default"].createElement(
      "div",
      { className: "follow" },
      _react2["default"].createElement(
        "div",
        { onClick: this.toggleFollow },
        isFollowing ? "Unfollow" : "Follow",
        " ",
        targetDisplay
      )
    );
  }
});
module.exports = exports["default"];