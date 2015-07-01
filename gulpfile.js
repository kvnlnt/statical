var babel = require('gulp-babel');
var concat = require('gulp-concat');
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var swig = require('gulp-swig');
var addsrc = require('gulp-add-src');
var rimraf = require('gulp-rimraf');

gulp.task('js', function () {
    return gulp.src([
    './src/patterns/**/*.js',
    './src/property/**/*.js',
    './src/pages/**/*.js',
    './src/parts/**/*.js',
    './src/pieces/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('scripts.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build'));
});

gulp.task('css', function () {
    var processors = [];
    return gulp.src([
    './src/patterns/**/*.css',
    './src/pieces/**/*.css',
    './src/parts/**/*.css',
    './src/pages/**/*.css',
    './src/property/**/*.css'
    ])
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build'));
});

gulp.task('html-pieces', function(){
    var options = { cache:false, load_json:true, varControls: ['{{@piece', '}}'] };
    return gulp.src(['./src/pieces/**/*.jst'])
    .pipe(swig(options))
    .pipe(gulp.dest('./src/pieces'));
});

gulp.task('html-parts', function(){
    var options = { cache:false, load_json:true, varControls: ['{{@part', '}}'] };
    return gulp.src(['./src/parts/**/*.jst'])
    .pipe(swig(options))
    .pipe(gulp.dest('./src/parts'));
});

gulp.task('html-pages', function(){
    var options = { cache:false, load_json:true, varControls: ['{{@page', '}}'] };
    return gulp.src(['./src/pages/**/*.jst'])
    .pipe(swig(options))
    .pipe(gulp.dest('./src/pages'));
});

gulp.task('html', ['html-pieces', 'html-parts', 'html-pages'], function() {
   return this; 
});

gulp.task('clean', function(){
    return gulp.src(['./src/**/*.html', './build/*.html', './build/*.js', './build/*.css'], { read: false })
    .pipe(rimraf({ force: true }));
});