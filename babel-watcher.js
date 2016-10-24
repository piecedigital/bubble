var watchBabel = require("watch-babel");
var logOut = require("./dist/log-out").logOut;
var cp = require("child_process");
var fs = require("fs");
var cluster = require("cluster");

if(cluster.isMaster) {
  var child1 = cluster.fork({
    PROCESS_INDEX: "1"
  });
  var child2 = cluster.fork({
    PROCESS_INDEX: "2"
  });
} else {
  var i = process.env.PROCESS_INDEX;
  console.log("child process:", i);
  switch (i) {
    case "1": babelWatcher(); break;
    case "2": sassWatcher(); break;
  }
}

function babelWatcher() {
  var srcDir = "./src";
  var destDir = "./dist";
  var options = { glob: ["**/**/*.js", "**/**/*.jsx"] };
  var watcher = watchBabel(srcDir, destDir, options);
  var timer = 0;
  var executing = false;
  var failure = false;
  watcher.on("ready", function() { console.log("ready", arguments); });
  watcher.on("success", function(filepath) {
    console.log("Transpiled ", filepath);
    // if(!filepath.match(/(routes.js|render-jsx.js)$/)) {
    // }
    timer += 2;
    executing = false;
    failure = false;
    brfy();
  });
  watcher.on("failure", function(filepath, e) {
    failure = true;
    console.log("Failed to transpile", filepath, "(Error: ", e);
  });
  watcher.on("delete", function(filepath) {
    console.log("Deleted file", filepath);
  });

  function brfy() {
    setTimeout(() => {
      timer--;
      console.log(timer);
      if(!timer && !executing && !failure) {
        console.log("browserifying...");
        executing = true;
        cp.exec("browserify ./dist/views/app.jsx -o ./dist/public/js/bundle.js", function (err) {
          if(err) {
            logOut(err, true, {
              type: "error"
            });
          } else {
            logOut("browserification complete", true)
          }
        });
      } else {
        if(timer > 0) {
          brfy();
        } else {
          timer = 0;
        }
      }
    }, 1000)
  }
}

function sassWatcher() {
  cp.exec(`sass --watch src/public/scss:dist/public/css --style=nested`, function (err, stdout, stderr) {
    if(err) {
      logOut(err, true, {
        type: "error"
      });
    } else {
      logOut(stdout, true)
      logOut(stderr, true, {
        type: "error"
      });
    }
  });
  // fs.watch("./src", {
  //   recursive: true
  // }, function (eventType, filename) {
  //   console.log(eventType, filename);
  //   if(eventType === "change" && filename.match(/(\/|\\)[a-z\-]+\.scss$/i)) {
  //     console.log("totally a Sass file change!");
  //     cp.exec(`sass ./src/${filename} ./dist/${cssNameChange(filename)} --style=nested`, function (err) {
  //       if(err) {
  //         logOut(err, true, {
  //           type: "error"
  //         });
  //       } else {
  //         logOut("sass compilation complete", true)
  //       }
  //     });
  //   }
  // });

  function cssNameChange(str) {
    var t = str.replace(/(\.scss)$/, ".css").replace(/scss/, "css");
    console.log(t);
    return t;
  }
}
