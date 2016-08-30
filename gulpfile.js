'use strict';

const stylus = require('gulp-stylus');
const pug = require('gulp-pug');
const gulp = require('gulp');
const Duo = require('duo');

gulp.task('default', ['views', 'styles', 'scripts']);

gulp.task('views', () => {
  gulp.src('views/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('build'));
});

gulp.task('styles', () => {
  gulp.src('styles/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('build'));
});

gulp.task('scripts', () => {
  Duo(__dirname)
    .entry('scripts/index.js')
    .write((err) => {
      if (err) throw err;
    });
});

gulp.task('watch', () => {
  gulp.watch('scripts/**/*.js', ['scripts']);
  gulp.watch('styles/**/*.styl', ['styles']);
  gulp.watch('views/**/*.pug', ['views']);
});
