/*!
 * @see {@link https://github.com/dowjones/gulp-bundle-assets/blob/master/examples/full/bundle.config.js#L86}
 */
module.exports = {
	bundle: {
		"js/vendors": {
			scripts: [
				//"./node_modules/jquery/dist/jquery.js",
				//"./bower_components/mui/packages/cdn/js/mui.js",
				//"../../cdn/highlight.js/9.12.0/js/highlight.pack.js",
				"../../cdn/verge/1.9.1/js/verge.fixed.js"
			],
			"options": {
				rev: false,
				uglify: false,
				maps: false,
				"pluginOptions": {
					'gulp-sourcemaps': {
						destPath: './'
					}
				}
			}
		},
		"js/vendors.min": {
			scripts: [
				//"./node_modules/jquery/dist/jquery.js",
				//"./bower_components/mui/packages/cdn/js/mui.js",
				//"../../cdn/highlight.js/9.12.0/js/highlight.pack.js",
				"../../cdn/verge/1.9.1/js/verge.fixed.js"
			],
			"options": {
				rev: false,
				uglify: true,
				maps: true,
				"pluginOptions": {
					'gulp-sourcemaps': {
						destPath: './'
					}
				}
			}
		},
		"css/vendors": {
			styles: [
				//"../../fonts/material-design-icons/3.0.1/css/material-icons.css",
				//"../../fonts/MaterialDesign-Webfont/2.2.43/css/materialdesignicons.css",
				"../../fonts/roboto-fontfacekit/2.137/css/roboto.css",
				"../../fonts/roboto-mono-fontfacekit/2.0.986/css/roboto-mono.css",
				//"./node_modules/normalize.css/normalize.css",
				//"../../cdn/highlight.js/9.12.0/css/hljs.css",
				"./bower_components/mui/src/sass/mui.css"
			],
			"options": {
				rev: false,
				uglify: false,
				minCSS: false,
				maps: false,
				"pluginOptions": {
					'gulp-sourcemaps': {
						destPath: './'
					}
				}
			}
		},
		"css/vendors.min": {
			styles: [
				//"../../fonts/material-design-icons/3.0.1/css/material-icons.css",
				//"../../fonts/MaterialDesign-Webfont/2.2.43/css/materialdesignicons.css",
				"../../fonts/roboto-fontfacekit/2.137/css/roboto.css",
				"../../fonts/roboto-mono-fontfacekit/2.0.986/css/roboto-mono.css",
				//"./node_modules/normalize.css/normalize.css",
				//"../../cdn/highlight.js/9.12.0/css/hljs.css",
				"./bower_components/mui/src/sass/mui.css"
			],
			"options": {
				rev: false,
				uglify: true,
				minCSS: true,
				maps: true,
				"pluginOptions": {
					'gulp-sourcemaps': {
						destPath: './'
					}
				}
			}
		}
	}
};