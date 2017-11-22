var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task("test", shell.task("./node_modules/mocha/bin/mocha"));
