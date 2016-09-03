import { ajax } from "./ajax";
export default function(errorCB, options = {}) {
  options = Object.assign({}, options);
  options.stream_type = options.stream_type || "live";
  options.limit = options.limit || 20;
  options.headers = options.headers || {};
  let baseURL = "https://api.twitch.tv/kraken/";
  const makeRequest = function(okayCB, path) {
    return new Promise((resolve, reject) => {
      let requestURL = `${baseURL}${path}?`;
      Object.keys(options).map(key => {
        let value = options[key];
        requestURL += `${key}=${value}&`
      });
      requestURL.replace(/&$/, "");
      ajax({
        url: requestURL,
        beforeSend: function(xhr) {
          if(options.headers) {
            Object.keys(options.headers).map(header => {
              xhr.setRequestHeader(header, options.headers[header]);
            });
          }
        },
        success(data) {
          data = JSON.parse(data);
          resolve(data);
          if(typeof okayCB === "function") okayCB(data);
        },
        error(error) {
          console.error(error);
        }
      })
    });
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
      getUser: (okayCB, username) => {
        delete options.stream_type;
        delete options.limit;
        return makeRequest(okayCB, `users/${username}`);
      },
      followedStreams: (okayCB) => {
        options.offset = typeof options.offset === "number" && options.offset !== Infinity ? options.offset : 0;
        options.headers.Authorization = `OAuth ${this.props.auth.access_token}`;
        return makeRequest(okayCB, "streams/followed");
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
