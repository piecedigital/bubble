"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _modulesClientLoadData = require("../../../modules/client/load-data");

var _modulesClientLoadData2 = _interopRequireDefault(_modulesClientLoadData);

var UserItem = _react2["default"].createClass({
  displayName: "UserItem",
  render: function render() {
    var _props = this.props;
    var list = _props.list;
    var username = _props.username;
    var data = _props.data;
    var controls = _props.controls;
    var _props$methods = _props.methods;
    var removeFromList = _props$methods.removeFromList;
    var moveToList = _props$methods.moveToList;

    return _react2["default"].createElement(
      "div",
      { className: "user-item" },
      _react2["default"].createElement(
        "label",
        null,
        _react2["default"].createElement(
          "span",
          { className: "wrap" },
          _react2["default"].createElement(
            _reactRouter.Link,
            { href: "/profile/" + username, to: "/profile/" + username },
            username
          ),
          _react2["default"].createElement("div", { className: "section" }),
          _react2["default"].createElement(
            "div",
            { className: "game-id" },
            "Gamer ID: ",
            data.gamerID
          )
        ),
        controls ? _react2["default"].createElement(
          "span",
          { className: "wrap" },
          list === "queue" ? [_react2["default"].createElement(
            "span",
            { key: "playing", onClick: moveToList.bind(null, "nowPlaying"), title: "Will move this person to the queue Now Playing" },
            "Now Playing"
          ), _react2["default"].createElement(
            "span",
            { key: "played", onClick: moveToList.bind(null, "alreadyPlayed"), title: "Will move this person to the queue Already Played" },
            "Already Played"
          )] : list === "nowPlaying" ? [_react2["default"].createElement(
            "span",
            { key: "queue", onClick: moveToList.bind(null, "queue"), title: "Will move this person to the queue Now Playing" },
            "Queue"
          ), _react2["default"].createElement(
            "span",
            { key: "played", onClick: moveToList.bind(null, "alreadyPlayed"), title: "Will move this person to the queue Already Played" },
            "Already Played"
          )] : null,
          _react2["default"].createElement(
            "span",
            { className: "danger", onClick: removeFromList, title: "Will remove this person from the queue completely" },
            "Remove"
          )
        ) : null
      )
    );
  }
});

