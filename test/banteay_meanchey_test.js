'use strict';

var expect    = require('chai').expect;
var Province  = require('../src/province');
var provinces = require('../output/ខេត្ដបន្ទាយមានជ័យ.json');
var parties   = require('../resources/jsons/parties.json');

describe('totalCount', function() {
  var province = Province.loadFromJSON(provinces);

  it('is correct on Party', function() {
    parties.forEach(function(party) {
      var totalCount = province.total[party.identifier] || 0;

      expect(province.getTotal(party.identifier)).to.equal(totalCount);
    });
  });

  it('is correct on District', function() {
    var districts = province.getDistricts();
    districts.forEach(function(district) {
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