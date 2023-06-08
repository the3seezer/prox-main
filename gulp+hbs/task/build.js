const gulp = require('gulp')

gulp.task('build', gulp.series([
    'clean',
    'style',
    'html-hbs',
    'image',
    'vendor',
    'js'
]))