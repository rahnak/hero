var gulp   = require('gulp');
var sass   = require('gulp-sass');
var ts     = require('gulp-typescript');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var bSync  = require('browser-sync').create();

var tsConfig = ts.createProject('tsconfig.json');

gulp.task('sass', function() {
    return gulp
        .src('./src/sass/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./build/css'))
        .pipe(bSync.stream());
});

gulp.task('typescript', function() {
    var result = tsConfig
        .src()
        .pipe(tsConfig());

    return result.js.pipe(gulp.dest('./build/js'));
});

gulp.task('watch:typescript', ['typescript'], function(done) {
    bSync.reload();
    done();
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

gulp.task('release', ['release:css', 'release:js']);

gulp.task('run', ['sass', 'typescript'], function() {
    bSync.init({
        server: {
            baseDir: './build'
        }
    });

    gulp.watch('./src/sass/*.scss', ['sass']);
    gulp.watch('./src/typescript/*.ts', ['watch:typescript']);
});

gulp.task('default', ['run']);