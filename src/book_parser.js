var Excel = require('exceljs');
var _     = require('lodash');
var khmerConverter = require('khmer-unicode-converter');

var SheetParser = require('./sheet_parser');
var District    = require('./district');

var BookParser = function(path) {
  this.path     = path;
  this.workbook = new Excel.Workbook();
};

BookParser.prototype = {
  parse: function() {
    var self = this;

    this.workbook.xlsx
      .readFile(this.path)
      .then(function() {
        self.setAttributes();

        console.log(self.attributes[0].communes[0]);
      });
  },

  setAttributes: function() {
    var self = this;
    var districts = [];
    var district, commune;

    this.workbook.eachSheet(function(worksheet) {
      var sheetParser  = new SheetParser(worksheet);
      var districtName = sheetParser.getDistrictName();
      commune          = sheetParser.getCommune();
      var stations     = sheetParser.getStations();

      if (districtName) {
        district = new District(districtName);
      }

      if (commune && district) {
        district.addCommune(commune);
      }

      if (stations.length > 0 && commune) {
        commune.addStations(stations);
      }

      if (districtName) {
        districts.push(district);
      }
    });

    this.attributes = districts;
  }
};

module.exports = BookParser;