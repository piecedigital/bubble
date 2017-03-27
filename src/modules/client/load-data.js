import { ajax } from "./ajax";
export default function loadData(errorCB, options = {}) {
  options = Object.assign({}, options);
  options.stream_type = options.stream_type || "live";
  options.limit = options.limit || 20;
  options.headers = options.headers || {};
  // accept v3 api
  // options.headers["Accept"] = "application/vnd.twitchtv.v3+json";
  // accept v5 api
  options.headers["Accept"] = "application/vnd.twitchtv.v5+json";

  let redirectURI, clientID;
  const match = location.host === ("amorrius.net");
  if(match) {
    redirectURI =`http://${location.host}`;
    clientID = "2lbl5iik3q140d45q5bddj3paqekpbi";
  } else {
    redirectURI = "http://amorrius.dev";
    clientID ="cye2hnlwj24qq7fezcbq9predovf6yy"
  }


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
            // console.log(data);
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
      getFirebaseConfig: (okayCB) => {
        // console.log(this);
        return makeRequest(okayCB, "/get-firebase-config", true);
      },
      getUserID: (okayCB) => {
        if(options.usernameList) {
          options.login = options.usernameList.join(",");
        } else {
          options.login = options.username;
        }
        options.api_version = 5;
        delete options.username;
        // options.client_id = options.headers["Client-ID"];
        // options.headers = options.headers || {};
        return makeRequest(okayCB, `users`);
      },
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
        return new Promise(function(resolve, reject) {

          if(options.userID) {

            makeRequest(okayCB, `users/${options.userID}`)
            .then(data => resolve(data))
            .catch((e = {}) => reject(e));

          } else {

            // start by getting the user ID
            loadData((e = {}) => {
              console.error(e.stack || e);
            }, {
              username: options.username
            })
            .then(methods => {
              methods
              .getUserID()
              .then(data => {
                // console.log("user id", data);
                // real request
                makeRequest(okayCB, `users/${data.users[0]._id}`)
                .then(data => resolve(data))
                .catch((e = {}) => reject(e));
              })
              .catch((e = {}) => console.error(e.stack || e));
            })
            .catch((e = {}) => console.error(e.stack || e));

          }

        });
      },
      getChannelByName: (okayCB) => {
        delete options.stream_type;
        delete options.limit;
        return new Promise(function(resolve, reject) {

          if(options.userID) {
            makeRequest(okayCB, `channels/${options.userID}`)
            .then(data => resolve(data))
            .catch((e = {}) => reject(e));
          } else {
            // start by getting the user ID
            loadData((e = {}) => {
              console.error(e.stack || e);
            }, {
              username: options.username
            })
            .then(methods => {
              methods
              .getUserID()
              .then(data => {
                // console.log("user id", data);
                // real request
                makeRequest(okayCB, `channels/${data.users[0]._id}`)
                .then(data => resolve(data))
                .catch((e = {}) => reject(e));
              })
              .catch((e = {}) => console.error(e.stack || e));
            })
            .catch((e = {}) => console.error(e.stack || e));
          }

        });
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
        return new Promise(function(resolve, reject) {

          if(options.userID) {
            makeRequest(okayCB, `streams/${options.userID}`)
            .then(data => resolve(data))
            .catch((e = {}) => reject(e));
          } else {
            // start by getting the user ID
            loadData((e = {}) => {
              console.error(e.stack || e);
            }, {
              username: options.username
            })
            .then(methods => {
              methods
              .getUserID()
              .then(data => {
                // console.log("user id", data);
                // real request
                makeRequest(okayCB, `streams/${data.users[0]._id}`)
                .then(data => resolve(data))
                .catch((e = {}) => reject(e));
              })
              .catch((e = {}) => console.error(e.stack || e));
            })
            .catch((e = {}) => console.error(e.stack || e));
          }

        });
      },
      getFollowStatus: (okayCB) => {
        delete options.stream_type;
        delete options.limit;
        return new Promise(function(resolve, reject) {

          // start by getting the first user ID
          loadData((e = {}) => {
            console.error(e.stack || e);
          }, {
            username: options.username
          })
          .then(methods => {
            methods
            .getUserID()
            .then(data => {
              // console.log("user id", data);
              // get the target user ID
              loadData((e = {}) => {
                console.error(e.stack || e);
              }, {
                username: options.target
              })
              .then(methods => {
                methods
                .getUserID()
                .then(data2 => {
                  // console.log("target id", data2);
                  // real request
                  makeRequest(okayCB, `users/${data.users[0]._id}/follows/channels/${data2.users[0]._id}`)
                  .then(data => resolve(data))
                  .catch((e = {}) => reject(e));
                })
                .catch((e = {}) => console.error(e.stack || e));
              })
              .catch((e = {}) => console.error(e.stack || e));

            })
            .catch((e = {}) => console.error(e.stack || e));
          })
          .catch((e = {}) => console.error(e.stack || e));

        });
      },
      getSubscriptionStatus: (okayCB) => {
        delete options.stream_type;
        delete options.limit;
        options = needAuth(options);
        options.to = options.to || "user";
        return new Promise(function(resolve, reject) {

          // start by getting the first user ID
          loadData((e = {}) => {
            console.error(e.stack || e);
          }, {
            username: options.username
          })
          .then(methods => {
            methods
            .getUserID()
            .then(data => {
              // console.log("user id", data);
              // get the target user ID
              loadData((e = {}) => {
                console.error(e.stack || e);
              }, {
                username: options.target
              })
              .then(methods => {
                methods
                .getUserID()
                .then(data2 => {
                  // console.log("target id", data2);
                  // real request
                  const url = options.to === "channel" ? `channels/${data2.users[0]._id}/subscriptions/${data.users[0]._id}` : `users/${data.users[0]._id}/subscriptions/${data2.users[0]._id}`;
                  return makeRequest(okayCB, url)
                  .then(data => resolve(data))
                  .catch((e = {}) => reject(e));
                })
                .catch((e = {}) => console.error(e.stack || e));
              })
              .catch((e = {}) => console.error(e.stack || e));
            })
            .catch((e = {}) => console.error(e.stack || e));
          })
          .catch((e = {}) => console.error(e.stack || e));

        });
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
        return new Promise(function(resolve, reject) {

          if(options.userID) {
            makeRequest(okayCB, `channels/${options.userID}/videos`)
            .then(data => resolve(data))
            .catch((e = {}) => reject(e));
          } else {
            // start by getting the user ID
            loadData((e = {}) => {
              console.error(e.stack || e);
            }, {
              username
            })
            .then(methods => {
              methods
              .getUserID()
              .then(data => {
                // console.log("user id", data);
                // console.log(data.users[0]._id);
                // real request
                makeRequest(okayCB, `channels/${data.users[0]._id}/videos`)
                .then(data => resolve(data))
                .catch((e = {}) => reject(e));
              })
              .catch((e = {}) => console.error(e.stack || e));
            })
            .catch((e = {}) => console.error(e.stack || e));
          }

        });
      },
      getVODData: (okayCB) => {
        delete options.stream_type;
        delete options.limit;
        const id = options.id;
        delete options.id;
        return makeRequest(okayCB, `videos/${id}`);
      },
      getHostingByName: (okayCB) => {
        delete options.stream_type;
        delete options.limit;
        let username = options.username;
        delete options.username;
        options.client_id = options.headers["Client-ID"];
        // options.headers = options.headers || {};
        return new Promise(function(resolve, reject) {

          // start by getting the first user ID
          loadData((e = {}) => {
            console.error(e.stack || e);
          }, {
            username
          })
          .then(methods => {
            methods
            .getUserID()
            .then(data => {
              // console.log("user id", data);
              // get the target user ID
              return makeRequest(okayCB, `/get-host/${data.users[0]._id}`, true)
              .then(data => resolve(data))
              .catch((e = {}) => reject(e));
            })
            .catch((e = {}) => console.error(e.stack || e));
          })
          .catch((e = {}) => console.error(e.stack || e));

        });
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
        return new Promise(function(resolve, reject) {

          // start by getting the user ID
          loadData((e = {}) => {
            console.error(e.stack || e);
          }, {
            username: username
          })
          .then(methods => {
            methods
            .getUserID()
            .then(data => {
              // console.log("user id", data);

              // getting the target user ID
              loadData((e = {}) => {
                console.error(e.stack || e);
              }, {
                username: target
              })
              .then(methods => {
                methods
                .getUserID()
                .then(data2 => {
                  // console.log("target id", data2);
                  console.log(data, data2);
                  // real request
                  makeRequest(okayCB, `users/${data.users[0]._id}/follows/channels/${data2.users[0]._id}`)
                  .then(data => resolve(data))
                  .catch((e = {}) => reject(e));
                })
                .catch((e = {}) => console.error(e.stack || e));
              })
              .catch((e = {}) => console.error(e.stack || e));

            })
            .catch((e = {}) => console.error(e.stack || e));
          })
          .catch((e = {}) => console.error(e.stack || e));

        });
      },
      unfollowStream: (okayCB) => {
        delete options.stream_type;
        delete options.limit;
        options.type = "DELETE";
        options = needAuth(options);
        let username = options.username, target = options.target;
        delete options.username;
        delete options.target;
        return new Promise(function(resolve, reject) {

          // start by getting the user ID
          loadData((e = {}) => {
            console.error(e.stack || e);
          }, {
            username: username
          })
          .then(methods => {
            methods
            .getUserID()
            .then(data => {
              // console.log("user id", data);

              // start by getting the user ID
              loadData((e = {}) => {
                console.error(e.stack || e);
              }, {
                username: target
              })
              .then(methods => {
                methods
                .getUserID()
                .then(data2 => {
                  // console.log("target id", data2);
                  // real request
                  makeRequest(okayCB, `users/${data.users[0]._id}/follows/channels/${data2.users[0]._id}`)
                  .then(data => resolve(data))
                  .catch((e = {}) => reject(e));
                })
                .catch((e = {}) => console.error(e.stack || e));
              })
              .catch((e = {}) => console.error(e.stack || e));

            })
            .catch((e = {}) => console.error(e.stack || e));
          })
          .catch((e = {}) => console.error(e.stack || e));

        });
      },
      followedStreams: (okayCB) => {
        options.offset = typeof options.offset === "number" && options.offset !== Infinity ? options.offset : 0;
        options.headers = options.headers || {};
        options.headers.Authorization = `OAuth ${options.access_token || this.props.auth.access_token}`;
        return new Promise(function(resolve, reject) {

          // start by getting the user ID
          loadData((e = {}) => {
            console.error(e.stack || e);
          }, {
            username: options.username || this.props.userData.name
          })
          .then(methods => {
            methods
            .getUserID()
            .then(data => {
              // console.log("user id", data);
              // real request
              makeRequest(okayCB, `users/${data.users[0]._id}/follows/channels`)
              .then(data => resolve(data))
              .catch((e = {}) => reject(e));
            })
            .catch((e = {}) => console.error(e.stack || e));
          })
          .catch((e = {}) => console.error(e.stack || e));

        });
      },
      followingStreams: (okayCB) => {
        options.offset = typeof options.offset === "number" && options.offset !== Infinity ? options.offset : 0;
        options.headers = options.headers || {};
        options.headers.Authorization = `OAuth ${options.access_token || this.props.auth.access_token}`;
        return new Promise(function(resolve, reject) {

          // start by getting the user ID
          loadData((e = {}) => {
            console.error(e.stack || e);
          }, {
            username: options.username || this.props.userData.name
          })
          .then(methods => {
            methods
            .getUserID()
            .then(data => {
              // console.log("user id", data);
              // real request
              makeRequest(okayCB, `channels/${data.users[0]._id}/follows`)
              .then(data => resolve(data))
              .catch((e = {}) => reject(e));
            })
            .catch((e = {}) => console.error(e.stack || e));
          })
          .catch((e = {}) => console.error(e.stack || e));

        });
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
