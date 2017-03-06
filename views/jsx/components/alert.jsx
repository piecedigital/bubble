"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

exports["default"] = _react2["default"].createClass({
  displayName: "Alert",
  closeOption: function closeOption() {
    this.props.methods.alertHandler(null);
  },
  cancelOption: function cancelOption() {
    this.props.methods.alertHandler(null);
  },
  okayOption: function okayOption() {
    this.props.methods.alertHandler(null);
  },
  getLink: function getLink(name) {
    switch (name) {
      case "twitter":
        var url = encodeURI("https://twitter.com/share" + ("?text=Come watch " + this.props.data.state.name + " on Twitch!") + ("&url=https://www.amorrius.net?ms=" + this.props.data.state.name) + "&hashtags=twitch,amorrius" + "&via=PieceDigital");
        return _react2["default"].createElement(
          "li",
          { className: "" + name },
          _react2["default"].createElement(
            "a",
            {
              key: name,
              className: "twitter-share-button",
              target: "_blank",
              href: url },
            "Tweet"
          )
        );
        break;
      default:

    }
  },
  render: function render() {
    var _this = this;

    var _props = this.props;
    var data = _props.data;
    var alertHandler = _props.methods.alertHandler;

    // console.log(data);
    if (!data) return _react2["default"].createElement(
      "div",
      { className: "alert", onClick: function () {
          alertHandler(null);
        } },
      _react2["default"].createElement(
        "div",
        { className: "box", onClick: function (e) {
            return e.nativeEvent.stopImmediatePropagation();
          } },
        _react2["default"].createElement("div", { className: "message" }),
        _react2["default"].createElement("ul", { className: "links" }),
        _react2["default"].createElement("div", { className: "options" })
      )
    );

    var message = data.message;
    var options = data.options;
    var links = data.links;

    var optionsList = options.map(function (opt) {
      return _react2["default"].createElement(
        "button",
        { key: opt, onClick: _this[opt + "Option"] },
        opt
      );
    });

    var linksList = links.map(function (name) {
      return _this.getLink(name);
    });

    return _react2["default"].createElement(
      "div",
      { className: "alert open" },
      _react2["default"].createElement("div", { className: "backdrop", onClick: function () {
          alertHandler(null);
        } }),
      _react2["default"].createElement(
        "div",
        { className: "box", onClick: function (e) {
            return e.nativeEvent.stopImmediatePropagation();
          } },
        _react2["default"].createElement(
          "div",
          { className: "message" },
          _react2["default"].createElement("span", { dangerouslySetInnerHTML: { __html: message } })
        ),
        _react2["default"].createElement(
          "ul",
          { className: "links" },
          linksList
        ),
        _react2["default"].createElement(
          "div",
          { className: "options" },
          optionsList
        )
      )
    );
  }
});
module.exports = exports["default"];