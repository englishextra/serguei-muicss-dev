/*global ActiveXObject, console, doesFontExist, hljs, imagePromise, loadCSS,
loadJsCss, Timers, ToProgress, require, verge, WheelIndicator */
/*property console, join, split */
/*!
 * safe way to handle console.log
 * @see {@link https://github.com/paulmillr/console-polyfill}
 */
(function(root){
	"use strict";
	if (!root.console) {
		root.console = {};
	}
	var con = root.console;
	var prop;
	var method;
	var dummy = function () {};
	var properties = ["memory"];
	var methods = ["assert,clear,count,debug,dir,dirxml,error,exception,group,",
		"groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,",
		"show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn"];
	methods.join("").split(",");
	for (; (prop = properties.pop()); ) {
		if (!con[prop]) {
			con[prop] = {};
		}
	}
	for (; (method = methods.pop()); ) {
		if (!con[method]) {
			con[method] = dummy;
		}
	}
	prop = method = dummy = properties = methods = null;
}("undefined" !== typeof window ? window : this));
/*!
 * modified ToProgress v0.1.1
 * arguments.callee changed to TP, a local wrapper function,
 * so that public function name is now customizable;
 * wrapped in curly brackets:
 * else{document.body.appendChild(this.progressBar);};
 * removed module check
 * @see {@link http://github.com/djyde/ToProgress}
 * @see {@link https://github.com/djyde/ToProgress/blob/master/ToProgress.js}
 * @see {@link https://gist.github.com/englishextra/6a8c79c9efbf1f2f50523d46a918b785}
 * @see {@link https://jsfiddle.net/englishextra/z5xhjde8/}
 * passes jshint
 */
(function (root, document, undefined) {
	"use strict";
	var ToProgress = (function () {
		var TP = function () {
			var _addEventListener = "addEventListener";
			var appendChild = "appendChild";
			var createElement = "createElement";
			var firstChild = "firstChild";
			var getElementById = "getElementById";
			var getElementsByClassName = "getElementsByClassName";
			var hasOwnProperty = "hasOwnProperty";
			var opacity = "opacity";
			var prototype = "prototype";
			var _removeEventListener = "removeEventListener";
			var style = "style";
			function whichTransitionEvent() {
				var t,
				el = document[createElement]("fakeelement");
				var transitions = {
					"transition": "transitionend",
					"OTransition": "oTransitionEnd",
					"MozTransition": "transitionend",
					"WebkitTransition": "webkitTransitionEnd"
				};
				for (t in transitions) {
					if (transitions[hasOwnProperty](t)) {
						if (el[style][t] !== undefined) {
							return transitions[t];
						}
					}
				}
			}
			var transitionEvent = whichTransitionEvent();
			function ToProgress(opt, selector) {
				this.progress = 0;
				this.options = {
					id: "top-progress-bar",
					color: "#F44336",
					height: "2px",
					duration: 0.2,
					zIndex: "auto"
				};
				if (opt && typeof opt === "object") {
					for (var key in opt) {
						if (opt[hasOwnProperty](key)) {
							this.options[key] = opt[key];
						}
					}
				}
				this.options.opacityDuration = this.options.duration * 3;
				this.progressBar = document[createElement]("div");
				this.progressBar.id = this.options.id;
				this.progressBar.setCSS = function (style) {
					for (var property in style) {
						if (style[hasOwnProperty](property)) {
							this.style[property] = style[property];
						}
					}
				};
				this.progressBar.setCSS({
					"position": selector ? "relative" : "fixed",
					"top": "0",
					"left": "0",
					"right": "0",
					"background-color": this.options.color,
					"height": this.options.height,
					"width": "0%",
					"transition": "width " + this.options.duration + "s" + ", opacity " + this.options.opacityDuration + "s",
					"-moz-transition": "width " + this.options.duration + "s" + ", opacity " + this.options.opacityDuration + "s",
					"-webkit-transition": "width " + this.options.duration + "s" + ", opacity " + this.options.opacityDuration + "s",
					"z-index": this.options.zIndex
				});
				if (selector) {
					var el;
					if (selector.indexOf("#", 0) !== -1) {
						el = document[getElementById](selector) || "";
					} else {
						if (selector.indexOf(".", 0) !== -1) {
							el = document[getElementsByClassName](selector)[0] || "";
						}
					}
					if (el) {
						if (el.hasChildNodes()) {
							el.insertBefore(this.progressBar, el[firstChild]);
						} else {
							el[appendChild](this.progressBar);
						}
					}
				} else {
					document.body[appendChild](this.progressBar);
				}
			}
			ToProgress[prototype].transit = function () {
				this.progressBar[style].width = this.progress + "%";
			};
			ToProgress[prototype].getProgress = function () {
				return this.progress;
			};
			ToProgress[prototype].setProgress = function (progress, callback) {
				this.show();
				if (progress > 100) {
					this.progress = 100;
				} else if (progress < 0) {
					this.progress = 0;
				} else {
					this.progress = progress;
				}
				this.transit();
				if (callback) {
					callback();
				}
			};
			ToProgress[prototype].increase = function (toBeIncreasedProgress, callback) {
				this.show();
				this.setProgress(this.progress + toBeIncreasedProgress, callback);
			};
			ToProgress[prototype].decrease = function (toBeDecreasedProgress, callback) {
				this.show();
				this.setProgress(this.progress - toBeDecreasedProgress, callback);
			};
			ToProgress[prototype].finish = function (callback) {
				var that = this;
				this.setProgress(100, callback);
				this.hide();
				if (transitionEvent) {
					this.progressBar[_addEventListener](transitionEvent, function (e) {
						that.reset();
						that.progressBar[_removeEventListener](e.type, TP);
					});
				}
			};
			ToProgress[prototype].reset = function (callback) {
				this.progress = 0;
				this.transit();
				if (callback) {
					callback();
				}
			};
			ToProgress[prototype].hide = function () {
				this.progressBar[style][opacity] = "0";
			};
			ToProgress[prototype].show = function () {
				this.progressBar[style][opacity] = "1";
			};
			return ToProgress;
		};
		return TP();
	})();
	root.ToProgress = ToProgress;
})("undefined" !== typeof window ? window : this, document);
/*!
 * return image is loaded promise
 * @see {@link https://jsfiddle.net/englishextra/56pavv7d/}
 * @param {String|Object} s image path string or HTML DOM Image Object
 * var m = document.querySelector("img") || "";
 * var s = m.src || "";
 * imagePromise(m).then(function (r) {
 * alert(r);
 * }).catch (function (err) {
 * alert(err);
 * });
 * imagePromise(s).then(function (r) {
 * alert(r);
 * }).catch (function (err) {
 * alert(err);
 * });
 * @see {@link https://gist.github.com/englishextra/3e95d301d1d47fe6e26e3be198f0675e}
 * passes jshint
 */
