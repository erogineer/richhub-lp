var gulp = require('gulp');// gulpプラグインの読みこみ
var browserSync = require('browser-sync');// browser-syncのプラグインの読み込み
var paths = {
  rootDir : 'htdocs',
  bowerDir : 'bower_components',
  compileDir : 'src'
};
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var htmlmin = require('gulp-minify-html');
//var riot = require('gulp-riot');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var coffee = require('gulp-coffee');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var bower = require('gulp-bower');
var bowerfiles = require('main-bower-files');
var concat = require('gulp-concat');
var filter = require('gulp-filter');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var uglify = require('gulp-uglify');


gulp.task( 'server', function() {//'browser-sync'が実行時のタスク名なります。
  browserSync({
    server: {
      baseDir: paths.rootDir //ルートとなるディレクトリを指定
    }
  });
  runSequence(['build']);
  gulp.watch(paths.compileDir + "/sass/**/*.scss", ['sass']);
  gulp.watch(paths.compileDir + "/templates/*.html", ['html']);
  gulp.watch(paths.compileDir + "/templates/riot/*.tag", ['riot']);
  gulp.watch(paths.compileDir + "/js/*.js", ['jsmin']);
  gulp.watch(paths.compileDir + "/images/**", ['imagemin']);
});
// sassファイルコンパイル情報
gulp.task('sass', function() {
  gulp.src(paths.compileDir + '/sass/**/*.scss') // 読み出したいファイル
    .pipe(plumber(notify.onError('Error: <%= error.message %>')))
    .pipe(sass({style: 'expanded'})) // 行いたい処理
    .pipe(cssmin())
    .pipe(gulp.dest(paths.rootDir + "/libs/css")); // gulp.dest(出力先)で出力先に施したファイルを出力
});
gulp.task('html', function() {
  gulp.src(paths.compileDir+ '/templates/*.html')
    .pipe(plumber(notify.onError('Error: <%= error.message %>')))
    //.pipe(htmlmin({empty : true}))
    .pipe(gulp.dest(paths.rootDir))
});

gulp.task('riot', function() {
  gulp.src(paths.compileDir+ '/templates/riot/*.tag')
    .pipe(plumber(notify.onError('Error: <%= error.message %>')))
    //.pipe(riot({compact: true}))
    .pipe(gulp.dest(paths.rootDir+ '/libs/riot'))
});

gulp.task('bower', function() {
  var bowerfile = bowerfiles();
  var jsFilter = filter('**/*.js', {restore: true});
  var cssFilter = filter('**/*.css', {restore: true});
  gulp.src(bowerfile)
    .pipe(jsFilter)
    .pipe(concat('libs/packages.js'))
    .pipe(gulp.dest(paths.rootDir))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(concat('libs/packages.css'))
    .pipe(gulp.dest(paths.rootDir));
});

// js圧縮タスク
gulp.task('jsmin', function() {
  gulp.src(paths.compileDir + '/js/*')
    .pipe(plumber(notify.onError('Error: <%= error.message %>')))
    .pipe(uglify({preserveComments: 'some'}))
    .pipe(gulp.dest(paths.rootDir+ '/libs/js'))
});

// 画像圧縮
gulp.task('imagemin', function() {
  gulp.src(paths.compileDir + '/images/*')
    .pipe(changed(paths.rootDir + '/libs/images'))
    .pipe(imagemin({optimizationLevel: 7}))
    .pipe(gulp.dest(paths.rootDir + '/libs/images'))
});

gulp.task('build', function() {
  runSequence(['bower', 'html', 'sass', 'jsmin', 'riot', 'imagemin']);
});

gulp.task('default', function() {
  runSequence(['build']);
});

