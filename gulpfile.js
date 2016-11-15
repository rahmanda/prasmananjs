/*
 |--------------------------------------------------------------------------
 | PrasmananJS Asset Management
 |--------------------------------------------------------------------------
 |
 | In order to increase productivity we shall leave all the heavy and repe-
 | -titive work to this script. Abuse it as many as possible (in positive way).
 |
 */

var gulp        = require("gulp");
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
    tests: 'tests'
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
    view   : {
	src: PREFIX_PATH.tests + "/manual/*.html"
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

// Static server + watching asset files
gulp.task('serve', ['build'], function () {
    browserSync.init({
	proxy: SERVER
    });

    gulp.watch(PATH.sass.src, ['sass-build']);
    gulp.watch(PATH.js.src, ['browserify-build']).on('change', browserSync.reload);    
    gulp.watch(PATH.view.src).on('change', browserSync.reload);
    gulp.watch(PATH.test.src).on('change', browserSync.reload);
});

gulp.task('sass-build', ['sass-minified', 'sass-unminified']);

// Compile sass into CSS & auto-inject into browsers
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

gulp.task('browserify-build', ['browserify', 'browserify-unminified']);

// Compile all js files into one file
gulp.task('browserify', function() {
    return browserify(PATH.js.entry)
	.bundle()
	.pipe(source(BUILD_NAME.js.minified))
	.pipe(buffer())
	.pipe(uglify())
	.pipe(gulp.dest(PATH.js.dist));
});

gulp.task('browserify-unminified', function() {
    return browserify(PATH.js.entry)
	.bundle()
	.pipe(source(BUILD_NAME.js.unminified))
	.pipe(buffer())
	.pipe(gulp.dest(PATH.js.dist));
});

gulp.task('build', ['browserify-build', 'sass-build']);

gulp.task('default', ['serve']);
