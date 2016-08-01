import express from "express";
import { renderHTML } from "./render-jsx";

const app = express();

app
.get("/", function (req, res) {
  console.log(req.cookies);
  res.send(renderHTML("home", {
    auth: {
      access_token: req.cookies["access_token"]
    }
  }));
})
.get("/profile", function (req, res) {
  res.send(renderHTML("profile"));
})
.get("/get-test-data", function (req, res) {
  res.json({
    title: "Burst or Blow | Bubble",
    who: "WORLD"
  });
});

export default app;
