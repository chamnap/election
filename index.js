#!/usr/bin/env node

'use strict';

var khmerConverter  = require('khmer-unicode-converter');
var _               = require('lodash');

var BookParser      = require('./src/book_parser');

var bookParser = new BookParser('បាត់ដំបង', './resources/excels/02-Battambang.xlsx');
bookParser.parse();