import express from "express";
import https from "https";
import { renderHTML } from "./render-jsx";

const app = express();

app
.get("/", function (req, res) {
  const subdomain = req.headers.host.match(/^([a-z0-9]*)/i)[1];

  console.log("Sub Domain:", subdomain);
  res.send(`Sub Domain Test: ${subdomain}`);
});

export default app;
