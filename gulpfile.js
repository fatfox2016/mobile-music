var gulp = require("gulp");
var htmlClean = require("gulp-htmlclean");
var imgMin = require("gulp-imagemin");
var newer = require("gulp-newer");
var uglify = require("gulp-uglify");
var strip = require("gulp-strip-debug");
var concat = require("gulp-concat");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var cssnano = require("cssnano");
var connect = require("gulp-connect");

console.log(process.env.NODE_ENV == "producation")
var devMode = process.env.NODE_ENV == "development";

var folder = {
    src: "./src/",  //开发目录
    build: "./build/"  //压缩打包后目录
}

// 流读取文件   task running grunt
gulp.task("images", function () {
    gulp.src(folder.src + "images/*")
        .pipe(newer(folder.build + "images"))
        .pipe(imgMin())
        .pipe(gulp.dest(folder.build + "images/"))
})

gulp.task("html", function () {
    var page = gulp.src(folder.src + "html/*")
        .pipe(connect.reload());
    if (!devMode) {
        page.pipe(htmlClean());
    }
    page.pipe(gulp.dest(folder.build + "html/"))
})

gulp.task("js", function () {
    var page = gulp.src(folder.src + "js/*")
        .pipe(connect.reload());
    if (!devMode) {
        // page.pipe(strip())
        page.pipe(uglify());
    }
    page.pipe(gulp.dest(folder.build + "js/"))
})

gulp.task("css", function () {
    var options = [autoprefixer(), cssnano()],
        page = gulp.src(folder.src + "css/*")
            .pipe(connect.reload())
            .pipe(less());
    if (!devMode) {
        page.pipe(postcss(options));
    }
    page.pipe(gulp.dest(folder.build + "css/"))
})

gulp.task("watch", function () {
    gulp.watch(folder.src + "html/*", ["html"]);
    gulp.watch(folder.src + "css/*", ["css"]);
    gulp.watch(folder.src + "js/*", ["js"]);
    gulp.watch(folder.src + "images/*", ["image"]);
})

gulp.task("server", function () {
    connect.server({
        port: "8090",
        livereload: true
    });
})

// gulp.task("default", ["html", "images", "js", "css", "watch", "server"])
gulp.task("default", ["html", "images", "js","watch","css", "server"])