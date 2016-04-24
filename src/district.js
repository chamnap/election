var District = function(name, province) {
  this.name     = name;
  this.communes = [];
  this.province = province;
};

District.prototype = {
  addCommune: function(commune) {
    this.communes.push(commune);
  }
};

module.exports = District;