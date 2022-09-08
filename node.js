const ExcelJS = require("exceljs");
const shapefile = require("shapefile");
const turf = require("turf");
const encoding = require("encoding");
const RECORDS = [];
var fs = require("fs"); //文件模块
var path = require("path"); //系统路径模块

(async () => {
  // 读取excel
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(__dirname + "/合并.xlsx");
  const sheet = workbook.worksheets[0];
  let field = [];
  sheet.eachRow(function (row, rowNumber) {
    if (rowNumber == 1) {
      field = row.values;
    } else {
      let user = {};
      row.values.forEach((item, index) => {
        user[field[index]] = item;
      });
      RECORDS.push(user);
    }
  });

  var file = path.join(__dirname, "/json/ent_data.json");
  var content = JSON.stringify(RECORDS);

  fs.writeFile(file, content, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("文件创建成功，地址：" + file);
  });
})();
