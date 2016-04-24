var _        = require('lodash');
var parties  = require('../json/parties.json');
var Party    = require('./party');

var Commune = function(id, name, total) {
  this.id       = id;
  this.name     = name;
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