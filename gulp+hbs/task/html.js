const gulp = require('gulp')
const config = require('../gulp.config.json')
const handlebars = require('handlebars')
const gulpHandlebars = require('gulp-compile-handlebars')
const layouts = require('handlebars-layouts')
const rename = require('gulp-rename')
const {argv} = require('yargs')
const Sidebar = require('../JsonData/sidebar.json')
layouts.register(handlebars)

gulp.task('html-hbs', function(){
    let directory = argv.output
    if (directory === undefined) {
        directory = config.output
    }
	const options = {
		ignorePartials: true,
        batch: ['./src/templates/']
    }

    const paths = [
        'src/templates/pages/**/*.hbs',
    ]

    const skipApp = []

    for (let app in config.pages.skip.app) {
        skipApp[app] = `!src/templates/pages/app/${config.pages.skip.app[app]}*.hbs`
        for (let index in Sidebar) {
            if (Sidebar[index].name == 'app') {
                const rm = Sidebar[index].children.findIndex(item => item.name === config.pages.skip.app[app])
                    if (rm > -1) {
                        Sidebar[index].children.splice(rm,1)
                    }
            }
        }
    }

    const skipBackend = []

    for (let index in Sidebar) {
        if (Sidebar[index].children !== undefined) {
            if (Sidebar[index].children.length > 0) {
                for (let backend in config.pages.skip.backend) {
                    const rm = Sidebar[index].children.findIndex(item => item.name === config.pages.skip.backend[backend])
                    if (rm > -1) {
                        Sidebar[index].children.splice(rm,1)
                    }
                }
            }
        }
    }

    for (let backend in config.pages.skip.backend) {
        skipBackend[backend] = `!src/templates/pages/backend/${config.pages.skip.backend[backend]}*.hbs`
        const rm = Sidebar.findIndex(item => item.name === config.pages.skip.backend[backend])
        if (rm > -1) {
            Sidebar.splice(rm,1)
        }
    }

    const skipLanding = []

    for (let landing in config.pages.skip.landing) {
        skipLanding[landing] = `!src/templates/pages/frontend/${config.pages.skip.landing[landing]}*.hbs`
    }
    return gulp.src(paths.concat(skipBackend, skipApp, skipLanding))
        .pipe(gulpHandlebars({
            layout: `layouts/backend/${config.backend.layout}`,
            defaultMenu: config.backend.layoutMenu,
            appName: config.appName,
            logo: config.logo,
            sidebarList: Sidebar
        }, options))
        .pipe(rename({
            extname: '.html'
        }))
        .pipe(gulp.dest(`./${directory}`));
});