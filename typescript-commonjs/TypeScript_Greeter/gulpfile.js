/// <binding BeforeBuild='default' />
'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
//var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var tsify = require('tsify');
// var ts = require('gulp-typescript');

// var tsProject = ts.createProject('tsconfig.json');

gulp.task('default', function () {
     // set up the browserify instance on a task basis
    var b = browserify({
        entries: './scripts/index.ts',
        extensions: ['.ts'],
        debug: true  // exorcist: "app.js.map > index.ts"
    });

    return b.plugin(tsify, { noImplicitAny: true }).bundle()
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
          // Add transformation tasks to the pipeline here.
          //.pipe(uglify())
          //.on('error', gutil.log)
      .pipe(sourcemaps.write('./', { includeContent:false, sourceRoot:'../../' }))
      .pipe(gulp.dest('./www/scripts/'));
});