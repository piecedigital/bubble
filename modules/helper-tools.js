"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var missingLogo = "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png";

exports.missingLogo = missingLogo;
var browserNotification = function browserNotification(options) {
  if (!("Notification" in window)) {
    console.log("Notilfications are not supported");
  } else {
    checkPermission(options);
  }
};

exports.browserNotification = browserNotification;
function checkPermission(options) {
  if (Notification.permission === "granted") {
    makeNotification(options);
  } else {
    if (Notification.permission !== "denied") {
      Notification.requestPermission(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          makeNotification(options);
        }
      });
    }
  }
}

function makeNotification(data) {
  var title = "TwiQu notification";
  var options = {
    body: "TwiQu.com",
    icon: "/media/logo-png.png"
  };
  switch (data.type) {
    case "stream_online":
      title = "A New Stream Is Live!";
      options.body = data.channelName + " is live!\n\rClick to watch them now!";
      break;
  }
  var notification = new Notification(title, options);
  notification.onclick = function () {
    notification.close();
    data.callback();
  };
  setTimeout(function () {
    if (typeof notification === "object") {
      if (typeof data.finishCB === "function") data.finishCB();
      notification.close();
    }
  }, (data.timeout || 2) * 1000);
}