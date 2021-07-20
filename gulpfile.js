const {src, dest, parallel, series, watch} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const svgSprite = require('gulp-svg-sprite');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fs = require ('fs');
const del = require ('del');
const concat = require('gulp-concat');
const webpack = require ('webpack');
const webpackStream = require('webpack-stream');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');

//ф-я работы со шрифтами

const fonts = () => {
    src('./src/fonts/**.ttf')
        .pipe(ttf2woff())
        .pipe(dest('./app/fonts/'))
    return src('./src/fonts/**.ttf')
        .pipe(ttf2woff2())
        .pipe(dest('./app/fonts/'))
}

const checkWeight = (fontname) => { // свич проверяет вхождение определенного текста и ставит необходимое значение
    let weight = 400;
    switch (true) {
        case /Thin/.test(fontname):
            weight = 100;
            break;
        case /ExtraLight/.test(fontname):
            weight = 200;
            break;
        case /Light/.test(fontname):
            weight = 300;
            break;
        case /Regular/.test(fontname):
            weight = 400;
            break;
        case /Medium/.test(fontname):
            weight = 500;
            break;
        case /SemiBold/.test(fontname):
            weight = 600;
            break;
        case /Semi/.test(fontname):
            weight = 600;
            break;
        case /Bold/.test(fontname):
            weight = 700;
            break;
        case /ExtraBold/.test(fontname):
            weight = 800;
            break;
        case /Havy/.test(fontname):
            weight = 700;
            break;
        case /Black/.test(fontname):
            weight = 900;
            break;
        default:
            weight = 400;
    }
    return weight;
}

const cb = () => {}

let srcFonts = './src/scss/_fonts.scss'; // путь до файла, где вызов шрифтов
let appFonts = './app/fonts/'; // путь до шрифтов конечных

const fontsStyle = (done) => {
    let file_content = fs.readFileSync(srcFonts);

    fs.writeFile(srcFonts, '', cb); //читаем файлы srcFonts
    fs.readdir(appFonts, function (err, items) { //смотрим, что у нас есть за файлы и проходимся по ним циклом
        if (items) {
            let c_fontname;
            for (var i = 0; i < items.length; i++) {
                let fontname = items[i].split('.');
                fontname = fontname[0];
                let font = fontname.split('-')[0];
                let weight = checkWeight(fontname);
                if (c_fontname != fontname) {
                    fs.appendFile(srcFonts, '@include font-face("' + font + '", "' + fontname + '", ' + weight +'); \r\n', cb); //и в зависимости от этого создаем include в файле _fonts.scss
                }
                c_fontname = fontname;
            }
        }
    })
    done();
}

// ф-я для работы с свг-спрайтами

const svgSprites = () => {
    return src('./src/img/svg/**.svg')
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../sprite.svg"
                }
            }
        }))
        .pipe(dest('./app/img'))
}

// sourcemap, rename, autoprefixer, cleanCSS, browserSync
const styles = () => {
    return src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', notify.onError()))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(autoprefixer({
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./app/css/'))
        .pipe(browserSync.stream())
}

const htmlInclude = () => {
    return src(['./src/*.html'])
        .pipe(fileinclude({
            prefix: '@',
            basepath: '@file'
        }))
        .pipe(dest('./app'))
        .pipe(browserSync.stream())
}

// ф-я просто переноса картинок

const imgToApp = () => {
    src(['./src/img/**.jpg', './src/img/**.JPG', './src/img/**.png', './src/img/**.jpeg'])
        .pipe(dest('./app/img'))
    return src(['./src/img/**/**.png', './src/img/**/**.jpg', './src/img/**/**.svg'])
        .pipe(dest('./app/img'))
}

// ф-я просто переноса других файлов (видео/аудио)

const resources = () => {
	return src('./src/resources/**')
		.pipe(dest('./app/resources'))
}

//ф-я, которая удаляет то, что нам не нужно

const clean = () => {
    return del(['app/*'])
}

// ф-я через Вебпак, которая собирает файлы js

