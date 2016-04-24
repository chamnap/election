var Party    = require('./party');

var District = function(name, total) {
  this.name     = name;
  this.total    = total || {};
  this.communes = [];
};

District.prototype = {
  getTotal: function(identifier) {
    var party = Party.find(identifier);
    if(!party) {
      return;
    }

    var totalCount = 0;
    this.communes.forEach(function(commune) {
      totalCount += commune.getTotal(identifier);
    });

    return totalCount;
  },

  addCommune: function(commune) {
    this.communes.push(commune);
  },

  setTotal: function(total) {
    this.total = total;
  }
};

module.exports = District;