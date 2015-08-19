'use strict';

var gulp = require('gulp'),
	   browserify = require('gulp-browserify'),
	   less = require('gulp-less'),
     plumber = require('gulp-plumber'),
     uglify = require('gulp-uglify'),
     rename = require('gulp-rename'),
     livereload = require('gulp-livereload');


gulp.task('apps', function() {
    gulp.src('public/javascripts/*.js')
        .pipe(plumber())
        .pipe(browserify({
          insertGlobals : false
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('public/javascripts/dist/'));
        //.pipe(livereload());
});


gulp.task('less', function(){
	gulp.src('./public/stylesheets/*.less')
      .pipe(plumber())
	    .pipe(less())
	    .pipe(gulp.dest('./public/stylesheets/'));
      //.pipe(livereload());
});

// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch(['public/javascripts/*.js'], ['apps']);
    gulp.watch(['public/stylesheets/*.less'], ['less']);
});

gulp.task('default', ['watch', 'apps', 'less']);