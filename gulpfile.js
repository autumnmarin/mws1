var gulp = require('gulp');
var smushit = require('gulp-smushit');
const imagemin = require('gulp-imagemin');

gulp.task('default', function () {
    return gulp.src('img/*')
        .pipe(smushit({
            verbose: true
        }))
        .pipe(gulp.dest('smushit-img'));
});


gulp.task('default',function(){
return gulp.src('img/*')
.pipe(imagemin({progressive: true, optimizationLevel: 5}))
.pipe(gulp.dest('./imgnew/'));
});
