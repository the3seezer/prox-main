const gulp = require('gulp')

gulp.task('build', gulp.series([
    'style',
    'js'
]))