import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import routes from "./modules/routes";
import { logOut } from "./log-out";

const app = express();
const PORT = process.env["PORT"] || 8080;

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(routes);

app.listen(PORT);
logOut(`Listening on port ${PORT}`, true);

process.on('uncaughtException', function (err) {
  logOut("**Uncaught Exception event**", true, {
    type: "error"
  });
});
