var gulp = require("gulp"),
  gutil = require("gulp-util"),
  sass = require("gulp-sass"),
  browserSync = require("browser-sync"),
  autoprefixer = require("gulp-autoprefixer"),
  uglify = require("gulp-uglify"),
  jshint = require("gulp-jshint"),
  header = require("gulp-header"),
  rename = require("gulp-rename"),
  cssnano = require("gulp-cssnano"),
  sourcemaps = require("gulp-sourcemaps"),
  package = require("./package.json"),
  fs = require("fs"),
  pug = require("gulp-pug");

const LOCALS = JSON.parse(fs.readFileSync("./src/locals.json"));

var banner = [
  "/*!\n" +
    " * <%= package.name %>\n" +
    " * <%= package.title %>\n" +
    " * <%= package.url %>\n" +
    " * @author <%= package.author %>\n" +
    " * @version <%= package.version %>\n" +
    " * Copyright " +
    new Date().getFullYear() +
    ". <%= package.license %> licensed.\n" +
    " */",
  "\n"
].join("");

gulp.task("css", function() {
  return gulp
    .src("src/scss/style.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer("last 4 version"))
    .pipe(gulp.dest("app/static/css"))
    .pipe(cssnano())
    .pipe(rename({ suffix: ".min" }))
    .pipe(header(banner, { package: package }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("app/static/css"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("js", function() {
  gulp
    .src("src/js/scripts.js")
    .pipe(sourcemaps.init())
    .pipe(jshint(".jshintrc"))
    .pipe(jshint.reporter("default"))
    .pipe(header(banner, { package: package }))
    .pipe(gulp.dest("app/static/js"))
    .pipe(uglify())
    .on("error", function(err) {
      gutil.log(gutil.colors.red("[Error]"), err.toString());
    })
    .pipe(header(banner, { package: package }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("app/static/js"))
    .pipe(browserSync.reload({ stream: true, once: true }));
});

gulp.task("templates", function buildHTML() {
  return gulp
    .src("src/templates/*.pug")
    .pipe(pug({ locals: LOCALS, pretty: true }))
    .pipe(gulp.dest("app/"));
});

gulp.task("fonts", function() {
  return gulp.src("src/fonts/*").pipe(gulp.dest("app/static/fonts"));
});

gulp.task("images", function() {
  return gulp.src("src/img/*").pipe(gulp.dest("app/static/img"));
});

gulp.task("browser-sync", function() {
  browserSync.init(null, {
    server: "./app",
    open: false
  });
});
gulp.task("bs-reload", function() {
  browserSync.reload();
});

gulp.task(
  "default",
  ["css", "js", "templates", "images", "fonts", "browser-sync"],
  function() {
    gulp.watch("src/scss/**/*.scss", ["css"]);
    gulp.watch("src/js/*.js", ["js"]);
    gulp.watch("src/img/*", ["images"]);
    gulp.watch("src/fonts/*", ["fonts"]);
    gulp.watch("src/templates/**/*.pug", ["templates"]);
    gulp.watch("src/locals.json", ["templates"]);
    gulp.watch("app/*.html", ["bs-reload"]);
  }
);

gulp.task("build", ["css", "js", "templates", "images", "fonts"]);
