var Excel = require('exceljs');
var Q     = require('q');
var _     = require('lodash');
var fs    = require('fs');

var SheetParser = require('./sheet_parser');
var Province    = require('./province');
var District    = require('./district');

var BookParser = function(province) {
  this.province = province;
  this.workbook = new Excel.Workbook();
};

BookParser.prototype = {
  parseAndSave: function() {
    var self     = this;
    var deferred = Q.defer();

    this.workbook.xlsx
      .readFile(this.province.getExcelPath())
      .then(function() {
        self.setAttributes();
        self.writeJSON();

        deferred.resolve();
      });

    return deferred.promise;
  },

  // http://stackoverflow.com/questions/13859218/nodejs-how-to-make-function-fs-writefile-write-with-bom
  writeJSON: function() {
    fs.writeFileSync('output/' + this.province.name + '.json', '\ufeff' + JSON.stringify(this.province, null, 2));
  },

  setAttributes: function() {
    var self = this;
    var districts = [];
    var district, commune, totalProvince;

    this.workbook.eachSheet(function(worksheet) {
      var sheetParser   = new SheetParser(worksheet, self.province.skipParties);
      var districtName  = sheetParser.getDistrictName();
      var stations      = sheetParser.getStations();
      var totalCommune  = sheetParser.getTotalCommune();
      var totalDistrict = sheetParser.getTotalDistrict();
      totalProvince     = sheetParser.getTotalProvince();

      // commune
      if (sheetParser.isStartOfPage()) {
        commune        = sheetParser.getCommune();
      }
      if (commune) {
        commune.addStations(stations);

        if (totalCommune) {
          commune.setTotal(totalCommune);
        }
      }

      // district
      if (districtName) {
        district = new District(districtName);
      }

      if (district && sheetParser.getCommune()) {
        district.addCommune(commune);
      }

      if (district) {
        if (totalDistrict) {
          district.setTotal(totalDistrict);
        }
      }

      if (districtName) {
        districts.push(district);
      }
    });

    this.province.setDistricts(districts);
    this.province.setTotal(totalProvince);
  }
};

module.exports = BookParser;