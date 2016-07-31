import express from "express";
import { renderHTML } from "./render-jsx";

const app = express();

app
.get("/", function (req, res) {
  res.send(renderHTML("home"));
})
.get("/get-test-data", function (req, res) {
  res.json({
    title: "Burst or Blow | Bubble",
    who: "WORLD"
  });
});

export default app;
