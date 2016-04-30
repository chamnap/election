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
    var provincePath = path.resolve('output/' + provinceJSON.kh_name + '.json');
    if (!fs.existsSync(provincePath)) {
      return;
    }

    var provinceAttr = require(provincePath);
    var province     = Province.loadFromJSON(provinceAttr);

    describe(provinceJSON.en_name, function() {
      parties.forEach(function(party) {
        it('is correct on Party::' + party.identifier, function() {
          var totalCount = province.total[party.identifier] || 0;

          expect(province.getTotal(party.identifier)).to.equal(totalCount);
        });
      });

      var districts = province.getDistricts();
      districts.forEach(function(district) {
        it('is correct on District::' + district.name, function() {
          parties.forEach(function(party) {
            var totalCount = district.total[party.identifier] || 0;

            expect(district.getTotal(party.identifier), party.identifier + ':' + district.name).to.equal(totalCount);
          });
        });
      });

      it('is correct on Commune', function() {
        var communes = province.getCommunes();
        communes.forEach(function(commune) {
          parties.forEach(function(party) {
            var totalCount = commune.total[party.identifier] || 0;

            expect(commune.getTotal(party.identifier), party.identifier + ':' + commune.name).to.equal(totalCount);
          });
        });
      });
    });
  });
});