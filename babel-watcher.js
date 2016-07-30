var watchBabel = require("watch-babel");

var srcDir = "./src";
var destDir = "./dist";
var options = { glob: ["**/*.js", "**/*.jsx"] };
var watcher = watchBabel(srcDir, destDir, options);
watcher.on("ready", function() { console.log("ready", arguments); });
watcher.on("success", function(filepath) {
  console.log("Transpiled ", filepath);
});
watcher.on("failure", function(filepath, e) {
  console.log("Failed to transpile", filepath, "(Error: ", e);
});
watcher.on("delete", function(filepath) {
  console.log("Deleted file", filepath);
});
