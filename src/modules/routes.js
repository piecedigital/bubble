import express from "express";
import { renderHTML } from "./render-jsx";

const app = express();

app
.get("/", function (req, res) {
  res.send(renderHTML("home", {
    auth: {
      access_token: req.cookies["access_token"]
    }
  }));
})
.get("/search/:searchtype", function (req, res) {
  res.send(renderHTML("search", {
    query: {
      q: req.query.q || req.query.query
    }
  }));
})
.get("/profile", function (req, res) {
  res.send(renderHTML("profile"));
})
.get("/streams", function (req, res) {
  res.send(renderHTML("general-page", {
    page: "streams"
  }));
})
.get("/games", function (req, res) {
  res.send(renderHTML("general-page", {
    page: "games"
  }));
})
.get("/get-test-data", function (req, res) {
  res.json({
    title: "Burst or Blow | Bubble",
    who: "WORLD"
  });
})
.get("*", function (req, res) {
  res.status(404).send("not found");
});

export default app;
