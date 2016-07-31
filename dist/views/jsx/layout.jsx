"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _homeJsx = require("./home.jsx");

var _homeJsx2 = _interopRequireDefault(_homeJsx);

var _modulesAjax = require("../../modules/ajax");

exports["default"] = _react2["default"].createClass({
  displayName: "Layout",
  getInitialState: function getInitialState() {
    return {
      prePlaceData: this.props.data
    };
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    new Promise(function (resolve, reject) {
      if (!_this.props.data) {
        (0, _modulesAjax.ajax)({
          url: "/get-test-data",
          success: function success(data) {
            console.log(data);
            resolve(JSON.parse(data));
          },
          error: function error(e) {
            console.error(e);
          }
        });
      } else {
        resolve(_this.props.data);
      }
    }).then(function (data) {
      _this.setState({
        prePlaceData: data
      });
    });
  },
  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
    return !!nextState.prePlaceData;
  },
  render: function render() {
    var prePlaceData = this.state.prePlaceData;

    return _react2["default"].createElement(
      "div",
      null,
      _react2["default"].createElement(
        "nav",
        null,
        "NAVIGATION ELEMENT"
      ),
      (function () {
        if (prePlaceData) {
          return this.props.children ? _react2["default"].cloneElement(this.props.children, {
            data: prePlaceData
          }) : _react2["default"].createElement(_homeJsx2["default"], { data: prePlaceData });
        }
      }).bind(this)()
    );
  }
});
module.exports = exports["default"];