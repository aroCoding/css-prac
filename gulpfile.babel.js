import gulp from 'gulp';
import image from 'gulp-image';
import del from 'del';
import ws from 'gulp-webserver';
import gSass from 'gulp-sass';
import nSass from 'node-sass';
const sass = gSass(nSass);
import autop from 'gulp-autoprefixer';

const routes = {
  image: {
    src: 'image/**/*',
    dest: 'img',
  },
  scss: {
    watch: 'src/scss/**/*.scss',
    src: 'src/scss/style.scss',
    dest: 'css',
  },
};

const img = () =>
  gulp.src(routes.image.src).pipe(image()).pipe(gulp.dest(routes.image.dest));

const clean = () => del(['img', 'css/style.css']);

const webserver = () =>
  gulp.src('build').pipe(ws({ livereload: true, open: true }));

const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autop())
    .pipe(gulp.dest(routes.scss.dest));

const watch = () => {
  gulp.watch(routes.image.src, img);
  gulp.watch(routes.scss.watch, styles);
};

const prepare = gulp.series([clean, img]);
const assets = gulp.series([styles]);
const live = gulp.parallel([webserver, watch]);

export const dev = gulp.series([prepare, assets, live]);
