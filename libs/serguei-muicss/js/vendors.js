/*!
 * modified Simple lightbox effect in pure JS
 * @see {@link https://github.com/squeral/lightbox}
 * @see {@link https://github.com/squeral/lightbox/blob/master/lightbox.js}
 * @params {Object} elem Node element
 * @params {Object} [rate] debounce rate, default 500ms
 * new IframeLightbox(elem)
 * passes jshint
 */
(function (root, document) {
	"use strict";
	var addEventListener = "addEventListener";
	var getElementById = "getElementById";
	var getElementsByClassName = "getElementsByClassName";
	var createElement = "createElement";
	var classList = "classList";
	var appendChild = "appendChild";
	var dataset = "dataset";
	var containerClass = "iframe-lightbox";
	var isLoadedClass = "is-loaded";
	var isOpenedClass = "is-opened";
	var isShowingClass = "is-showing";
	var IframeLightbox = function (elem, settings) {
		var options = settings || {};
		this.trigger = elem;
		this.rate = options.rate || 500;
		this.el = document[getElementsByClassName](containerClass)[0] || "";
		this.body = this.el ? this.el[getElementsByClassName]("body")[0] : "";
		this.content = this.el ? this.el[getElementsByClassName]("content")[0] : "";
		this.href = elem[dataset].src || "";
		this.paddingBottom = elem[dataset].paddingBottom || "";
		//Event handlers
		this.onOpened = options.onOpened;
		this.onIframeLoaded = options.onIframeLoaded;
		this.onLoaded = options.onLoaded;
		this.onCreated = options.onCreated;
		this.init();
	};
	IframeLightbox.prototype.init = function () {
		var _this = this;
		if (!this.el) {
			this.create();
		}
		var debounce = function (func, wait) {
			var timeout,
			args,
			context,
			timestamp;
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
		var handleOpenIframeLightbox = function (e) {
			e.preventDefault();
			_this.open();
		};
		var debounceHandleOpenIframeLightbox = debounce(handleOpenIframeLightbox, this.rate);
		this.trigger[addEventListener]("click", debounceHandleOpenIframeLightbox);
	};
	IframeLightbox.prototype.create = function () {
		var _this = this,
		bd = document[createElement]("div");
		this.el = document[createElement]("div");
		this.content = document[createElement]("div");
		this.body = document[createElement]("div");
		this.el[classList].add(containerClass);
		bd[classList].add("backdrop");
		this.content[classList].add("content");
		this.body[classList].add("body");
		this.el[appendChild](bd);
		this.content[appendChild](this.body);
		this.contentHolder = document[createElement]("div");
		this.contentHolder[classList].add("content-holder");
		this.contentHolder[appendChild](this.content);
		this.el[appendChild](this.contentHolder);
		document.body[appendChild](this.el);
		bd[addEventListener]("click", function () {
			_this.close();
		});
		var clearBody = function () {
			if (_this.isOpen()) {
				return;
			}
			_this.el[classList].remove(isShowingClass);
			_this.body.innerHTML = "";
		};
		this.el[addEventListener]("transitionend", clearBody, false);
		this.el[addEventListener]("webkitTransitionEnd", clearBody, false);
		this.el[addEventListener]("mozTransitionEnd", clearBody, false);
		this.el[addEventListener]("msTransitionEnd", clearBody, false);
		this.callCallback(this.onCreated, this);
	};
	IframeLightbox.prototype.loadIframe = function () {
		var _this = this;
		this.iframeId = containerClass + Date.now();
		this.body.innerHTML = '<iframe src="' + this.href + '" name="' + this.iframeId + '" id="' + this.iframeId + '" onload="this.style.opacity=1;" style="opacity:0;border:none;" scrolling="no" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true" height="166" frameborder="no"></iframe>';
		(function (iframeId, body) {
			document[getElementById](iframeId).onload = function () {
				this.style.opacity = 1;
				body[classList].add(isLoadedClass);
				_this.callCallback(_this.onIframeLoaded, _this);
				_this.callCallback(_this.onLoaded, _this);
			};
		})(this.iframeId, this.body);
	};
	IframeLightbox.prototype.open = function () {
		this.loadIframe();
		if (this.paddingBottom) {
			this.content.style.paddingBottom = this.paddingBottom;
		} else {
			this.content.removeAttribute("style");
		}
		this.el[classList].add(isShowingClass);
		this.el[classList].add(isOpenedClass);
		this.callCallback(this.onOpened, this);
	};
	IframeLightbox.prototype.close = function () {
		this.el[classList].remove(isOpenedClass);
		this.body[classList].remove(isLoadedClass);
	};
	IframeLightbox.prototype.isOpen = function () {
		return this.el[classList].contains(isOpenedClass);
	};
	IframeLightbox.prototype.callCallback = function(func, data) {
		if (typeof func !== "function") {
			return;
		}
		var caller = func.bind(this);
		caller(data);
	};
	root.IframeLightbox = IframeLightbox;
})("undefined" !== typeof window ? window : this, document);

/*!
 * modified verge 1.9.1+201402130803
 * @see {@link https://github.com/ryanve/verge}
 * MIT License 2013 Ryan Van Etten
 * removed module
 * converted to dot notation
 * added &&r.left<=viewportW()&&(0!==el.offsetHeight);
 * added &&r.left<=viewportW()&&(0!==el.offsetHeight);
 * added &&r.top<=viewportH()&&(0!==el.offsetHeight);
 * Substitute inViewport with: inY on vertical sites, inX on horizontal ones.
 * On pages without horizontal scroll, inX is always true.
 * On pages without vertical scroll, inY is always true.
 * If the viewport width is >= the document width, then inX is always true.
 * bug: inViewport returns true if element is hidden
 * @see {@link https://github.com/ryanve/verge/issues/19}
 * @see {@link https://github.com/ryanve/verge/blob/master/verge.js}
 * passes jshint
 */
(function (root) {
	"use strict";
	var verge = (function () {
		var xports = {},
		win = typeof root !== "undefined" && root,
		doc = typeof document !== "undefined" && document,
		docElem = doc && doc.documentElement,
		matchMedia = win.matchMedia || win.msMatchMedia,
		mq = matchMedia ? function (q) {
			return !!matchMedia.call(win, q).matches;
		}
		 : function () {
			return false;
		},
		viewportW = xports.viewportW = function () {
			var a = docElem.clientWidth,
			b = win.innerWidth;
			return a < b ? b : a;
		},
		viewportH = xports.viewportH = function () {
			var a = docElem.clientHeight,
			b = win.innerHeight;
			return a < b ? b : a;
		};
		xports.mq = mq;
		xports.matchMedia = matchMedia ? function () {
			return matchMedia.apply(win, arguments);
		}
		 : function () {
			return {};
		};
		function viewport() {
			return {
				"width": viewportW(),
				"height": viewportH()
			};
		}
		xports.viewport = viewport;
		xports.scrollX = function () {
			return win.pageXOffset || docElem.scrollLeft;
		};
		xports.scrollY = function () {
			return win.pageYOffset || docElem.scrollTop;
		};
		function calibrate(coords, cushion) {
			var o = {};
			cushion = +cushion || 0;
			o.width = (o.right = coords.right + cushion) - (o.left = coords.left - cushion);
			o.height = (o.bottom = coords.bottom + cushion) - (o.top = coords.top - cushion);
			return o;
		}
		function rectangle(el, cushion) {
			el = el && !el.nodeType ? el[0] : el;
			if (!el || 1 !== el.nodeType) {
				return false;
			}
			return calibrate(el.getBoundingClientRect(), cushion);
		}
		xports.rectangle = rectangle;
		function aspect(o) {
			o = null === o ? viewport() : 1 === o.nodeType ? rectangle(o) : o;
			var h = o.height,
			w = o.width;
			h = typeof h === "function" ? h.call(o) : h;
			w = typeof w === "function" ? w.call(o) : w;
			return w / h;
		}
		xports.aspect = aspect;
		xports.inX = function (el, cushion) {
			var r = rectangle(el, cushion);
			return !!r && r.right >= 0 && r.left <= viewportW() && (0 !== el.offsetHeight);
		};
		xports.inY = function (el, cushion) {
			var r = rectangle(el, cushion);
			return !!r && r.bottom >= 0 && r.top <= viewportH() && (0 !== el.offsetHeight);
		};
		xports.inViewport = function (el, cushion) {
			var r = rectangle(el, cushion);
			return !!r && r.bottom >= 0 && r.right >= 0 && r.top <= viewportH() && r.left <= viewportW() && (0 !== el.offsetHeight);
		};
		return xports;
	})();
	root.verge = verge;
})("undefined" !== typeof window ? window : this);
