/*
|--------------------------------------------------------------------------
| BuffetJS Asset Management
|--------------------------------------------------------------------------
|
| In order to increase productivity we shall leave all the heavy and repe-
| -titive work to this script. Abuse it as many as possible (in positive way).
|
 */

var gulp        = require("gulp");
var sass        = require("gulp-sass");
var cssnano     = require("gulp-cssnano");
var concat      = require("gulp-concat");
var browserSync = require("browser-sync").create();

var ROOTPATH = "/";
var SERVER   = "http://localhost:8000";
var PATH = {
  sass : "src/scss/*.scss",
  view : "tests/manual/*.html",
  js   : "src/js/*.js",
  dist : {
    css : "dist",
    js  : "dist"
  }
};

// Static server + watching asset files
gulp.task('serve', ['sass'], function () {
  browserSync.init({
    proxy: SERVER
  });

  gulp.watch(PATH.sass, ['sass']);
  gulp.watch(PATH.view).on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src(PATH.sass)
         .pipe(sass())
         .pipe(cssnano())
         .pipe(gulp.dest(PATH.dist.css))
         .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
