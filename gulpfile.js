const gulp = require('gulp');


gulp.task('default', () =>
    gulp.src('img/*.jpg')
        .pipe(webp())
        .pipe(gulp.dest('dist'))
);
