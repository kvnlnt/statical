var gulp = require('gulp');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var postcss = require('gulp-postcss');

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