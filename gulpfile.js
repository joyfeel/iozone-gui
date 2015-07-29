'use strict';

var gulp = require('gulp'),
	browserify = require('gulp-browserify');


gulp.task('apps', function() {
    gulp.src('public/javascripts/*.js')
        .pipe(browserify({
          insertGlobals : false
        }))
        .pipe(gulp.dest('public/javascripts/dist'))
});


// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch(['public/javascripts/*.js'], ['apps']);
});



gulp.task('default', ['watch', 'apps']);