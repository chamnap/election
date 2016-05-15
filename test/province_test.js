'use strict';

var expect    = require('chai').expect;
var fs        = require('fs');
var path      = require('path');
var _         = require('lodash');

var Province  = require('../src/province');
var provinces = require('../resources/jsons/provinces.json');
var parties   = require('../resources/jsons/parties.json');

describe('totalCount', function () {
  provinces.forEach(function (provinceJSON) {
    var province     = Province.find(provinceJSON.number);
    var provincePath = province.getJsonPath();
    if (!fs.existsSync(provincePath)) {
      return;
    }

    var provinceAttr = require(provincePath);
    province = Province.loadFromJSON(provinceAttr);

    describe(provinceJSON.en_name, function () {
      it('has total', function () {
        expect(province.total).not.to.equal({});
      });

      parties.forEach(function (party) {
        it('is correct on Party::' + party.identifier, function () {
          var totalCount = province.total[party.identifier] || 0;

          expect(province.getTotal(party.identifier)).to.equal(totalCount);
        });
      });

      var districts = province.getDistricts();
      districts.forEach(function (district) {
        it('has total', function () {
          expect(district.total).not.to.equal({});
        });

        it('is correct on District::' + district.name, function () {
          parties.forEach(function (party) {
            var totalCount = district.total[party.identifier] || 0;
            var message = party.identifier + ':' + district.name;

            expect(district.getTotal(party.identifier), message).to.equal(totalCount);
          });
        });
      });

      it('is correct on Commune', function () {
        var communes = province.getCommunes();
        communes.forEach(function (commune) {
          it('has total', function () {
            expect(commune.total).not.to.equal({});
          });

          parties.forEach(function (party) {
            var totalCount = commune.total[party.identifier] || 0;
            var message = party.identifier + ':' + commune.id + ':' + commune.name;

            expect(commune.getTotal(party.identifier), message).to.equal(totalCount);
          });
        });
      });
    });
  });
});
