const { src, dest, series, parallel } = require('gulp');
const sourcemaps = require('gulp-sourcemaps')

/**
  * Clean files
  */
function clean() {
  const del = require('del');

  return del([
    'build/'
  ]);
}

/**
  * Bundle HTML
  */
function htmlBundle() {
  return src('./src/*.html')
    .pipe(dest('./build'))
}

/**
  * Lint CSS
  */
function cssLint() {
  const gulpStylelint = require('gulp-stylelint');

  return src('src/css/*.css')
    .pipe(gulpStylelint({
      config: {
        extends: ['stylelint-config-standard'],
      },
      reporters: [
        {formatter: 'string', console: true}
      ]
    }));
}

/**
  * Transpile, concatenate, and minify CSS
  */
function cssBundle() {
  const postcss = require('gulp-postcss')

  return src('src/css/*.css')
    .pipe( sourcemaps.init() )
    .pipe( postcss([
      require('postcss-easy-import'), // Concatenate
      require('precss'), // Transpile Sass
      require('postcss-preset-env'), // Use modern CSS
      require('autoprefixer'), // Add vendor prefixes
      require('cssnano') // Minify
      ]) )
    .pipe( sourcemaps.write('.') )
    .pipe( dest('./build/css') )
}

/**
  * Lint JS
  */
// function jsLint() {
// }

function jsBundle() {
  const concat = require('gulp-concat');
  const uglify = require('gulp-uglify');
  const rename = require("gulp-rename");

  return src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js')) // Concatenate
    .pipe(sourcemaps.write())
    .pipe(dest('./build/js'))
    .pipe(uglify()) // Minify
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write())
    .pipe(dest('./build/js'))
}

exports.build = series(
  clean,
  parallel( htmlBundle, cssLint, /*jsLint*/ ),
  parallel( cssBundle, jsBundle )
);