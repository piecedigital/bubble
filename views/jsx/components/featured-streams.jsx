"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _modulesLoadData = require("../../../modules/load-data");

var _modulesLoadData2 = _interopRequireDefault(_modulesLoadData);

var _modulesHelperTools = require("../../../modules/helper-tools");

var _userUserQuestionsJsx = require("./user/user-questions.jsx");

var _userUserQuestionsJsx2 = _interopRequireDefault(_userUserQuestionsJsx);

var _reactRouter = require('react-router');

// list item for featured streams
var StreamListItem = _react2["default"].createClass({
  displayName: "feat-StreamListItem",
  render: function render() {
    var _props = this.props;
    var index = _props.index;
    var displayStream = _props.methods.displayStream;
    var _props$data = _props.data;
    var stream = _props$data.stream;
    var _props$data$stream = _props$data.stream;
    var game = _props$data$stream.game;
    var viewers = _props$data$stream.viewers;
    var title = _props$data$stream.title;
    var id = _props$data$stream._id;
    var preview = _props$data$stream.preview;
    var _props$data$stream$channel = _props$data$stream.channel;
    var mature = _props$data$stream$channel.mature;
    var logo = _props$data$stream$channel.logo;
    var name = _props$data$stream$channel.name;
    var language = _props$data$stream$channel.language;

    var viewersString = viewers.toLocaleString("en"); // https://www.livecoding.tv/earth_basic/
    return _react2["default"].createElement(
      "span",
      null,
      _react2["default"].createElement(
        "li",
        { className: "stream-list-item clickable home", onClick: function () {
            displayStream(index);
          } },
        _react2["default"].createElement(
          "div",
          { className: "wrapper" },
          _react2["default"].createElement(
            "div",
            { className: "image" },
            _react2["default"].createElement("img", { src: preview.medium || _modulesHelperTools.missingLogo })
          ),
          _react2["default"].createElement(
            "div",
            { className: "info" },
            _react2["default"].createElement(
              "div",
              { className: "channel-name" },
              name
            ),
            _react2["default"].createElement("div", { className: "separator-1-7" }),
            _react2["default"].createElement(
              "div",
              { className: "title" },
              title
            ),
            _react2["default"].createElement(
              "div",
              { className: "game" },
              "Live with \"" + (game || null) + "\", streaming to " + viewersString + " viewer" + (viewers > 1 ? "s" : "")
            )
          )
        )
      ),
      _react2["default"].createElement("div", { className: "separator-4-dim" })
    );
  }
});

// the displayed stream of the feature streams
var FeaturedStream = _react2["default"].createClass({
  displayName: "FeaturedStream",
  getInitialState: function getInitialState() {
    return {
      displayName: "",
      bio: ""
    };
  },
  fetchUserData: function fetchUserData() {
    var _this = this;

    this.setState({
      // displayName: "",
      // bio: ""
    }, function () {
      var _props$data$stream$channel2 = _this.props.data.stream.channel;
      var name = _props$data$stream$channel2.name;
      var logo = _props$data$stream$channel2.logo;

      _modulesLoadData2["default"].call(_this, function (e) {
        console.error(e.stack);
      }, {
        username: name
      }).then(function (methods) {
        methods.getUserByName().then(function (data) {
          // console.log("feature data", data);
          _this.setState({
            displayName: data.display_name,
            bio: data.bio
          });
        })["catch"](function (e) {
          return console.error(e.stack);
        });
      })["catch"](function (e) {
        return console.error(e.stack);
      });
    });
  },
  componentDidMount: function componentDidMount() {
    this.fetchUserData();
  },
  componentWillReceiveProps: function componentWillReceiveProps() {
    this.fetchUserData();
  },
  render: function render() {
    var _props2 = this.props;
    var appendStream = _props2.methods.appendStream;
    var _props2$data$stream$channel = _props2.data.stream.channel;
    var name = _props2$data$stream$channel.name;
    var logo = _props2$data$stream$channel.logo;
    var _state = this.state;
    var displayName = _state.displayName;
    var bio = _state.bio;

    return _react2["default"].createElement(
      "div",
      { className: "featured-stream" },
      _react2["default"].createElement(
        "div",
        { className: "stream" },
        _react2["default"].createElement("iframe", { src: "https://player.twitch.tv/?channel=" + name + "&muted=true", frameBorder: "0", scrolling: "no", allowFullScreen: true })
      ),
      displayName ? _react2["default"].createElement(
        "div",
        { className: "stream-info" },
        _react2["default"].createElement(
          "div",
          { className: "image" },
          _react2["default"].createElement("img", { src: logo, alt: "profile image of " + (displayName || name) })
        ),
        _react2["default"].createElement(
          "div",
          { className: "text" },
          _react2["default"].createElement(
            "div",
            { className: "display-name" },
            _react2["default"].createElement(
              _reactRouter.Link,
              { to: "/profile/" + name },
              displayName
            )
          ),
          _react2["default"].createElement(
            "div",
            { className: "to-channel" },
            _react2["default"].createElement(
              "a",
              { href: "https://www.twitch.tv/" + name, target: "_black", rel: "nofollow" },
              "Visit on Twitch"
            )
          ),
          _react2["default"].createElement("div", { className: "separator-1-1" }),
          _react2["default"].createElement(
            "a",
            { href: "#", className: "watch", onClick: function () {
                appendStream.call(null, name, displayName);
              } },
            "Watch in Player"
          ),
          _react2["default"].createElement("div", { className: "separator-1-1" })
        ),
        _react2["default"].createElement(
          "div",
          { className: "text" },
          _react2["default"].createElement(
            "div",
            { className: "bio" },
            bio
          )
        )
      ) : _react2["default"].createElement(
        "div",
        { className: "stream-info" },
        "Loading channel info..."
      )
    );
  }
});

