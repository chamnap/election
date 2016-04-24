var _ = require('lodash');

var Station = function(attributes) {
  var self = this;

  _.forEach(attributes, function(value, key) {
    self[key] = value;
  });
};

module.exports = Station;