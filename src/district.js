var District = function(name, province) {
  this.name     = name;
  this.communes = [];
  this.province = province;
  this.total    = {};
};

District.prototype = {
  addCommune: function(commune) {
    this.communes.push(commune);
  },

  setTotal: function(total) {
    this.total = total;
  }
};

module.exports = District;