(function (root) {
	"use strict";
	var imagePromise = function (s) {
		if (root.Promise) {
			return new Promise(function (y, n) {
				var f = function (e, p) {
					e.onload = function () {
						y(p);
					};
					e.onerror = function () {
						n(p);
					};
					e.src = p;
				};
				if ("string" === typeof s) {
					var a = new Image();
					f(a, s);
				} else {
					if ("img" !== s.tagName) {
						return Promise.reject();
					} else {
						if (s.src) {
							f(s, s.src);
						}
					}
				}
			});
		} else {
			throw new Error("Promise is not in global object");
		}
	};
	root.imagePromise = imagePromise;
})("undefined" !== typeof window ? window : this);
/*!
 * Timer management (setInterval / setTimeout)
 * @param {Function} fn
 * @param {Number} ms
 * var timers = new Timers();
 * timers.timeout(function () {
 * console.log("before:", timers);
 * timers.clear();
 * timers = null;
 * doSomething();
 * console.log("after:", timers);
 * }, 3000);
 * @see {@link https://github.com/component/timers}
 * @see {@link https://github.com/component/timers/blob/master/index.js}
 * passes jshint
 */
(function(root) {
	"use strict";
	var Timers = function(ids) {
		this.ids = ids || [];
	};
	Timers.prototype.timeout = function(fn, ms) {
		var id = setTimeout(fn, ms);
		this.ids.push(id);
		return id;
	};
	Timers.prototype.interval = function(fn, ms) {
		var id = setInterval(fn, ms);
		this.ids.push(id);
		return id;
	};
	Timers.prototype.clear = function() {
		this.ids.forEach(clearTimeout);
		this.ids = [];
	};
	root.Timers = Timers;
})("undefined" !== typeof window ? window : this, document);
/*!
 * modified Detect Whether a Font is Installed
 * @param {String} fontName The name of the font to check
 * @return {Boolean}
 * @author Kirupa <sam@samclarke.com>
 * @see {@link https://www.kirupa.com/html5/detect_whether_font_is_installed.htm}
 * passes jshint
 */
(function(root, document) {
	"use strict";
	var doesFontExist = function(fontName) {
		var createElement = "createElement";
		var getContext = "getContext";
		var measureText = "measureText";
		var width = "width";
		var canvas = document[createElement]("canvas");
		var context = canvas[getContext]("2d");
		var text = "abcdefghijklmnopqrstuvwxyz0123456789";
		context.font = "72px monospace";
		var baselineSize = context[measureText](text)[width];
		context.font = "72px '" + fontName + "', monospace";
		var newSize = context[measureText](text)[width];
		canvas = null;
		if (newSize === baselineSize) {
			return false;
		} else {
			return true;
		}
	};
	root.doesFontExist = doesFontExist;
})("undefined" !== typeof window ? window : this, document);
/*!
 * load CSS async
 * modified order of arguments, added callback option, removed CommonJS stuff
 * @see {@link https://github.com/filamentgroup/loadCSS}
 * @see {@link https://gist.github.com/englishextra/50592e9944bd2edc46fe5a82adec3396}
 * @param {String} hrefString path string
 * @param {Object} callback callback function
 * @param {String} media media attribute string value
 * @param {Object} [before] target HTML element
 * loadCSS(hrefString,callback,media,before)
 */
(function(root, document) {
	"use strict";
	var loadCSS = function(_href, callback) {
		var ref = document.getElementsByTagName("head")[0] || "";
		var link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = _href;
		link.media = "all";
		if (ref) {
			ref.appendChild(link);
			if (callback && "function" === typeof callback) {
				link.onload = callback;
			}
			return link;
		}
		return;
	};
	root.loadCSS = loadCSS;
})("undefined" !== typeof window ? window : this, document);
/*!
 * modified loadExt
 * @see {@link https://gist.github.com/englishextra/ff9dc7ab002312568742861cb80865c9}
 * passes jshint
 */
(function(root, document) {
	"use strict";
	var loadJsCss = function(files, callback) {
		var _this = this;
		var appendChild = "appendChild";
		var body = "body";
		var createElement = "createElement";
		var getElementsByTagName = "getElementsByTagName";
		var insertBefore = "insertBefore";
		var _length = "length";
		var parentNode = "parentNode";
		_this.files = files;
		_this.js = [];
		_this.head = document[getElementsByTagName]("head")[0] || "";
		_this.body = document[body] || "";
		_this.ref = document[getElementsByTagName]("script")[0] || "";
		_this.callback = callback || function() {};
		_this.loadStyle = function(file) {
			var link = document[createElement]("link");
			link.rel = "stylesheet";
			link.type = "text/css";
			link.href = file;
			_this.head[appendChild](link);
		};
		_this.loadScript = function(i) {
			var script = document[createElement]("script");
			script.type = "text/javascript";
			script.async = true;
			script.src = _this.js[i];
			var loadNextScript = function() {
				if (++i < _this.js[_length]) {
					_this.loadScript(i);
				} else {
					_this.callback();
				}
			};
			script.onload = function() {
				loadNextScript();
			};
			_this.head[appendChild](script);
			if (_this.ref[parentNode]) {
				_this.ref[parentNode][insertBefore](script, _this.ref);
			} else {
				(_this.body || _this.head)[appendChild](script);
			}
		};
		var i,
			l;
		for (i = 0, l = _this.files[_length]; i < l; i += 1) {
			if ((/\.js$|\.js\?/).test(_this.files[i])) {
				_this.js.push(_this.files[i]);
			}
			if ((/\.css$|\.css\?|\/css\?/).test(_this.files[i])) {
				_this.loadStyle(_this.files[i]);
			}
		}
		i = l = null;
		if (_this.js[_length] > 0) {
			_this.loadScript(0);
		} else {
			_this.callback();
		}
	};
	root.loadJsCss = loadJsCss;
})("undefined" !== typeof window ? window : this, document);
/*!
 * app logic
 */
