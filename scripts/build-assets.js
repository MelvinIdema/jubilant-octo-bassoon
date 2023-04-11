const gulp = require("gulp");

return gulp.src([
  "./src/images/**/*.*",
])
  .pipe(gulp.dest("./static/"));
