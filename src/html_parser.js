var _     = require('lodash');
var Q     = require('q');
var jsdom = require('jsdom');
var path  = require('path');
var fs    = require('fs');

var Province    = require('./province');
var Commune     = require('./commune');
var abc         = require('./abc');

var HtmlParser = function(province) {
  this.province = province;
};

HtmlParser.prototype = {
  jqueryPath: function() {
    return path.resolve('jquery.js');
  },

  getRowSelector: function() {
    switch(this.province.number) {
      case 1:
      case 3:
        return '.t.m8';
      case 2:
        return '.t.m8, .t.m4';
      case 4:
        return '.t.m9';
    }
  },

  parseAndSave: function() {
    var self = this;
    var deferred = Q.defer();

    jsdom.env(
      this.province.getHtmlPath(),
      [this.jqueryPath()],
      function (err, window) {
        self.stations = self.getStations(window.$);
        self.writeJSON();

        deferred.resolve();
      }
    );

    return deferred.promise;
  },

  // http://stackoverflow.com/questions/13859218/nodejs-how-to-make-function-fs-writefile-write-with-bom
  writeJSON: function() {
    fs.writeFileSync(this.province.getStationsPath(), '\ufeff' + JSON.stringify(this.stations, null, 2));
  },

  getStations: function($) {
    var self       = this;
    var stations   = [];
    var totalPages = $('#page-container > div').length;

    $('#page-container > div').each(function(index, page) {
      var station = {};
      var $page   = $(this);
      $page.children().find(self.getRowSelector()).each(function(index) {
        var text = $(this).text().trim();

        if (text.match(/^\d{4}/)) {
          station.id = text.trim().slice(0, 4);
        } else if (text !== 'srub' && text !== 'srubRsuk' && text !== 'srubextþ') {
          if(text.length <= 3 || text.match(/^\d+/)) {
            station = {};
          } else {
            station.name = abc(text);
            station.kh_name = text;
          }
        }

        if (station.id && station.name) {
          stations.push(station);
          station = {};
        }
      });
    });

    return _.uniqBy(stations, 'id');
  }
};

module.exports = HtmlParser;