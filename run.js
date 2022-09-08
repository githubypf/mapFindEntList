var fs = require("fs"); //文件模块
var path = require("path"); //系统路径模块
const booleanPointInPolygon = require("@turf/boolean-point-in-polygon").default;
var turf = require("@turf/helpers");
var xlsx = require("node-xlsx");
const json2xls = require("json2xls");

const handle = (item, result, type, callback) => {
  try {
    var pt = turf.point([item.lng, item.lat]);
    let a = booleanPointInPolygon(pt, result);
    if (a) {
      item.type = type;
      callback(item);
    }
  } catch (error) {
    console.log(error);
  }
};

fs.readFile("./json/ent_data.json", "utf8", (err, data) => {
  let entList = JSON.parse(data);

  let readList = ["片区", "区县", "乡镇", "园区"];

  readList.forEach((title) => {
    fs.readFile(`./json/${title}.json`, "utf8", (err, data1) => {
      let list = JSON.parse(data1);
      list.forEach((result) => {
        let jsonArray = [];
        entList.forEach((item, index) => {
          handle(item, result, result.properties.Name, (result) => {
            jsonArray.push(result);
          });
        });
        if (!jsonArray.length) {
          return;
        }
        var file = path.join(
          __dirname,
          `/export/${title}/${result.properties.Name}.xlsx`
        );
        let xls = json2xls(jsonArray);
        fs.writeFileSync(file, xls, "binary");
        console.log(title, result.properties.Name);
      });
    });
  });
});
