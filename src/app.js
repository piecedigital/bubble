import express from "express";
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

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
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
