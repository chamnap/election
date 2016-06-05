var _        = require('lodash');
var path     = require('path');
var sprintf  = require('sprintf-js').sprintf;
var csv      = require('fast-csv');
var Q        = require('q');

var District = require('./district');
var Commune  = require('./commune');
var Station  = require('./station');
var Party    = require('./party');

var parties   = require('../resources/jsons/parties.json');
var provinces = require('../resources/jsons/provinces.json');

var Province = function(attributes) {
  var self = this;

  _.forEach(attributes, function(value, key) {
    self[key] = value;
  });

  self.name      = attributes.en_name;
  self.total     = attributes.total || {};
  self.districts = attributes.districts || [];
};

Province.find = function(number) {
  var attributes = _.find(provinces, function(province) { return province.number === parseInt(number); });
  var province   = new Province(attributes);
  province.name  = attributes.kh_name;

  return province;
};

Province.loadFromJSON = function(json) {
  var province = new Province({ name: json.kh_name, kh_name: json.kh_name, en_name: json.en_name, number: json.number, total: json.total });

  json.districts.forEach(function(districtJson) {
    var district = new District(districtJson.kh_name, districtJson.en_name, districtJson.total);

    districtJson.communes.forEach(function(communeJson) {
      var commune = new Commune(communeJson.id, communeJson.kh_name, communeJson.en_name, communeJson.total);

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
  getHtmlPath: function() {
    var number   = sprintf("%02d", this.number);
    var fileName = number + '-' + this.en_name.replace(/ /g, '-') + '.html';

    return path.resolve('./resources/htmls/' + fileName);
  },

  getJsonPath: function() {
    var number   = sprintf("%02d", this.number);
    var fileName = number + '-' + this.en_name.replace(/ /g, '-') + '.json';

    return path.resolve('./resources/jsons/' + fileName);
  },

  getTxtPath: function() {
    var number   = sprintf("%02d", this.number);
    var fileName = number + '-' + this.en_name.replace(/ /g, '-') + '.txt';

    return path.resolve('./resources/txts/' + fileName);
  },

  getExcelPath: function() {
    var number   = sprintf("%02d", this.number);
    var fileName = number + '-' + this.en_name.replace(/ /g, '-') + '.xlsx';

    return path.resolve('./resources/excels/' + fileName);
  },

  getStationsPath: function() {
    var number   = sprintf("%02d", this.number);
    var fileName = number + '-' + this.en_name.replace(/ /g, '-') + '.json';

    return path.resolve('./resources/stations/' + fileName);
  },

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

  getStations: function() {
    var stations = [];
    this.getCommunes().forEach(function(commune) {
      stations = stations.concat(commune.stations);
    });

    return stations;
  },

  setTotal: function(total) {
    this.total = total;
  },

  saveAsTxt: function() {
    var self = this;
    var deferred = Q.defer();
    var stations = [['province_kh_name', 'province_en_name', 'district_kh_name', 'district_en_name', 'commune_kh_name', 'commune_en_name', 'station_number', 'station_name', 'party1', 'party2', 'party3', 'party4', 'party5', 'party6', 'party7', 'party8', 'party9', 'party10', 'party11', 'useful_votes', 'non_useful_votes', 'total_in_box']];

    this.districts.forEach(function(district) {
      district.communes.forEach(function(commune) {
        commune.stations.forEach(function(station) {
          var array = [self.kh_name, self.en_name, district.kh_name, district.en_name, commune.kh_name, commune.en_name];
          array = array.concat(station.asArray());

          stations.push(array);
        });
      });
    });

    csv
      .writeToPath(this.getTxtPath(), stations, { headers: true, quoteColumns: true })
      .on('finish', function() {
        deferred.resolve();
      });

    return deferred.promise;
  }
};

module.exports = Province;