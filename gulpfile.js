'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var notify = require('gulp-notify');
var minifyCSS = require('gulp-minify-css');
var watchify = require('watchify');
var jasmine = require('gulp-jasmine');
var karma = require('karma').server;
var sass = require('gulp-sass');
var react = require('gulp-react');
var plumber = require('gulp-plumber');

var path = {
  HTML_SRC: './client/src/index.html',
  HTML_PUBLIC: './client/dist/public',
  CSS_SRC: './client/src/css/style.scss',
  CSS_PUBLIC: './client/dist/public/css',
  ENTRY_POINT: './client/src/js/App.jsx',
  OUT: 'bundle.js',
  PUBLIC: './client/dist/public/js',
  JS_SRC: './client/src/js/**.js',
  IMAGES_SRC: './client/src/images/**',
  IMAGES_PUBLIC: './client/dist/public/images',
  BOWER_SRC: './client/src/bower_components/**',
  BOWER_PUBLIC: './client/dist/bower_components',
  SPEC: './spec/client/**.js',
  JSX_SRC: './client/src/js/components/**',
  JXS_OTHER_SRC: './client/src/js/stores/**',
  SPEC_JSX_SRC: './spec/client/**',
  COMPILED: './spec/compiled'
};

// Convert JSX templates to individual JS files
gulp.task('react', function() {
  return gulp.src([path.JSX_SRC, path.JXS_OTHER_SRC, path.SPEC_JSX_SRC])
    .pipe(react())
    .pipe(gulp.dest(path.COMPILED));
});

gulp.task('test', function (done) {
  // karma.start({
  //   configFile: __dirname + '/karma.conf.js',
  //   singleRun: true
  // }, done);
  return gulp.src([path.SPEC])
    .pipe(jasmine());
});

// Copy image files to dist
gulp.task('images', function(){
  gulp.src([path.IMAGES_SRC])
  .pipe(gulp.dest(path.IMAGES_PUBLIC))
  .pipe(notify('Stego assets have been copied over!'));
});

// Copy bower components to dist
gulp.task('bower', function(){
  gulp.src([path.BOWER_SRC])
  .pipe(gulp.dest(path.BOWER_PUBLIC))
  .pipe(notify('Bower components have been copied over!'));
});

// Copy HTML file to dist
gulp.task('html', function(){
  return gulp.src([path.HTML_SRC])
  .pipe(gulp.dest(path.HTML_PUBLIC))
  .pipe(notify('Stego HTML Build Complete!'));
});

// HTML Watch task
gulp.task('watch-html', function(){
  gulp.watch(path.HTML_SRC, function(){
    return gulp.src([path.HTML_SRC])
    .pipe(gulp.dest(path.HTML_PUBLIC))
    .pipe(notify('WATCH: Stego HTML Build Complete!'));
  });
});

// Compile JSX file to build.js
gulp.task('jsx', function(){
  browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify]
  })
  .bundle()
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.PUBLIC))
    .pipe(notify('Stego JSX Build Complete!'));
});

// JSX Watch task
gulp.task('watch-jsx', function(){
  var watcher = watchify(browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true
  }));

  return watcher.on('update', function(){
    watcher.bundle()
    .pipe(plumber())
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.PUBLIC))
    .pipe(notify('WATCH: Stego JS Build Complete!'));
  })
    .bundle()
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.PUBLIC));
});

// Compile Sass and minify styles files to dist
gulp.task('css', function(){
  gulp.src(path.CSS_SRC)
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(gulp.dest(path.CSS_PUBLIC))
    .pipe(notify('Stego CSS Build Complete!'));
});

// Sass/CSS Watch task
gulp.task('watch-css', function(){
  gulp.watch(path.CSS_SRC, function(){
    gulp.src(path.CSS_SRC)
    .pipe(plumber())
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(gulp.dest(path.CSS_PUBLIC))
    .pipe(notify('WATCH: Stego Styles Build Complete!'));
  });
});

// Copy non-JSX Javascript files to dist
gulp.task('js', function(){
  gulp.src([path.JS_SRC])
  .pipe(gulp.dest(path.PUBLIC))
  .pipe(notify('JS sources have been copied over!'));
});

// Watch for changes in non-JSX Javscript files
gulp.task('watch-js', function(){
  gulp.watch(path.JS_SRC, function(){
    return gulp.src([path.JS_SRC])
    .pipe(plumber())
    .pipe(gulp.dest(path.PUBLIC))
    .pipe(notify('JS sources have been copied over!'));
  });
});

// When "gulp" is run in the terminal, this is what will be called
gulp.task('build', ['jsx', 'js', 'html', 'css', 'images', 'bower']);
gulp.task('default', ['watch-js', 'watch-jsx', 'watch-html', 'watch-css']);
