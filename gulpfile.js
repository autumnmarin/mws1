const gulp = require('gulp');
const webp = require('gulp-webp');

gulp.task('default', () =>
    gulp.src('img/*.jpg')
        .pipe(webp())
        .pipe(gulp.dest('dist'))
);
