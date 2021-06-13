const { src, dest, series } = require('gulp')
const stylus = require('gulp-stylus')
const pug = require('gulp-pug')

const DIST_DIR = 'dist'

function views (cb) {
  src('src/index.pug')
    .pipe(pug())
    .pipe(dest(DIST_DIR))
  cb()
}

function styles (cb) {
  src('src/index.styl')
    .pipe(stylus())
    .pipe(dest(DIST_DIR))
  cb()
}

exports.default = series(views, styles)
