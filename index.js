var cp = require('child_process');
var env = {
  PORT: "8080"
};
// would put other environment variables here
cp.fork("./dist/app.js", env);
