"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _firebase = require("firebase");

var _firebase2 = _interopRequireDefault(_firebase);

// poll creation related components

var Feedback = _react2["default"].createClass({
  displayName: "MakePoll",
  getInitialState: function getInitialState() {
    return {
      validation: {
        nameMin: 3,
        nameMax: 60,
        nameCount: 0,
        nameValid: false,

        emailRegex: new RegExp("^([a-z0-9]*)(\\.[a-z0-9]*)?(@[a-z0-9]*\\.[a-z0-9]*)(\\.[a-z0-9]*)?"),
        emailValid: true,

        titleMin: 3,
        titleMax: 60,
        titleCount: 0,
        titleValid: false,

        bodyMin: 30,
        bodyMax: 2000,
        bodyCount: 0,
        bodyValid: false
      }
    };
  },
  submit: function submit(e) {
    var _this = this;

    e.preventDefault();
    var _props = this.props;
    var auth = _props.auth;
    var userData = _props.userData;
    var fireRef = _props.fireRef;
    var versionData = _props.versionData;
    var popUpHandler = _props.methods.popUpHandler;

    var feedback = {
      name: this.refs.name.value,
      email: this.refs.email.value,
      title: this.refs.title.value,
      body: this.refs.body.value,
      date: Date.now(),
      version: versionData
    };

    // return console.log(feedback);
    if (this.state.validation.nameValid && this.state.validation.emailValid && this.state.validation.titleValid && this.state.validation.bodyValid) {
      var ref = fireRef.feedbackRef.push().set(feedback);
    } else {
      return;
    }

    // close the pop up
    this.setState({
      success: true
    }, function () {
      setTimeout(function () {
        _this.props.methods.popUpHandler("close");
      }, 2000);
    });
  },
  validate: function validate(name, e) {
    // name will be the same as a referenced element
    // the name will be used to be validated, matched with a variable "suffix"
    var value = e.target.value;
    var thisValid = name + "Valid";

    if (name === "email") {
      var thisRegex = this.state.validation[name + "Regex"];
      this.setState({
        validation: Object.assign(this.state.validation, _defineProperty({}, thisValid, !value || !!value.match(thisRegex)))
      }, function () {
        // console.log(name, this.state.validation[thisValid])
      });
    } else {
        var _Object$assign2;

        var thisMin = this.state.validation[name + "Min"];
        var thisMax = this.state.validation[name + "Max"];
        var thisCount = name + "Count";
        this.setState({
          validation: Object.assign(this.state.validation, (_Object$assign2 = {}, _defineProperty(_Object$assign2, thisValid, value.length >= thisMin && value.length <= thisMax), _defineProperty(_Object$assign2, thisCount, value.length), _Object$assign2))
        }, function () {
          // console.log(name, this.state.validation[thisCount], this.state.validation[thisValid], thisMin, thisMax)
        });
      }
  },
  render: function render() {
    // console.log(this.props);
    var _props2 = this.props;
    var fireRef = _props2.fireRef;
    var overlay = _props2.overlay;
    var versionData = _props2.versionData;
    var popUpHandler = _props2.methods.popUpHandler;
    var _state = this.state;
    var success = _state.success;
    var error = _state.error;
    var choices = _state.choices;
    var time = _state.time;

    if (!versionData || !fireRef) {
      return _react2["default"].createElement(
        "div",
        { className: "overlay-ui-default feedback" + (overlay === "feedback" ? " open" : ""), onClick: function (e) {
            return e.stopPropagation();
          } },
        _react2["default"].createElement(
          "div",
          { className: "title" },
          "Preparing form..."
        )
      );
    }
    if (error) {
      return _react2["default"].createElement(
        "div",
        { className: "overlay-ui-default feedback" + (overlay === "feedback" ? " open" : ""), onClick: function (e) {
            return e.stopPropagation();
          } },
        _react2["default"].createElement(
          "div",
          { className: "title" },
          "There was an issue preparing the form :("
        )
      );
    } else if (success) {
      return _react2["default"].createElement(
        "div",
        { className: "overlay-ui-default feedback" + (overlay === "feedback" ? " open" : ""), onClick: function (e) {
            return e.stopPropagation();
          } },
        _react2["default"].createElement(
          "div",
          { className: "title" },
          "Your feedback was submitted successfully!"
        )
      );
    } else return _react2["default"].createElement(
      "div",
      { className: "overlay-ui-default feedback" + (overlay === "feedback" ? " open" : ""), onClick: function (e) {
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
        "Submit Your Feedback"
      ),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement(
        "div",
        { className: "scroll" },
        _react2["default"].createElement(
          "form",
          { onSubmit: this.submit },
          _react2["default"].createElement(
            "div",
            { className: "section" },
            _react2["default"].createElement(
              "label",
              null,
              _react2["default"].createElement(
                "div",
                { className: "label bold" },
                "Name"
              ),
              _react2["default"].createElement("input", { type: "text", ref: "name", className: "" + (this.state.validation["nameValid"] ? "valid" : "invalid"), onChange: this.validate.bind(null, "name") }),
              _react2["default"].createElement(
                "div",
                null,
                this.state.validation["nameCount"],
                "/",
                _react2["default"].createElement(
                  "span",
                  { className: "" + (this.state.validation["nameCount"] < this.state.validation["nameMin"] ? "color-red" : "") },
                  this.state.validation["nameMin"]
                ),
                "-",
                _react2["default"].createElement(
                  "span",
                  { className: "" + (this.state.validation["nameCount"] > this.state.validation["nameMax"] ? "color-red" : "") },
                  this.state.validation["nameMax"]
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
                "div",
                { className: "label bold" },
                "email (optional)"
              ),
              _react2["default"].createElement("input", { type: "text", ref: "email", className: "" + (this.state.validation["emailValid"] ? "valid" : "invalid"), onChange: this.validate.bind(null, "email") })
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
                "Title/Intro"
              ),
              _react2["default"].createElement("input", { type: "text", ref: "title", className: "" + (this.state.validation["titleValid"] ? "valid" : "invalid"), onChange: this.validate.bind(null, "title") }),
              _react2["default"].createElement(
                "div",
                null,
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
                "What's Your Feedback?"
              ),
              _react2["default"].createElement("textarea", { ref: "body", className: "" + (this.state.validation["bodyValid"] ? "valid" : "invalid"), onChange: this.validate.bind(null, "body") }),
              _react2["default"].createElement(
                "div",
                null,
                this.state.validation["bodyCount"],
                "/",
                _react2["default"].createElement(
                  "span",
                  { className: "" + (this.state.validation["bodyCount"] < this.state.validation["bodyMin"] ? "color-red" : "") },
                  this.state.validation["bodyMin"]
                ),
                "-",
                _react2["default"].createElement(
                  "span",
                  { className: "" + (this.state.validation["bodyCount"] > this.state.validation["bodyMax"] ? "color-red" : "") },
                  this.state.validation["bodyMax"]
                )
              )
            )
          ),
          _react2["default"].createElement("div", { className: "separator-1-dim" }),
          _react2["default"].createElement(
            "div",
            { className: "section" },
            _react2["default"].createElement(
              "button",
              { className: "submit btn-default" },
              "Submit"
            )
          )
        )
      )
    );
  }
});
exports.Feedback = Feedback;