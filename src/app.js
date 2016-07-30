import express from "express";
import routes from "./modules/routes";
import { logOut } from "./log-out";

const app = express();
app.use(routes);
const PORT = process.env["PORT"] || 8080;

app.listen(PORT);
// console.log(__dirname);
logOut(`Listening on port ${PORT}`, true);
