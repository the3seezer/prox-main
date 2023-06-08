const gulp = require('gulp')
const browserSync = require('browser-sync').create();

gulp.task('watch', gulp.series(
    'style',
    'js',
    function () {
    browserSync.init({
        server: {
            baseDir: `./`
        },
        reloadDelay: 1000
    });
    gulp.watch('./assets/**/*.scss', gulp.series('style')).on('change', browserSync.reload);
    gulp.watch('./assets/**/*.js', gulp.series('js')).on('change', browserSync.reload);
}));
