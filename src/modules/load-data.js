import { ajax } from "./ajax";
export default function(errorCB, options = {}) {
  options = Object.assign({}, options);
  options.stream_type = options.stream_type || "live";
  options.limit = options.limit || 20;
  options.headers = options.headers || {};
  // accept v3 api
  options.headers["Accept"] = "application/vnd.twitchtv.v3+json";

  const redirectURI = typeof location === "object" ? `http://${location.host}` : "http://localhost:8080";
  const clientID = redirectURI === "http://localhost:8080" ? "cye2hnlwj24qq7fezcbq9predovf6yy" : "2lbl5iik3q140d45q5bddj3paqekpbi";

  options.headers["Client-ID"] = clientID;
  let baseURL = "https://api.twitch.tv/kraken/";
  const makeRequest = function(okayCB, path, omitBase) {
    return new Promise((resolve, reject) => {
      let requestURL = `${!omitBase ? baseURL : ""}${path}?`;
      Object.keys(options).map(key => {
        const exceptions = ["type", "headers"];
        if(exceptions.indexOf(key) < 0) {
          let value = options[key];
          requestURL += `${key}=${value}&`
        }
      });
      requestURL.replace(/&$/, "");
      ajax({
        url: requestURL,
        type: options.type || null,
        beforeSend: function(xhr) {
          if(options.headers) {
            Object.keys(options.headers).map(header => {
              xhr.setRequestHeader(header, options.headers[header]);
            });
          }
        },
        success(data) {
          try {
            data = JSON.parse(data);
          } catch (e) {
            console.log(data);
            console.error(e.stack || e);
          } finally {
            resolve(data);
            if(typeof okayCB === "function") okayCB(data);
          }
        },
        error(error) {
          console.error(error);
          reject();
        }
      })
    });
  };
  const needAuth = function (options) {
    var access_token = options.access_token;
    options.headers.Authorization = `OAuth ${access_token}`;
    return options;
  };
  return new Promise((resolve, reject) => {
    resolve({
      featured: (okayCB) => {
        // console.log(this);
        options.limit = 25;
        options.offset = 0;
        return makeRequest(okayCB, "streams/featured");
      },
      topGames: (okayCB) => {
        // console.log(this);
        options.offset = typeof options.offset === "number" && options.offset !== Infinity ? options.offset : 0;
        return makeRequest(okayCB, "games/top");
      },
      topStreams: (okayCB) => {
        // console.log(this);
        options.offset = typeof options.offset === "number" && options.offset !== Infinity ? options.offset : 0;
        return makeRequest(okayCB, "streams");
      },
      getUserByName: (okayCB) => {
        delete options.stream_type;
        delete options.limit;
        return makeRequest(okayCB, `users/${options.username}`);
      },
      getCurrentUser: (okayCB) => {
        delete options.stream_type;
        delete options.limit;
        options.headers = options.headers || {};
        options = needAuth(options);
        if(options.access_token) return makeRequest(okayCB, `user`);
        return new Promise(function(resolve, reject) {
          reject("no access token");
        });
      },
      getStreamByName: (okayCB) => {
        delete options.stream_type;
        delete options.limit;
        return makeRequest(okayCB, `streams/${options.username}`);
      },
      getFollowStatus: (okayCB) => {
        delete options.stream_type;
        delete options.limit;
        return makeRequest(okayCB, `users/${options.username}/follows/channels/${options.target}`);
      },
      getPanels: (okayCB) => {
        delete options.stream_type;
        delete options.limit;
        let username = options.username;
        delete options.username;
        options.client_id = options.headers["Client-ID"];
        // options.headers = options.headers || {};
        return makeRequest(okayCB, `/get-panels/${username}`, true);
      },
      getVideos: (okayCB) => {
        delete options.stream_type;
        delete options.limit;
        let username = options.username;
        delete options.username;
        // options.client_id = options.headers["Client-ID"];
        // options.headers = options.headers || {};
        return makeRequest(okayCB, `channels/${username}/videos`);
      },
      followStream: (okayCB) => {
        delete options.stream_type;
        delete options.limit;
        options.type = "PUT";
        options.notifications = true;
        options = needAuth(options);
        let username = options.username, target = options.target;
        delete options.username;
        delete options.target;
        return makeRequest(okayCB, `users/${username}/follows/channels/${target}`);
      },
      unfollowStream: (okayCB) => {
        delete options.stream_type;
        delete options.limit;
        options.type = "DELETE";
        options = needAuth(options);
        let username = options.username, target = options.target;
        delete options.username;
        delete options.target;
        return makeRequest(okayCB, `users/${username}/follows/channels/${target}`);
      },
      followedStreams: (okayCB) => {
        options.offset = typeof options.offset === "number" && options.offset !== Infinity ? options.offset : 0;
        options.headers = options.headers || {};
        options.headers.Authorization = `OAuth ${options.access_token || this.props.auth.access_token}`;
        return makeRequest(okayCB, `users/${options.name || this.props.userData.name}/follows/channels`);
      },
      followingStreams: (okayCB) => {
        options.offset = typeof options.offset === "number" && options.offset !== Infinity ? options.offset : 0;
        options.headers = options.headers || {};
        options.headers.Authorization = `OAuth ${options.access_token || this.props.auth.access_token}`;
        return makeRequest(okayCB, `channels/${options.name || this.props.userData.name}/follows`);
      },
      followedVideos: (okayCB) => {
        options.offset = typeof options.offset === "number" && options.offset !== Infinity ? options.offset : 0;
        return makeRequest(okayCB, "videos/followed");
      },
      searchChannels: (okayCB) => {
        options.offset = typeof options.offset === "number" && options.offset !== Infinity ? options.offset : 0;
        return makeRequest(okayCB, "search/channels");
      },
      searchStreams: (okayCB) => {
        options.offset = typeof options.offset === "number" && options.offset !== Infinity ? options.offset : 0;
        return makeRequest(okayCB, "search/streams");
      },
      searchGames: (okayCB) => {
        options.offset = typeof options.offset === "number" && options.offset !== Infinity ? options.offset : 0;
        return makeRequest(okayCB, "search/games");
      }
    });
  });
};
