#!/usr/bin/env node

'use strict';

var khmerConverter  = require('khmer-unicode-converter');
var _               = require('lodash');
var fs              = require('fs');

var BookParser      = require('./src/book_parser');
var provinces       = require('./resources/jsons/provinces.json');

module.exports = function(province) {
  var provincePath = province.getExcelPath();
  if (!fs.existsSync(provincePath)) {
    throw provincePath + " doesn't exist";
  }

  var bookParser = new BookParser(province);
  return bookParser.parseAndSave();
};