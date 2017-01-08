"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

exports["default"] = _react2["default"].createClass({
  displayName: "SideTools",
  capitalize: function capitalize(string) {
    return string.toLowerCase().split(" ").map(function (word) {
      return word.replace(/^(\.)/, function (_, l) {
        return l.toUpperCase();
      });
    }).join(" ");
  },
  render: function render() {
    var _props = this.props;
    var refresh = _props.refresh;
    var refreshList = _props.refreshList;
    var gatherData = _props.gatherData;
    var applyFilter = _props.applyFilter;
    var loadingData = _props.loadingData;
    var locked = _props.locked;
    var lockedTop = _props.lockedTop;

    return _react2["default"].createElement(
      "div",
      { ref: "tools", className: "tools" + (lockedTop ? " locked-top" : locked ? " locked" : "") },
      _react2["default"].createElement(
        "div",
        { className: "parent" },
        _react2["default"].createElement(
          "div",
          { className: "scroll" },
          refresh ? _react2["default"].createElement(
            "div",
            { className: "option btn-default refresh", onClick: refresh },
            "Refresh Streams"
          ) : null,
          refreshList ? _react2["default"].createElement(
            "div",
            { className: "option btn-default refresh", onClick: function () {
                return refreshList(true);
              } },
            "Refresh Listing"
          ) : null,
          gatherData ? _react2["default"].createElement(
            "div",
            { className: "option btn-default load-more" + (loadingData ? " bg-color-dimmer not-clickable" : ""), onClick: loadingData ? null : gatherData },
            loadingData ? "Loading More" : "Load More"
          ) : null,
          applyFilter ? _react2["default"].createElement(
            "div",
            { className: "option btn-default filters" },
            _react2["default"].createElement(
              "div",
              { className: "filter-status" },
              _react2["default"].createElement(
                "label",
                { htmlFor: "filter-select" },
                "Show"
              ),
              _react2["default"].createElement(
                "select",
                { id: "filter-select", className: "", ref: "filterSelect", onChange: applyFilter, defaultValue: "all" },
                ["all", "online", "offline"].map(function (filter) {
                  return _react2["default"].createElement(
                    "option",
                    { key: filter, value: filter },
                    "Show ",
                    capitalize(filter)
                  );
                })
              )
            )
          ) : null
        )
      )
    );
  }
});
module.exports = exports["default"];