// const scripts = () => {
// 	return src('./src/js/main.js')
// 		.pipe(webpackStream({
// 			mode: 'development',
// 			output: {
// 				filename: 'main.js',
// 			},
// 			module: {
// 				rules: [{
// 					test: /\.m?js$/,
// 					exclude: /(node_modules|bower_components)/,
// 					use: {
// 						loader: 'babel-loader',
// 						options: {
// 							presets: ['@babel/preset-env']
// 						}
// 					}
// 				}]
// 			},
// 		}))
// 		.on('error', function (err) {
// 			console.error('WEBPACK ERROR', err);
// 			this.emit('end'); // Don't stop the rest of the task
// 		})

// 		.pipe(sourcemaps.init())
// 		.pipe(uglify().on("error", notify.onError()))
// 		.pipe(sourcemaps.write('.'))
// 		.pipe(dest('./app/js'))
// 		.pipe(browserSync.stream());
// }

function scriptsSlick() {
    return src([
        'node_modules/jquery/src/jquery.js',
        'node_modules/slick-carousel/slick/slick.js',
        'src/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}

// автомат. обновление страницы (LiveServer)

const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: "./app"
        }
    });

    // тут просматриваются папки и файлы на изменение

    watch('./src/scss/**/*.scss', styles);
    watch('./src/js/**/*.js', scriptsSlick);
    watch('./src/*.html', htmlInclude);
    watch('./src/html/*.html', htmlInclude);
    watch('./src/img/**.jpg', imgToApp);
    watch('./src/img/**.png', imgToApp);
    watch('./src/img/**.jpeg', imgToApp);
    watch('./src/img/**.svg', svgSprites);
    watch('./src/resources/**', resources);
    watch('./src/fonts/**.ttf', fonts);
    watch('./src/fonts/**.ttf', fontsStyle);
}

exports.styles = styles;
exports.watchFiles = watchFiles;
exports.fileinclude = htmlInclude;

exports.default = series(clean, parallel(htmlInclude, /* scripts, */ scriptsSlick, fonts, resources, imgToApp, svgSprites), fontsStyle, styles, watchFiles);

//gulp finaly build

const images = () => {
    src(['./src/img/**/**.jpg', './src/img/**/**.JPG', './src/img/**/**.png', './src/img/**/**.jpeg'])
        .pipe(imagemin(
            [
                imagemin.gifsicle({interlaced: true}),
                imagemin.mozjpeg({quality: 75, progressive: true}),
                imagemin.optipng({optimizationLevel: 5}),
                imagemin.svgo({
                    plugins:[
                        {removeViewBox: true},
                        {cleanupIDs:false}
                    ]
                })
            ]
        ))
        .pipe(dest('app/img'))
        return src(['./src/img/icons/**.png', './src/img/icons/**.svg'])
        .pipe(imagemin(
            [
                imagemin.gifsicle({interlaced: true}),
                imagemin.mozjpeg({quality: 75, progressive: true}),
                imagemin.optipng({optimizationLevel: 5}),
                imagemin.svgo({
                    plugins:[
                        {removeViewBox: true},
                        {cleanupIDs:false}
                    ]
                })
            ]
        ))
        .pipe(dest('app/img/icons'))
}

// const scriptsBuild = () => {
// 	return src('./src/js/main.js')
// 		.pipe(webpackStream({
// 				mode: 'development',
// 				output: {
// 					filename: 'main.js',
// 				},
// 				module: {
// 					rules: [{
// 						test: /\.m?js$/,
// 						exclude: /(node_modules|bower_components)/,
// 						use: {
// 							loader: 'babel-loader',
// 							options: {
// 								presets: ['@babel/preset-env']
// 							}
// 						}
// 					}]
// 				},
// 			}))
// 			.on('error', function (err) {
// 				console.error('WEBPACK ERROR', err);
// 				this.emit('end'); // Don't stop the rest of the task
// 			})
// 		.pipe(uglify().on("error", notify.onError()))
// 		.pipe(dest('./app/js'))
// }

function scriptsSlick() {
    return src([
        'node_modules/jquery/src/jquery.js',
        'node_modules/slick-carousel/slick/slick.js',
        'src/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}

const stylesBuild = () => {
    return src('./src/scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', notify.onError()))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(autoprefixer({
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(dest('./app/css/'))
}

const htmlMinify = () => {
    return src('app/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(dest('app'))
}

exports.build = series(clean, parallel(htmlInclude, /* scriptsBuild, */ scriptsSlick, fonts, resources, imgToApp, svgSprites), stylesBuild, images, htmlMinify, fontsStyle);

