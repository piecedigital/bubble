var watchBabel = require("watch-babel");
var logOut = require("./dist/log-out").logOut;
var cp = require("child_process");

var srcDir = "./src";
var destDir = "./dist";
var options = { glob: ["**/*.js", "**/*.jsx"] };
var watcher = watchBabel(srcDir, destDir, options);
watcher.on("ready", function() { console.log("ready", arguments); });
watcher.on("success", function(filepath) {
  console.log("Transpiled ", filepath);
  cp.exec("browserify ./dist/views/app.jsx -o ./dist/public/js/bundle.js", function (err) {
    if(err) {
      logOut(err, true, {
        type: "error"
      });
    } else {
      logOut("browserification complete", true)
    }
  });
});
watcher.on("failure", function(filepath, e) {
  console.log("Failed to transpile", filepath, "(Error: ", e);
});
watcher.on("delete", function(filepath) {
  console.log("Deleted file", filepath);
});
