"use strict";

var firebase = require("firebase");
var env = {
  PORT: 8080,
  NODE_ENV: "dev",
  API_KEY: "AIzaSyCKZDymYonde07sD7vMu7RukYhGwau1mm4",
  AUTH_DOMAIN: "bubble-13387.firebaseapp.com",
  DATABASE_URL: "https://bubble-13387.firebaseio.com",
  STORAGE_BUCKET: "bubble-13387.appspot.com",
  MESSAGING_SENDER_ID: "766141212604",
  V_MAJOR: 0,
  V_MINOR: 6,
  V_PATCH: 0
};
var data = {
  apiKey: env["API_KEY"],
  authDomain: env["AUTH_DOMAIN"],
  databaseURL: env["DATABASE_URL"],
  storageBucket: env["STORAGE_BUCKET"],
  messagingSenderId: env["MESSAGING_SENDER_ID"]
};
var config = data;
Firebase.initializeApp(config);
var ref = {
  root: Firebase.database().ref(),
  appConfigRef: Firebase.database().ref("appConfig"),
  usersRef: Firebase.database().ref("users"),
  questionsRef: Firebase.database().ref("questions"),
  answersRef: Firebase.database().ref("answers"),
  ratingsRef: Firebase.database().ref("ratings"),
  commentsRef: Firebase.database().ref("comments"),
  AMAsRef: Firebase.database().ref("AMAs"),
  pollsRef: Firebase.database().ref("polls")
};
var fireRef = ref;

fireRef.questionsRef.orderByKey().limitToLast(2).once("value").then(function (snap) {
  var answers = snap.val();

  var questions = {};
});