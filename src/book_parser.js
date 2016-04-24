var Excel = require('exceljs');
var _     = require('lodash');
var fs    = require('fs');

var SheetParser = require('./sheet_parser');
var Province    = require('./province');
var District    = require('./district');

var BookParser = function(name, path) {
  this.name     = name;
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

        self.writeJSON();
      });
  },

  // http://stackoverflow.com/questions/13859218/nodejs-how-to-make-function-fs-writefile-write-with-bom
  writeJSON: function() {
    fs.writeFile('json/' + this.name + '.json', '\ufeff' + JSON.stringify(this.province, null, 2));
  },

  setAttributes: function() {
    var self = this;
    var districts = [];
    var district, commune, totalProvince;

    this.workbook.eachSheet(function(worksheet) {
      var sheetParser   = new SheetParser(worksheet);
      var districtName  = sheetParser.getDistrictName();
      var stations      = sheetParser.getStations();
      var totalCommune  = sheetParser.getTotalCommune();
      var totalDistrict = sheetParser.getTotalDistrict();
      totalProvince     = sheetParser.getTotalProvince();

      if (sheetParser.isStartOfPage()) {
        commune        = sheetParser.getCommune();
      }

      if (districtName) {
        district = new District(districtName);
      }

      if (district && commune) {
        district.addCommune(commune);
      }

      if (district) {
        if (totalDistrict) {
          district.setTotal(totalDistrict);
        }
      }

      if (commune) {
        commune.addStations(stations);

        if (totalCommune) {
          commune.setTotal(totalCommune);
        }
      }

      if (districtName) {
        districts.push(district);
      }
    });

    this.province = new Province(this.name);
    this.province.setDistricts(districts);
    this.province.setTotal(totalProvince);
  }
};

module.exports = BookParser;