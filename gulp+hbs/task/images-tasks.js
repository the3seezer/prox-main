const gulp = require('gulp')
const config = require('../gulp.config.json')
const imagemin = require('gulp-imagemin')
const cache = require('gulp-cache')
const {argv} = require('yargs')
const gulpIf = require('gulp-if');


gulp.task('image', function () {
    let directory = argv.output
    if (directory === undefined) {
        directory = config.output
    }
    return gulp.src(['./src/assets/images/**/*.*'])
    .pipe(gulpIf(config.imgMinify, cache(imagemin())))
    .pipe(gulp.dest(`./${directory}/assets/images`));
});