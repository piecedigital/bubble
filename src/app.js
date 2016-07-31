import express from "express";
import path from "path";
import routes from "./modules/routes";
import { logOut } from "./log-out";

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(routes);
const PORT = process.env["PORT"] || 8080;

app.listen(PORT);
logOut(`Listening on port ${PORT}`, true);
