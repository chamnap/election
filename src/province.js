var District = require('./district');
var Commune  = require('./commune');
var Station  = require('./station');
var Party    = require('./party');

var parties  = require('../json/parties.json');

var Province = function(name, total) {
  this.name      = name;
  this.total     = total || {};
  this.districts = [];
};

Province.loadFromJSON = function(json) {
  var province = new Province(json.name, json.total);

  json.districts.forEach(function(districtJson) {
    var district = new District(districtJson.name, districtJson.total);

    districtJson.communes.forEach(function(communeJson) {
      var commune = new Commune(communeJson.id, communeJson.name, communeJson.total);

      communeJson.stations.forEach(function(stationJson) {
        var station = new Station(stationJson);

        commune.addStations(station);
      });

      district.addCommune(commune);
    });

    province.addDistrict(district);
  });

  return province;
};

Province.prototype = {
  getTotal: function(identifier) {
    var party = Party.find(identifier);
    if(!party) {
      return;
    }

    var totalCount = 0;

    this.districts.forEach(function(district) {
      totalCount += district.getTotal(identifier);
    });

    return totalCount;
  },

  addDistrict: function(district) {
    this.districts = this.districts.concat(district);
  },

  setDistricts: function(districts) {
    this.districts = districts;
  },

  getDistricts: function() {
    return this.districts;
  },

  getCommunes: function() {
    var communes = [];
    this.districts.forEach(function(district) {
      communes = communes.concat(district.communes);
    });

    return communes;
  },

  setTotal: function(total) {
    this.total = total;
  }
};

module.exports = Province;