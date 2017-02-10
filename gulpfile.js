var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    htmlmin     = require('gulp-htmlmin'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    tslint      = require('gulp-tslint'),
    typescript  = require('gulp-typescript'),
    uglify      = require('gulp-uglify'),
    browsersync = require('browser-sync').create();

var tsConfig = typescript.createProject('tsconfig.json');

gulp.task('dependencies', function() {
    return gulp
        .src('./node_modules/lz-string/libs/lz-string.min.js')
        .pipe(gulp.dest('./source/js'))
        .pipe(gulp.dest('./build/js'))
        .pipe(gulp.dest('./release/js'));
});

gulp.task('sass', function() {
    return gulp
        .src('./source/sass/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./build/css'))
        .pipe(browsersync.stream());
});

gulp.task('lint', function() {
    return gulp
        .src('./source/typescript/*.ts')
        .pipe(tslint({
            formatter: "stylish"
        }))
        .pipe(tslint.report({emitError: false}))
});

gulp.task('typescript', ['lint'], function() {
    var result = tsConfig
        .src()
        .pipe(sourcemaps.init())
        .pipe(tsConfig());

    return result.js
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('./build/js'));
});

gulp.task('watch:typescript', ['typescript'], function(done) {
    browsersync.reload();
    done();
});

gulp.task('release:html', function() {
    return gulp
        .src('./build/index.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./release'));
});

gulp.task('release:css', function() {
    return gulp
        .src('./build/css/main.css')
        .pipe(gulp.dest('./release/css'));
});

gulp.task('release:js', function() {
    return gulp
        .src([
            './build/js/game.js',
            './build/js/main.js'
        ])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./release/js'));
});

gulp.task('release', ['dependencies', 'release:html', 'release:css', 'release:js']);

gulp.task('run', ['dependencies', 'sass', 'typescript'], function() {
    browsersync.init({
        server: {
            baseDir: './build'
        }
    });

    gulp.watch('./build/index.html').on('change', browsersync.reload);
    gulp.watch('./source/sass/*.scss', ['sass']);
    gulp.watch('./source/typescript/*.ts', ['watch:typescript']);
});

gulp.task('default', ['run']);