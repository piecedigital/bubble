"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ajax = require("./ajax");

exports["default"] = function (errorCB) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  options = Object.assign({}, options);
  options.stream_type = options.stream_type || "live";
  options.limit = options.limit || 20;
  var baseURL = "https://api.twitch.tv/kraken/";
  var makeRequest = function makeRequest(okayCB, path) {
    console.log("options", options);
    return new Promise(function (resolve, reject) {
      var requestURL = "" + baseURL + path + "?";
      Object.keys(options).map(function (key) {
        var value = options[key];
        requestURL += key + "=" + value + "&";
      });
      requestURL.replace(/&$/, "");
      (0, _ajax.ajax)({
        url: requestURL,
        success: function success(data) {
          data = JSON.parse(data);
          resolve(data);
          if (typeof okayCB === "function") okayCB(data);
        },
        error: function error(_error) {
          console.error(_error);
        }
      });
    });
  };
  return new Promise(function (resolve, reject) {
    resolve({
      featured: function featured(okayCB) {
        // console.log(this);
        options.limit = 25;
        options.offset = 0;
        return makeRequest(okayCB, "streams/featured");
      },
      topGames: function topGames(okayCB) {
        // console.log(this);
        options.offset = typeof options.offset === "number" && options.offset !== Infinity ? options.offset : 0;
        return makeRequest(okayCB, "games/top");
      },
      topStreams: function topStreams(okayCB) {
        // console.log(this);
        options.offset = typeof options.offset === "number" && options.offset !== Infinity ? options.offset : 0;
        return makeRequest(okayCB, "streams");
      },
      getUser: function getUser(okayCB, username) {
        delete options.stream_type;
        delete options.limit;
        return makeRequest(okayCB, "users/" + username);
      },
      followedStreams: function followedStreams(okayCB) {
        options.offset = typeof options.offset === "number" && options.offset !== Infinity ? options.offset : 0;
        return makeRequest(okayCB, "search/followed");
      },
      followedVideos: function followedVideos(okayCB) {
        options.offset = typeof options.offset === "number" && options.offset !== Infinity ? options.offset : 0;
        return makeRequest(okayCB, "videos/followed");
      },
      searchChannels: function searchChannels(okayCB) {
        options.offset = typeof options.offset === "number" && options.offset !== Infinity ? options.offset : 0;
        return makeRequest(okayCB, "search/channels");
      },
      searchStreams: function searchStreams(okayCB) {
        options.offset = typeof options.offset === "number" && options.offset !== Infinity ? options.offset : 0;
        return makeRequest(okayCB, "search/streams");
      },
      searchGames: function searchGames(okayCB) {
        options.offset = typeof options.offset === "number" && options.offset !== Infinity ? options.offset : 0;
        return makeRequest(okayCB, "search/games");
      }
    });
  });
};

;
module.exports = exports["default"];