'use strict';
const {src,dest,series} = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass')(require('sass'));
const rename = require("gulp-rename");
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const destino = "dist";


function cssminificar_css() {
    return src("./public/sass/**/*.scss")
            .pipe(sass())
            .pipe(cleanCSS())
            .pipe(rename('main.min.css'))
            .pipe(dest("./public/css"));
             // .pipe(dest("./public/css"));
}

function js(){
    return src("./public/js//*")
           .pipe(concat("main.min.js"))
           .pipe(uglify())
           .pipe(dest("./public/js"));
}

exports.cssmin = cssminificar_css;
exports.js = js;


//gulp cssmin
//gulp js