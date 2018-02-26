"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = loadData;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _universalAjax = require("../universal/ajax");

var _universalAjax2 = _interopRequireDefault(_universalAjax);

function loadData(errorCB) {
  var _this = this;

  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  options = Object.assign({}, options);
  options.stream_type = options.stream_type || "live";
  options.limit = options.limit || 20;
  options.headers = options.headers || {};
  // accept v3 api
  // options.headers["Accept"] = "application/vnd.twitchtv.v3+json";
  // accept v5 api
  options.headers["Accept"] = "application/vnd.twitchtv.v5+json";

  var redirectURI = undefined,
      clientID = undefined;
  if (typeof location === "object") {
    var match = location.host === "amorrius.net";
    if (match) {
      redirectURI = "http://" + location.host;
      clientID = "2lbl5iik3q140d45q5bddj3paqekpbi";
    } else {
      redirectURI = "http://amorrius.dev";
      clientID = "cye2hnlwj24qq7fezcbq9predovf6yy";
    }
  } else {
    // console.log("load data server side");
    redirectURI = "http://amorrius." + (process.env["NODE_ENV"] === "prod" ? "net" : "dev");
    clientID = "cye2hnlwj24qq7fezcbq9predovf6yy";
  }

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
      (0, _universalAjax2["default"])({
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
            if (e.message.match(/Unexpected token e in JSON at position 0/i)) {
              console.error("Not JSON");
            } else {
              console.error(e.stack || e);
            }
          } finally {
            resolve(data);
            if (typeof okayCB === "function") okayCB(data);
          }
        },
        error: function error(_error) {
          console.log(_error);
          // try {
          //   const message = JSON.parse(error.response).message;
          //   if(message.match(/\d+ is not following \d+/)) {
          //     // console.log("not following");
          //   }
          // } catch (e) {
          //   console.error(error);
          // }
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
      getUserID: function getUserID(okayCB) {
        if (options.usernameList) {
          options.login = options.usernameList.join(",");
        } else {
          options.login = options.username;
        }
        options.api_version = 5;
        delete options.username;
        // options.client_id = options.headers["Client-ID"];
        // options.headers = options.headers || {};
        return makeRequest(okayCB, "users");
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
        return new Promise(function (resolve, reject) {

          if (options.userID) {

            makeRequest(okayCB, "users/" + options.userID).then(function (data) {
              return resolve(data);
            })["catch"](function () {
              var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
              return reject(e);
            });
          } else {

            // start by getting the user ID
            loadData(function () {
              var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

              console.error(e.stack || e);
            }, {
              username: options.username
            }).then(function (methods) {
              methods.getUserID().then(function (data) {
                // console.log("user id", data);
                // real request
                if (!data.users || !data.users[0]) return resolve({});
                makeRequest(okayCB, "users/" + data.users[0]._id).then(function (data) {
                  return resolve(data);
                })["catch"](function () {
                  var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                  return reject(e);
                });
              })["catch"](function () {
                var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                return console.error(e.stack || e);
              });
            })["catch"](function () {
              var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
              return console.error(e.stack || e);
            });
          }
        });
      },
      getChannelByName: function getChannelByName(okayCB) {
        delete options.stream_type;
        delete options.limit;
        return new Promise(function (resolve, reject) {

          if (options.userID) {
            makeRequest(okayCB, "channels/" + options.userID).then(function (data) {
              return resolve(data);
            })["catch"](function () {
              var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
              return reject(e);
            });
          } else {
            // start by getting the user ID
            loadData(function () {
              var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

              console.error(e.stack || e);
            }, {
              username: options.username
            }).then(function (methods) {
              methods.getUserID().then(function (data) {
                // console.log("user id", data);
                // real request
                if (data.users && data.users[0]) {
                  makeRequest(okayCB, "channels/" + data.users[0]._id).then(function (data) {
                    return resolve(data);
                  })["catch"](function () {
                    var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                    return reject(e);
                  });
                } else {
                  reject("No users");
                }
              })["catch"](function () {
                var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                return console.error(e.stack || e);
              });
            })["catch"](function () {
              var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
              return console.error(e.stack || e);
            });
          }
        });
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
        return new Promise(function (resolve, reject) {

          if (options.userID) {
            makeRequest(okayCB, "streams/" + options.userID).then(function (data) {
              return resolve(data);
            })["catch"](function () {
              var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
              return reject(e);
            });
          } else {
            // start by getting the user ID
            loadData(function () {
              var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

              console.error(e.stack || e);
            }, {
              username: options.username
            }).then(function (methods) {
              methods.getUserID().then(function (data) {
                // console.log("user id", data);
                // real request
                makeRequest(okayCB, "streams/" + data.users[0]._id).then(function (data) {
                  return resolve(data);
                })["catch"](function () {
                  var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                  return reject(e);
                });
              })["catch"](function () {
                var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                return console.error(e.stack || e);
              });
            })["catch"](function () {
              var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
              return console.error(e.stack || e);
            });
          }
        });
      },
      getFollowStatus: function getFollowStatus(okayCB) {
        delete options.stream_type;
        delete options.limit;
        return new Promise(function (resolve, reject) {

          // start by getting the first user ID
          loadData(function () {
            var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            console.error(e.stack || e);
          }, {
            username: options.username
          }).then(function (methods) {
            methods.getUserID().then(function (data) {
              // console.log("user id", data);
              // get the target user ID
              loadData(function () {
                var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                console.error(e.stack || e);
              }, {
                username: options.target
              }).then(function (methods) {
                methods.getUserID().then(function (data2) {
                  // console.log("target id", data2);
                  // real request
                  makeRequest(okayCB, "users/" + data.users[0]._id + "/follows/channels/" + data2.users[0]._id).then(function (data) {
                    return resolve(data);
                  })["catch"](function () {
                    var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                    return reject(e);
                  });
                })["catch"](function () {
                  var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                  return console.error(e.stack || e);
                });
              })["catch"](function () {
                var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                return console.error(e.stack || e);
              });
            })["catch"](function () {
              var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
              return console.error(e.stack || e);
            });
          })["catch"](function () {
            var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            return console.error(e.stack || e);
          });
        });
      },
      getSubscriptionStatus: function getSubscriptionStatus(okayCB) {
        delete options.stream_type;
        delete options.limit;
        options = needAuth(options);
        options.to = options.to || "user";
        return new Promise(function (resolve, reject) {

          // start by getting the first user ID
          loadData(function () {
            var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            console.error(e.stack || e);
          }, {
            username: options.username
          }).then(function (methods) {
            methods.getUserID().then(function (data) {
              // console.log("user id", data);
              // get the target user ID
              loadData(function () {
                var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                console.error(e.stack || e);
              }, {
                username: options.target
              }).then(function (methods) {
                methods.getUserID().then(function (data2) {
                  // console.log("target id", data2);
                  // real request
                  var url = options.to === "channel" ? "channels/" + data2.users[0]._id + "/subscriptions/" + data.users[0]._id : "users/" + data.users[0]._id + "/subscriptions/" + data2.users[0]._id;
                  return makeRequest(okayCB, url).then(function (data) {
                    return resolve(data);
                  })["catch"](function () {
                    var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                    return reject(e);
                  });
                })["catch"](function () {
                  var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                  return console.error(e.stack || e);
                });
              })["catch"](function () {
                var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                return console.error(e.stack || e);
              });
            })["catch"](function () {
              var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
              return console.error(e.stack || e);
            });
          })["catch"](function () {
            var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            return console.error(e.stack || e);
          });
        });
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
        // limit - integer -	Maximum number of objects to return. Default: 10. Maximum: 100.
        // offset -	integer -	Object offset for pagination of results. Default: 0.
        // broadcast_type -	comma-separated list -Constrains the type of videos returned. Valid values: (any combination of) archive, highlight, upload. Default: all types (no filter).
        // language -	comma-separated list -Constrains the language of the videos that are returned; for example, en,es. Default: all languages.
        // sort -	string -Sorting order of the returned objects. Valid values: views, time. Default: time (most recent first).

        delete options.stream_type;
        // delete options.limit;
        var username = options.username;
        delete options.username;
        // options.client_id = options.headers["Client-ID"];
        // options.headers = options.headers || {};
        return new Promise(function (resolve, reject) {

          if (options.userID) {
            makeRequest(okayCB, "channels/" + options.userID + "/videos").then(function (data) {
              return resolve(data);
            })["catch"](function () {
              var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
              return reject(e);
            });
          } else {
            // start by getting the user ID
            loadData(function () {
              var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

              console.error(e.stack || e);
            }, {
              username: username
            }).then(function (methods) {
              methods.getUserID().then(function (data) {
                // console.log("user id", data);
                // console.log(data.users[0]._id);
                // real request
                makeRequest(okayCB, "channels/" + data.users[0]._id + "/videos").then(function (data) {
                  return resolve(data);
                })["catch"](function () {
                  var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                  return reject(e);
                });
              })["catch"](function () {
                var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                return console.error(e.stack || e);
              });
            })["catch"](function () {
              var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
              return console.error(e.stack || e);
            });
          }
        });
      },
      getVODData: function getVODData(okayCB) {
        delete options.stream_type;
        delete options.limit;
        var id = options.id;
        delete options.id;
        return makeRequest(okayCB, "videos/" + id);
      },
      getHostingByName: function getHostingByName(okayCB) {
        delete options.stream_type;
        delete options.limit;
        var username = options.username;
        delete options.username;
        options.client_id = options.headers["Client-ID"];
        // options.headers = options.headers || {};
        return new Promise(function (resolve, reject) {

          // start by getting the first user ID
          loadData(function () {
            var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            console.error(e.stack || e);
          }, {
            username: username
          }).then(function (methods) {
            methods.getUserID().then(function (data) {
              // console.log("user id", data);
              // get the target user ID
              return makeRequest(okayCB, "/get-host/" + data.users[0]._id, true).then(function (data) {
                return resolve(data);
              })["catch"](function () {
                var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                return reject(e);
              });
            })["catch"](function () {
              var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
              return console.error(e.stack || e);
            });
          })["catch"](function () {
            var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            return console.error(e.stack || e);
          });
        });
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
        return new Promise(function (resolve, reject) {

          // start by getting the user ID
          loadData(function () {
            var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            console.error(e.stack || e);
          }, {
            username: username
          }).then(function (methods) {
            methods.getUserID().then(function (data) {
              // console.log("user id", data);

              // getting the target user ID
              loadData(function () {
                var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                console.error(e.stack || e);
              }, {
                username: target
              }).then(function (methods) {
                methods.getUserID().then(function (data2) {
                  // console.log("target id", data2);
                  console.log(data, data2);
                  // real request
                  makeRequest(okayCB, "users/" + data.users[0]._id + "/follows/channels/" + data2.users[0]._id).then(function (data) {
                    return resolve(data);
                  })["catch"](function () {
                    var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                    return reject(e);
                  });
                })["catch"](function () {
                  var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                  return console.error(e.stack || e);
                });
              })["catch"](function () {
                var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                return console.error(e.stack || e);
              });
            })["catch"](function () {
              var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
              return console.error(e.stack || e);
            });
          })["catch"](function () {
            var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            return console.error(e.stack || e);
          });
        });
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
        return new Promise(function (resolve, reject) {

          // start by getting the user ID
          loadData(function () {
            var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            console.error(e.stack || e);
          }, {
            username: username
          }).then(function (methods) {
            methods.getUserID().then(function (data) {
              // console.log("user id", data);

              // start by getting the user ID
              loadData(function () {
                var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                console.error(e.stack || e);
              }, {
                username: target
              }).then(function (methods) {
                methods.getUserID().then(function (data2) {
                  // console.log("target id", data2);
                  // real request
                  makeRequest(okayCB, "users/" + data.users[0]._id + "/follows/channels/" + data2.users[0]._id).then(function (data) {
                    return resolve(data);
                  })["catch"](function () {
                    var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                    return reject(e);
                  });
                })["catch"](function () {
                  var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                  return console.error(e.stack || e);
                });
              })["catch"](function () {
                var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                return console.error(e.stack || e);
              });
            })["catch"](function () {
              var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
              return console.error(e.stack || e);
            });
          })["catch"](function () {
            var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            return console.error(e.stack || e);
          });
        });
      },
      followedStreams: function followedStreams(okayCB) {
        options.offset = typeof options.offset === "number" && options.offset !== Infinity ? options.offset : 0;
        options.headers = options.headers || {};
        options.headers.Authorization = "OAuth " + (options.access_token || _this.props.auth.access_token);
        return new Promise(function (resolve, reject) {

          // start by getting the user ID
          loadData(function () {
            var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            console.error(e.stack || e);
          }, {
            username: options.username || this.props.userData.name
          }).then(function (methods) {
            methods.getUserID().then(function (data) {
              // console.log("user id", data);
              // real request
              makeRequest(okayCB, "users/" + data.users[0]._id + "/follows/channels").then(function (data) {
                return resolve(data);
              })["catch"](function () {
                var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                return reject(e);
              });
            })["catch"](function () {
              var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
              return console.error(e.stack || e);
            });
          })["catch"](function () {
            var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            return console.error(e.stack || e);
          });
        });
      },
      followingStreams: function followingStreams(okayCB) {
        options.offset = typeof options.offset === "number" && options.offset !== Infinity ? options.offset : 0;
        options.headers = options.headers || {};
        options.headers.Authorization = "OAuth " + (options.access_token || _this.props.auth.access_token);
        return new Promise(function (resolve, reject) {

          // start by getting the user ID
          loadData(function () {
            var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            console.error(e.stack || e);
          }, {
            username: options.username || this.props.userData.name
          }).then(function (methods) {
            methods.getUserID().then(function (data) {
              // console.log("user id", data);
              // real request
              makeRequest(okayCB, "channels/" + data.users[0]._id + "/follows").then(function (data) {
                return resolve(data);
              })["catch"](function () {
                var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                return reject(e);
              });
            })["catch"](function () {
              var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
              return console.error(e.stack || e);
            });
          })["catch"](function () {
            var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            return console.error(e.stack || e);
          });
        });
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
        options.live = "true";
        return makeRequest(okayCB, "search/games");
      },
      searchVideos: function searchVideos(okayCB) {
        options.offset = typeof options.offset === "number" && options.offset !== Infinity ? options.offset : 0;
        options.game = options.query;
        options.period = "all";
        options.sort = "time";
        options.broadcast_type = "archive,upload";
        return makeRequest(okayCB, "videos/top");
      }
    });
  });
}

;
module.exports = exports["default"];