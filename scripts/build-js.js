const gulp = require("gulp");
const minify = require("gulp-minify");
const concat = require("gulp-concat");

return gulp.src(["./src/js/*.js"])
  .pipe(gulp.dest("./static/"));
