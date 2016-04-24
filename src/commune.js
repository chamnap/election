var Commune = function(name, district) {
  this.name     = name;
  this.stations = [];
  this.district = district;
  this.total    = {};
};

Commune.prototype = {
  addStations: function(stations) {
    this.stations = this.stations.concat(stations);
  },

  setTotal: function(total) {
    this.total = total;
  }
};

module.exports = Commune;