(function(root, document) {
	"use strict";

	var docElem = document.documentElement || "";
	var docImplem = document.implementation || "";
	var docBody = document.body || "";

	var classList = "classList";
	var createElement = "createElement";
	var createElementNS = "createElementNS";
	var defineProperty = "defineProperty";
	var getElementsByClassName = "getElementsByClassName";
	var getOwnPropertyDescriptor = "getOwnPropertyDescriptor";
	var querySelector = "querySelector";
	var querySelectorAll = "querySelectorAll";
	var _addEventListener = "addEventListener";
	var _length = "length";

	docBody[classList].add("hide-sidedrawer");

	var loadingSpinner = document[getElementsByClassName]("half-circle-spinner")[0] ||
							document[getElementsByClassName]("hollow-dots-spinner")[0] || "";

	/* var progressBar = new ToProgress({
			id: "top-progress-bar",
			color: "#FF2C40",
			height: "0.188rem",
			duration: 0.2,
			zIndex: 999
		});

	var hideProgressBar = function () {
		progressBar.finish();
		progressBar.hide();
	};

	progressBar.complete = function () {
		return this.finish(),
		this.hide();
	}; */

	/* progressBar.increase(20); */

	var hasTouch = "ontouchstart" in docElem || "";

	var hasWheel = "onwheel" in document[createElement]("div") || void 0 !== document.onmousewheel || "";

	var getHTTP = function(force) {
		var any = force || "";
		var locationProtocol = root.location.protocol || "";
		return "http:" === locationProtocol ? "http" : "https:" === locationProtocol ? "https" : any ? "http" : "";
	};

	var forcedHTTP = getHTTP(true);

	var run = function() {

		var appendChild = "appendChild";
		var body = "body";
		var cloneNode = "cloneNode";
		var createContextualFragment = "createContextualFragment";
		var createDocumentFragment = "createDocumentFragment";
		var createRange = "createRange";
		var dataset = "dataset";
		var getAttribute = "getAttribute";
		var getElementById = "getElementById";
		var getElementsByTagName = "getElementsByTagName";
		var href = "href";
		var innerHTML = "innerHTML";
		var parentNode = "parentNode";
		var replaceChild = "replaceChild";
		var setAttribute = "setAttribute";
		var style = "style";
		var title = "title";
		var _removeEventListener = "removeEventListener";

		var isActiveClass = "is-active";
		var isBindedClass = "is-binded";
		var isFixedClass = "is-fixed";
		var isHiddenClass = "is-hidden";

		/* progressBar.increase(20); */

		if (docElem && docElem[classList]) {
			docElem[classList].remove("no-js");
			docElem[classList].add("js");
		}

		var earlyDeviceFormfactor = (function (selectors) {
			var orientation;
			var size;
			var f = function (a) {
				var b = a.split(" ");
				if (selectors) {
					for (var c = 0; c < b[_length]; c += 1) {
						a = b[c];
						selectors.add(a);
					}
				}
			};
			var g = function (a) {
				var b = a.split(" ");
				if (selectors) {
					for (var c = 0; c < b[_length]; c += 1) {
						a = b[c];
						selectors.remove(a);
					}
				}
			};
			var h = {
				landscape: "all and (orientation:landscape)",
				portrait: "all and (orientation:portrait)"
			};
			var k = {
				small: "all and (max-width:768px)",
				medium: "all and (min-width:768px) and (max-width:991px)",
				large: "all and (min-width:992px)"
			};
			var d;
			var matchMedia = "matchMedia";
			var matches = "matches";
			var o = function (a, b) {
				var c = function (a) {
					if (a[matches]) {
						f(b);
						orientation = b;
					} else {
						g(b);
					}
				};
				c(a);
				a.addListener(c);
			};
			var s = function (a, b) {
				var c = function (a) {
					if (a[matches]) {
						f(b);
						size = b;
					} else {
						g(b);
					}
				};
				c(a);
				a.addListener(c);
			};
			for (d in h) {
				if (h.hasOwnProperty(d)) {
					o(root[matchMedia](h[d]), d);
				}
			}
			for (d in k) {
				if (k.hasOwnProperty(d)) {
					s(root[matchMedia](k[d]), d);
				}
			}
			return {
				orientation: orientation || "",
				size: size || ""
			};
		})(docElem[classList] || "");

		var earlyDeviceType = (function (mobile, desktop, opera) {
			var selector = (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i).test(opera) || (/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i).test(opera.substr(0, 4)) ? mobile : desktop;
			docElem[classList].add(selector);
			return selector;
		})("mobile", "desktop", navigator.userAgent || navigator.vendor || (root).opera);

		var earlySvgSupport = (function (selector) {
			selector = docImplem.hasFeature("http://www.w3.org/2000/svg", "1.1") ? selector : "no-" + selector;
			docElem[classList].add(selector);
			return selector;
		})("svg");

		var earlySvgasimgSupport = (function (selector) {
			selector = docImplem.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1") ? selector : "no-" + selector;
			docElem[classList].add(selector);
			return selector;
		})("svgasimg");

		var earlyHasTouch = (function (selector) {
			selector = "ontouchstart" in docElem ? selector : "no-" + selector;
			docElem[classList].add(selector);
			return selector;
		})("touch");

		var getHumanDate = (function () {
			var newDate = (new Date());
			var newDay = newDate.getDate();
			var newYear = newDate.getFullYear();
			var newMonth = newDate.getMonth();
			(newMonth += 1);
			if (10 > newDay) {
				newDay = "0" + newDay;
			}
			if (10 > newMonth) {
				newMonth = "0" + newMonth;
			}
			return newYear + "-" + newMonth + "-" + newDay;
		})();

		var initialDocumentTitle = document.title || "";

		var userBrowsingDetails = " [" + (getHumanDate ? getHumanDate : "") + (earlyDeviceType ? " " + earlyDeviceType : "") + (earlyDeviceFormfactor.orientation ? " " + earlyDeviceFormfactor.orientation : "") + (earlyDeviceFormfactor.size ? " " + earlyDeviceFormfactor.size : "") + (earlySvgSupport ? " " + earlySvgSupport : "") + (earlySvgasimgSupport ? " " + earlySvgasimgSupport : "") + (earlyHasTouch ? " " + earlyHasTouch : "") + "]";

		if (document[title]) {
			document[title] = document[title] + userBrowsingDetails;
		}

		/*var observeMutations = function (scope) {
			var context = scope && scope.nodeName ? scope : "";
			var mo;
			var getMutations = function (e) {
				var triggerOnMutation = function (m) {
					console.log("mutations observer: " + m.type);
					console.log(m.type, "target: " + m.target.tagName + ("." + m.target[className] || "#" + m.target.id || ""));
					console.log(m.type, "added: " + m.addedNodes[_length] + " nodes");
					console.log(m.type, "removed: " + m.removedNodes[_length] + " nodes");
					if ("childList" === m.type || "subtree" === m.type) {
						 mo.disconnect();
					}
				};
				for (var i = 0, l = e[_length]; i < l; i += 1) {
					triggerOnMutation(e[i]);
				}
			};
			if (context) {
				mo = new MutationObserver(getMutations);
				mo.observe(context, {
					childList: !0,
					subtree: !0,
					attributes: !1,
					characterData: !1
				});
			}
		};*/

		var appContentId = "app-content";
		var appContent = document[getElementById](appContentId) || "";
		var appContentParent;

		if (appContent) {
			appContentParent = appContent[parentNode] || "";
			/* observeMutations(appContentParent); */
		}

		var debounce = function (func, wait) {
			var timeout;
			var args;
			var context;
			var timestamp;
			return function () {
				context = this;
				args = [].slice.call(arguments, 0);
				timestamp = new Date();
				var later = function () {
					var last = (new Date()) - timestamp;
					if (last < wait) {
						timeout = setTimeout(later, wait - last);
					} else {
						timeout = null;
						func.apply(context, args);
					}
				};
				if (!timeout) {
					timeout = setTimeout(later, wait);
				}
			};
		};

		var throttle = function (func, wait) {
			var ctx;
			var args;
			var rtn;
			var timeoutID;
			var last = 0;
			function call() {
				timeoutID = 0;
				last = +new Date();
				rtn = func.apply(ctx, args);
				ctx = null;
				args = null;
			}
			return function throttled() {
				ctx = this;
				args = arguments;
				var delta = new Date() - last;
				if (!timeoutID) {
					if (delta >= wait) {
						call();
					} else {
						timeoutID = setTimeout(call, wait - delta);
					}
				}
				return rtn;
			};
		};

		var scroll2Top = function (scrollTargetY, speed, easing) {
			var scrollY = root.scrollY || docElem.scrollTop;
			var posY = scrollTargetY || 0;
			var rate = speed || 2000;
			var soothing = easing || "easeOutSine";
			var currentTime = 0;
			var time = Math.max(0.1, Math.min(Math.abs(scrollY - posY) / rate, 0.8));
			var easingEquations = {
				easeOutSine: function (pos) {
					return Math.sin(pos * (Math.PI / 2));
				},
				easeInOutSine: function (pos) {
					return (-0.5 * (Math.cos(Math.PI * pos) - 1));
				},
				easeInOutQuint: function (pos) {
					if ((pos /= 0.5) < 1) {
						return 0.5 * Math.pow(pos, 5);
					}
					return 0.5 * (Math.pow((pos - 2), 5) + 2);
				}
			};
			function tick() {
				currentTime += 1 / 60;
				var p = currentTime / time;
				var t = easingEquations[soothing](p);
				if (p < 1) {
					requestAnimationFrame(tick);
					root.scrollTo(0, scrollY + ((posY - scrollY) * t));
				} else {
					root.scrollTo(0, posY);
				}
			}
			tick();
		};

		var insertExternalHTML = function (id, url, callback, onerror) {
			var container = document[getElementById](id.replace(/^#/, "")) || "";
			var arrange = function () {
				var x = root.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
				x.overrideMimeType("text/html;charset=utf-8");
				x.open("GET", url, !0);
				x.withCredentials = !1;
				x.onreadystatechange = function () {
					var cb = function () {
						return callback && "function" === typeof callback && callback();
					};
					if (x.status === "404" || x.status === 0) {
						console.log("Error XMLHttpRequest-ing file", x.status);
						return onerror && "function" === typeof onerror && onerror();
					} else if (x.readyState === 4 && x.status === 200 && x.responseText) {
						var frag = x.responseText;
						try {
							var clonedContainer = container[cloneNode](false);
							if (document[createRange]) {
								var rg = document[createRange]();
								rg.selectNode(docBody);
								var df = rg[createContextualFragment](frag);
								clonedContainer[appendChild](df);
								return container[parentNode] ? container[parentNode][replaceChild](clonedContainer, container) : container[innerHTML] = frag,
								cb();
							} else {
								clonedContainer[innerHTML] = frag;
								return container[parentNode] ? container[parentNode][replaceChild](document[createDocumentFragment][appendChild](clonedContainer), container) : container[innerHTML] = frag,
								cb();
							}
						} catch (e) {
							console.log(e);
						}
						return;
					}
				};
				x.send(null);
			};
			if (container) {
				arrange();
			}
		};

		var loadUnparsedJSON = function (url, callback, onerror) {
			var cb = function (string) {
				return callback && "function" === typeof callback && callback(string);
			};
			var x = root.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
			x.overrideMimeType("application/json;charset=utf-8");
			x.open("GET", url, !0);
			x.withCredentials = !1;
			x.onreadystatechange = function () {
				if (x.status === "404" || x.status === 0) {
					console.log("Error XMLHttpRequest-ing file", x.status);
					return onerror && "function" === typeof onerror && onerror();
				} else if (x.readyState === 4 && x.status === 200 && x.responseText) {
					cb(x.responseText);
				}
			};
			x.send(null);
		};

		/*jshint bitwise: false */
		var parseLink = function (url, full) {
			var _full = full || "";
			return (function () {
				var _replace = function (s) {
					return s.replace(/^(#|\?)/, "").replace(/\:$/, "");
				};
				var _location = location || "";
				var _protocol = function (protocol) {
					switch (protocol) {
					case "http:":
						return _full ? ":" + 80 : 80;
					case "https:":
						return _full ? ":" + 443 : 443;
					default:
						return _full ? ":" + _location.port : _location.port;
					}
				};
				var _isAbsolute = (0 === url.indexOf("//") || !!~url.indexOf("://"));
				var _locationHref = root.location || "";
				var _origin = function () {
					var o = _locationHref.protocol + "//" + _locationHref.hostname + (_locationHref.port ? ":" + _locationHref.port : "");
					return o || "";
				};
				var _isCrossDomain = function () {
					var c = document[createElement]("a");
					c.href = url;
					var v = c.protocol + "//" + c.hostname + (c.port ? ":" + c.port : "");
					return v !== _origin();
				};
				var _link = document[createElement]("a");
				_link.href = url;
				return {
					href: _link.href,
					origin: _origin(),
					host: _link.host || _location.host,
					port: ("0" === _link.port || "" === _link.port) ? _protocol(_link.protocol) : (_full ? _link.port : _replace(_link.port)),
					hash: _full ? _link.hash : _replace(_link.hash),
					hostname: _link.hostname || _location.hostname,
					pathname: _link.pathname.charAt(0) !== "/" ? (_full ? "/" + _link.pathname : _link.pathname) : (_full ? _link.pathname : _link.pathname.slice(1)),
					protocol: !_link.protocol || ":" === _link.protocol ? (_full ? _location.protocol : _replace(_location.protocol)) : (_full ? _link.protocol : _replace(_link.protocol)),
					search: _full ? _link.search : _replace(_link.search),
					query: _full ? _link.search : _replace(_link.search),
					isAbsolute: _isAbsolute,
					isRelative: !_isAbsolute,
					isCrossDomain: _isCrossDomain(),
					hasHTTP: (/^(http|https):\/\//i).test(url) ? true : false
				};
			})();
		};
		/*jshint bitwise: true */

		var isValidId = function (a, full) {
			return full ? /^\#[A-Za-z][-A-Za-z0-9_:.]*$/.test(a) ? true : false : /^[A-Za-z][-A-Za-z0-9_:.]*$/.test(a) ? true : false;
		};

		var findPos = function (a) {
			a = a.getBoundingClientRect();
			return {
				top: Math.round(a.top + (root.pageYOffset || docElem.scrollTop || docBody.scrollTop) - (docElem.clientTop || docBody.clientTop || 0)),
				left: Math.round(a.left + (root.pageXOffset || docElem.scrollLeft || docBody.scrollLeft) - (docElem.clientLeft || docBody.clientLeft || 0))
			};
		};

		var isNodejs = "undefined" !== typeof process && "undefined" !== typeof require || "";
		var isElectron = "undefined" !== typeof root && root.process && "renderer" === root.process.type || "";
		var isNwjs = (function () {
			if ("undefined" !== typeof isNodejs && isNodejs) {
				try {
					if ("undefined" !== typeof require("nw.gui")) {
						return true;
					}
				} catch (e) {
					return false;
				}
			}
			return false;
		})();

		var openDeviceBrowser = function (url) {
			var triggerForElectron = function () {
				var es = isElectron ? require("electron").shell : "";
				return es ? es.openExternal(url) : "";
			};
			var triggerForNwjs = function () {
				var ns = isNwjs ? require("nw.gui").Shell : "";
				return ns ? ns.openExternal(url) : "";
			};
			var triggerForHTTP = function () {
				return true;
			};
			var triggerForLocal = function () {
				return root.open(url, "_system", "scrollbars=1,location=no");
			};
			if (isElectron) {
				triggerForElectron();
			} else if (isNwjs) {
				triggerForNwjs();
			} else {
				var locationProtocol = root.location.protocol || "",
				hasHTTP = locationProtocol ? "http:" === locationProtocol ? "http" : "https:" === locationProtocol ? "https" : "" : "";
				if (hasHTTP) {
					triggerForHTTP();
				} else {
					triggerForLocal();
				}
			}
		};

		var handleExternalLink = function (url, ev) {
			ev.stopPropagation();
			ev.preventDefault();
			var logicHandleExternalLink = openDeviceBrowser.bind(null, url);
			var debounceLogicHandleExternalLink = debounce(logicHandleExternalLink, 200);
			debounceLogicHandleExternalLink();
		};
		var manageExternalLinkAll = function (scope) {
			var ctx = scope && scope.nodeName ? scope : "";
			var linkTag = "a";
			var links = ctx ? ctx[getElementsByTagName](linkTag) || "" : document[getElementsByTagName](linkTag) || "";
			var arrange = function (e) {
				if (!e[classList].contains(isBindedClass)) {
					var url = e[getAttribute]("href") || "";
					if (url && parseLink(url).isCrossDomain && parseLink(url).hasHTTP) {
						e.title = "" + (parseLink(url).hostname || "") + " откроется в новой вкладке";
						if ("undefined" !== typeof getHTTP && getHTTP()) {
							e.target = "_blank";
							e.rel = "noopener";
						} else {
							e[_addEventListener]("click", handleExternalLink.bind(null, url));
						}
						e[classList].add(isBindedClass);
					}
				}
			};
			if (links) {
				for (var i = 0, l = links[_length]; i < l; i += 1) {
					arrange(links[i]);
				}
				/* forEach(links, arrange, false); */
			}
		};
		manageExternalLinkAll();

		var handleDataSrcImageAll = function (scope) {
			var ctx = scope && scope.nodeName ? scope : "";
			var dataSrcImgClass = "data-src-img";
			var imgs = ctx ? ctx[getElementsByClassName](dataSrcImgClass) || "" : document[getElementsByClassName](dataSrcImgClass) || "";
			var arrange = function (e) {
				/*!
				 * true if elem is in same y-axis as the viewport or within 100px of it
				 * @see {@link https://github.com/ryanve/verge}
				 */
				if (verge.inY(e, 100) /* && 0 !== e.offsetHeight */) {
					if (!e[classList].contains(isBindedClass)) {
						var srcString = e[dataset].src || "";
						if (srcString) {
							if (parseLink(srcString).isAbsolute && !parseLink(srcString).hasHTTP) {
								e[dataset].src = srcString.replace(/^/, forcedHTTP + ":");
								srcString = e[dataset].src;
							}
							imagePromise(srcString).then(function () {
								e.src = srcString;
							}).catch (function (err) {
								console.log("cannot load image with imagePromise:", srcString, err);
							});
							e[classList].add(isActiveClass);
							e[classList].add(isBindedClass);
						}
					}
				}
			};
			if (imgs) {
				for (var i = 0, l = imgs[_length]; i < l; i += 1) {
					arrange(imgs[i]);
				}
				/* forEach(imgs, arrange, false); */
			}
		};
		var handleDataSrcImageAllWindow = function () {
			var throttleHandleDataSrcImageAll = throttle(handleDataSrcImageAll, 100);
			throttleHandleDataSrcImageAll();
		};
		var manageDataSrcImageAll = function () {
			root[_removeEventListener]("scroll", handleDataSrcImageAllWindow, {passive: true});
			root[_removeEventListener]("resize", handleDataSrcImageAllWindow);
			root[_addEventListener]("scroll", handleDataSrcImageAllWindow, {passive: true});
			root[_addEventListener]("resize", handleDataSrcImageAllWindow);
			var timers = new Timers();
			timers.timeout(function () {
				timers.clear();
				timers = null;
				handleDataSrcImageAll();
			}, 500);
		};
		manageDataSrcImageAll();

		var handleDataSrcIframeAll = function (scope) {
			var ctx = scope && scope.nodeName ? scope : "";
			var dataSrcIframeClass = "data-src-iframe";
			var iframes = ctx ? ctx[getElementsByClassName](dataSrcIframeClass) || "" : document[getElementsByClassName](dataSrcIframeClass) || "";
			var arrange = function (e) {
				/*!
				 * true if elem is in same y-axis as the viewport or within 100px of it
				 * @see {@link https://github.com/ryanve/verge}
				 */
				if (verge.inY(e, 100) /* && 0 !== e.offsetHeight */) {
					if (!e[classList].contains(isBindedClass)) {
						var srcString = e[dataset].src || "";
						if (srcString) {
							if (parseLink(srcString).isAbsolute && !parseLink(srcString).hasHTTP) {
								e[dataset].src = srcString.replace(/^/, forcedHTTP + ":");
								srcString = e[dataset].src;
							}
							e.src = srcString;
							e[classList].add(isActiveClass);
							e[classList].add(isBindedClass);
							e[setAttribute]("frameborder", "no");
							e[setAttribute]("style", "border:none;");
							e[setAttribute]("webkitallowfullscreen", "true");
							e[setAttribute]("mozallowfullscreen", "true");
							e[setAttribute]("scrolling", "no");
							e[setAttribute]("allowfullscreen", "true");
						}
					}
				}
			};
			if (iframes) {
				for (var i = 0, l = iframes[_length]; i < l; i += 1) {
					arrange(iframes[i]);
				}
				/* forEach(iframes, arrange, false); */
			}
		};
		var handleDataSrcIframeAllWindow = function () {
			var throttlehandleDataSrcIframeAll = throttle(handleDataSrcIframeAll, 100);
			throttlehandleDataSrcIframeAll();
		};
		var manageDataSrcIframeAll = function () {
			root[_removeEventListener]("scroll", handleDataSrcIframeAllWindow, {passive: true});
			root[_removeEventListener]("resize", handleDataSrcIframeAllWindow);
			root[_addEventListener]("scroll", handleDataSrcIframeAllWindow, {passive: true});
			root[_addEventListener]("resize", handleDataSrcIframeAllWindow);
			var timers = new Timers();
			timers.timeout(function () {
				timers.clear();
				timers = null;
				handleDataSrcIframeAll();
			}, 500);
		};
		manageDataSrcIframeAll();

		var handleDropdownButton = function (evt) {
			evt.stopPropagation();
			evt.preventDefault();
			var _this = this;
			var wrapperRect = _this.nextElementSibling.getBoundingClientRect();
			var toggleRect = _this.getBoundingClientRect();
			var top = toggleRect.top + toggleRect.height;
			var left = toggleRect.left;
			_this.nextElementSibling[style].top = top + "px";
			if (!_this.nextElementSibling[classList].contains("mui-dropdown__menu--right")) {
				_this.nextElementSibling[style].left = left + "px";
			}
			if (_this.nextElementSibling[style].display === "none") {
				_this.nextElementSibling[style].display = "block";
			} else {
				_this.nextElementSibling[style].display = "none";
			}
		};
		var toggleDropdownsVisibility = function (scope) {
			var ctx = scope && scope.nodeName ? scope : "";
			var linkTag = "a";
			var links = ctx ? ctx[getElementsByTagName](linkTag) || "" : document[getElementsByTagName](linkTag) || "";
			var dropdownButtons = [];
			for (var j = 0, m = links[_length]; j < m; j += 1) {
				if (links[j][dataset].muiToggle) {
					dropdownButtons.push(links[j]);
				}
			}
			if (dropdownButtons) {
				for (var i = 0, l = dropdownButtons[_length]; i < l; i += 1) {
					if (!dropdownButtons[i][classList].contains(isBindedClass) &&
						dropdownButtons[i].nextElementSibling.nodeName.toLowerCase() === "ul" &&
						dropdownButtons[i].nextElementSibling.nodeType === 1
						) {
							dropdownButtons[i].nextElementSibling[style].display = "none";
							dropdownButtons[i][_addEventListener]("click", handleDropdownButton);
							dropdownButtons[i][classList].contains(isBindedClass);
					}
				}
			}
		};
		toggleDropdownsVisibility();

		var hideAllDropdowns = function () {
			var dropdowns = document[getElementsByClassName]("mui-dropdown__menu") || "";
			if (dropdowns) {
				for (var i = 0, l = dropdowns[_length]; i < l; i += 1) {
					if (dropdowns[i].style.display !== "none") {
						dropdowns[i].style.display = "none";
					}
				}
			}
		};
		var hideAllDropdownsOnNavigating = function () {
			if (appContentParent) {
				/* if (!appContentParent[classList].contains(isBindedClass)) { */
					appContentParent[_addEventListener]("click", hideAllDropdowns);
					/* appContentParent[classList].add(isBindedClass); */
				/* } */
			}
		};
		hideAllDropdownsOnNavigating();

		var enableHljs = function (scope) {
			var ctx = scope && scope.nodeName ? scope : "";
			var codeTag = "code";
			var codes = ctx ? ctx[getElementsByTagName](codeTag) || "" : document[getElementsByTagName](codeTag) || "";
			if (root.hljs) {
				for (var i = 0, l = codes[_length]; i < l; i += 1) {
					if (codes[i][classList].contains("hljs") && !codes[i][classList].contains(isBindedClass)) {
						hljs.highlightBlock(codes[i]);
						codes[i][classList].add(isBindedClass);
					}
				}
			}
		};

		var initRouting = function () {
			var routesJsonUrl = "./libs/serguei-muicss/json/routes.json";
			var processRoutesJsonResponse = function (routesJsonResponse) {
				var routesJsonObj;
				try {
					routesJsonObj = JSON.parse(routesJsonResponse);
					if (!routesJsonObj.hashes) {
						throw new Error("incomplete JSON data: no hashes");
					} else if (!routesJsonObj.home) {
						throw new Error("incomplete JSON data: no home");
					} else {
						if (!routesJsonObj.notfound) {
							throw new Error("incomplete JSON data: no notfound");
						}
					}
				} catch (err) {
					console.log("cannot init processRoutesJsonResponse", err);
					return;
				}
				var triggerOnContentInserted = function (titleString) {
					document[title] = (titleString ? titleString + " - " : "") + (initialDocumentTitle ? initialDocumentTitle + (userBrowsingDetails ? userBrowsingDetails : "") : "");
					/*!
					 * cache parent node beforehand
					 * put when templates rendered
					 */
					if (appContentParent) {
						manageExternalLinkAll(appContentParent);
						toggleDropdownsVisibility(appContentParent);
						var timers2 = new Timers();
						timers2.timeout(function () {
							timers2.clear();
							timers2 = null;
							handleDataSrcIframeAll(appContentParent);
						}, 500);
						var timers = new Timers();
						timers.timeout(function () {
							timers.clear();
							timers = null;
							handleDataSrcImageAll(appContentParent);
						}, 500);
						enableHljs(appContentParent);
					}
					/* hideProgressBar(); */
					if (loadingSpinner) {
						loadingSpinner[style].display = "none";
					}
					scroll2Top(0, 20000);
				};
				var handleRoutesWindow = function () {
					var locationHash = root.location.hash || "";
					if (locationHash) {
						var isNotfound = false;
						for (var i = 0, l = routesJsonObj.hashes[_length]; i < l; i += 1) {
							if (locationHash === routesJsonObj.hashes[i][href]) {
								isNotfound = true;
								/* progressBar.increase(40); */
								if (loadingSpinner) {
									loadingSpinner[style].display = "block";
								}
								insertExternalHTML(appContentId, routesJsonObj.hashes[i].url, triggerOnContentInserted.bind(null, routesJsonObj.hashes[i][title]));
								break;
							}
						}
						if (false === isNotfound) {
							var targetObj = locationHash ? (isValidId(locationHash, true) ? document[getElementById](locationHash.replace(/^#/,"")) || "" : "") : "";
							if (targetObj) {
								scroll2Top(findPos(targetObj).top, 10000);
							} else {
								var notfoundUrl = routesJsonObj.notfound.url;
								var notfoundTitle = routesJsonObj.notfound[title];
								if (notfoundUrl /* && notfoundTitle */) {
									if (loadingSpinner) {
										loadingSpinner[style].display = "block";
									}
									/* progressBar.increase(40); */
									insertExternalHTML(appContentId, notfoundUrl, triggerOnContentInserted.bind(null, notfoundTitle));
								}
							}
						}
					} else {
						var homeUrl = routesJsonObj.home.url;
						var homeTitle = routesJsonObj.home[title];
						if (homeUrl /* && homeTitle */) {
							if (loadingSpinner) {
								loadingSpinner[style].display = "block";
							}
							/* progressBar.increase(40); */
							insertExternalHTML(appContentId, homeUrl, triggerOnContentInserted.bind(null, homeTitle));
						}
					}
				};
				handleRoutesWindow();
				root[_addEventListener]("hashchange", handleRoutesWindow);
			};
			if (appContent) {
				loadUnparsedJSON(routesJsonUrl, processRoutesJsonResponse);
			}
		};
		initRouting();

		var sidedrawer = document[getElementById]("sidedrawer") || "";

		var activeClass = "active";
		var hideSidedrawerClass = "hide-sidedrawer";

		var handleMenuButton = function () {
			/* var _this = this; */
			if (sidedrawer) {
				if (!docBody[classList].contains(hideSidedrawerClass)) {
					docBody[classList].add(hideSidedrawerClass);
				} else {
					docBody[classList].remove(hideSidedrawerClass);
				}
				if (!sidedrawer[classList].contains(activeClass)) {
					sidedrawer[classList].add(activeClass);
				} else {
					sidedrawer[classList].remove(activeClass);
				}
			}
		};
		var toggleSidedrawerVisibility = function () {
			var menuButtons = document[getElementsByClassName]("sidedrawer-toggle") || "";
			if (menuButtons) {
				for (var i = 0, l = menuButtons[_length]; i < l; i += 1) {
					if (!menuButtons[i][classList].contains(isBindedClass)) {
						menuButtons[i][_addEventListener]("click", handleMenuButton);
						menuButtons[i][classList].contains(isBindedClass);
					}
				}
			}
		};
		toggleSidedrawerVisibility();

		var handleSidedrawerCategoryLink = function (evt) {
			evt.stopPropagation();
			evt.preventDefault();
			var _this = this;
			if (_this.nextElementSibling[style].display === "none") {
				_this.nextElementSibling[style].display = "block";
			} else {
				_this.nextElementSibling[style].display = "none";
			}
		};
		var toggleSidedrawerCategoryItemsVisibility = function () {
			var sidedrawerCategories = sidedrawer ? sidedrawer[getElementsByTagName]("strong") || "" : "";
			if (sidedrawerCategories) {
				for (var i = 0, l = sidedrawerCategories[_length]; i < l; i += 1) {
					if (!sidedrawerCategories[i][classList].contains(isBindedClass) &&
						sidedrawerCategories[i].nextElementSibling.nodeName.toLowerCase() === "ul" &&
						sidedrawerCategories[i].nextElementSibling.nodeType === 1
						) {
							sidedrawerCategories[i].nextElementSibling[style].display = "none";
							sidedrawerCategories[i][_addEventListener]("click", handleSidedrawerCategoryLink);
							sidedrawerCategories[i][classList].contains(isBindedClass);
					}
				}
			}
		};
		toggleSidedrawerCategoryItemsVisibility();

		var handleSidedrawerCategorySubLink = function () {
			docBody[classList].add(hideSidedrawerClass);
			sidedrawer[classList].remove(activeClass);
		};
		var hideSidedrawerOnNavigating = function () {
			var links;
			if (sidedrawer) {
				links = sidedrawer[getElementsByTagName]("a") || "";
				if (links) {
					for (var i = 0, l = links[_length]; i < l; i += 1) {
						if (!links[i][classList].contains(isBindedClass)) {
							links[i][_addEventListener]("click", handleSidedrawerCategorySubLink);
						}
					}
				}
			}
			if (appContentParent) {
				/* if (!appContentParent[classList].contains(isBindedClass)) { */
					appContentParent[_addEventListener]("click", handleSidedrawerCategorySubLink);
					/* appContentParent[classList].add(isBindedClass); */
				/* } */
			}
		};
		hideSidedrawerOnNavigating();

		var appBar = document[getElementsByTagName]("header")[0] || "";
		var appBarHeight = appBar.offsetHeight || 0;

		var hideAppBar = function () {
			var logic = function () {
				appBar[classList].remove(isFixedClass);
				if ((document[body].scrollTop || docElem.scrollTop || 0) > appBarHeight) {
					appBar[classList].add(isHiddenClass);
				} else {
					appBar[classList].remove(isHiddenClass);
				}
			};
			var throttleLogic = throttle(logic, 100);
			throttleLogic();
		};
		var revealAppBar = function () {
			var logic = function () {
				appBar[classList].remove(isHiddenClass);
				if ((document[body].scrollTop || docElem.scrollTop || 0) > appBarHeight) {
					appBar[classList].add(isFixedClass);
				} else {
					appBar[classList].remove(isFixedClass);
				}
			};
			var throttleLogic = throttle(logic, 100);
			throttleLogic();
		};
		var resetAppBar = function () {
			var logic = function () {
				if ((document[body].scrollTop || docElem.scrollTop || 0) < appBarHeight) {
					appBar[classList].remove(isHiddenClass);
					appBar[classList].remove(isFixedClass);
				}
			};
			var throttleLogic = throttle(logic, 100);
			throttleLogic();
		};
		if (appBar) {
			root[_addEventListener]("scroll", resetAppBar, {passive: true});
			if (hasTouch) {
				if (root.tocca) {
					root[_addEventListener]("swipeup", hideAppBar, {passive: true});
					root[_addEventListener]("swipedown", revealAppBar, {passive: true});
				}
			} else {
				if (hasWheel) {
					if (root.WheelIndicator) {
						var indicator;
						indicator = new WheelIndicator({
								elem: root,
								callback: function (e) {
									if ("down" === e.direction) {
										hideAppBar();
									}
									if ("up" === e.direction) {
										revealAppBar();
									}
								},
								preventMouse: false
							});
					}
				}
			}
		}
	};

	/* var scripts = [
		"../../fonts/material-design-icons/3.0.1/css/material-icons.css",
		"../../fonts/MaterialDesign-Webfont/2.2.43/css/materialdesignicons.css",
		"../../fonts/roboto-fontfacekit/2.137/css/roboto.css",
		"../../fonts/roboto-mono-fontfacekit/2.0.986/css/roboto-mono.css",
		"./node_modules/normalize.css/normalize.css",
		"../../cdn/highlight.js/9.12.0/css/hljs.css",
		"./bower_components/mui/src/sass/mui.css"
	]; */

	var scripts = [
		/* "./libs/serguei-muicss/css/vendors.min.css", */
		"./libs/serguei-muicss/css/bundle.min.css"
	];

	var supportsPassive = (function() {
		var support = false;
		try {
			var opts = Object[defineProperty] && Object[defineProperty]({}, "passive", {
				get: function() {
					support = true;
				}
			});
			root[_addEventListener]("test", function() {}, opts);
		} catch (err) {}
		return support;
	})();

	var needsPolyfills = (function() {
		return !String.prototype.startsWith ||
			!supportsPassive ||
			!root.requestAnimationFrame ||
			!root.matchMedia ||
			("undefined" === typeof root.Element && !("dataset" in docElem)) ||
			!("classList" in document[createElement]("_")) ||
			document[createElementNS] && !("classList" in document[createElementNS]("http://www.w3.org/2000/svg", "g")) ||
			/* !document.importNode || */
			/* !("content" in document[createElement]("template")) || */
			(root.attachEvent && !root[_addEventListener]) ||
			!("onhashchange" in root) ||
			!Array.prototype.indexOf ||
			!root.Promise ||
			!root.fetch ||
			!document[querySelectorAll] ||
			!document[querySelector] ||
			!Function.prototype.bind ||
			(Object[defineProperty] &&
				Object[getOwnPropertyDescriptor] &&
				Object[getOwnPropertyDescriptor](Element.prototype, "textContent") &&
				!Object[getOwnPropertyDescriptor](Element.prototype, "textContent").get) ||
			!("undefined" !== typeof root.localStorage && "undefined" !== typeof root.sessionStorage) ||
			!root.WeakMap ||
			!root.MutationObserver;
	})();

	if (needsPolyfills) {
		scripts.push("./cdn/polyfills/js/polyfills.fixed.min.js");
	}

	/* var scripts = [
		"./node_modules/jquery/dist/jquery.js",
		"./bower_components/mui/packages/cdn/js/mui.js",
		"../../cdn/highlight.js/9.12.0/js/highlight.pack.js",
		"../../cdn/verge/1.9.1/js/verge.fixed.js",
		"../../cdn/Tocca.js/2.0.1/js/Tocca.fixed.min.js",
		"../../cdn/wheel-indicator/1.1.4/js/wheel-indicator.fixed.min.js"
	]; */

	scripts.push("./libs/serguei-muicss/js/vendors.min.js");

	/*!
	 * load scripts after webfonts loaded using doesFontExist
	 */

	var supportsCanvas = (function() {
		var elem = document[createElement]("canvas");
		return !!(elem.getContext && elem.getContext("2d"));
	})();

	var onFontsLoadedCallback = function() {

		var slot;
		var onFontsLoaded = function() {
			clearInterval(slot);
			slot = null;

			/* progressBar.increase(20); */

			var load;
			load = new loadJsCss(scripts, run);
		};

		var checkFontIsLoaded = function() {
			/*!
			 * check only for fonts that are used in current page
			 */
			if (doesFontExist("Roboto") && doesFontExist("Roboto Mono")) {
				onFontsLoaded();
			}
		};

		if (supportsCanvas) {
			slot = setInterval(checkFontIsLoaded, 100);
		} else {
			slot = null;
			onFontsLoaded();
		}
	};

	loadCSS(
		/* forcedHTTP + "://fonts.googleapis.com/css?family=Roboto+Mono%7CRoboto:300,400,500,700&subset=cyrillic,latin-ext", */
		"./libs/serguei-muicss/css/vendors.min.css",
		onFontsLoadedCallback
	);

	/*!
	 * load scripts after webfonts loaded using webfontloader
	 */

	/* root.WebFontConfig = {
		google: {
			families: [
				"Roboto:300,400,500,700:cyrillic",
				"Roboto Mono:400:cyrillic,latin-ext"
			]
		},
		listeners: [],
		active: function () {
			this.called_ready = true;
			for (var i = 0; i < this.listeners[_length]; i++) {
				this.listeners[i]();
			}
		},
		ready: function (callback) {
			if (this.called_ready) {
				callback();
			} else {
				this.listeners.push(callback);
			}
		}
	};

	var onFontsLoadedCallback = function () {

		var onFontsLoaded = function () {
			progressBar.increase(20);

			var load;
			load = new loadJsCss(scripts, run);
		};

		root.WebFontConfig.ready(onFontsLoaded);
	};

	var load;
	load = new loadJsCss(
			[forcedHTTP + "://cdn.jsdelivr.net/npm/webfontloader@1.6.28/webfontloader.min.js"],
			onFontsLoadedCallback
		); */
})("undefined" !== typeof window ? window : this, document);
