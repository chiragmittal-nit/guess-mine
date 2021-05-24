import { src, dest, series, parallel, watch } from "gulp";
import sass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer"; // so that gulp converts scss to browser compatible css
import minifyCss from "gulp-csso"; // minifies the resultant css
import uglify from "gulp-uglify";
import babel from "babelify";
import rename from "gulp-rename";
import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";
import browserify from "browserify";
import del from "del";

sass.compiler = require("node-sass"); // don't know what it does , just copied from npm page of 'gulp-sass'

const path = {
  scss: {
    src: "src/assets/scss/styles.scss",
    dest: "src/public",
    watch: "src/assets/scss/**/*.scss",
  },
  js: {
    src: "src/assets/js/main.js",
    dest: "src/public",
    watch: "src/assets/js/**/*.js",
  },
};

function clean() {
  return del("src/public");
}

function jsTask() {
  const bundler = browserify({ entries: path.js.src }).transform(babel, {
    presets: ["@babel/preset-env"],
  });
  return bundler
    .bundle()
    .pipe(source("bundle.min.js"))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(dest(path.js.dest));
}
function scssTask() {
  return src(path.scss.src)
    .pipe(sass())
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(minifyCss())
    .pipe(rename("styles.min.css"))
    .pipe(dest(path.scss.dest));
}

function watchFiles() {
  watch([path.scss.watch, path.js.watch], parallel(jsTask, scssTask));
}
export default series(clean, parallel(jsTask, scssTask), watchFiles);
