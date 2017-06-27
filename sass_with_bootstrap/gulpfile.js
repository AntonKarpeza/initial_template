var gulp = require('gulp'), //Connect Gulp
		gutil          = require('gulp-util' ),
		browserSync    = require('browser-sync'),
		sass           = require('gulp-sass'), //Connect Sass
		concat         = require('gulp-concat'), //Connect gulp-concut (for concatenating files)
		uglify         = require('gulp-uglifyjs'), //Connect gulp-uglifyjs (for squeeze JS)
		rename         = require('gulp-rename'), //Connect library for rename files
		del            = require('del'), //Connect library for remove files and folders
		imagemin       = require('gulp-imagemin'), //Connect library for working with images
		cache          = require('gulp-cache'), //Connect library for caching
		autoprefixer   = require('gulp-autoprefixer'), //Connect library for automatic addition of prefixes
		cleanCSS       = require('gulp-clean-css'),
		ftp            = require('vinyl-ftp'),
		notify         = require("gulp-notify"),
		rsync          = require('gulp-rsync');

/* --------------------- BROWSER-SYNC ------------------------ */
gulp.task('browser-sync', function () { // Create a task 'browser-sync'
	browserSync({ //Perfome the browser
		server: { //Definition of server parameters
			baseDir: 'app',//Directory for server - folder 'app'
			index: "index.html"//File that browser looks after
		},
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
		notify: false //Disable notifications
	});
});

/* --------------------- SASS ------------------------ */
gulp.task('sass', function(){
	return gulp.src('app/sass/**/*.sass') //Choose files
	.pipe(sass({outputStyle: 'expand'}).on("error", notify.onError())) //Convert Sass to CSS with gulp-sass
	.pipe(rename({suffix: '.min', prefix : ''}))//Make prefixes
	.pipe(autoprefixer(['last 15 versions'])) 
	.pipe(claenCSS()) //Optionally, comment out when debugging
	.pipe(gulp.dest('app/css')) //Transfer to the folder 'app/css'
	.pipe(browserSync.reload({stream: true}));
});

/* --------------------- COMMON-JS ------------------------ */
gulp.task('common-js', function() {
	return gulp.src([
		'app/js/common.js',
		])
	.pipe(concat('common.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});

/* --------------------- JS ------------------------ */
gulp.task('js' ['common-js'], function () {
	return gulp.src([ //Select all the necessary libraries
		'app/libs/default/jQuery/jquery-2.1.3.min.js',
		'app/js/common.min.js'//Always in the end
	])
		.pipe(concat('script.min.js')) //Collect in new file "script.min.js"
		//.pipe(uglify()) //Compress JS-file
		.pipe(gulp.dest('app/js')) //Transfer to the folder 'app/js'
		.pipe(browserSync.reload({stream: true}));
});

/* --------------------- WATCH ------------------------ */
//['Parameters that run before "watch"']
gulp.task('watch',['sass' ,'js' ,'browser-sync'], function(){
	gulp.watch('app/sass/**/*.sass', ['sass']); //Monitoring SASS files in the folder 'sass'
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']); //Monitoring JS files in the folder 'js'
	gulp.watch('app/*.html', browserSync.reload); //Monitoring HTML files in the folder 'app'
});

/* --------------------- IMG ------------------------ */
gulp.task('imgemin', function(){
	return gulp.src('app/img/**/*')//Choose all images 
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/img')); //Transfer IMG to the folder 'dist/img'
});

/* --------------------- BUILD ------------------------ */
gulp.task('build',['removedist', 'imgemin' ,'sass', 'js'], function(){

	var buildFiles = gulp.src([
		'app/*.html',
		'app/.htaccess',
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([ //Assembling CSS-files to production
		'app/css/main.min.css',
	]).pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src('app/fonts/**/*') //Transfer FONTS to production
		.pipe(gulp.dest('dist/fonts'));

	var buildJs = gulp.src([
		'app/js/scripts.min.js', //Transfer SCRIPTS to production
		]) .pipe(gulp.dest('dist/js'));
});

/* --------------------- DEPLOY ------------------------ */
gulp.task('deploy', function() {

	var conn = ftp.create({
		host:      'hostname.com',
		user:      'username',
		password:  'userpassword',
		parallel:  10,
		log: gutil.log
	});

	var globs = [
	'dist/**',
	'dist/.htaccess',
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/path/to/folder/on/server'));

});

/* --------------------- RSYNC ------------------------ */
gulp.task('rsync', function() {
	return gulp.src('dist/**')
	.pipe(rsync({
		root: 'dist/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		archive: true,
		silent: false,
		compress: true
	}));
});

/* --------------------- CLEARCACH ------------------------ */
gulp.task('clearcach', function () { return cache.clearAll(); });

/* --------------------- REMOVEDIST------------------------ */
gulp.task('removedist', function () { return del.sync('dist'); //Removes the folder 'dist' before assembly });

/* --------------------- DEFAULT ------------------------ */
gulp.task('default', ['watch']);
