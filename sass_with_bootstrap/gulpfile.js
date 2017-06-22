var gulp = require('gulp'), //Connect Gulp
	browserSync = require('browser-sync'),
	sass = require('gulp-sass'), //Connect Sass
	concat = require('gulp-concat'), //Connect gulp-concut (for concatenating files)
	uglify = require('gulp-uglifyjs'), //Connect gulp-uglifyjs (for squeeze JS)
	cssnano = require('gulp-cssnano'), //Connect packet for minification CSS
	rename = require('gulp-rename'), //Connect library for rename files
	del = require('del'), //Connect library for remove files and folders
	imagemin = require('gulp-imagemin'), //Connect library for working with IMG
	pngquant = require('imagemin-pngquant'), //Connect library for working with PNG
	cache = require('gulp-cache'), //Connect library for caching
	autoprefixer = require('gulp-autoprefixer'); //Connect library for automatic addition of prefixes


/* --------------------- BROWSER-SYNC ------------------------ */
gulp.task('browser-sync', function () { // Create a task 'browser-sync'
	browserSync({ //Perfome the browser
		server: { //Definition of server parameters
			baseDir: 'app',//Directory for server - folder 'app'
			index: "index.html"//File that browser looks after
		},
		notify: false //Disable notifications
	});
});

/* --------------------- SASS ------------------------ */
gulp.task('sass', function(){
	return gulp.src('app/sass/**/*.sass') //Choose a files
	.pipe(sass()) //Convert Sass to CSS with gulp-sass
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) //Make prefixes
	.pipe(gulp.dest('app/css')) //Transfer to the folder 'app/css'
	.pipe(browserSync.reload({stream: true}))
});

/* --------------------- SCRIPTS ------------------------ */
gulp.task('scripts', function () {
	return gulp.src([ //Select all the necessary libraries
		'app/libs/default/jQuery/jquery-2.1.3.min.js'
	])
		.pipe(concat('libs.min.js')) //Collect in new file "libs.min.js"
		.pipe(uglify()) //Compress JS-file
		.pipe(gulp.dest('app/js')); //Transfer to the folder 'app/js'
});

/* --------------------- CSS-LIBS ------------------------ */
gulp.task('css-libs',['sass'], function () {
	return gulp.src('app/css/libs.css') //Choose a file for the minifiguration
		.pipe(cssnano()) //Compress CSS
		.pipe(rename({suffix: '.min'})) //Add a suffix .min
		.pipe(gulp.dest('app/css')); //Transfer to the folder 'app/css'
});

/* --------------------- WATCH ------------------------ */
//['Parameters that run before "watch"']
gulp.task('watch',[ 'browser-sync', 'css-libs', 'scripts'], function(){
	gulp.watch('app/sass/**/*.sass', ['sass']); //Monitoring SASS files in the folder 'sass'
	gulp.watch('app/js/**/*.js', browserSync.reload); //Monitoring JS files in the folder 'js'
	gulp.watch('app/*.html', browserSync.reload); //Monitoring HTML files in the folder 'app'
	gulp.watch('app/*.php', browserSync.reload); //Monitoring PHP files in the folder 'app'
});

/* --------------------- CLEAN ------------------------ */
gulp.task('clean', function () {
	return del.sync('dist'); //Removes the folder 'dist' before assembly
});

/* --------------------- IMG ------------------------ */
gulp.task('img', function(){
	return gulp.src('app/img/**/*')//Choose all images 
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			une: [pngquant()]
		})))
	.pipe(gulp.dest('dist/img')); //Transfer IMG to the folder 'dist/img'
});

/* --------------------- BUILD ------------------------ */
gulp.task('build',['clean', 'img' ,'sass', 'scripts'], function(){
	var buildCss = gulp.src([ //Assembling CSS-files to production
		'app/css/main.css',
		'app/css/libs.min.css',
		'app/css/fonts.css'
	])
	.pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src('app/fonts/**/*') //Transfer FONTS to production
		.pipe(gulp.dest('dist/fonts'));

	var buildJs = gulp.src('app/js/**/*') //Transfer SCRIPTS to production
		.pipe(gulp.dest('dist/js'));

	var buildHtml = gulp.src('app/*.html') //Transfer HTML to production
		.pipe(gulp.dest('dist'));

	var buildPhp = gulp.src('app/*.php') //Transfer PHP to production
		.pipe(gulp.dest('dist'));
});

/* --------------------- CLEAR ------------------------ */
gulp.task('clear', function (callback) {
	return cache.clearAll();
});

/* --------------------- DEFAULT ------------------------ */
gulp.task('default', ['watch']);
