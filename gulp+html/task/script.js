const gulp = require('gulp')
const terser = require('terser');
const gulpTerser = require('gulp-terser');
const wait = require('gulp-wait')
const concat = require('gulp-concat')
const config = require('../gulp.config.json')
const {argv} = require('yargs')

let directory = argv.output
if (directory === undefined) {
    directory = config.output
}

gulp.task('js-move', function () {
    return gulp.src(['./src/assets/js/**/*.js'])
        .pipe(gulp.dest(`./assets/js`));
});

function jsTask(scripts, filename) {
    let paths = []
    scripts.required.forEach((js) => {
        paths.push(js.replace('{directory}', directory))
    })
    scripts.optional.forEach((js) => {
        paths.push(js.replace('{directory}', directory))
    })
    return gulp.src(paths)
            .pipe(wait(500))
            .pipe(concat(filename))
            .pipe(gulpTerser({}, terser.minify))
            .pipe(gulp.dest(`./assets/js`));
}

gulp.task('js-mini:backend', function() {
    const scripts = config.backend.assets.js
    return jsTask(scripts, 'backend-bundle.min.js')
})
gulp.task('js-mini:frontend', function() {
    const scripts = config.frontend.assets.js
    return jsTask(scripts, 'frontend-bundle.min.js')
})

gulp.task('js', gulp.series('js-move','js-mini:backend', 'js-mini:frontend'))