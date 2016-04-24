var Excel = require('exceljs');

var Province = function(name, path) {
  this.name = name;
  this.path = path;
  this.workbook = new Excel.Workbook();
};

module.exports = Province;