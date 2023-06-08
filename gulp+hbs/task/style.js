const gulp = require('gulp')
const sass = require('gulp-sass')
const concat = require('gulp-concat')
const cssnano = require('gulp-cssnano')
const autoprefixer = require('gulp-autoprefixer')
const {argv} = require('yargs')
const config = require('../gulp.config.json')
const nop = require('gulp-nop')
const cssbeautify = require('gulp-cssbeautify')

let directory = argv.output
const prox = argv.prox
if (directory === undefined) {
    directory = config.output
}

function cssUnminify(styles, filename){
    let paths = []
    styles.forEach((js) => {
        paths.push(js.replace('{directory}', directory))
    })

    return gulp.src(paths)
        .pipe(sass({
            includePaths: ["./node_modules"],
            outputStyle: "compressed"
        }))
        .pipe(autoprefixer())
        .pipe(cssbeautify({
            indent: '  ',
            openbrace: 'separate-line',
            autosemicolon: true
        }))
        .pipe(concat(filename))
        .pipe(gulp.dest(`./${directory}/assets/css/`))
}

function styleTask(styles, filename) {
    let paths = []
    styles.forEach((js) => {
        paths.push(js.replace('{directory}', directory))
    })

    return gulp.src(paths)
        .pipe(sass({
            includePaths: ["./node_modules"],
            outputStyle: "compressed"
        }))
        .pipe(cssnano())
        .pipe(concat(filename))
        .pipe(gulp.dest(`./${directory}/assets/css/`))
    
}

gulp.task('style:backend', function(){
    let styles = config.backend.assets.style;
    cssUnminify(styles, 'backend.css')
    return styleTask(styles, 'backend.min.css')
})

gulp.task('style:frontend', function(){
    let styles = config.frontend.assets.style;
    cssUnminify(styles, 'frontend.css')
    return styleTask(styles, 'frontend.min.css')
})

gulp.task('style:intro', function(){
    let styles = config.intro.assets.style;
    if (prox !== undefined && prox) {
        return gulp.src('.').pipe(nop())
    } else {
        return styleTask(styles, 'intro.min.css')
    }
})

gulp.task('style', gulp.series('style:backend','style:frontend', 'style:intro'));