// primary section for the featured component
exports["default"] = _react2["default"].createClass({
  displayName: "FeaturedStreams",
  getInitialState: function getInitialState() {
    return {
      requestOffset: 0,
      streamDataArray: [],
      questions: {},
      featuredStreamIndex: 0
    };
  },
  displayStream: function displayStream(index) {
    this.setState({
      featuredStreamIndex: index
    });
  },
  componentDidMount: function componentDidMount() {
    var _this2 = this;

    var _props3 = this.props;
    var fireRef = _props3.fireRef;
    var _props3$methods = _props3.methods;
    var loadData = _props3$methods.loadData;
    var appendStream = _props3$methods.appendStream;

    if (loadData) {
      loadData.call(this, function (e) {
        console.error(e.stack);
      }).then(function (methods) {
        methods.featured().then(function (data) {
          // console.log(data);
          _this2.setState({
            offset: _this2.state.requestOffset + 25,
            streamDataArray: Array.from(_this2.state.streamDataArray).concat(data.featured)
          });
        })["catch"](function (e) {
          return console.error(e.stack);
        });
      })["catch"](function (e) {
        return console.error(e.stack);
      });
    }
  },
  render: function render() {
    var _this3 = this;

    var _state2 = this.state;
    var requestOffset = _state2.requestOffset;
    var streamDataArray = _state2.streamDataArray;
    var questions = _state2.questions;
    var _props4 = this.props;
    var auth = _props4.auth;
    var userData = _props4.userData;
    var fireRef = _props4.fireRef;
    var _props4$methods = _props4.methods;
    var appendStream = _props4$methods.appendStream;
    var loadData = _props4$methods.loadData;
    var popUpHandler = _props4$methods.popUpHandler;

    var questionsList = Object.keys(questions);
    return _react2["default"].createElement(
      "div",
      { className: "featured-streams" },
      fireRef ? _react2["default"].createElement(_userUserQuestionsJsx2["default"], _extends({}, this.props, { pageOverride: "featured" })) : null,
      streamDataArray.length > 0 ? _react2["default"].createElement(FeaturedStream, { data: streamDataArray[this.state.featuredStreamIndex], methods: {
          appendStream: appendStream,
          loadData: loadData
        } }) : null,
      _react2["default"].createElement(
        "div",
        { className: "wrapper" },
        _react2["default"].createElement(
          "ul",
          { className: "list" },
          streamDataArray.map(function (itemData, ind) {
            return _react2["default"].createElement(StreamListItem, { key: ind, index: ind, data: itemData, methods: {
                appendStream: appendStream,
                displayStream: _this3.displayStream
              } });
          })
        )
      )
    );
  }
});
module.exports = exports["default"];

// questionsList.length > 0 ? (
//   <div className="wrapper qna">
//     <ul className="list">
//     {
//       questionsList.map((questionID, ind) => {
//         return (
//           <QuestionListItem
//           auth={auth}
//           userData={userData}
//           fireRef={fireRef}
//           key={ind}
//           questionID={questionID}
//           data={questions[questionID]}
//           methods={{ popUpHandler }}/>
//         );
//       })
//     }
//     </ul>
//   </div>
// ) : null