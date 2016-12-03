var fs = require("fs");

var transNewData = function (data, filename) {
  var parsings = data;
  var parser = /^([\s]+)?(var|let|const)?([\s]+)?([a-z=\s:]+)(\()(.+)?(\))([\s]+)?([\n]+)?(\{)/;

  var typeMaker = function(type, line) {
    var match = type.match(/:\s(Object|Array|String|Bool|Func|Int|Float)/);
    var returnValue = match;
    var variable = type.replace(/^\s+/, "").match(/^[a-z\_]+(\s+=\s+)?/i)[0];
    // console.log("VARIABLE", variable);
    console.log("SHOEHORN", type, match);
    if(match) {
      returnValue = `shoehorn({ lineNumber: ${line}, variableName: "${variable}" }).${match[1]}(${variable}); `;
    }
    return [returnValue, variable];
  };

  var toParse = parsings.split(/\n/).map((str, line) => {
    var match = str.match(parser);
    if(match) {
      console.log(match);
      var newStr = str.replace(parser, (_0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10) => {
        var new_6 = _6, new_10 = _10;
        if(_4.match("function") && _6) {
          var args = _6.split(/,\s+?/);
          // console.log(_6, args);
          var newArgs = args.map(arg => {
            var checked = typeMaker(arg, line);
            var typeCheckingStr = checked[0];
            var variable = checked[1];
            // console.log(typeCheckingStr);
            if(!typeCheckingStr) {
              // console.error(new Error(`Line ${line}: no matching type provided for ${arg}${filename ? ` in file ${filename}` : ""}`).stack);
            } else {
              new_10 += typeCheckingStr;
            }
            return variable;
          });
          new_6 = newArgs.join(", ").replace(/,\s+?$/, "");
          // console.log("ARGS", args, new_6);
        }

        return `${_1 || ""}${_2 || ""}${_3 || ""}${_4 || ""}${_5 || ""}${new_6 || ""}${_7 || ""}${_8 || ""}${_9 || ""}${new_10 || ""}`;
      });
      // console.log(newStr);
      return newStr;
    } else {
      return str;
    }
  });
  // console.log("\n\r\n\rNew output");
  var parsed = toParse.join("\n");
  var newData = `var shoehorn = require("shoehornjs");
${parsed}`;
  // console.log(newData);
  return newData;
};

var writeNewData = function (filepath, data) {
  fs.writeFile(__dirname + "/dist/" + filepath, data, function (err) {
    if(err) {
      return console.error(err.stack || err);
    }
  });
}

var getData = function (filepath, cb) {
  fs.readFile(__dirname + "/dist/" + filepath, "utf-8", function (err, data) {
    if(err) {
      return console.error(err.stack || err);
    }
    var newData = transNewData(data, filepath);
    writeNewData(filepath, newData);
    if(typeof cb === "function") cb(filepath);
  });
}

module.exports = getData;
