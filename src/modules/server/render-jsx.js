import React from "react";
import RDS from "react-dom/server";

export const renderHTML = function(fileName, prePlaceData = {}) {
  prePlaceData.title = prePlaceData.title || "Q&A Aggregator for Twitch streamers | Amorrius"
  var Layout = require(`../../views/jsx/layout.jsx`);
  var Page = require(`../../views/jsx/${fileName}.jsx`);

  let data =
  `<html>`+
    `<head>`+
      `<meta charSet="utf-8" />`+
      // key seo
      `<title>${prePlaceData.title}</title>`+
      `<meta property="og:title" content="${prePlaceData.title}"/>`+
      `<meta property="description" content="${prePlaceData.description || "Watch your favorite Twitch.tv livestreams, multistream various Twitch streams, and aggregate questions for a great Q&A session."}"/>`+
      `<meta property="og:description" content="${prePlaceData.description || "Watch your favorite Twitch.tv livestreams, multistream various Twitch streams, and aggregate questions for a great Q&A session."}"/>`+
      `<meta property="og:image" content="${prePlaceData.image || ""}"/>`+
      // other
      `<meta httpEquiv="Content-Type" content="text/html" charSet="UTF-8" />`+
      `<meta name="language" content="en-us" />`+
      `<meta name="publisher" content="Piece Digital Studios" />`+
      `<meta name="classification" content="multistream, multiple stream, multiple broadcast viewing, question and answer aggregation" />`+
      `<link rel="stylesheet" href="/css/style.css" media="screen" title="no title" charSet="utf-8"/>`+
      `<link rel="shortcut icon" type="image/x-icon" href="/media/logo-png.png"/>`+
      `<link rel="apple-touch-icon" type="image/x-icon" href="/media/logo-png.png"/>`+
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
