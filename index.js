#!/usr/bin/env node

'use strict';

var khmerConverter  = require('khmer-unicode-converter');
var _               = require('lodash');

var BookParser      = require('./src/book_parser');

var bookParser = new BookParser('ខេត្ដបន្ទាយមានជ័យ', './resources/excels/01-Banteay-Meanchey.xlsx');
bookParser.parse();