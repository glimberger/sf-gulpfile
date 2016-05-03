'use strict';

/**
 * Gulp file for Symfony projects.
 */

var config = require('./gulpconfig.json'); // config file
var exec = require('child_process').exec;
var parseArgs = require('minimist');

// gulp plugins
var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var bump = require('gulp-bump');
var runSequence = require('run-sequence');


// gulp tasks

/**
 * [dev] convert scss to css with sourcemap.
 * Usage:
 *  $ gulp styles
 *  $ gulp styles:dev
 */
gulp.task('styles', ['styles:dev']);
gulp.task('styles:dev', function () {
    runSequence(
        'sass:dev',
        'assetic:dump'
    );
});
gulp.task('sass:dev', function () {
    for (var i in config.bundles) {
        var source = config.bundles[i] + '/Resources/public/' + config.sass.src,
            dest   = config.bundles[i] + '/Resources/public/' + config.sass.dest;

        gulp.src(source)
            .pipe(sourcemaps.init())
            .pipe(sass({sourceComments: 'map'}).on('error', sass.logError))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(dest));
    }
});

/**
 * [prod] convert scss to css with sourcemap and compress.
 * Usage:
 *  $ gulp styles:prod
 */
gulp.task('styles:prod', function () {
    runSequence(
        'sass:prod',
        'assetic:dump'
    );
});
gulp.task('sass:prod', function () {
    for (var i in config.bundles) {
        var source = config.bundles[i] + '/Resources/public/' + config.sass.src,
            dest   = config.bundles[i] + '/Resources/public/' + config.sass.dest;

        gulp.src(source)
            .pipe(sass().on('error', sass.logError))
            .pipe(cleanCSS({debug: true}, function(details) {
                console.log(details.name + ': ' + details.stats.originalSize);
                console.log(details.name + ': ' + details.stats.minifiedSize);
            }))
            .pipe(gulp.dest(dest));
    }
});

/**
 * copy fonts
 * Usage:
 *  $ gulp fonts
 */
gulp.task('fonts', function () {
    var sources = [];
    for (var i in config.bundles) {
        sources.push(config.bundles[i] + '/Resources/public/' + config.fonts.src);
    }
    sources = sources.concat(config.fonts.vendor);
    gulp.src(sources)
        .pipe(gulp.dest(config.fonts.dest));
});

/**
 * copy images
 * Usage:
 *  $ gulp images
 */
gulp.task('images', function () {
    var sources = [];
    for (var i in config.bundles) {
        sources.push(config.bundles[i] + '/Resources/public/' + config.images.src);
    }
    sources = sources.concat(config.images.vendor);
    gulp.src(sources)
        .pipe(gulp.dest(config.images.dest));
});

/**
 * run assets:install symfony command
 * Usage:
 *  $ gulp assets:install
 */
gulp.task('assets:install', function (cb) {
    exec(config.commands.assets_install, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

/**
 * run assetic:dump symfony command
 * Usage:
 *  $ gulp assetic:dump
 */
gulp.task('assetic:dump', function (cb) {
    exec(config.commands.assetic_dump, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

/**
 * [dev] watch for changes and run tasks
 * Usage:
 *  $ gulp watch
 */
gulp.task('watch', function () {
    var globs = [];
    for (var i in config.bundles) {
        globs.push(config.bundles[i] + '/Resources/public/' + config.sass.watch);
    }
    gulp
        .watch(globs, ['styles:dev'])
        .on('change', function(event) {
            gutil.log('File', gutil.colors.cyan(event.path), 'was', gutil.colors.yellow(event.type), ', running tasks...');
        });
});

/**
 * [dev] tasks in dev environment.
 * Usage:
 *  $ gulp
 *  $ gulp dev
 */
gulp.task('default', ['dev']);
gulp.task('dev', ['styles:dev', 'fonts', 'images']);

/**
 * [prod] tasks in prod environment
 * Usage:
 *  $ gulp prod
 */
gulp.task('prod', ['styles:prod', 'fonts', 'images']);