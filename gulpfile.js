'use strict';

var gulp = require('gulp'),
	 browserify = require('gulp-browserify'),
	 less = require('gulp-less'),
   plumber = require('gulp-plumber');


gulp.task('apps', function() {
    gulp.src('public/javascripts/*.js')
        .pipe(plumber())
        .pipe(browserify({
          insertGlobals : false
        }))
        .pipe(gulp.dest('public/javascripts/dist'))
});


// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch(['public/javascripts/*.js'], ['apps']);
    gulp.watch(['public/stylesheets/*.less'], ['less']);
});

gulp.task('less', function(){
	gulp.src('./public/stylesheets/*.less')
      .pipe(plumber())
	    .pipe(less())
	    .pipe(gulp.dest('./public/stylesheets/'));
});



gulp.task('default', ['watch', 'apps', 'less']);