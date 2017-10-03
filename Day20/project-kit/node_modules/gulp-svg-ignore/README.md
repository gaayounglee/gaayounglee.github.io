## svg ignore

Just for removing the layers of svg sources

[![Build Status](https://travis-ci.org/morlay/gulp-svg-ignore.svg?branch=master)](https://travis-ci.org/morlay/gulp-svg-ignore)
[![Dependencies](https://david-dm.org/morlay/gulp-svg-ignore.png)](https://david-dm.org/morlay/gulp-svg-ignore)

## Usage

    var gulp = require('gulp');
    var gulpSvgIgnore = require('gulp-svg-ignore');
    var selectorList = ['#layer'] // input an array with jQuery style selector

    gulp.src('*.svg')
      .pipe(gulpSvgIgnore(selectorList))