var ViewGameQueue = _react2["default"].createClass({
  displayName: "ViewGameQueue",
  getInitialState: function getInitialState() {
    return {
      userDataPresent: false,
      fireRefPresent: false,
      propsPresent: false,
      queueInfo: null,
      icon: "PC/Steam".toLowerCase(),
      confirmedSub: false,
      partnered: false,
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
        queueLimitValid: false
      }
    };
  },
  checkForProps: function checkForProps() {
    var _props2 = this.props;
    var userData = _props2.userData;
    var fireRef = _props2.fireRef;

    var propsPresent =
    // !!userData &&
    !!fireRef;
    // console.log(propsPresent);
    if (propsPresent && !this.state.propsPresent) {
      this.setState({
        fireRefPresent: !!fireRef,
        propsPresent: propsPresent
      });

      if (!this.state.propsPresent) this.prepListener();
    }
    if (!!userData) {
      this.setState({
        userDataPresent: !!userData
      });
      this.checkSub();
    }
  },
  checkSub: function checkSub() {
    var _this = this;

    var _props3 = this.props;
    var userData = _props3.userData;
    var queueHost = _props3.queueHost;
    var auth = _props3.auth;

    // for the viewer, check if they are subbed to the channel
    if (userData && userData.name !== queueHost) {
      _modulesClientLoadData2["default"].call(this, function (e) {
        console.error(e.stack);
      }, {
        target: queueHost,
        username: userData.name,
        access_token: auth.access_token
      }).then(function (methods) {
        methods.getSubscriptionStatus().then(function (data) {
          // if they're a sub then set confirmedSub to true
          // otherwise this will trigger a bad request response and we don't have to do anything else
          console.log("subscribed");
          _this.setState({
            confirmedSub: true
          });
        })["catch"](function () {
          var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
          return console.error(e.stack || e);
        });
      })["catch"](function () {
        var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        return console.error(e.stack || e);
      });
    } else {
      // for the channel, check if they are partnered
      _modulesClientLoadData2["default"].call(this, function (e) {
        console.error(e.stack);
      }, {
        target: queueHost,
        username: userData.name,
        access_token: auth.access_token
      }).then(function (methods) {
        methods.getChannelByName().then(function (data) {
          // if they're a sub then set confirmedSub to true
          // otherwise this will trigger a bad request response and we don't have to do anything else
          console.log("partnered", data.partner);
          _this.setState({
            partnered: data.partner
          });
        })["catch"](function () {
          var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
          return console.error(e.stack || e);
        });
      })["catch"](function () {
        var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        return console.error(e.stack || e);
      });
    }
  },
  prepListener: function prepListener() {
    var _this2 = this;

    // console.log("init prep 2");
    var _props4 = this.props;
    var fireRef = _props4.fireRef;
    var queueHost = _props4.queueHost;

    var temp = function temp(snap) {
      // console.log("prep 2");
      var key = snap.getKey();
      var val = snap.val();
      if (key === queueHost) {
        fireRef.gameQueuesRef.off("child_added", temp);
        _this2.initListener();
      }
    };

    fireRef.gameQueuesRef.on("child_added", temp);
  },
  initListener: function initListener() {
    var _this3 = this;

    var _props5 = this.props;
    var fireRef = _props5.fireRef;
    var userData = _props5.userData;
    var queueHost = _props5.queueHost;

    var nodeRef = fireRef.gameQueuesRef.child(queueHost);
    nodeRef.once("value").then(function (snap) {
      var queueInfo = snap.val();
      // console.log(snap.getKey(), snap.val());
      // set some initial value for the count in validation
      // not doing this would leave the inputs false since the validation woud not otherise be up todate
      _this3.setState({
        queueInfo: queueInfo,
        validation: Object.assign(_this3.state.validation, {
          titleCount: queueInfo.title.length,
          gameCount: queueInfo.game.length,
          rankCount: queueInfo.rank.length
        })
      }, function () {
        nodeRef.on("child_added", _this3.infoChange.bind(_this3, "added"));
        nodeRef.on("child_changed", _this3.infoChange.bind(_this3, "changed"));
        nodeRef.on("child_removed", _this3.infoChange.bind(_this3, "removed"));
        _this3.killListener = function () {
          nodeRef.off("child_added", this.infoChange.bind(this, "added"));
          nodeRef.off("child_changed", this.infoChange.bind(this, "changed"));
          nodeRef.off("child_removed", this.infoChange.bind(this, "removed"));
        };
      });
    });
  },
  infoChange: function infoChange(type, snap) {
    var key = snap.getKey();
    var val = snap.val();
    var newQueueInfo = JSON.parse(JSON.stringify(this.state.queueInfo || {}));
    // console.log(type, key, val);
    switch (key) {
      case "title":
      case "game":
      case "queueLimit":
      case "rank":
      case "platform":
      case "subOnly":
        this.setState({
          queueInfo: Object.assign(newQueueInfo, _defineProperty({}, key, val))
        });
        if (key === "platform") this.changeIcon();
        break;
      case "queue":
      case "nowPlaying":
      case "alreadyPlayed":
      default:
        // remove the entire node
        if (type === "removed") {
          delete newQueueInfo[key];
          this.setState({
            queueInfo: newQueueInfo
          });
        } else {
          var removedOne = Object.keys(val).length <= Object.keys(newQueueInfo[key] || {}).length;
          // if `removedOne`
          if (removedOne) {
            // console.log("removedOne", removedOne);
            // set the new object to the node in state
            this.setState({
              queueInfo: Object.assign(newQueueInfo, _defineProperty({}, key, val))
            });
          } else {
            // console.log("just a change");
            // else, this is an add or change
            // console.log(newQueueInfo, newQueueInfo[key]);
            this.setState({
              queueInfo: Object.assign(newQueueInfo, _defineProperty({}, key, Object.assign(newQueueInfo[key] || {}, val)))
            });
          }
        }
        break;
    }
  },
  validate: function validate(name, e) {
    var _Object$assign4;

    // name will be the same as a referenced element
    // the name will be used to be validated, matched with a variable "suffix"
    var value = e.target.value;
    var thisMin = this.state.validation[name + "Min"];
    var thisMax = this.state.validation[name + "Max"];
    var thisValid = name + "Valid";
    var thisCount = name + "Count";
    this.setState({
      validation: Object.assign(this.state.validation, (_Object$assign4 = {}, _defineProperty(_Object$assign4, thisValid, value.length >= thisMin && value.length <= thisMax), _defineProperty(_Object$assign4, thisCount, e.target.type === "number" ? value : value.length), _Object$assign4))
    });
  },
  submit: function submit(type, e) {
    e.preventDefault();
    var _props6 = this.props;
    var fireRef = _props6.fireRef;
    var userData = _props6.userData;
    var queueHost = _props6.queueHost;

    switch (type) {
      case "update":
        fireRef.gameQueuesRef.child(userData.name).update({
          title: this.refs.title.value,
          game: this.refs.game.value,
          rank: this.refs.rank.value,
          queueLimit: parseInt(this.refs.queueLimit.value),
          platform: this.refs.platform.value,
          subOnly: this.state.partnered ? this.refs.subOnly.checked : false
        });
        break;
      case "reset":
        fireRef.gameQueuesRef.child(userData.name).update({
          queue: null,
          nowPlaying: null,
          alreadyPlayed: null
        });
        break;
      case "queueUp":
        fireRef.gameQueuesRef.child(queueHost).child("queue").child(userData.name).update({
          gamerID: this.refs.gamerID.value,
          date: Date.now()
        });
        break;
    }
  },
  getPlatformLogo: function getPlatformLogo() {
    var _obj;

    var platform = arguments.length <= 0 || arguments[0] === undefined ? "PC/Steam".toLowerCase() : arguments[0];

    var obj = (_obj = {
      "none": {
        name: "none",
        displayName: "None",
        url: "http://amorrius.net"
      }
    }, _defineProperty(_obj, "PC/Steam".toLowerCase(), {
      name: "steam",
      displayName: "PC/Steam",
      url: "http://steampowered.com"
    }), _defineProperty(_obj, "PC/Uplay".toLowerCase(), {
      name: "uplay",
      displayName: "PC/Uplay",
      url: "http://uplay.ubi.com"
    }), _defineProperty(_obj, "PC/Origin".toLowerCase(), {
      name: "origin",
      displayName: "PC/Origin",
      url: "http://origin.com"
    }), _defineProperty(_obj, "PS4/PSN".toLowerCase(), {
      name: "psn",
      displayName: "PS4/PSN",
      url: "http://playstation.com"
    }), _defineProperty(_obj, "XBox/XBL".toLowerCase(), {
      name: "xbox",
      displayName: "XBox/XBL",
      url: "http://xbox.com"
    }), _defineProperty(_obj, "Wii/NN".toLowerCase(), {
      name: "nintendo",
      displayName: "Wii/NN",
      url: "http://nintendo.com"
    }), _obj);
    // console.log(obj, platform, obj[platform]);
    return obj[platform];
  },
  changeIcon: function changeIcon() {
    // console.log("change icon", this.refs.platform.value);
    this.setState({
      icon: this.refs.platform ? this.refs.platform.value : this.state.queueInfo.platform
    });
  },
  removeFromList: function removeFromList(username, list) {
    var _props7 = this.props;
    var fireRef = _props7.fireRef;
    var queueHost = _props7.queueHost;

    fireRef.gameQueuesRef.child(queueHost).child(list).update(_defineProperty({}, username, null));
  },
  moveToList: function moveToList(username, userData, currList, nextList) {
    var _props8 = this.props;
    var fireRef = _props8.fireRef;
    var queueHost = _props8.queueHost;

    fireRef.gameQueuesRef.child(queueHost).child(nextList).update(_defineProperty({}, username, userData))["catch"](function () {
      var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      return console.error(e.stack || e);
    });

    setTimeout(function () {
      fireRef.gameQueuesRef.child(queueHost).child(currList).update(_defineProperty({}, username, null))["catch"](function () {
        var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        return console.error(e.stack || e);
      });
    });
  },
  setChange: function setChange(e, ref) {
    // console.log("change");
    // console.log(e.target.value, e.target.checked, ref);
    if (ref === "subOnly") {
      this.setState({
        queueInfo: Object.assign(this.state.queueInfo, {
          subOnly: e.target.checked || null
        })
      });
    } else {
      this.setState({
        queueInfo: Object.assign(this.state.queueInfo, _defineProperty({}, ref, e.target.value))
      });
    }
  },
  componentDidMount: function componentDidMount() {
    if (!this.state.propsPresent || !this.state.userDataPresent) this.checkForProps();
  },
  componentDidUpdate: function componentDidUpdate() {
    if (!this.state.propsPresent || !this.state.userDataPresent) this.checkForProps();
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this.killListener === "function") this.killListener();
  },
  render: function render() {
    var _this4 = this;

    var _props9 = this.props;
    var fireRef = _props9.fireRef;
    var userData = _props9.userData;
    var location = _props9.location;
    var queueHost = _props9.queueHost;
    var popUpHandler = _props9.methods.popUpHandler;
    var _state = this.state;
    var queueInfo = _state.queueInfo;
    var propsPresent = _state.propsPresent;
    var icon = _state.icon;
    var confirmedSub = _state.confirmedSub;
    var partnered = _state.partnered;

    if (!propsPresent) return null;

    if (!queueInfo && (!userData || userData.name !== queueHost)) return _react2["default"].createElement(
      "div",
      { className: "overlay-ui-default view-game-queue open", onClick: function (e) {
          return e.stopPropagation();
        } },
      _react2["default"].createElement(
        "div",
        { className: "close", onClick: popUpHandler.bind(null, "close") },
        "x"
      ),
      _react2["default"].createElement(
        "div",
        { className: "title" },
        "There is no queue info ready"
      )
    );

    var _ref = queueInfo || {};

    var queue = _ref.queue;
    var nowPlaying = _ref.nowPlaying;
    var alreadyPlayed = _ref.alreadyPlayed;

    var queueList = queue ? Object.keys(queue).map(function (username) {
      var data = queue[username];
      return _react2["default"].createElement(UserItem, {
        controls: userData && userData.name === queueHost,
        key: username,
        username: username,
        data: data,
        list: "queue",
        methods: {
          removeFromList: _this4.removeFromList.bind(_this4, username, "queue"),
          moveToList: _this4.moveToList.bind(_this4, username, data, "queue")
        } });
    }) : _react2["default"].createElement(
      "span",
      { className: "bold" },
      "No one in this queue"
    );
    var nowPlayingList = nowPlaying ? Object.keys(nowPlaying).map(function (username) {
      var data = nowPlaying[username];
      return _react2["default"].createElement(UserItem, {
        controls: userData && userData.name === queueHost,
        key: username,
        username: username,
        data: data,
        list: "nowPlaying",
        methods: {
          removeFromList: _this4.removeFromList.bind(_this4, username, "nowPlaying"),
          moveToList: _this4.moveToList.bind(_this4, username, data, "nowPlaying")
        } });
    }) : _react2["default"].createElement(
      "span",
      { className: "bold" },
      "No one in this queue"
    );
    var alreadyPlayedList = alreadyPlayed ? Object.keys(alreadyPlayed).map(function (username) {
      var data = alreadyPlayed[username];
      return _react2["default"].createElement(UserItem, {
        controls: userData && userData.name === queueHost,
        key: username,
        username: username,
        data: data,
        list: "alreadyPlayed",
        methods: {
          removeFromList: _this4.removeFromList.bind(_this4, username, "alreadyPlayed"),
          moveToList: _this4.moveToList.bind(_this4, username, data, "alreadyPlayed")
        } });
    }) : _react2["default"].createElement(
      "span",
      { className: "bold" },
      "No one in this queue"
    );
    var queueLimitMet = queueInfo && queueInfo.queue ? Object.keys(queueInfo.queue).length >= (queueInfo.queueLimit || 1) : false;

    return _react2["default"].createElement(
      "div",
      { className: "overlay-ui-default view-game-queue open", onClick: function (e) {
          return e.stopPropagation();
        } },
      _react2["default"].createElement(
        "div",
        { className: "close", onClick: popUpHandler.bind(null, "close") },
        "x"
      ),
      _react2["default"].createElement(
        "div",
        { className: "title" },
        "Queue for ",
        queueHost
      ),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement(
        "div",
        { className: "scroll" },
        _react2["default"].createElement(
          "div",
          { className: "section" },
          _react2["default"].createElement(
            "label",
            null,
            _react2["default"].createElement(
              "div",
              { className: "label bold" },
              "Title"
            ),
            userData && userData.name === queueHost ? [_react2["default"].createElement("input", { key: "input", type: "text", ref: "title", className: "" + (this.state.validation["titleValid"] ? " valid" : ""), value: queueInfo ? queueInfo.title : "",
              onChange: function (e) {
                _this4.setChange(e, "title");
                _this4.validate.bind(null, "title");
              } }), _react2["default"].createElement(
              "div",
              { key: "validity" },
              this.state.validation["titleCount"],
              "/",
              _react2["default"].createElement(
                "span",
                { className: "" + (this.state.validation["titleCount"] < this.state.validation["titleMin"] ? "color-red" : "") },
                this.state.validation["titleMin"]
              ),
              "-",
              _react2["default"].createElement(
                "span",
                { className: "" + (this.state.validation["titleCount"] > this.state.validation["titleMax"] ? "color-red" : "") },
                this.state.validation["titleMax"]
              )
            )] : _react2["default"].createElement(
              "span",
              null,
              queueInfo.title
            )
          )
        ),
        _react2["default"].createElement("div", { className: "separator-1-dim" }),
        _react2["default"].createElement(
          "div",
          { className: "section" },
          _react2["default"].createElement(
            "label",
            null,
            _react2["default"].createElement(
              "div",
              { className: "label bold" },
              "Game"
            ),
            userData && userData.name === queueHost ? [_react2["default"].createElement("input", { key: "input", type: "text", ref: "game", className: "" + (this.state.validation["gameValid"] ? " valid" : ""), value: queueInfo ? queueInfo.game : "",
              onChange: function (e) {
                _this4.setChange(e, "game");
                _this4.validate.bind(null, "game");
              } }), _react2["default"].createElement(
              "div",
              { key: "validity" },
              this.state.validation["gameCount"],
              "/",
              _react2["default"].createElement(
                "span",
                { className: "" + (this.state.validation["gameCount"] < this.state.validation["gameMin"] ? "color-red" : "") },
                this.state.validation["gameMin"]
              ),
              "-",
              _react2["default"].createElement(
                "span",
                { className: "" + (this.state.validation["gameCount"] > this.state.validation["gameMax"] ? "color-red" : "") },
                this.state.validation["gameMax"]
              )
            )] : _react2["default"].createElement(
              "span",
              null,
              queueInfo.game
            )
          )
        ),
        _react2["default"].createElement("div", { className: "separator-1-dim" }),
        _react2["default"].createElement(
          "div",
          { className: "section" },
          _react2["default"].createElement(
            "label",
            null,
            _react2["default"].createElement(
              "div",
              { className: "label bold" },
              "Rank"
            ),
            userData && userData.name === queueHost ? [_react2["default"].createElement("input", { key: "input", type: "text", ref: "rank", className: "" + (this.state.validation["rankValid"] ? " valid" : ""), value: queueInfo ? queueInfo.rank : "",
              onChange: function (e) {
                _this4.setChange(e, "rank");
                _this4.validate.bind(null, "rank");
              } }), _react2["default"].createElement(
              "div",
              { key: "validity" },
              this.state.validation["rankCount"],
              "/",
              _react2["default"].createElement(
                "span",
                { className: "" + (this.state.validation["rankCount"] < this.state.validation["rankMin"] ? "color-red" : "") },
                this.state.validation["rankMin"]
              ),
              "-",
              _react2["default"].createElement(
                "span",
                { className: "" + (this.state.validation["rankCount"] > this.state.validation["rankMax"] ? "color-red" : "") },
                this.state.validation["rankMax"]
              )
            )] : _react2["default"].createElement(
              "span",
              null,
              queueInfo.rank
            )
          )
        ),
        _react2["default"].createElement("div", { className: "separator-1-dim" }),
        _react2["default"].createElement(
          "div",
          { className: "section" },
          _react2["default"].createElement(
            "label",
            null,
            _react2["default"].createElement(
              "div",
              { className: "label bold" },
              "Queue Limit"
            ),
            userData && userData.name === queueHost ? [_react2["default"].createElement("input", { key: "input", type: "number", min: this.state.validation["queueLimitMin"], max: this.state.validation["queueLimitMax"], ref: "queueLimit", className: "" + (this.state.validation["queueLimitValid"] ? " valid" : ""), value: queueInfo ? queueInfo.queueLimit : this.state.validation["queueLimitMax"],
              onChange: function (e) {
                _this4.setChange(e, "queueLimit");
                _this4.validate.bind(null, "queueLimit");
              } }), _react2["default"].createElement(
              "div",
              { key: "validity" },
              this.state.validation["queueLimitCount"],
              "/",
              _react2["default"].createElement(
                "span",
                { className: "" + (this.state.validation["queueLimitCount"] < this.state.validation["queueLimitMin"] ? "color-red" : "") },
                this.state.validation["queueLimitMin"]
              ),
              "-",
              _react2["default"].createElement(
                "span",
                { className: "" + (this.state.validation["queueLimitCount"] > this.state.validation["queueLimitMax"] ? "color-red" : "") },
                this.state.validation["queueLimitMax"]
              )
            )] : _react2["default"].createElement(
              "span",
              null,
              queueInfo.queueLimit
            )
          )
        ),
        _react2["default"].createElement("div", { className: "separator-1-dim" }),
        _react2["default"].createElement(
          "div",
          { className: "section" },
          _react2["default"].createElement(
            "label",
            null,
            _react2["default"].createElement(
              "div",
              { className: "label bold" },
              "Platform"
            ),
            _react2["default"].createElement(
              "span",
              { className: "align" },
              _react2["default"].createElement(
                "a",
                { href: this.getPlatformLogo(icon).url, target: "_blank" },
                _react2["default"].createElement("img", { className: "cr-logo", src: "/media/cr-logos/" + this.getPlatformLogo(icon).name + ".png" })
              ),
              userData && userData.name === queueHost ? _react2["default"].createElement(
                "select",
                { ref: "platform", value: queueInfo ? queueInfo.platform : "PC/Steam",
                  onChange: function (e) {
                    _this4.setChange(e, "platform");
                    _this4.changeIcon();
                  } },
                ["None", "PC/Steam", "PC/Uplay", "PC/Origin", "PS4/PSN", "XBox/XBL", "Wii/NN"].map(function (text) {
                  return _react2["default"].createElement(
                    "option",
                    { key: text.toLowerCase(), value: text.toLowerCase() },
                    text
                  );
                })
              ) : _react2["default"].createElement(
                "span",
                null,
                queueInfo ? this.getPlatformLogo(queueInfo.platform).displayName : "PC/Steam"
              )
            )
          )
        ),
        _react2["default"].createElement("div", { className: "separator-1-dim" }),
        _react2["default"].createElement(
          "div",
          { className: "section" },
          _react2["default"].createElement(
            "label",
            null,
            _react2["default"].createElement(
              "span",
              { className: "label bold" },
              "Subscriber Only? "
            ),
            userData && userData.name === queueHost ? partnered ? _react2["default"].createElement("input", { key: "input", type: "checkbox", ref: "subOnly", onChange: function (e) {
                _this4.setChange(e, "subOnly");
              }, checked: queueInfo ? queueInfo.subOnly : false }) : "You must be a Twitch partner to change this option" : queueInfo ? queueInfo.subOnly ? "Yes" : "No" : "No"
          )
        ),
        _react2["default"].createElement("div", { className: "separator-1-dim" }),
        userData && userData.name === queueHost ? _react2["default"].createElement(
          "div",
          { className: "section" },
          _react2["default"].createElement(
            "div",
            { className: "align wide" },
            _react2["default"].createElement(
              "form",
              { onSubmit: this.submit.bind(this, "update") },
              _react2["default"].createElement(
                "div",
                { className: "section" },
                _react2["default"].createElement(
                  "button",
                  { className: "submit btn-default" },
                  "Update Game Queue"
                )
              )
            ),
            _react2["default"].createElement(
              "form",
              { onSubmit: this.submit.bind(this, "reset") },
              _react2["default"].createElement(
                "div",
                { className: "section" },
                _react2["default"].createElement(
                  "button",
                  { className: "submit btn-default" },
                  "Reset Game Queue"
                )
              )
            )
          )
        ) : null,
        _react2["default"].createElement("div", { className: "separator-1-dim" }),
        _react2["default"].createElement("div", { className: "separator-1-dim" }),
        queueInfo && userData && userData.name !== queueHost ? queueInfo.subOnly && !confirmedSub ? _react2["default"].createElement(
          "div",
          { className: "section" },
          _react2["default"].createElement(
            "label",
            null,
            _react2["default"].createElement(
              "div",
              { className: "label bold" },
              "Sorry! You have to be a subscriber to join this queue. ",
              _react2["default"].createElement(
                "a",
                { href: "https://www.twitch.tv/" + queueHost + "/subscribe", target: "_blank", rel: "nofollow" },
                "Click here to subscribe to ",
                queueHost
              )
            )
          )
        ) : !queueLimitMet && (!queueInfo.queue || !queueInfo.queue[userData.name]) && (!queueInfo.nowPlaying || !queueInfo.nowPlaying[userData.name]) && (!queueInfo.alreadyPlayed || !queueInfo.alreadyPlayed[userData.name]) ? _react2["default"].createElement(
          "div",
          { className: "section" },
          _react2["default"].createElement(
            "label",
            null,
            _react2["default"].createElement(
              "div",
              { className: "label bold" },
              "Queue Up"
            ),
            _react2["default"].createElement(
              "div",
              { className: "section" },
              _react2["default"].createElement(
                "label",
                null,
                _react2["default"].createElement(
                  "div",
                  { className: "label bold" },
                  "Gamer ID (Steam, PSN, XBL, etc.)"
                ),
                _react2["default"].createElement("input", { key: "input", type: "text", ref: "gamerID", className: "" + (this.state.validation["gamerIDValid"] ? " valid" : ""), defaultValue: queueInfo.gamerID, onChange: this.validate.bind(null, "gamerID") }),
                _react2["default"].createElement(
                  "div",
                  { key: "validity" },
                  this.state.validation["gamerIDCount"],
                  "/",
                  _react2["default"].createElement(
                    "span",
                    { className: "" + (this.state.validation["gamerIDCount"] < this.state.validation["gamerIDMin"] ? "color-red" : "") },
                    this.state.validation["gamerIDMin"]
                  ),
                  "-",
                  _react2["default"].createElement(
                    "span",
                    { className: "" + (this.state.validation["gamerIDCount"] > this.state.validation["gamerIDMax"] ? "color-red" : "") },
                    this.state.validation["gamerIDMax"]
                  )
                )
              )
            ),
            _react2["default"].createElement(
              "form",
              { key: "update", onSubmit: this.submit.bind(this, "queueUp") },
              _react2["default"].createElement(
                "div",
                { className: "section" },
                _react2["default"].createElement(
                  "button",
                  { className: "submit btn-default" },
                  "Queue Up"
                )
              )
            )
          )
        ) : _react2["default"].createElement(
          "div",
          { className: "section" },
          _react2["default"].createElement(
            "label",
            null,
            _react2["default"].createElement(
              "div",
              { className: "label bold" },
              "Can't queue up right now. It's either full, you're already queued up, or you already played."
            )
          )
        ) : !userData ? _react2["default"].createElement(
          "div",
          { className: "section" },
          _react2["default"].createElement(
            "label",
            null,
            _react2["default"].createElement(
              "div",
              { className: "label bold" },
              "Connect with Twitch to queue up"
            )
          )
        ) : null,
        _react2["default"].createElement("div", { className: "separator-1-dim" }),
        _react2["default"].createElement("div", { className: "separator-1-dim" }),
        _react2["default"].createElement(
          "div",
          { className: "section" },
          _react2["default"].createElement(
            "label",
            null,
            _react2["default"].createElement(
              "div",
              { className: "label bold" },
              "Now Playing: (",
              queueInfo && queueInfo.nowPlaying ? Object.keys(queueInfo.nowPlaying).length : 0,
              ")"
            ),
            _react2["default"].createElement(
              "div",
              { className: "section" },
              _react2["default"].createElement(
                "label",
                null,
                _react2["default"].createElement(
                  "div",
                  { className: "list" },
                  nowPlayingList
                )
              )
            )
          )
        ),
        _react2["default"].createElement(
          "div",
          { className: "section" },
          _react2["default"].createElement(
            "label",
            null,
            _react2["default"].createElement(
              "div",
              { className: "label bold" },
              "In Queue: (",
              queueInfo && queueInfo.queue ? Object.keys(queueInfo.queue).length : 0,
              ")"
            ),
            _react2["default"].createElement(
              "div",
              { className: "section" },
              _react2["default"].createElement(
                "label",
                null,
                _react2["default"].createElement(
                  "div",
                  { className: "list" },
                  queueList
                )
              )
            )
          )
        ),
        _react2["default"].createElement(
          "div",
          { className: "section" },
          _react2["default"].createElement(
            "label",
            null,
            _react2["default"].createElement(
              "div",
              { className: "label bold" },
              "Already Played: (",
              queueInfo && queueInfo.alreadyPlayed ? Object.keys(queueInfo.alreadyPlayed).length : 0,
              ")"
            ),
            _react2["default"].createElement(
              "div",
              { className: "section" },
              _react2["default"].createElement(
                "label",
                null,
                _react2["default"].createElement(
                  "div",
                  { className: "list" },
                  alreadyPlayedList
                )
              )
            )
          )
        )
      )
    );
  }
});
exports.ViewGameQueue = ViewGameQueue;
/* now playing queue */ /* waiting queue */ /* already played */