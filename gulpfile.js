var gulp = require("gulp");
var browserify = require("browserify");
var reactify = require("reactify");
var source = require("vinyl-source-stream");

gulp.task("bundle", function () {
    return browserify({
        entries: "./main.jsx",
        debug: true
    }).transform(reactify)
        .bundle()
        .pipe(source("main.js"))
        .pipe(gulp.dest("app/dist"))
});

gulp.task("copy", ["bundle"], function () {
    return gulp.src(["views/index.html","node_modules/bootstrap-css/css/bootstrap.min.css","views/stylesheets/style.css"])
        .pipe(gulp.dest("app/dist"));
});

gulp.task("default",["copy"],function(){
   console.log("Gulp completed..."); 
});