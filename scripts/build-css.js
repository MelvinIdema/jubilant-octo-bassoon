const gulp = require("gulp");
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const minify = require("gulp-minify");
const autoprefixer = require("gulp-autoprefixer");

return gulp
  .src(["./src/css/*.css"])
  .pipe(cleanCSS())
  .pipe(minify())
  .pipe(
    autoprefixer({
      cascade: false,
    }),
  )
  .pipe(gulp.dest("./static/"));
