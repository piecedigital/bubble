var cp = require('child_process');
var env = {
  PORT: 80,
  NODE_ENV: "dev",
  API_KEY: "AIzaSyCKZDymYonde07sD7vMu7RukYhGwau1mm4",
  AUTH_DOMAIN: "bubble-13387.firebaseapp.com",
  DATABASE_URL: "https://bubble-13387.firebaseio.com",
  STORAGE_BUCKET: "bubble-13387.appspot.com",
  MESSAGING_SENDER_ID: "766141212604",
  V_MAJOR: 0,
  V_MINOR: 13,
  V_PATCH: 7,
};
// would put other environment variables here
cp.fork("./dist/app.js", [], {
  env: env
});

process.on('uncaughtException', function (err) {
  console.log("\n\r **Uncaught Exception event** \n\r");
  console.log(err);
});
