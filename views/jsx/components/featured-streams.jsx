"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _modulesClientLoadData = require("../../../modules/client/load-data");

var _modulesClientLoadData2 = _interopRequireDefault(_modulesClientLoadData);

var _modulesClientHelperTools = require("../../../modules/client/helper-tools");

var _bookmarkBtnJsx = require("./bookmark-btn.jsx");

var _bookmarkBtnJsx2 = _interopRequireDefault(_bookmarkBtnJsx);

var _userQuestionsJsx = require("./user-questions.jsx");

var _userQuestionsJsx2 = _interopRequireDefault(_userQuestionsJsx);

var _listItemsJsx = require('./list-items.jsx');

// list item for featured streams
// const StreamListItem = React.createClass({
//   displayName: "feat-StreamListItem",
//   render() {
//     const {
//       index,
//       methods: {
//         displayStream
//       },
//       data: {
//         stream,
//         stream: {
//           game,
//           viewers,
//           title,
//           _id: id,
//           preview,
//           channel: {
//             mature,
//             logo,
//             name,
//             language
//           }
//         }
//       }
//     } = this.props;
//     let viewersString = viewers.toLocaleString("en"); // http://www.livecoding.tv/earth_basic/
//     return (
//       <span>
//         <li className={`stream-list-item clickable home`} onClick={() => {
//           displayStream(index)
//         }}>
//           <div className="wrapper">
//             <div className="image">
//               <CImg
//                 style={{
//                   width: 215,
//                   height: 121
//                 }}
//                 src={preview.medium || missingLogo} />
//             </div>
//             <div className="info">
//               <div className="channel-name">
//                 {name}
//               </div>
//               <div className={`separator-1-7`}></div>
//               <div className="title">
//                 {title}
//               </div>
//               <div className="game">
//                 {`Live with "${game || null}", streaming to ${viewersString} viewer${viewers > 1 ? "s" : ""}`}
//               </div>
//             </div>
//           </div>
//         </li>
//         <div className={`separator-4-dim`}></div>
//       </span>
//     )
//   }
// });

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
      var _props$data$stream$channel = _this.props.data.stream.channel;
      var name = _props$data$stream$channel.name;
      var logo = _props$data$stream$channel.logo;

      _modulesClientLoadData2["default"].call(_this, function (e) {
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
        })["catch"](function () {
          var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
          return console.error(e.stack || e);
        });
      })["catch"](function () {
        var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        return console.error(e.stack || e);
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
    var _props = this.props;
    var fireRef = _props.fireRef;
    var userData = _props.userData;
    var versionData = _props.versionData;
    var appendStream = _props.methods.appendStream;
    var _props$data$stream$channel2 = _props.data.stream.channel;
    var name = _props$data$stream$channel2.name;
    var logo = _props$data$stream$channel2.logo;
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
          _react2["default"].createElement(_modulesClientHelperTools.CImg, {
            style: {
              width: 168,
              height: 234.7
            },
            src: logo,
            alt: "profile image of " + (displayName || name) })
        ),
        _react2["default"].createElement(
          "div",
          { className: "links" },
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
          _react2["default"].createElement(_bookmarkBtnJsx2["default"], {
            className: "color-white",
            fireRef: fireRef,
            userData: userData,
            givenUsername: name,
            versionData: versionData }),
          _react2["default"].createElement("div", { className: "separator-1-1" })
        ),
        _react2["default"].createElement(
          "div",
          { className: "body" },
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

    var _props2 = this.props;
    var fireRef = _props2.fireRef;
    var _props2$methods = _props2.methods;
    var loadData = _props2$methods.loadData;
    var appendStream = _props2$methods.appendStream;

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

    // console.log("feat", this.props.initState);
    var _state2 = this.state;
    var requestOffset = _state2.requestOffset;
    var streamDataArray = _state2.streamDataArray;
    var _props3 = this.props;
    var auth = _props3.auth;
    var userData = _props3.userData;
    var fireRef = _props3.fireRef;
    var versionData = _props3.versionData;
    var _props3$methods = _props3.methods;
    var appendStream = _props3$methods.appendStream;
    var loadData = _props3$methods.loadData;
    var popUpHandler = _props3$methods.popUpHandler;

    return _react2["default"].createElement(
      "div",
      { className: "featured-streams" },
      fireRef ? _react2["default"].createElement(_userQuestionsJsx2["default"], _extends({}, this.props, { pageOverride: "featured" })) : null,
      streamDataArray.length > 0 ? _react2["default"].createElement(FeaturedStream, {
        fireRef: fireRef,
        userData: userData,
        versionData: versionData,
        data: streamDataArray[this.state.featuredStreamIndex],
        methods: {
          appendStream: appendStream,
          loadData: loadData
        } }) : null,
      _react2["default"].createElement(
        "div",
        { className: "top-stream-list" },
        _react2["default"].createElement(
          "div",
          { className: "section-title" },
          "Top Streams"
        ),
        _react2["default"].createElement(
          "div",
          { className: "wrapper" },
          _react2["default"].createElement(
            "ul",
            { className: "list" },
            streamDataArray.map(function (itemData, ind) {
              return _react2["default"].createElement(_listItemsJsx.StreamListItem, { key: ind, index: ind, data: itemData, homepage: true, methods: {
                  appendStream: appendStream,
                  displayStream: _this3.displayStream
                } });
            })
          )
        )
      )
    );
  }
});
module.exports = exports["default"];