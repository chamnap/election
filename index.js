#!/usr/bin/env node

'use strict';

var khmerConverter  = require('khmer-unicode-converter');
var _               = require('lodash');
var fs              = require('fs');

var BookParser      = require('./src/book_parser');
var HtmlParser      = require('./src/html_parser');
var provinces       = require('./resources/jsons/provinces.json');

module.exports = {
  station: function(province) {
    var provincePath = province.getHtmlPath();
    if (!fs.existsSync(provincePath)) {
      throw provincePath + " doesn't exist";
    }

    var htmlParser = new HtmlParser(province);
    return htmlParser.parseAndSave();
  },

  province: function(province) {
    var provincePath = province.getExcelPath();
    if (!fs.existsSync(provincePath)) {
      throw provincePath + " doesn't exist";
    }

    var bookParser = new BookParser(province);
    return bookParser.parseAndSave();
  }
};