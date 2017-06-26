"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _modulesClientHelperTools = require("../../../modules/client/helper-tools");

var StreamerItem = _react2["default"].createClass({
  displayName: "StreamerItem",
  getInitialState: function getInitialState() {
    return {};
  },
  move: function move(direction) {
    this.props.methods.move(direction, this.props.index);
  },
  render: function render() {
    var _props = this.props;
    var data = _props.data;
    var canMoveUp = _props.canMoveUp;
    var canMoveDown = _props.canMoveDown;

    var displayName = undefined;
    if (typeof data === "object") {
      displayName = data.displayName;
    } else {
      displayName = data;
    }

    return _react2["default"].createElement(
      "div",
      { className: "streamer-item" },
      _react2["default"].createElement(
        "label",
        null,
        _react2["default"].createElement(
          "span",
          { className: "name" },
          displayName
        ),
        _react2["default"].createElement(
          "span",
          { className: "tools" },
          canMoveUp ? _react2["default"].createElement(
            "span",
            { className: "move-up", onClick: this.move.bind(this, "up") },
            "↑"
          ) : _react2["default"].createElement(
            "span",
            { className: "move-up still", style: { opacity: .5 } },
            "↑"
          ),
          canMoveDown ? _react2["default"].createElement(
            "span",
            { className: "move-down", onClick: this.move.bind(this, "down") },
            "↓"
          ) : _react2["default"].createElement(
            "span",
            { className: "move-down still", style: { opacity: .5 } },
            "↓"
          )
        )
      )
    );
  }
});

var StreamReorderer = _react2["default"].createClass({
  displayName: "StreamReorderer",
  getInitialState: function getInitialState() {
    return {
      streamersArray: []
    };
  },
  move: function move(direction) {
    var index = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    var newStreamersArray = JSON.parse(JSON.stringify(this.state.streamersArray));

    if (index === 0 && direction === "up") {
      return;
    } else if (index === newStreamersArray.length - 1 && direction === "down") {
      return;
    } else {
      var dir = direction === "up" ? -1 : 1;
      var mover = newStreamersArray[index];
      var moverPlace = index + dir;
      var movee = newStreamersArray[index + dir];
      var moveePlace = index;

      newStreamersArray[moverPlace] = mover;
      newStreamersArray[moveePlace] = movee;

      this.props.methods.reorderStreams(newStreamersArray, moverPlace);

      this.setState({
        streamersArray: newStreamersArray
      });
    }
  },
  componentDidMount: function componentDidMount() {
    var streamersArray = this.props.streamOrderMap.length > 0 ? this.props.streamOrderMap : Object.keys(this.props.streamersInPlayer);

    this.setState({
      streamersArray: streamersArray
    });
  },
  render: function render() {
    var _this = this;

    var _props2 = this.props;
    var streamersInPlayer = _props2.streamersInPlayer;
    var popUpHandler = _props2.methods.popUpHandler;
    var streamersArray = this.state.streamersArray;

    var list = streamersArray.map(function (nameOrID, ind) {
      return _react2["default"].createElement(StreamerItem, {
        key: nameOrID,
        index: ind,
        name: nameOrID,
        id: nameOrID,
        data: streamersInPlayer[nameOrID],
        canMoveUp: ind > 0,
        canMoveDown: ind < streamersArray.length - 1,
        methods: {
          move: _this.move
        }
      });
    });

    return _react2["default"].createElement(
      "div",
      { className: "overlay-ui-default view-stream-reorderer open", onClick: function (e) {
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
        "Re-Order Streams In Player"
      ),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement("div", { className: "separator-4-dim" }),
      _react2["default"].createElement(
        "div",
        { className: "section" },
        _react2["default"].createElement(
          "div",
          { className: "list" },
          list.length > 0 ? list : "You aren't watching anyone"
        )
      )
    );
  }
});
exports.StreamReorderer = StreamReorderer;