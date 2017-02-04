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
    "private_key": decodeURI(process.env["SERV_ACC_PRIV_KEY"]),
    "client_email": process.env["SERV_ACC_CLIENT_EMAIL"],
    "client_id": process.env["SERV_ACC_CLIENT_ID"],
    "auth_uri": process.env["SERV_ACC_AUTH_URI"],
    "token_uri": process.env["SERV_ACC_TOKEN_URI"],
    "auth_provider_x509_cert_url": process.env["SERV_ACC_PROVIDER_CERT"],
    "client_x509_cert_url": process.env["SERV_ACC_CLIENT_CERT"]
  };
}

export const initFirebase = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env["DATABASE_URL"]
  });
  const ref = {
    root: admin.database().ref(),
    authTokensRef: admin.database().ref("authTokens"),
    appConfigRef: admin.database().ref("appConfig"),
    usersRef: admin.database().ref("users"),
    notificationsRef: admin.database().ref("notifications"),
    questionsRef: admin.database().ref("questions"),
    answersRef: admin.database().ref("answers"),
    ratingsRef: admin.database().ref("ratings"),
    commentsRef: admin.database().ref("comments"),
    AMAsRef: admin.database().ref("AMAs"),
    pollsRef: admin.database().ref("polls"),
    gameQueuesRef: Firebase.database().ref("gameQueues"),
  };
  return (ref);
}
