const fs = require("fs");

module.exports = {
  writeFile: (path, body) => {
    fs.writeFile(path, body, function (err) {
      if (err) {
        console.log(err);
      }
    });
  },

  handleJson: (array) => {
    const flat = array.flat();
    const result = [];

    if (fs.existsSync("./log.json")) {
      const r = module.exports.executeJSON(flat);
      result.push(r);
    } else {
      module.exports.writeFile("./log.json", JSON.stringify(flat));
    }

    return result;
  },

  executeJSON: (data) => {
    const file = fs.readFileSync("./log.json");
    if (file.length > 0) {
      const dataFileParser = JSON.parse(file.toString());

      const engsAPI = data.map((res) => res.eng);
      const engsFile = dataFileParser.map((res) => res.eng);

      const engsResult = engsAPI.filter((x) => {
        return JSON.stringify(engsFile).lastIndexOf(JSON.stringify(x)) < 0;
      });

      module.exports.writeFile("./log.json", JSON.stringify(data));

      return engsResult;
    } else {
      module.exports.writeFile("./log.json", JSON.stringify(data));
    }
  },
};
