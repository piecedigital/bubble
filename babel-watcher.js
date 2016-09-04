var watchBabel = require("watch-babel");
var logOut = require("./dist/log-out").logOut;
var cp = require("child_process");

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
  timer += 5;
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
