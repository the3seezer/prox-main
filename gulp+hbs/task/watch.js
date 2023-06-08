const gulp = require('gulp')
const browserSync = require('browser-sync').create();
const config = require('../gulp.config.json')
const {argv} = require('yargs')

gulp.task('watch', gulp.series(
    'clean',
    'style',
    'html-hbs',
    'image',
    'vendor',
    'js',
    function () {
    let directory = argv.output
    if (directory === undefined) {
        directory = config.output
    }
    browserSync.init({
        server: {
            baseDir: `./${directory}`
        },
        reloadDelay: 1000
    });
    gulp.watch('./src/**/*.hbs', gulp.series('html-hbs')).on('change', browserSync.reload);
    gulp.watch('./src/**/*.scss', gulp.series('style')).on('change', browserSync.reload);
    gulp.watch('./src/**/*.js', gulp.series('js')).on('change', browserSync.reload);
}));
