const gulp = require('gulp');
var babel = require("gulp-babel");

gulp.task('default', () =>
    gulp.src('img/*.jpg')
        .pipe(webp())
        .pipe(gulp.dest('dist'))
);

gulp.task("default", function () {
  return gulp.src("src/app.js")
    .pipe(babel())
    .pipe(gulp.dest("dist"));
});
