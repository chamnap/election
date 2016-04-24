var _        = require('lodash');
var parties  = require('../json/parties.json');

var Party = function(identifier, name, totalCount) {
  this.identifier = identifier;
  this.name       = name;
  this.totalCount = totalCount;
};

Party.find = function(identifier) {
  var attributes = _.find(parties, function(party) { return party.identifier == identifier; });

  return new Party(attributes.identifier, attributes.name);
};

Party.prototype = {
  setTotalCount: function(totalCount) {
    this.totalCount = totalCount;
  }
}

module.exports = Party;