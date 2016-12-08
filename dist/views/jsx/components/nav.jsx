"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var SlideInput = _react2["default"].createClass({
  displayName: "SlideInput",
  submit: function submit(e) {
    e.preventDefault();
    var _props = this.props;
    var callback = _props.callback;
    var commandValue = _props.commandValue;
    var toggleCallback = _props.methods.toggleCallback;
    var value = this.refs.input.value;

    value.replace(/\s/g, "");
    if (callback) callback(value, false);
    toggleCallback(commandValue);
    this.refs.input.value = "";
  },
  render: function render() {
    var _props2 = this.props;
    var open = _props2.open;
    var commandValue = _props2.commandValue;
    var symbol = _props2.symbol;
    var placeholder = _props2.placeholder;
    var _props2$methods = _props2.methods;
    var focusCallback = _props2$methods.focusCallback;
    var toggleCallback = _props2$methods.toggleCallback;

    return _react2["default"].createElement(
      "div",
      { className: "nav-item input" + (open ? " open" : ""), onClick: focusCallback.bind(null, commandValue) },
      _react2["default"].createElement(
        "div",
        { title: placeholder, className: "symbol", onClick: toggleCallback.bind(null, commandValue) },
        symbol
      ),
      _react2["default"].createElement(
        "form",
        { title: placeholder, onSubmit: this.submit },
        _react2["default"].createElement("input", { placeholder: placeholder, ref: "input", type: "text" })
      )
    );
  }
});

exports["default"] = _react2["default"].createClass({
  displayName: "Nav",
  getInitialState: function getInitialState() {
    return { addOpen: false, searchOpen: false, navOpen: false };
  },
  focusInput: function focusInput(input) {
    switch (input) {
      case "add":
        this.refs.addInput.refs.input.focus();
        break;
      case "search":
        this.refs.searchInput.refs.input.focus();
        break;
    }
  },
  toggleInput: function toggleInput(input) {
    switch (input) {
      case "add":
        this.setState({
          addOpen: !this.state.addOpen,
          searchOpen: false
        });
        break;
      case "search":
        this.setState({
          addOpen: false,
          searchOpen: !this.state.searchOpen
        });
        break;
      default:
        this.setState({
          addOpen: false,
          searchOpen: false
        });
    }
  },
  toggleNav: function toggleNav(state) {
    switch (state) {
      case "close":
        this.setState({
          navOpen: false
        });
        break;
      case "open":
        this.setState({
          navOpen: true
        });
      default:
        this.setState({
          navOpen: !this.state.navOpen
        });
    }
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    this.refs.nav.addEventListener("mouseleave", function () {
      console.log("leave");
      _this.toggleNav("close");
    }, false);
  },
  render: function render() {
    var _this2 = this;

    var _state = this.state;
    var addOpen = _state.addOpen;
    var searchOpen = _state.searchOpen;
    var navOpen = _state.navOpen;
    var _props3 = this.props;
    var authData = _props3.authData;
    var userData = _props3.userData;
    var url = _props3.url;
    var _props3$methods = _props3.methods;
    var logout = _props3$methods.logout;
    var appendStream = _props3$methods.appendStream;
    var search = _props3$methods.search;

    return _react2["default"].createElement(
      "nav",
      { ref: "nav", className: "" + (navOpen ? "open" : "") },
      _react2["default"].createElement(
        "div",
        null,
        _react2["default"].createElement(
          "span",
          { className: "inputs" },
          _react2["default"].createElement(SlideInput, { ref: "addInput", commandValue: "add", symbol: "+", open: addOpen, placeholder: "Add a stream to the Player", callback: function (value, bool) {
              _this2.toggleNav("close");
              appendStream(value, undefined, bool);
            }, methods: {
              focusCallback: this.focusInput,
              toggleCallback: this.toggleInput
            } }),
          _react2["default"].createElement(SlideInput, { ref: "searchInput", commandValue: "search", symbol: "S", open: searchOpen, placeholder: "Search Twitch", callback: function (value, bool) {
              _this2.toggleNav("close");
              search(value, undefined, bool);
            }, methods: {
              focusCallback: this.focusInput,
              toggleCallback: this.toggleInput
            } })
        ),
        _react2["default"].createElement(
          _reactRouter.Link,
          { className: "nav-item", to: "/", onClick: this.toggleNav.bind(null, "close") },
          "Home"
        ),
        _react2["default"].createElement(
          _reactRouter.Link,
          { className: "nav-item", to: "/streams", onClick: this.toggleNav.bind(null, "close") },
          "Streams"
        ),
        _react2["default"].createElement(
          _reactRouter.Link,
          { className: "nav-item", to: "/games", onClick: this.toggleNav.bind(null, "close") },
          "Games"
        ),
        authData && authData.access_token ? _react2["default"].createElement(
          "span",
          { className: "auth" },
          userData ? _react2["default"].createElement(
            _reactRouter.Link,
            { className: "nav-item", to: "/profile", onClick: this.toggleNav.bind(null, "close") },
            "Profile"
          ) : null,
          _react2["default"].createElement(
            "a",
            { className: "nav-item", href: "#", onClick: function () {
                logout();
                _this2.toggleNav("close");
              } },
            "Disconnect"
          )
        ) : _react2["default"].createElement(
          "a",
          { className: "nav-item login", href: url, onClick: this.toggleNav.bind(null, "close") },
          "Connect to Twitch"
        )
      ),
      _react2["default"].createElement(
        "span",
        { className: "mobile-nav", onClick: this.toggleNav.bind(null, "toggle") },
        _react2["default"].createElement("span", null)
      )
    );
  }
});
module.exports = exports["default"];