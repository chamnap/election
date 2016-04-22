var XLSX = require('xlsx');

var Province = function(name, path) {
  this.name = name;
  this.path = path;
  this.workbook = XLSX.readFile(this.path);
};

Province.prototype = {
};

module.exports = Province;