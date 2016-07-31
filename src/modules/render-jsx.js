import React from "react";
import RDS from "react-dom/server";

export const renderHTML = function(fileName, prePlaceData = {
  title: "Burst or Blow | Bubble",
  who: "WORLD"
}) {
  var Layout = require(`../views/jsx/layout.jsx`);
  var Page = require(`../views/jsx/${fileName}.jsx`);

  let data = RDS.renderToString(
    <Layout data={prePlaceData}>
      <Page data={prePlaceData} />
    </Layout>
  );
  return `<!DOCTYPE html><html><head><meta charSet="utf-8" /><title>${prePlaceData.title}</title></head><body><div class="react-app">${data}</div><script src="/js/bundle.js"></script></body></html>`;
};
// console.log(renderHTML("home"));
