var Commune = function(name, district) {
  this.name     = name;
  this.stations = [];
  this.district = district;
};

Commune.prototype = {
  addStations: function(stations) {
    this.stations = this.stations.concat(stations);
  }
};

module.exports = Commune;