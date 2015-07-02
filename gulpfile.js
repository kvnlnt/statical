var autoprefixer = require('autoprefixer');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var cssnext = require('cssnext');
var csswring = require('csswring');
var customMedia = require("postcss-custom-media");
var gulp = require('gulp');
var gulpsync = require('gulp-sync')(gulp);
var gutil = require('gulp-util');
var postcss = require('gulp-postcss');
var print = require('gulp-print');
var rimraf = require('gulp-rimraf');
var sourcemaps = require('gulp-sourcemaps');
var swig = require('gulp-swig');
var browserSync = require('browser-sync').create();

gulp.task('js', function() {
    return gulp.src([
            './src/patterns/**/*.js',
            './src/property/**/*.js',
            './src/pages/**/*.js',
            './src/parts/**/*.js',
            './src/pieces/**/*.js'
        ], {
            base: './src'
        })
        .pipe(sourcemaps.init())
        .pipe(print(function(filepath) {
            return gutil.colors.blue('STATICAL') + ' compiled ' + filepath;
        }))
        .pipe(concat('scripts.js'))
        .pipe(babel({
            compact: true,
            code: true
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build'));
});

gulp.task('css', function() {
    var processors = [customMedia(), autoprefixer, cssnext(), csswring()];
    return gulp.src([
            './src/patterns/settings.css',
            './src/patterns/defaults.css',
            './src/patterns/grid.css',
            './src/patterns/typography.css',
            './src/patterns/**/*.css',
            './src/pieces/**/*.css',
            './src/parts/**/*.css',
            './src/pages/**/*.css',
            './src/property/**/*.css'
        ], {
            base: './src'
        })
        .pipe(sourcemaps.init())
        .pipe(print(function(filepath) {
            return gutil.colors.blue('STATICAL') + ' compiled ' + filepath;
        }))
        .pipe(concat('styles.css'))
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build'));
});

gulp.task('html-pieces', function() {
    var options = {
        cache: false,
        load_json: true,
        varControls: ['{{@piece', '}}']
    };
    return gulp.src(['./src/pieces/**/*.jst'])
        .pipe(swig(options))
        .pipe(print(function(filepath) {
            return gutil.colors.blue('STATICAL') + ' compiled ' + filepath;
        }))
        .pipe(gulp.dest('./src/pieces'));
});

gulp.task('html-parts', function() {
    var options = {
        cache: false,
        load_json: true,
        varControls: ['{{@part', '}}']
    };
    return gulp.src(['./src/parts/**/*.jst'])
        .pipe(swig(options))
        .pipe(print(function(filepath) {
            return gutil.colors.blue('STATICAL') + ' compiled ' + filepath;
        }))
        .pipe(gulp.dest('./src/parts'));
});

gulp.task('html-pages', function() {
    var options = {
        cache: false,
        load_json: true,
        varControls: ['{{@page', '}}']
    };
    return gulp.src(['./src/pages/**/*.jst'])
        .pipe(swig(options))
        .pipe(print(function(filepath) {
            return gutil.colors.blue('STATICAL') + ' compiled ' + filepath;
        }))
        .pipe(gulp.dest('./src/pages'));
});

gulp.task('html', gulpsync.sync(['html-pieces', 'html-parts', 'html-pages']), function() {
    return gulp.src('./src/pages/*.html')
        .pipe(print(function(filepath) {
            return gutil.colors.blue('STATICAL') + ' deployed ' + filepath;
        }))
        .pipe(gulp.dest('./build'));
});

gulp.task('build', gulpsync.sync(['clean', 'js', 'css', 'html']));

gulp.task('default', gulpsync.sync(['clean', 'js', 'css', 'html']), function() {

    browserSync.init({
        server: "./build"
    });

    gulp.watch("./src/**/*.js", ['js']);
    gulp.watch("./src/**/*.css", ['css']);
    gulp.watch("./src/**/*.jst", ['html']);
    gulp.watch("./src/**/*.json", ['html']);
    gulp.watch("./build/*.*").on('change', browserSync.reload);

});

gulp.task('clean', function() {
    return gulp.src(['./src/**/*.html', './build/*.html', './build/*.js', './build/*.css', './build/*.map'], {
            read: false
        })
        .pipe(print(function(filepath) {
            return gutil.colors.red('STATICAL') + ' deleted ' + filepath;
        }))
        .pipe(rimraf({
            force: true
        }));
});