var sprintf = require('sprintf-js').sprintf;
var _       = require('lodash');
var Cell    = require('exceljs/lib/doc/cell');

var abc     = require('./abc');
var Commune = require('./commune');

var SheetParser = function(worksheet, skipParties) {
  this.worksheet    = worksheet;
  this.skipParties  = skipParties;
};

SheetParser.prototype = {
  getDistrictName: function() {
    if (!this.isStartOfPage()) {
      return;
    }

    var a7 = this.worksheet.getCell('A7').value;
    var a8 = this.worksheet.getCell('A8').value;
    var b7 = this.worksheet.getCell('B7').value;
    var b8 = this.worksheet.getCell('B8').value;

    var name;
    if (a7 && a8 && a8.match(/^\d{2}-\d{3}$/)) {
      name = a7;
    }

    if (b7 && b8 && b8.match(/^\d{2}-\d{3}$/)) {
      name = b7;
    }

    if (name) {
      name = abc(name);
    }

    return name;
  },

  getCommune: function() {
    if (!this.isStartOfPage()) {
      return;
    }

    var a8 = this.worksheet.getCell('A8').value;
    var b8 = this.worksheet.getCell('B8').value;
    var c8 = this.worksheet.getCell('C8').value;
    var a7 = this.worksheet.getCell('A7').value;
    var b7 = this.worksheet.getCell('B7').value;
    var c7 = this.worksheet.getCell('C7').value;

    var hash = {};
    if (a8) {
      hash = { id: a8, name: b8 };
    } else if (b8) {
      hash = { id: b8, name: c8 };
    } else if (a7) {
      hash = { id: a7, name: b7 };
    } else {
      hash = { id: b7, name: c7 };
    }
    hash.name = abc(hash.name);

    return new Commune(hash.id, hash.name);
  },

  getStation: function(values) {
    var self = this;
    var station = {
      name:       values[0],
      number:     values[1]
    };

    // set station
    var keys = ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 'useful', 'notUseful', 'totalInBox'];
    keys.forEach(function(key, index) {
      station[key] = self.atReverseIndexofArray(values, -(14 - index));
    });

    // reset value before skipParties
    if (this.skipParties) {
      this.skipParties.concat().reverse().forEach(function(skipParty) {
        var indexKey = _.findIndex(keys, function(key) { return key === skipParty; });
        station[skipParty] = null;

        for(var i=0; i<indexKey; i++) {
          station[keys[i]] = self.atReverseIndexofArray(values, -(14 - self.skipParties.length - i));
        }
      });
    }

    if (station.number) {
      var number = parseInt(station.number);
      if (_.isNaN(number)) {
        station.name   = values[0] + values[1];
        station.number = sprintf("%04d", parseInt(values[2]));
      } else {
        station.number = sprintf("%04d", parseInt(station.number));
      }
    }

    if (station.name) {
      station.name = abc(station.name);
    }

    return station;
  },

  // Filter out total, total_district, total_province
  getStations: function() {
    return _.reject(this.getAllStations(), function(station) { return _.startsWith(station.name, 'សរុប'); });
  },

  getAllStations: function() {
    if (this._stations) {
      return this._stations;
    }

    this._stations = [];
    var rowNumber;
    if (this.isStartOfPage()) {
      rowNumber = _.findIndex(this.worksheet._rows, function(row) {
        return row.values.indexOf('TI01') > -1 || row.values.indexOf('T01') > -1;
      });
      rowNumber += 2;
    } else {
      rowNumber = 7;
    }

    for(var i = rowNumber; i < this.worksheet._rows.length; i++) {
      var row     = this.worksheet.getRow(i);
      var values  = this.getRowValues(row);

      if(values.length > 0) {
        var station = this.getStation(values);
        this._stations.push(station);
      }
    }

    return this._stations;
  },

  getTotalCommune: function() {
    return _.find(this.getAllStations(), function(station) { return station.name == 'សរុប'; });
  },

  getTotalDistrict: function() {
    return _.find(this.getAllStations(), function(station) { return station.name == 'សរុបស្រុក'; });
  },

  getTotalProvince: function() {
    return _.find(this.getAllStations(), function(station) { return station.name == 'សរុបខេត្ដ'; });
  },

  getRowValues: function(row) {
    var values = [];
    row.eachCell(function(cell, index) {
      if (cell.type !== Cell.Types.Merge) {
        values.push(cell.value);
      }
    });
    var intItems = this.intArray(values.slice(1, values.length).join(' ').split(' '));
    values = [values[0]].concat(intItems);

    return this.compactArray(values);
  },

  compactArray: function(array) {
    return _.filter(array, function(value) { return (value !== '' && !!value) || value === 0; });
  },

  intArray: function(array) {
    var result = [];

    _(array).forEach(function(value) {
      var intValue = parseInt(value.replace(/,/, ''));
      if (_.isNaN(intValue)) {
        result.push(value);
      } else {
        result.push(intValue);
      }
    });

    return result;
  },

  atReverseIndexofArray: function(array, index) {
    return array[array.length + index];
  },

  isStartOfPage: function() {
    var result = false;

    this.worksheet.getSheetValues().forEach(function(array) {
      if (array.indexOf('TI01') > 0 || array.indexOf('T01') > 0) { // district sheet has T01, T02
        result = true;
      }
    });

    return result;
  }
};

module.exports = SheetParser;