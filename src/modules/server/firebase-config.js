import Firebase from "firebase";
import admin from "firebase-admin";
import { logOut } from "../../log-out";

let serviceAccount;

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

export const initFirebase = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env["DATABASE_URL"] || "https://bubble-13387.firebaseio.com"
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
    gameQueuesRef: admin.database().ref("gameQueues"),
  };
  return (ref);
}

export const getAuthToken = () => {
  return new Promise(function(resolve, reject) {
    admin.auth().createCustomToken(serviceAccount.custom_server_auth_uid)
    .then(function(customToken) {
      resolve(customToken);
    })
    .catch(function(error) {
      console.log("Error creating custom token:", error);
      reject(error);
    });
  });
}
