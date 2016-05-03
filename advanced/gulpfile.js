'use strict';

var config = require('./config.json'); // config file
var exec = require('child_process').exec;
var parseArgs = require('minimist');

// gulp plugins
var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var bump = require('gulp-bump');


// gulp tasks

/**
 * [dev] convert scss to css with sourcemap.
 * Usage:
 *  $ gulp styles
 *  $ gulp styles:dev
 */
gulp.task('styles', ['styles:dev']);
gulp.task('styles:dev', ['assets:install'], function () {
    gulp.src(config.paths.sass.src)
        .pipe(sourcemaps.init())
        .pipe(sass({sourceComments: 'map'}).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.paths.sass.dest));
});

/**
 * [prod] convert scss to css with sourcemap and compress.
 * Usage:
 *  $ gulp styles:prod
 */
gulp.task('styles:prod', ['assets:install'], function () {
    return gulp.src(config.paths.sass.src)
        .pipe(sourcemaps.init())
        .pipe(sass({sourceComments: 'map'}).on('error', sass.logError))
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.paths.sass.dest));
});

/**
 * [dev] concatenate custom scripts.
 * Usage:
 *  $ gulp scripts
 *  $ gulp scripts:dev
 */
gulp.task('scripts', ['scripts:dev']);
gulp.task('scripts:dev', ['assets:install'], function () {
    return gulp.src(config.paths.js.src)
        .pipe(concat('script.js'))
        .pipe(gulp.dest(config.paths.js.dest));
});

/**
 * [prod] compress and concatenate scripts.
 * Usage:
 *  $ gulp scripts:prod
 */
gulp.task('scripts:prod', ['assets:install'], function () {
    return gulp.src(config.paths.js.src)
        .pipe(uglify())
        .pipe(concat('script.js'))
        .pipe(gulp.dest(config.paths.js.dest));
});

/**
 * concatenate vendor scripts.
 * Usage:
 *  $ gulp scripts:vendor
 */
gulp.task('scripts:vendor', function () {
    return gulp.src(config.paths.js.vendor)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(config.paths.js.dest));
});

/**
 * copy fonts
 * Usage:
 *  $ gulp fonts
 */
gulp.task('fonts', ['assets:install'], function () {
    gulp.src(config.paths.fonts.src)
        .pipe(gulp.dest(config.paths.fonts.dest))
});

/**
 * copy images
 * Usage:
 *  $ gulp images
 */
gulp.task('images', ['assets:install'], function () {
    gulp.src(config.paths.images.src)
        .pipe(gulp.dest(config.paths.images.dest))
});

/**
 * run symfony assets:install command
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
 * [dev] watch for changes and run tasks
 * Usage:
 *  $ gulp watch
 */
gulp.task('watch', function () {
    var watched = [].concat(config.paths.js.watch, config.paths.sass.watch);

    gulp
        .watch(watched, ['assets:install', 'styles:dev', 'scripts:dev'])
        .on('change', function(event) {
            gutil.log('File', gutil.colors.cyan(event.path), 'was', gutil.colors.yellow(event.type), ', running tasks...');
        });
});

/**
 * [dev] increment component version.
 * Usage:
 *  # increment composer version (patch)
 *  gulp version
 *
 *  # increment w/ options
 *  gulp version -t <prerelease|patch|minor|major> -c <all|front|bower|node|gulp>
 */
gulp.task('version', function() {
    var argv = parseArgs(process.argv.slice(2));

    // source select
    var sources = [];
    var components = config.components;
    switch (argv.c) {
        case 'all':
            for (var key1 in components) {
                if (components.hasOwnProperty(key1)) {
                    sources.push(components[key1]);
                }
            }
            break;

        case 'front':
            for (var key2 in components) {
                if (components.hasOwnProperty(key2) && key2 !== 'composer') {
                    sources.push(components[key2]);
                }
            }
            break;

        case 'node':
        case 'package':
            if (components.hasOwnProperty('node')) {
                sources.push(config.components.node);
            }
            else {
                gutil.log("The component", gutil.colors.cyan(argv.c), "is", gutil.colors.red("not defined"));
            }
            break;

        case 'bower':
            if (components.hasOwnProperty('bower')) {
                sources.push(config.components.bower);
            }
            else {
                gutil.log("The component", gutil.colors.cyan(argv.c), "is", gutil.colors.red("not defined"));
            }
            break;

        case 'gulp':
        case 'gulpconfig':
            if (components.hasOwnProperty('gulp')) {
                sources.push(config.components.gulp);
            }
            else {
                gutil.log("The component", gutil.colors.cyan("gulp"), "is", gutil.colors.red("not defined"));
            }
            break;

        case 'composer':
            if (components.hasOwnProperty('composer')) {
                sources.push(config.components.composer);
            }
            else {
                gutil.log("The component", gutil.colors.cyan(argv.c), "is", gutil.colors.red("not defined"));
            }
            break;

        case undefined:
            break;

        default:
            if (argv.c !== true) { // argument is defined
                gutil.log("The component", gutil.colors.cyan(argv.c), "is", gutil.colors.red("not defined"));
            }
    }
    if (!argv.c) {
        if (components.hasOwnProperty('composer')) {
            sources.push(config.components.composer);
        }
        else {
            gutil.log("The component", gutil.colors.cyan("composer"), "is", gutil.colors.red("not defined"));
        }
    }
    console.log(sources);

    // type select
    var types = ['prerelease', 'patch', 'minor', 'major'];
    var options = {};
    if (types.indexOf(argv.t) > -1) { options.type = argv.t; }
    gulp.src(sources)
        .pipe(bump(options)
            .on('change', function (event) {
                gutil.log(event);
            })
            .on('error', gutil.log))
        .pipe(gulp.dest('./'));
});
gulp.task('version:minor', function(){
    gulp.src(['./composer.json'])
        .pipe(bump({type:'minor'}))
        .pipe(gulp.dest('./'));
});
gulp.task('version:major', function(){
    gulp.src(['./composer.json'])
        .pipe(bump({type:'major'}))
        .pipe(gulp.dest('./'));
});

/**
 * [dev] tasks in dev environment.
 * Usage:
 *  $ gulp
 *  $ gulp dev
 */
gulp.task('default', ['dev']);
gulp.task(
    'dev',
    ['assets:install', 'styles:dev', 'scripts:dev', 'scripts:vendor', 'fonts', 'images']
);

/**
 * [prod] tasks in prod environment
 * Usage:
 *  $ gulp prod
 */
gulp.task(
    'prod',
    ['assets:install', 'styles:prod', 'scripts:prod', 'scripts:vendor', 'fonts', 'images']
);
