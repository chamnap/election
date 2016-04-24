var Province = function(name) {
  this.name      = name;
  this.districts = [];
  this.total     = {};
};

Province.prototype = {
  setDistricts: function(districts) {
    this.districts = districts;
  },

  setTotal: function(total) {
    this.total = total;
  }
};

module.exports = Province;