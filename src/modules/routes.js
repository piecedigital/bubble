import express from "express";
import { renderHTML } from "./render-jsx";

const app = express();

app
.get("/", function (req, res) {
  res.send(renderHTML("home"))
});

export default app;
