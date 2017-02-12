import express from "express";
import subdomain from "express-subdomain";
import path from "path";
import cookieParser from "cookie-parser";
import routes from "./modules/server/routes";
import subdomainRoutes from "./modules/server/subdomain-routes";
import { logOut } from "./log-out";

console.log("Environment:", process.env["NODE_ENV"]);
console.log("App version:", `${process.env["V_MAJOR"]}.${process.env["V_MINOR"]}.${process.env["V_PATCH"]}`);

const app = express();
const PORT = process.env["PORT"] || 8080;

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(subdomain("www", routes));
app.use(subdomain("twinchill", routes));
app.use(subdomain("*", subdomainRoutes));
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
