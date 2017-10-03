"use strict";

module.exports = SvgIgnore;

var cheerio = require('cheerio');
var _ = require('lodash');

function SvgIgnore(selectorList) {
  this.selectorList = selectorList;
}

SvgIgnore.prototype.transform = function (svgSrcString) {
  var $ = cheerio.load(svgSrcString, {
    xmlMode: true
  });
  _.forEach(this.selectorList, function (selector) {
    $(selector).remove();
  });
  return $.html();
};
