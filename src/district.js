var Party    = require('./party');

var District = function(kh_name, en_name, total) {
  this.kh_name  = kh_name;
  this.en_name  = en_name;
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