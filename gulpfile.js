var gulp = require('gulp'); //  The less work you have to do when performing repetitive tasks like minification, compilation, unit testing, etc 
var browserify  = require('browserify');
var reactify = require('reactify'); // Reactify is needed to convert JSX to JS
var source  = require('vinyl-source-stream'); // when we use browserify with gulp, gulp requires input that pipes through a stream
var minifyCss = require('gulp-minify-css'); 
var uglify = require('gulp-uglify');                      // browserify ends about putting up a string so we require vinyl source to convert strings into stream  
var watchify = require('watchify'); 
var gutil = require('gulp-util');             
var less = require('gulp-less');

//including watchify only for dev build
var bundler = watchify(browserify('./src/assets/js/main.js', watchify.args));
bundler.transform('reactify');
gulp.task('browserify', bundle);
bundler.on('update', bundle); 


var prodBundler = browserify('./src/assets/js/main.js', watchify.args);
prodBundler.transform('reactify');
prodBundler.on('update', bundle); 

function bundle() {
  if (gutil.env.production === true){
    return prodBundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('main.js'))
    .pipe(gulp.dest('dist/assets/js'));    
  }else{
    return bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('main.js'))
    .pipe(gulp.dest('dist/assets/js'));
  }

}

  gulp.task('copy', function(){
    gulp.src('src/index.html')
    .pipe(gulp.dest('dist'));
    gulp.src('src/assets/images/*.*')
    .pipe(gulp.dest('dist/assets/images'));
    gulp.src('src/assets/fonts/*.*')
    .pipe(gulp.dest('dist/assets/fonts'));
    gulp.src('src/assets/js/utils/vendor/**/*.*')
    .pipe(gulp.dest('dist/assets/js/vendor/'));       
  });
  gulp.task('json', function() {
    gulp.src('src/assets/js/serverMessages/server_messages.json')
    .pipe(gulp.dest('dist/assets/js/localization/'));
    gulp.src('src/assets/js/utils/vendor/i18n/*.json')
    .pipe(gulp.dest('dist/assets/js/localization/'));  
  });
  gulp.task('build-less', function(){
    return gulp.src('src/assets/css/styles.less')
    .pipe(less())
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/assets/css'));
  });

if (gutil.env.production){
  gulp.task('default',['json' ,'browserify', 'build-less' , 'copy'], function(){
    console.log("*** Production Build finished ***");
  });

}else{
  gulp.task('default',['json' ,'browserify', 'build-less' , 'copy'], function(){

    return gulp.watch('src/**/*.*', ['json','browserify','build-less','copy'])
  })

}


