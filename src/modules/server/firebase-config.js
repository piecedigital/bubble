import Firebase from "firebase";
import admin from "firebase-admin";
import { logOut } from "../../log-out";

let serviceAccount;

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

export const initFirebase = () => {
  Firebase.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env["DATABASE_URL"]
  });
  const ref = {
    root: Firebase.database().ref(),
    authTokensRef: Firebase.database().ref("authTokens"),
    appConfigRef: Firebase.database().ref("appConfig"),
    usersRef: Firebase.database().ref("users"),
    notificationsRef: Firebase.database().ref("notifications"),
    questionsRef: Firebase.database().ref("questions"),
    answersRef: Firebase.database().ref("answers"),
    ratingsRef: Firebase.database().ref("ratings"),
    commentsRef: Firebase.database().ref("comments"),
    AMAsRef: Firebase.database().ref("AMAs"),
    pollsRef: Firebase.database().ref("polls"),
  };
  return (ref);
}
