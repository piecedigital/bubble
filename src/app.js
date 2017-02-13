import express from "express";
import https from "https";
import path from "path";
import cookieParser from "cookie-parser";
import subdomain from "./modules/server/subdomain";
import routes from "./modules/server/routes";
import subdomainRoutes from "./modules/server/subdomain-routes";
import { logOut } from "./log-out";

console.log("Environment:", process.env["NODE_ENV"]);
console.log("App version:", `${process.env["V_MAJOR"]}.${process.env["V_MINOR"]}.${process.env["V_PATCH"]}`);

const app = express();
const PORT = process.env["PORT"] || 8080;

// // let's encrypt
// const letsEncryptReponse = process.env.CERTBOT_RESPONSE;
// const letsEncryptReponse2 = process.env.CERTBOT_RESPONSE2;
//
// // Return the Let's Encrypt certbot response:
// app.get('/.well-known/acme-challenge/:content', function(req, res) {
//   if(req.headers.host.match("www")) {
//     // www.amorrius.net
//     res.send(letsEncryptReponse2);
//   } else {
//     // amorrius.net
//     res.send(letsEncryptReponse);
//   }
// });
// // end let's encrypt

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
// redirect to HTTPS, if on production server
// app.use(function(req, res, next) {
//   // only do this if we're on the production server
//   console.log(req.protocol, req.url);
//   if(process.env["NODE_ENV"] === "prod") {
//     if(!req.secure || req.protocol === "http") {
//       console.log("not secure");
//       res.redirect(301, "https://" + req.headers['host'] + req.url );
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// });
app.use( subdomain({
  whiteList: ["amorrius.dev", "amorrius.net"],
  blackList: ["www", "twinchill"],
}, subdomainRoutes) );
app.use(routes);

app.listen(PORT);

logOut(`Listening on port ${PORT}`, true);

process.on('uncaughtException', function (err) {
  logOut("**Uncaught Exception event**", true, {
    type: "error"
  });
  logOut(err, true, {
    type: "error"
  });
});
