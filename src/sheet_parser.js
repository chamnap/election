var Commune = require('./commune');

var SheetParser = function(worksheet) {
  this.worksheet  = worksheet;
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

    return new Commune(hash);
  },

  getStations: function() {
    var stations = [];
    var rowNumber;
    if (this.isStartOfPage()) {
      var b10 = this.worksheet.getCell('B10').value;
      var b11 = this.worksheet.getCell('B11').value;
      rowNumber = (b10 == 'TI01') ? 11 : 12;
    } else {
      rowNumber = 7;
    }

    for(var i=rowNumber; i<this.worksheet._rows.length; i++) {
      var row = this.worksheet.getRow(i);
      var station = {
        number:     this.atReverseIndex(row.values, -16),
        t1:         this.atReverseIndex(row.values, -15),
        t2:         this.atReverseIndex(row.values, -14),
        t3:         this.atReverseIndex(row.values, -13),
        t4:         this.atReverseIndex(row.values, -12),
        t5:         this.atReverseIndex(row.values, -11),
        t6:         this.atReverseIndex(row.values, -10),
        t7:         this.atReverseIndex(row.values, -9),
        t8:         this.atReverseIndex(row.values, -8),
        t9:         this.atReverseIndex(row.values, -7),
        t10:        this.atReverseIndex(row.values, -6),
        t11:        this.atReverseIndex(row.values, -5),
        useful:     this.atReverseIndex(row.values, -4),
        notUseful:  this.atReverseIndex(row.values, -2),
        totalInBox: this.atReverseIndex(row.values, -1),
        name:       row.values[1],
      };

      stations.push(station);
    }

    return stations;
  },

  atReverseIndex: function(array, index) {
    return array[array.length + index];
  },

  isStartOfPage: function() {
    var result = false;

    this.worksheet.getSheetValues().forEach(function(array) {
      if (array.indexOf('TI01') > 0) { // district sheet has T01, T02
        result = true;
      }
    });

    return result;
  }
};

module.exports = SheetParser;