var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    spritesmith  = require("gulp.spritesmith"),
    cssmin       = require('gulp-cssmin'),
    jade         = require('gulp-jade');

gulp.task('watch', function() {
    gulp.watch('htdocs/sass/*.scss', ['sass']);
    gulp.watch('htdocs/sprite/*', ['sprite']);
    gulp.watch('htdocs/jade/*', ['jade']);
});
gulp.task('sass', function () {
    gulp.src('htdocs/sass/*.scss')
        .pipe(sass())
        .pipe(autoprefixer("last 2 version", "ie 8", "ie 7"))
        .pipe(gulp.dest('htdocs/css'));
});
gulp.task('sprite', function () {
    var spriteData = gulp.src('htdocs/sprite/*')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.scss'
        }));
    spriteData.img.pipe(gulp.dest('htdocs/image'));
    spriteData.css.pipe(gulp.dest('htdocs/sass'));
});

gulp.task('deploy', function () {
    gulp.src('htdocs/css/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('htdocs/css'));
});

gulp.task('jade', function () {
    gulp.src('htdocs/jade/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('htdocs/'));
});