var Excel = require('exceljs');
var Q     = require('q');
var _     = require('lodash');
var fs    = require('fs');

var HtmlParser  = require('./html_parser');
var SheetParser = require('./sheet_parser');
var Province    = require('./province');
var District    = require('./district');

var BookParser = function(province) {
  this.province   = province;
  this.workbook   = new Excel.Workbook();
  this.htmlParser = new HtmlParser(province);

  var stationsPath = this.province.getStationsPath();
  if(fs.existsSync(stationsPath)) {
    this.stations   = require(stationsPath);
  } else {
    this.stations   = [];
  }
};

BookParser.prototype = {
  parseAndSave: function() {
    var self     = this;
    var deferred = Q.defer();

    this.workbook.xlsx
      .readFile(this.province.getExcelPath())
      .then(function() {
        self.setAttributes();
        self.updateStations();
        self.writeJSON();

        deferred.resolve();
      });

    return deferred.promise;
  },

  updateStations: function() {
    var self      = this;

    self.province.getStations().forEach(function(station) {
      var foundStation = self.findStation(station.number);
      if (foundStation && _.startsWith(foundStation.name, station.name)) {
        station.name = foundStation.name;
      } else {
        console.log("station not found: " + station.number);
      }
    });
  },

  findStation: function(id) {
    return _.find(this.stations, function(station) { return station.id === id; });
  },

  // http://stackoverflow.com/questions/13859218/nodejs-how-to-make-function-fs-writefile-write-with-bom
  writeJSON: function() {
    fs.writeFileSync(this.province.getJsonPath(), '\ufeff' + JSON.stringify(this.province, null, 2));
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