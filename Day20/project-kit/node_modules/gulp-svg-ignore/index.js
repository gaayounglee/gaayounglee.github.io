"use strict";

var mapStream = require('map-stream');
var SvgIgnore = require('./lib/SvgIgnore');
var path = require('path');
var _ = require('lodash');

module.exports = function (selectorList) {

  if (!_.isArray(selectorList)) {
    return mapStream(function (file, callback) {
      callback(null, file)
    })
  }

  var svgIgnore = new SvgIgnore(selectorList);

  return mapStream(function (file, callback) {
    if ('.svg' === path.extname(file.path)) {
      file.contents = new Buffer(svgIgnore.transform(file.contents));
    }
    callback(null, file)
  })

};
