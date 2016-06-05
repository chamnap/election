var _        = require('lodash');
var parties  = require('../resources/jsons/parties.json');
var Party    = require('./party');

var Commune = function(id, kh_name, en_name, total) {
  this.id       = id;
  this.kh_name  = kh_name;
  this.en_name  = en_name;
  this.total    = total || {};
  this.stations = [];
};

Commune.prototype = {
  getTotal: function(identifier) {
    var party = Party.find(identifier);
    if(!party) {
      return;
    }

    var totalCount = 0;
    this.stations.forEach(function(station) {
      totalCount += station[identifier];
    });

    return totalCount;
  },

  addStations: function(stations) {
    this.stations = this.stations.concat(stations);
  },

  setTotal: function(total) {
    this.total = total;
  }
};

module.exports = Commune;