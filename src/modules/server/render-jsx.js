import React from "react";
import RDS from "react-dom/server";

export const renderHTML = function(fileName, prePlaceData = {}) {
  prePlaceData.title = prePlaceData.title || "Q&A Aggregator for Twitch streamers | TwiQuA"
  var Layout = require(`../../views/jsx/layout.jsx`);
  var Page = require(`../../views/jsx/${fileName}.jsx`);

  let data =
  `<html>`+
    `<head>`+
      `<meta charSet="utf-8" />`+
      `<meta httpEquiv="Content-Type" content="text/html" charSet="UTF-8" />`+
      `<meta name="language" content="en-us" />`+
      `<meta name="publisher" content="Piece Digital Studios" />`+
      `<meta name="classification" content="multistream, multiple stream, multiple broadcast viewing, question and answer aggregation" />`+
      `<meta property="og:description" content="Watch your favorite Twitch.tv livestreams, multistream various Twitch streams, and aggregate questions for a great Q&A session."/>`+
      `<link rel="stylesheet" href="/css/style.css" media="screen" title="no title" charSet="utf-8"/>`+
      `<link rel="shortcut icon" type="image/x-icon" href="/media/logo-png.png"/>`+
      `<link rel="apple-touch-icon" type="image/x-icon" href="/media/logo-png.png"/>`+
      `<title>${prePlaceData.title}</title>`+
    `</head>`+
    `<body>`+
      `<div class="react-app">`+
        RDS.renderToStaticMarkup(
          <Layout {...prePlaceData}>
            <Page />
          </Layout>
        )+
      `</div>`+
      `<script src= "https://player.twitch.tv/js/embed/v1.js"></script>`+
      `<script src=${`/js/bundle${process.env["NODE_ENV"] === "prod" ? "-live" : ""}.js`}></script>`+
    `</body>`+
  `</html>`;
  return `<!DOCTYPE html>${data}`;
};
// console.log(renderHTML("home"));

// <meta name="creator" content="Darryl Dixon, Piece Digital" />
// <meta name="robots" content="index, follow" />
// <meta name="revisit-after" content="21 days" />
// <meta property="og:url" content="http://piecedigital.net/"/>
// <meta property="og:title" content="Piece Digital"/>
// <meta property="og:image" content="http://piecedigital.net/public/images/1logo.png"/>
// <meta property="og:site_name" content="Piece Digital Studios"/>
