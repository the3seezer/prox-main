const gulp = require('gulp')
const sass = require('gulp-sass')
const concat = require('gulp-concat')
const cssnano = require('gulp-cssnano')
const {argv} = require('yargs')
const config = require('../gulp.config.json')

let directory = argv.output
if (directory === undefined) {
    directory = config.output
}

function styleTask(styles, filename) {
    let paths = []
    styles.forEach((js) => {
        paths.push(js.replace('{directory}', directory))
    })

    return gulp.src(paths)
        .pipe(sass({
            includePaths: ["node_modules"],
            outputStyle: "compressed"
        }))
        .pipe(cssnano())
        .pipe(concat(filename))
        .pipe(gulp.dest(`./assets/css/`))
    
}

gulp.task('style:backend', function(){
    let styles = config.backend.assets.style;
    return styleTask(styles, 'backend.min.css')
})

gulp.task('style:frontend', function(){
    let styles = config.frontend.assets.style;
    return styleTask(styles, 'frontend.min.css')
})

gulp.task('style', gulp.series('style:backend','style:frontend'));