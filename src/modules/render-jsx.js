import React from "react";
import RDS from "react-dom/server";

export const renderHTML = function(fileName, prePlaceData = {}) {
  prePlaceData.title = prePlaceData.title || "Q&A Aggregator for Twitch streamers | TwiQuA"
  var Layout = require(`../views/jsx/layout.jsx`);
  var Page = require(`../views/jsx/${fileName}.jsx`);

  let data = RDS.renderToStaticMarkup(
    <html>
      <head>
        <meta charSet="utf-8" />
        <link rel="stylesheet" href="/css/style.css" media="screen" title="no title" charSet="utf-8"/>
        <title>{prePlaceData.title}</title>
      </head>
      <body>
        <div className="react-app">
          <Layout {...prePlaceData}>
            <Page />
          </Layout>
        </div>
        <script src="/js/bundle.js"></script>
      </body>
    </html>
  );
  return `<!DOCTYPE html>${data}`;
};
// console.log(renderHTML("home"));
