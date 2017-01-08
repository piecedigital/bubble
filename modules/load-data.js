"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ajax = require("./ajax");

exports["default"] = function (errorCB) {
  var _this = this;

  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  options = Object.assign({}, options);
  options.stream_type = options.stream_type || "live";
  options.limit = options.limit || 20;
  options.headers = options.headers || {};
  // accept v3 api
  options.headers["Accept"] = "application/vnd.twitchtv.v3+json";

  var redirectURI = typeof location === "object" ? "http://" + location.host : "http://localhost:8080";
  var clientID = redirectURI === "http://localhost:8080" ? "cye2hnlwj24qq7fezcbq9predovf6yy" : "2lbl5iik3q140d45q5bddj3paqekpbi";

  options.headers["Client-ID"] = clientID;
  var baseURL = "https://api.twitch.tv/kraken/";
  var makeRequest = function makeRequest(okayCB, path, omitBase) {
    return new Promise(function (resolve, reject) {
      var requestURL = "" + (!omitBase ? baseURL : "") + path + "?";
      Object.keys(options).map(function (key) {
        var exceptions = ["type", "headers"];
        if (exceptions.indexOf(key) < 0) {
          var value = options[key];
          requestURL += key + "=" + value + "&";
        }
      });
      requestURL.replace(/&$/, "");
      (0, _ajax.ajax)({
        url: requestURL,
        type: options.type || null,
        beforeSend: function beforeSend(xhr) {
          if (options.headers) {
            Object.keys(options.headers).map(function (header) {
              xhr.setRequestHeader(header, options.headers[header]);
            });
          }
        },
        success: function success(data) {
          try {
            data = JSON.parse(data);
          } catch (e) {
            // console.log(data);
            console.error(e.stack || e);
          } finally {
            resolve(data);
            if (typeof okayCB === "function") okayCB(data);
          }
        },
        error: function error(_error) {
          console.error(_error);
          reject();
        }
      });
    });
  };
  var needAuth = function needAuth(options) {
    var access_token = options.access_token;
    options.headers.Authorization = "OAuth " + access_token;
    return options;
  };
  return new Promise(function (resolve, reject) {
    resolve({
      getFirebaseConfig: function getFirebaseConfig(okayCB) {
        // console.log(this);
        return makeRequest(okayCB, "/get-firebase-config", true);
      },
      getUserID: function getUserID() {
        options.login = options.username;
        options.api_version = 5;
        delete options.username;
        // options.client_id = options.headers["Client-ID"];
        // options.headers = options.headers || {};
        return makeRequest(okayCB, "/users");
      },
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
      getUserByName: function getUserByName(okayCB) {
        delete options.stream_type;
        delete options.limit;
        return makeRequest(okayCB, "users/" + options.username);
      },
      getChannelByName: function getChannelByName(okayCB) {
        delete options.stream_type;
        delete options.limit;
        return makeRequest(okayCB, "channels/" + options.username);
      },
      getCurrentUser: function getCurrentUser(okayCB) {
        delete options.stream_type;
        delete options.limit;
        options.headers = options.headers || {};
        options = needAuth(options);
        if (options.access_token) return makeRequest(okayCB, "user");
        return new Promise(function (resolve, reject) {
          reject("no access token");
        });
      },
      getStreamByName: function getStreamByName(okayCB) {
        delete options.stream_type;
        delete options.limit;
        return makeRequest(okayCB, "streams/" + options.username);
      },
      getFollowStatus: function getFollowStatus(okayCB) {
        delete options.stream_type;
        delete options.limit;
        return makeRequest(okayCB, "users/" + options.username + "/follows/channels/" + options.target);
      },
      getPanels: function getPanels(okayCB) {
        delete options.stream_type;
        delete options.limit;
        var username = options.username;
        delete options.username;
        options.client_id = options.headers["Client-ID"];
        // options.headers = options.headers || {};
        return makeRequest(okayCB, "/get-panels/" + username, true);
      },
      getVideos: function getVideos(okayCB) {
        delete options.stream_type;
        delete options.limit;
        var username = options.username;
        delete options.username;
        // options.client_id = options.headers["Client-ID"];
        // options.headers = options.headers || {};
        return makeRequest(okayCB, "channels/" + username + "/videos");
      },
      followStream: function followStream(okayCB) {
        delete options.stream_type;
        delete options.limit;
        options.type = "PUT";
        options.notifications = true;
        options = needAuth(options);
        var username = options.username,
            target = options.target;
        delete options.username;
        delete options.target;
        return makeRequest(okayCB, "users/" + username + "/follows/channels/" + target);
      },
      unfollowStream: function unfollowStream(okayCB) {
        delete options.stream_type;
        delete options.limit;
        options.type = "DELETE";
        options = needAuth(options);
        var username = options.username,
            target = options.target;
        delete options.username;
        delete options.target;
        return makeRequest(okayCB, "users/" + username + "/follows/channels/" + target);
      },
      followedStreams: function followedStreams(okayCB) {
        options.offset = typeof options.offset === "number" && options.offset !== Infinity ? options.offset : 0;
        options.headers = options.headers || {};
        options.headers.Authorization = "OAuth " + (options.access_token || _this.props.auth.access_token);
        return makeRequest(okayCB, "users/" + (options.username || _this.props.userData.name) + "/follows/channels");
      },
      followingStreams: function followingStreams(okayCB) {
        options.offset = typeof options.offset === "number" && options.offset !== Infinity ? options.offset : 0;
        options.headers = options.headers || {};
        options.headers.Authorization = "OAuth " + (options.access_token || _this.props.auth.access_token);
        return makeRequest(okayCB, "channels/" + (options.username || _this.props.userData.name) + "/follows");
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