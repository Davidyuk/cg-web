// This file processes all of the assets in the "client" folder, and outputs the finished files in the "build" folder as a finished app.

var $ = require('gulp-load-plugins')(),
  argv = require('yargs').argv,
  gulp = require('gulp'),
  rimraf = require('rimraf'),
  sequence = require('run-sequence'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  debowerify = require('debowerify'),
  underscorify = require('node-underscorify');

// Check for --production flag
var isProduction = !!(argv.production);

var paths = {
  assets: [
    './client/**/*.*',
    '!./client/assets/{scss,js}/**/*.*'
  ],
  libJS: [
    'bower_components/openlayers3/build/ol.js'
  ],
  // These files are for your app's JavaScript
  appJS: [
    'client/assets/js/app.js'
  ]
};


// Cleans the build directory
gulp.task('clean', function(cb) {
  rimraf('./build', cb);
});

// Copies everything in the client folder except templates, Sass, and JS
gulp.task('copy', function() {
  return gulp.src(paths.assets, {
    base: './client/'
  })
    .pipe(gulp.dest('./build'))
  ;
});

// Compiles Sass
gulp.task('sass', function () {
  var minifyCss = $.if(isProduction, $.minifyCss());

  return gulp.src('client/assets/scss/app.scss')
    .pipe($.compass({
      config_file: './config.rb',
      sass: 'client/assets/scss/',
      css: 'temp/css',
      relative: false
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie 10']
    }))
    .pipe(minifyCss)
    .pipe(gulp.dest('./build/assets/css/'))
  ;
});

gulp.task('js', ['js:lib', 'js:app']);

gulp.task('js:lib', function(cb) {
  return gulp.src(paths.libJS)
    .pipe(gulp.dest('./build/assets/js/vendor/'))
  ;
});

gulp.task('js:app', function() {
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function (e) {
      console.log(e);
    }));

  return browserify('client/assets/js/app.js', { debug: !isProduction })
    .transform(debowerify)
    .transform(underscorify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(uglify)
    .pipe(gulp.dest('./build/assets/js/'))
  ;
});

// Starts a test server, which you can view at http://localhost:8079
gulp.task('server', ['build'], function() {
  gulp.src('./build')
    .pipe($.webserver({
      port: 8079,
      host: 'localhost',
      fallback: 'index.html',
      livereload: true,
      open: true
    }))
  ;
});

// Builds your entire app once, without starting a server
gulp.task('build', function(cb) {
  sequence('clean', ['sass', 'js'], 'copy', cb);
});

// Default task: builds your app, starts a server, and recompiles assets when they change
gulp.task('default', ['server'], function () {
  // Watch Sass
  gulp.watch(['./client/assets/scss/**/*', './scss/**/*'], ['sass']);

  // Watch JavaScript
  gulp.watch(['./client/assets/js/**/*', './js/**/*'], ['js:app']);

  // Watch static files
  gulp.watch(['./client/**/*.*', '!./client/assets/{scss,js}/**/*.*'], ['copy']);
});
