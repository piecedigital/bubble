"use strict";
const fs = require('fs');
module.exports.logOut = function (message, logIt, options) {
  options = options || {};
  options.type = options.type || "";
  const type = options.type;
  let time = `[${new Date().toUTCString()}]`;
  let milTime = `[${new Date().getTime()}]`;
  let error = `[${type || "0"}]`;
  let msg = `[${message.message || message}]`;
  let outMessage = `${milTime} ${time} ${error} ${msg}\r\n`;

  new Promise(function(resolve, reject) {
    fs.stat(`${__dirname}/logs/`, (err, stats) => {
      if(stats && stats.isDirectory()) {
        resolve(true);
      } else {
        fs.mkdir(`${__dirname}/logs`, () => {
          resolve(true);
        });
      }
    });
  })
  .then((e) => {
    let location = "default.log";
    switch(type) {
      case "error": location = "errors.log";
      break;
      default: location = "default.log";
    }
    new Promise(function(resolve, reject) {
      fs.stat(`${__dirname}/logs/${location}`, (err, stats) => {
        if(stats && stats.isFile()) {
          resolve(true);
        } else {
          fs.writeFile(`${__dirname}/logs/${location}`, "milliseconds;time;error;message\r\n\r\n", (err) => {
            if(err) return reject(err);
            resolve(true);
          });
        }
      });
    })
    .then((exists) => {
      if(exists) {
        fs.appendFile(`${__dirname}/logs/${location}`, outMessage, (err) => {
          if(err) console.error(new Error(e).stack);
        });
      }
      if(logIt) {
        switch (type) {
          case "error": console.error(new Error(outMessage).stack);
            break;
          default: console.log(outMessage);

        }
      }
    })
    .catch(e => console.error(e.stack || new Error(e).stack));
  })
  .catch(e => console.error(e.stack || new Error(e).stack));
}
