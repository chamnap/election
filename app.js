#!/usr/bin/env node

var program   = require('commander');
var converter = require('./index');
var provinces = require('./resources/jsons/provinces.json');
var Province  = require('./src/province');

program
  .version('0.1.0')
  .option('-s, --station', 'convert station names only')
  .parse(process.argv);

if (program.args[0]) {
  provinces = [];

  var input = program.args[0].split(',');
  input.forEach(function(provinceNumber) {
    var province = Province.find(provinceNumber);

    provinces.push(province);
  });
} else {
  array = [];
  provinces.forEach(function(province) {
    array.push(new Province(province));
  });

  provinces = array;
}

var method = program.station ? 'station' : 'province';
provinces.forEach(function(province) {
  converter[method](province)
    .then(function() {
      console.log(province.name + ' is done!');
    });
});