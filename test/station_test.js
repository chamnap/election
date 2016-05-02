'use strict';

var expect    = require('chai').expect;
var fs        = require('fs');
var path      = require('path');
var _         = require('lodash');

var Province  = require('../src/province');
var provinces = require('../resources/jsons/provinces.json');
var parties   = require('../resources/jsons/parties.json');

describe('totalCount', function() {
  provinces.forEach(function(provinceJSON) {
    var province     = Province.find(provinceJSON.number);
    var stationsPath = province.getStationsPath();
    if (!fs.existsSync(stationsPath)) {
      return;
    }

    var provinceAttr = require(province.getJsonPath());
    province = Province.loadFromJSON(provinceAttr);

    it('has total stations on' + province.name, function() {
      var stations = require(stationsPath);

      expect(province.getStations().length).to.equal(stations.length);
    });
  });
});
