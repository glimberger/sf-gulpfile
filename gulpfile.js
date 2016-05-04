'use strict';

var cfg = require('./config.json.dist'), // config file
    exec = require('child_process').exec;

// get working directory from config
function getWorkingDir() {
    var wd = ".";
    if (cfg.hasOwnProperty('cwd')) { wd = cfg.cwd; }
    return wd;
}


// gulp plugins
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cleanCSS = require('gulp-clean-css'),
    runSequence = require('run-sequence');


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
    var options = { cwd: getWorkingDir() };
    for (var i in cfg.bundles) {
        var source = cfg.bundles[i] + cfg.sass.src,
            dest   = cfg.bundles[i] + cfg.sass.dest;

        gulp.src(source, options)
            .pipe(sourcemaps.init())
            .pipe(sass({sourceComments: 'map'}).on('error', sass.logError))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(dest, options));
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
    var options = { cwd: getWorkingDir() };
    for (var i in cfg.bundles) {
        var source = cfg.bundles[i] + cfg.sass.src,
            dest   = cfg.bundles[i] + cfg.sass.dest;

        gulp.src(source, options)
            .pipe(sass().on('error', sass.logError))
            .pipe(cleanCSS({debug: true}, function(details) {
                console.log(details.name + ': ' + details.stats.originalSize);
                console.log(details.name + ': ' + details.stats.minifiedSize);
            }))
            .pipe(gulp.dest(dest, options));
    }
});

/**
 * copy fonts
 * Usage:
 *  $ gulp fonts
 */
gulp.task('fonts', function () {
    var options = { cwd: getWorkingDir() };
    var sources = [];
    for (var i in cfg.bundles) {
        sources.push(cfg.bundles[i] + cfg.fonts.src);
    }
    sources = sources.concat(cfg.fonts.vendor);
    gulp.src(sources, options)
        .pipe(gulp.dest(cfg.fonts.dest, options));
});

/**
 * copy images
 * Usage:
 *  $ gulp images
 */
gulp.task('images', function () {
    var options = { cwd: getWorkingDir() };
    var sources = [];
    for (var i in cfg.bundles) {
        sources.push(cfg.bundles[i] + cfg.images.src);
    }
    sources = sources.concat(cfg.images.vendor);
    gulp.src(sources, options)
        .pipe(gulp.dest(cfg.images.dest, options));
});

/**
 * run assets:install symfony command
 * Usage:
 *  $ gulp assets:install
 */
gulp.task('assets:install', function (cb) {
    var root = getWorkingDir();
    var command = [cfg.cmd.php, root +'/' + cfg.cmd.console, 'assets:install', root +'/web'].join(' ');
    gutil.log(command);
    exec(command, function (err, stdout, stderr) {
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
    var root = getWorkingDir();
    var command = [cfg.cmd.php, root +'/' + cfg.cmd.console, 'assetic:dump'].join(' ');
    exec(command, function (err, stdout, stderr) {
        gutil.log('stdout: ' + stdout);
        gutil.log('stderr: ' + stderr);
        if (err !== null) {
            console.log('exec error: ' + err);
        }
        cb(err);
    });
});

/**
 * [dev] watch for changes and run tasks
 * Usage:
 *  $ gulp watch
 */
gulp.task('watch', function () {
    var root = getWorkingDir();
    var globs = [];
    for (var i in cfg.bundles) {
        // scss files
        globs.push(root + '/' + cfg.bundles[i] + cfg.sass.watch);
        // js files
        globs.push(root + '/' + cfg.bundles[i] + cfg.js.watch)
    }
    gulp
        .watch(globs, ['styles:dev'])
        .on('change', function(event) {
            gutil.log('File', gutil.colors.cyan(event.path), 'was', gutil.colors.yellow(event.type), ', running tasks...');
        });
});

/**
 * Run`npm update` command.
 */
gulp.task('npm:update', function (cb) {
    var command = 'npm update';
    exec(command, function (err, stdout, stderr) {
        gutil.log('stdout: ' + stdout);
        gutil.log('stderr: ' + stderr);
        if (err !== null) {
            console.log('exec error: ' + err);
        }
        cb(err);
    });
});

/**
 * Run `bower install' command.
 */
gulp.task('bower:install', function (cb) {
    var options = { cwd: getWorkingDir() };
    var command = 'bower install';
    exec(command, options, function (err, stdout, stderr) {
        gutil.log('stdout: ' + stdout);
        gutil.log('stderr: ' + stderr);
        if (err !== null) {
            console.log('exec error: ' + err);
        }
        cb(err);
    });
});

/**
 * Run `bower update` command.
 */
gulp.task('bower:update', function (cb) {
    var options = { cwd: getWorkingDir() };
    var command = 'bower update';
    exec(command, options, function (err, stdout, stderr) {
        gutil.log('stdout: ' + stdout);
        gutil.log('stderr: ' + stderr);
        if (err !== null) {
            console.log('exec error: ' + err);
        }
        cb(err);
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