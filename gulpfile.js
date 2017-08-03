var gulp        = require('gulp');
var slm         = require('gulp-slm');
var sass        = require('gulp-sass');
var browserify  = require('gulp-browserify');
var git         = require('gulp-git');
var rename      = require("gulp-rename");
var gulpif      = require('gulp-if');
var uglify      = require('gulp-uglify');
var s3          = require('gulp-s3-upload')();
var sassVar     = require('gulp-sass-variables');
var contentful  = require('contentful')
var merge       = require('merge-stream');
var marked      = require('marked');

var version = ''

function task_tag(ex) {
    git.exec({args : 'describe --tags'}, function done(err, stdout) {
        version = stdout.trim();
        console.log(version);
        ex();
    });
};

function task_sass() {
    return gulp.src('./src/**/*.scss')
        .pipe(sassVar({
            $version: version
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(rename({
            suffix : '-' + version,
        }))
        .pipe(gulp.dest('./dist/'));
};


function task_browserify() {
    return gulp.src('src/app.js')
    .pipe(browserify({
        insertGlobals : true,
        debug : false
    }))
    .pipe(rename({
        suffix : '-' + version,
    }))
    .pipe(gulp.dest('dist/'))
};


marked.setOptions({"gfm": true, "tables": true, "breaks": true, "smartypants": true, "sanitize": false });
function task_slm() {
  return gulp.src('./src/*.slm')
    .pipe(slm({
      locals: {
        marked: marked,
        version: version
      }}))
    .pipe(gulp.dest('./dist/'))
};


function task_copy() {
    return gulp.parallel(
      function copy_modules() {
        return gulp.src(['node_modules/**/*.css'])
        .pipe(gulpif("*.css", gulp.dest('dist/node_modules/')));
    },
    function copy_external() {
        return gulp.src(['src/external/**']).pipe(gulp.dest('dist/external/'));
    },
    function copy_fonts() {
        return gulp.src(['node_modules/font-awesome/fonts/**']).pipe(gulp.dest('dist/fonts'));
    },
    function copy_assets() {
        return gulp.src(['assets/**']).pipe(gulp.dest('dist/assets/'));
    },
    function copy_images() {
        return gulp.src('src/img/**')
        .pipe(rename({
            suffix : '-' + version,
        }))
        .pipe(gulp.dest("./dist/img/"));
    });
};


gulp.task('default', gulp.series(task_tag, task_sass, task_browserify, task_slm, task_copy()));


gulp.task("deploy",
    gulp.series(function upload_all(){
        return gulp.src("./dist/**")
        .pipe(gulpif('!*index.html', s3({
            Bucket: 'www.korhal.io',
            ACL:    'public-read'
        })));
    },
    function upload_index() {
        return gulp.src("./dist/**")
        .pipe(gulpif('*index.html', s3({
            Bucket: 'www.korhal.io',
            ACL:    'public-read'
        })));
    }
));
