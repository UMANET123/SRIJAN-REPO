var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('scss', function () {
    return gulp.src('public/scss/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 4 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('public/css/'))
});

// gulp.task('watch',
//     gulp.series('clean', gulp.parallel('scss'),
//         function () {
//             gulp.watch('scss/**/*.scss', ['scss']);
//         })
// );

gulp.task('watch', ['scss'], function () {
    gulp.watch('public/scss/**/*.scss', ['scss']);
});
