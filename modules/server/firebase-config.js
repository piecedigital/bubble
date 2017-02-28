"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _firebase = require("firebase");

var _firebase2 = _interopRequireDefault(_firebase);

var _firebaseAdmin = require("firebase-admin");

var _firebaseAdmin2 = _interopRequireDefault(_firebaseAdmin);

var _logOut = require("../../log-out");

var serviceAccount = undefined;

try {
  serviceAccount = require(__dirname + "/../../private/bubble-13387-firebase-adminsdk-cbrvg-5186dc4eb2.json");
} catch (e) {
  serviceAccount = {
    "custom_server_auth_uid": process.env["CUSTOM_AUTH_UID"],
    "type": process.env["SERV_ACC_TYPE"],
    "project_id": process.env["SERV_ACC_PROJECT_ID"],
    "private_key_id": process.env["SERV_ACC_PRIV_KEY_ID"],
    "private_key": decodeURI(process.env["SERV_ACC_PRIV_KEY"]),
    "client_email": process.env["SERV_ACC_CLIENT_EMAIL"],
    "client_id": process.env["SERV_ACC_CLIENT_ID"],
    "auth_uri": process.env["SERV_ACC_AUTH_URI"],
    "token_uri": process.env["SERV_ACC_TOKEN_URI"],
    "auth_provider_x509_cert_url": process.env["SERV_ACC_PROVIDER_CERT"],
    "client_x509_cert_url": process.env["SERV_ACC_CLIENT_CERT"]
  };
}

var initFirebase = function initFirebase() {
  _firebaseAdmin2["default"].initializeApp({
    credential: _firebaseAdmin2["default"].credential.cert(serviceAccount),
    databaseURL: process.env["DATABASE_URL"] || "https://bubble-13387.firebaseio.com"
  });

  var ref = {
    root: _firebaseAdmin2["default"].database().ref(),
    authTokensRef: _firebaseAdmin2["default"].database().ref("authTokens"),
    appConfigRef: _firebaseAdmin2["default"].database().ref("appConfig"),
    usersRef: _firebaseAdmin2["default"].database().ref("users"),
    notificationsRef: _firebaseAdmin2["default"].database().ref("notifications"),
    questionsRef: _firebaseAdmin2["default"].database().ref("questions"),
    answersRef: _firebaseAdmin2["default"].database().ref("answers"),
    ratingsRef: _firebaseAdmin2["default"].database().ref("ratings"),
    commentsRef: _firebaseAdmin2["default"].database().ref("comments"),
    AMAsRef: _firebaseAdmin2["default"].database().ref("AMAs"),
    pollsRef: _firebaseAdmin2["default"].database().ref("polls"),
    gameQueuesRef: _firebaseAdmin2["default"].database().ref("gameQueues"),
    feedbackRef: _firebaseAdmin2["default"].database().ref("feedback")
  };
  return ref;
};

exports.initFirebase = initFirebase;
var getAuthToken = function getAuthToken() {
  return new Promise(function (resolve, reject) {
    _firebaseAdmin2["default"].auth().createCustomToken(serviceAccount.custom_server_auth_uid).then(function (customToken) {
      resolve(customToken);
    })["catch"](function (error) {
      console.log("Error creating custom token:", error);
      reject(error);
    });
  });
};
exports.getAuthToken = getAuthToken;