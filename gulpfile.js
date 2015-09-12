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
var fs = require("fs");
var changed = require('gulp-changed');
var awspublish = require('gulp-awspublish');
var statical = JSON.parse(fs.readFileSync('statical.json', 'utf8'));

// Compile javascript and deploy to build folder
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

// Compile css and deploy to build folder
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

// Compile pieces with piece scope
gulp.task('html-pieces', function() {
    var options = {
        cache: false,
        load_json: true,
        tagControls: ['{%piece', '%}'],
        varControls: ['{@piece', '}}']
    };
    return gulp.src(['./src/pieces/**/*.jst'])
        .pipe(swig(options))
        .pipe(print(function(filepath) {
            return gutil.colors.blue('STATICAL') + ' piece ' + filepath;
        }))
        .pipe(gulp.dest('./src/pieces'));
});

// Compile parts with part scope
gulp.task('html-parts', function() {
    var options = {
        cache: false,
        load_json: true,
        tagControls: ['{%part', '%}'],
        varControls: ['{@part', '}}']
    };
    return gulp.src(['./src/parts/**/*.jst'])
        .pipe(swig(options))
        .pipe(print(function(filepath) {
            return gutil.colors.blue('STATICAL') + ' part ' + filepath;
        }))
        .pipe(gulp.dest('./src/parts'));
});

// Compile pages with page scope
gulp.task('html-pages', function() {
    var options = {
        cache: false,
        load_json: true,
        tagControls: ['{%page', '%}'],
        varControls: ['{@page', '}}']
    };
    return gulp.src(['./src/pages/**/*.jst'])
        .pipe(swig(options))
        .pipe(print(function(filepath) {
            return gutil.colors.blue('STATICAL') + ' page ' + filepath;
        }))
        .pipe(gulp.dest('./src/pages'));
});

// Compile pages with property scope
gulp.task('html-property', function() {
    var options = {
        cache: false,
        load_json: false,
        locals: statical.property,
        tagControls: ['{%property', '%}'],
        varControls: ['{@property', '}}']
    };
    return gulp.src(['./src/pages/**/*.html'])
        .pipe(swig(options))
        .pipe(changed('./src/pages', {hasChanged: changed.compareSha1Digest}))
        .pipe(print(function(filepath) {
            return gutil.colors.blue('STATICAL') + ' property ' + filepath;
        }))
        .pipe(gulp.dest('./src/pages'));
});

// Compile all html and deploy to build folder
gulp.task('html-all', gulpsync.sync(['html-pieces', 'html-parts', 'html-pages', 'html-property']), function() {
    return gulp.src('./src/pages/**/*.html')
        .pipe(changed('./build'))
        .pipe(print(function(filepath) {
            return gutil.colors.blue('STATICAL') + ' deployed ' + filepath;
        }))
        .pipe(gulp.dest('./build'));
});

// Compile all css, js and html and deploy to build folder
gulp.task('build', gulpsync.sync(['js', 'css', 'html-all']), function(){
    console.log(gutil.colors.blue('STATICAL'), 'build complete');
});

// Clean all generated files (all html and build folder)
gulp.task('clean', function() {
    return gulp.src(['./src/**/*.html', './build/**/*.html', './build/*.js', './build/*.css', './build/*.map'], {
            read: false
        })
        .pipe(print(function(filepath) {
            return gutil.colors.red('STATICAL') + ' deleted ' + filepath;
        }))
        .pipe(rimraf({
            force: true
        }));
});

// Publish to S3 bucket
// gulp.task('publish', function() {
//     // CONFIGURE STATICAL.JSON SETTINGS FIRST TO ENABLE S3
//     var publisher = awspublish.create(statical.publish.publisher);
//     var headers = statical.publish.headers;
//     return gulp.src('./build/**')
//         .pipe(awspublish.gzip())
//         .pipe(publisher.publish(headers))
//         .pipe(publisher.cache())
//         .pipe(awspublish.reporter());
// });

// Start dev server and watches
gulp.task('serve', gulpsync.sync(['js', 'css', 'html-all']), function() {
    browserSync.init({
        server: "./build"
    });
    gulp.watch("./src/**/*.js", ['js']);
    gulp.watch("./src/**/*.css", ['css']);
    gulp.watch("./src/**/*.jst", ['html-all']);
    gulp.watch("./src/**/*.json", ['html-all']);
    gulp.watch("./build/*.*").on('change', browserSync.reload);
});

// DEFAULT TASK
gulp.task('default', ['serve']);