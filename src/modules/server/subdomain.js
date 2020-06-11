export default function ({ whiteList, blackList }, routes) {
  return function (req, res, next) {
    let blackListClear = true;

    let { host } = req.headers;

    const whiteListCheck = whiteList.map(str => {
      const regMatch = new RegExp(`(\.)?${str}$`, "i");
      host = host.replace(regMatch, "");
      console.log(host);
    });

    const subdomainExists = !!host;
    const blackListCheck = blackList.map(str => {
      const regMatch = new RegExp(`${str}`, "i");
      const theMatch = !!host.match(regMatch);
      return theMatch;
    });

    if(blackListCheck.indexOf(true) > -1) blackListClear = false;

    if(subdomainExists && blackListClear) {
      console.log("headed to subdomain:", host);
      return routes(req, res, next);
    } else {
      next();
    }
  }
}
