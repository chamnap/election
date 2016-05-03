var _ = require('lodash');

var Station = function(attributes) {
  var self = this;

  _.forEach(attributes, function(value, key) {
    self[key] = value;
  });
};

Station.prototype = {
  asArray: function() {
    return [this.number, this.name, this.t1, this.t2, this.t3, this.t4, this.t5, this.t6, this.t7, this.t8, this.t9, this.t10, this.t11, this.useful, this.notUseful, this.totalInBox];
  }
}

module.exports = Station;