export const browserNotification = function (options) {
  if(!("Notification" in window)) {
    console.log("Notilfications are not supported");
  } else {
    checkPermission(options);
  }
}

function checkPermission(options) {
  if(Notification.permission === "granted") {
    makeNotification(options);
  } else {
    if(Notification.permission !== "denied") {
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
  let title = "TwiQu notification";
  let options = {
    body: "TwiQu.com",
    icon: "/media/logo-png.png"
  };
  switch (data.type) {
    case "stream_online":
      title = "A New Stream Is Live!";
      options.body = `${data.channelName} is live!\n\rClick to watch them now!`
      break;
  }
  var notification = new Notification(title, options);
  notification.onclick = function () {
    notification.close();
    data.callback();
  };
  setTimeout(() => {
    if(typeof notification === "object") notification.close();
  }, 5000);
}
