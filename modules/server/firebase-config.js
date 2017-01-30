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
  serviceAccount = require("../../private/bubble-13387-firebase-adminsdk-cbrvg-5186dc4eb2.json");
} catch (e) {
  serviceAccount = {
    "type": process.env["SERV_ACC_TYPE"],
    "project_id": process.env["SERV_ACC_PROJECT_ID"],
    "private_key_id": process.env["SERV_ACC_PRIV_KEY_ID"],
    "private_key": process.env["SERV_ACC_PRIV_KEY"],
    "client_email": process.env["SERV_ACC_CLIENT_EMAIL"],
    "client_id": process.env["SERV_ACC_CLIENT_ID"],
    "auth_uri": process.env["SERV_ACC_AUTH_URI"],
    "token_uri": process.env["SERV_ACC_TOKEN_URI"],
    "auth_provider_x509_cert_url": process.env["SERV_ACC_PROVIDER_CERT"],
    "client_x509_cert_url": process.env["SERV_ACC_CLIENT_CERT"]
  };
}

var initFirebase = function initFirebase() {
  console.log("service accoutn", JSON.parse(JSON.stringify(serviceAccount)));
  _firebaseAdmin2["default"].initializeApp({
    credential: _firebaseAdmin2["default"].credential.cert(JSON.parse(JSON.stringify(serviceAccount))),
    databaseURL: process.env["DATABASE_URL"]
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
    pollsRef: _firebaseAdmin2["default"].database().ref("polls")
  };
  return ref;
};
exports.initFirebase = initFirebase;