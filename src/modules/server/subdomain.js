export default function ({ whiteList, blackList }, routes) {
  return function (req, res, next) {
    let blackListClear = true;

    // console.log(req.headers);
    let { host } = req.headers;
    // console.log("\n\r\n\r");
    // console.log("host", host);

    const whiteListCheck = whiteList.map(str => {
      const regMatch = new RegExp(`(\.)?${str}$`, "i");
      host = host.replace(regMatch, "");
      // console.log("regMatch", regMatch);
    });
    // console.log("new host", `"${host}"`);

    const subdomainExists = !!host;
    // console.log("subdomain exists", subdomainExists);
    // console.log("blacklist checking");
    const blackListCheck = blackList.map(str => {
      const regMatch = new RegExp(`${str}`, "i");
      const theMatch = !!host.match(regMatch);
      // console.log("regMatch", regMatch);
      // console.log("theMatch", theMatch);
      return theMatch;
    });
    // console.log(blackListCheck);
    if(blackListCheck.indexOf(true) > -1) blackListClear = false;
    // console.log("blacklist clear", blackListClear);

    if(subdomainExists && blackListClear) {
      // console.log("lists cleared");
      console.log("headed to subdomain:", host);
      return routes(req, res, next);
    } else {
      // console.log("normal routes");
      next();
    }
  }
}
