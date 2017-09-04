var gulp = require('gulp');
var sass = require('gulp-sass');//Sass converter
var rename = require('gulp-rename');//Rename file
var autoprefixer = require('gulp-autoprefixer');//Add prefix to css properties 
var cleanCSS = require('gulp-clean-css');//Minificastion css files(and delete all comments)
var concat = require('gulp-concat');//Concatenating js-files
var uglify = require('gulp-uglify');//Compress js-files
var imagemin = require('gulp-imagemin');//Compress images
var cache = require('gulp-cache'); //Connect library for caching

/* JS */
gulp.task('js', function() {
    return gulp.src([
            'App_Gulp/js/added.js',
            'App_Gulp/js/common.js' //Always in the end
        ])
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('Content/js'));
});

/* SASS */
gulp.task('sass', function() {
    return gulp.src('./App_Gulp/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))//Convert scss to css
        .pipe(rename({ suffix: '.min' }))//Add siffix 'min'
        .pipe(autoprefixer(['last 15 versions']))//Add prefix
        .pipe(cleanCSS())//Minification
        .pipe(gulp.dest('./Content/css'));
});

/* IMAGE */
gulp.task('imagemin', function() {
    return gulp.src('App_Gulp/img/**/*')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('Content/img'));
});

/* WATCH */
gulp.task('watch', ['sass', 'js', 'imagemin'], function () {
    gulp.watch('App_Gulp/sass/**/*.scss', ['sass']);//Monitoring SCSS files in the folder 'sass'
    gulp.watch(['App_Gulp/js/common.js'], ['js']); //Monitoring JS files in the folder 'js'
});

/* DEFAULT */
gulp.task('default', ['watch']);