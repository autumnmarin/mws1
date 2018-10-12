const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');

gulp.task('mozjpeg', () =>
    gulp.src('img/*.jpg')
    .pipe(imagemin([imageminMozjpeg({
        quality: 85

    })]))
    .pipe(gulp.dest('dist'))
);
