"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

exports["default"] = _react2["default"].createClass({
  displayName: "About",
  render: function render() {
    return _react2["default"].createElement(
      "div",
      { className: "top-level-component about" },
      _react2["default"].createElement(
        "div",
        { className: "general-page about" },
        _react2["default"].createElement(
          "div",
          { className: "wrapper-about" },
          _react2["default"].createElement(
            "section",
            null,
            _react2["default"].createElement(
              "p",
              null,
              _react2["default"].createElement(
                "span",
                { className: "headline" },
                "What Is \"Amorrius\"?"
              )
            ),
            _react2["default"].createElement(
              "p",
              null,
              _react2["default"].createElement(
                "span",
                { className: "limit" },
                "Amorrius is a platform for ",
                _react2["default"].createElement(
                  "a",
                  { href: "http://twitch.tv", target: "_blank", rel: "nofollow" },
                  "Twitch"
                ),
                " users to enjoy the Twitch experience in a better or different way. Twitch streamers and viewers get a better way to interact with each other, and the viewing experience is pretty dope as well.",
                _react2["default"].createElement("br", null),
                _react2["default"].createElement("br", null),
                "Have a question for you favorite streamer? Ask them and receive and answer.",
                _react2["default"].createElement("br", null),
                _react2["default"].createElement("br", null),
                "Don't know what game to play on stream today? Make a poll for your viewers to vote on.",
                _react2["default"].createElement("br", null),
                _react2["default"].createElement("br", null),
                "Like to play with viewers? Game Queue makes it easy to track who to play with next and who's already played.",
                _react2["default"].createElement("br", null),
                _react2["default"].createElement("br", null),
                "Want to check out a streamer later, but you don't want to spend a follow on it just yet? Bookmark them!",
                _react2["default"].createElement("br", null),
                _react2["default"].createElement("br", null),
                "And other smaller features, like being able to refresh the chat or video independently, and getting a timestamped video link if you're watching a VOD.",
                _react2["default"].createElement("br", null),
                _react2["default"].createElement("br", null),
                "Amorrius is a SPA (Single-Page Application) so you don't need to worry about page refreshes. This means you won't miss a beat while watching your favorite streams while navigating the app."
              )
            )
          ),
          _react2["default"].createElement(
            "section",
            null,
            _react2["default"].createElement(
              "p",
              null,
              _react2["default"].createElement(
                "span",
                { className: "headline" },
                "What Does \"Amorrius\" Mean?"
              )
            ),
            _react2["default"].createElement(
              "span",
              { className: "limit" },
              _react2["default"].createElement(
                "p",
                null,
                "I picked several Latin words (courtesy of Google Translate) to mean close to what's relevant to the app. Amicus - \"friend\"",
                _react2["default"].createElement("br", null),
                _react2["default"].createElement("br", null),
                "Torrens - \"Stream\" (of wealth, quantity)",
                _react2["default"].createElement("br", null),
                _react2["default"].createElement("br", null),
                "Penitus - \"interact\""
              )
            )
          ),
          _react2["default"].createElement(
            "section",
            null,
            _react2["default"].createElement(
              "p",
              null,
              _react2["default"].createElement(
                "span",
                { className: "headline" },
                "Why Should I Use Amorrius?"
              ),
              _react2["default"].createElement(
                "span",
                { className: "limit" },
                "You should use Amorrius if you're not satisfied with the native Twitch expeirence.",
                _react2["default"].createElement("br", null),
                _react2["default"].createElement("br", null),
                "You should use it if you like to watch multiple streams.",
                _react2["default"].createElement("br", null),
                _react2["default"].createElement("br", null),
                "You should use it if you want a more complete Twitch experience.",
                _react2["default"].createElement("br", null),
                _react2["default"].createElement("br", null),
                "You should use it if you like to interact with your viewers.",
                _react2["default"].createElement("br", null),
                _react2["default"].createElement("br", null),
                "You should use it if you like the existing features, and hopeful/planned future features.",
                _react2["default"].createElement("br", null),
                _react2["default"].createElement("br", null),
                "You should use it if you like ",
                _react2["default"].createElement(
                  "a",
                  { href: "http://piecedigital.net", target: "_blank", rel: "nofollow" },
                  "me"
                ),
                " (the developer). I'm hella dope... I think."
              )
            )
          ),
          _react2["default"].createElement(
            "section",
            null,
            _react2["default"].createElement(
              "p",
              null,
              _react2["default"].createElement(
                "span",
                { className: "headline" },
                "What Features Does Amorrius Have?"
              )
            ),
            _react2["default"].createElement(
              "span",
              { className: "limit" },
              _react2["default"].createElement(
                "ul",
                { className: "list" },
                _react2["default"].createElement(
                  "li",
                  null,
                  "Multi-stream viewing (only up to 6, currently. That seemed like an optimal count for a viewing experience). Individual streams have their own set of options:"
                ),
                _react2["default"].createElement(
                  "ul",
                  { className: "list" },
                  _react2["default"].createElement(
                    "li",
                    null,
                    "Refresh video or chat independently"
                  ),
                  _react2["default"].createElement(
                    "li",
                    null,
                    "Open stream panels"
                  ),
                  _react2["default"].createElement(
                    "li",
                    null,
                    "Bookmark the stream"
                  ),
                  _react2["default"].createElement(
                    "li",
                    null,
                    "Follow/Unfollow the channel"
                  ),
                  _react2["default"].createElement(
                    "li",
                    null,
                    "Open the question submission view for a channel"
                  )
                ),
                _react2["default"].createElement(
                  "li",
                  null,
                  "Questions and answers"
                ),
                _react2["default"].createElement(
                  "li",
                  null,
                  "Polls"
                ),
                _react2["default"].createElement(
                  "li",
                  null,
                  "Comments for questions and polls"
                ),
                _react2["default"].createElement(
                  "li",
                  null,
                  "User queuing"
                ),
                _react2["default"].createElement(
                  "li",
                  null,
                  "Bookmarks"
                )
              )
            )
          )
        )
      )
    );
  }
});
module.exports = exports["default"];