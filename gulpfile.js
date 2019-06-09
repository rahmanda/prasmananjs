/*
 |--------------------------------------------------------------------------
 | PrasmananJS Asset Management
 |--------------------------------------------------------------------------
 |
 | In order to increase productivity we shall leave all the heavy and repe-
 | -titive work to this script. Abuse it as many as possible (in positive way).
 |
 */

var path        = require("path");
var gulp        = require("gulp");
var server      = require("gulp-serve");
var sass        = require("gulp-sass");
var cssnano     = require("gulp-cssnano");
var uglify      = require("gulp-uglify");
var rename      = require("gulp-rename");
var source      = require("vinyl-source-stream");
var buffer      = require("vinyl-buffer");
var browserify  = require("browserify");
var browserSync = require("browser-sync").create();

var ROOTPATH = "/";
var SERVER   = "http://localhost:8000";
var PREFIX_PATH = {
  src: 'src',
  dist: 'dist',
  tests: 'tests',
  docs: 'docs'
};
var PATH = {
  sass   : {
    entry: PREFIX_PATH.src + "/scss/prasmanan.scss",
    src:   PREFIX_PATH.src + "/scss/**/*.scss",
    dist:  PREFIX_PATH.dist
  },
  js     : {
    entry: PREFIX_PATH.src + "/js/prasmanan.js",
    src:   PREFIX_PATH.src + "/js/**/*.js",
    dist:  PREFIX_PATH.dist
  },
  test   : {
    src: PREFIX_PATH.tests + "/unit/**/*.js"
  },
  docs   : {
    src: PREFIX_PATH.docs + "/**/*.html"
  }
};

var BUILD_NAME = {
  css: {
    minified: 'prasmanan.min.css',
    unminified: 'prasmanan.css'
  },
  js: {
    minified: 'prasmanan.min.js',
    unminified: 'prasmanan.js'
  }
};

gulp.task('css-build', ['sass-minified', 'sass-unminified']);
gulp.task('js-build', ['js-minified', 'js-unminified']);
gulp.task('build', ['js-build', 'css-build'], function () {
  gulp.src(path.join(__dirname, PATH.sass.dist, BUILD_NAME.css.minified))
    .pipe(gulp.dest(PREFIX_PATH.docs));
  gulp.src(path.join(__dirname, PATH.js.dist, BUILD_NAME.js.minified))
    .pipe(gulp.dest(PREFIX_PATH.docs));
});
gulp.task('default', ['serve']);

// Static server + watching asset files
gulp.task('serve', ['build'], function () {
  browserSync.init({
    proxy: SERVER
  });
  gulp.watch(PATH.sass.src, ['sass-build']);
  gulp.watch(PATH.js.src,   ['browserify-build'])
      .on('change', browserSync.reload);
  gulp.watch(PATH.docs.src)
      .on('change', browserSync.reload);
  gulp.watch(PATH.test.src).on('change', browserSync.reload);
});

// Compile sass into CSS + compressed it & auto-inject into browsers
gulp.task('sass-minified', function() {
  return gulp.src(PATH.sass.entry)
    .pipe(sass())
    .pipe(cssnano())
    .pipe(rename(BUILD_NAME.css.minified))
    .pipe(gulp.dest(PATH.sass.dist));
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass-unminified', function() {
  return gulp.src(PATH.sass.entry)
    .pipe(sass())
    .pipe(rename(BUILD_NAME.css.unminified))
    .pipe(gulp.dest(PATH.sass.dist))
    .pipe(browserSync.stream());
});

// Compile all js files into one file and compressed it
gulp.task('js-minified', function() {
  return browserify(PATH.js.entry)
    .bundle()
    .pipe(source(BUILD_NAME.js.minified))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(PATH.js.dist));
});

// Compile all js files into one file
gulp.task('js-unminified', function() {
  return browserify(PATH.js.entry)
    .bundle()
    .pipe(source(BUILD_NAME.js.unminified))
    .pipe(buffer())
    .pipe(gulp.dest(PATH.js.dist));
});

gulp.task('demo', server({
  root: [path.join(__dirname, PREFIX_PATH.docs)],
  port: 8000
}));
