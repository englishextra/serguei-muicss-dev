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
		this.onClosed = options.onClosed;
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
		this.callCallback(this.onClosed, this);
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
 * A small javascript library for ripples
 * /Written by Aaron Längert
 * @see {@link https://github.com/SirBaaron/ripple-js}
 * replaced eval with workaround
 * moved functions away from for loop
 * == to ===
 * added is binded ripple class to avoid multiple assignments
 * moved some functions higher
 * passes jshint
 */
(function (root, document) {
	"use strict";
	var ripple = (function () {
		function getRippleContainer(el) {
			var childs = el.childNodes;
			for (var ii = 0; ii < childs.length; ii++) {
				try {
					/* if (childs[ii].className.indexOf("rippleContainer") > -1) { */
					if (childs[ii].classList.contains("rippleContainer")) {
						return childs[ii];
					}
				} catch (err) {}
			}
			return el;
		}
		function rippleStart(e) {
			var rippleContainer = getRippleContainer(e.target);
			/* if ((rippleContainer.getAttribute("animating") === "0" || !rippleContainer.hasAttribute("animating")) && e.target.className.indexOf("ripple") > -1) { */
			if ((rippleContainer.getAttribute("animating") === "0" || !rippleContainer.hasAttribute("animating")) && e.target.classList.contains("ripple")) {
				rippleContainer.setAttribute("animating", "1");
				var offsetX = typeof e.offsetX === "number" ? e.offsetX : e.touches[0].clientX - e.target.getBoundingClientRect().left;
				var offsetY = typeof e.offsetY === "number" ? e.offsetY : e.touches[0].clientY - e.target.getBoundingClientRect().top;
				var fullCoverRadius = Math.max(Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)), Math.sqrt(Math.pow(e.target.clientWidth - offsetX, 2) + Math.pow(e.target.clientHeight - offsetY, 2)), Math.sqrt(Math.pow(offsetX, 2) + Math.pow(e.target.clientHeight - offsetY, 2)), Math.sqrt(Math.pow(offsetY, 2) + Math.pow(e.target.clientWidth - offsetX, 2)));
				var expandTime = e.target.getAttribute("ripple-press-expand-time") || 3;
				rippleContainer.style.transition = "transform " + expandTime + "s ease-out, box-shadow 0.1s linear";
				rippleContainer.style.background = e.target.getAttribute("ripple-color") || "white";
				rippleContainer.style.opacity = e.target.getAttribute("ripple-opacity") || "0.6";
				rippleContainer.style.boxShadow = e.target.getAttribute("ripple-shadow") || "none";
				rippleContainer.style.top = offsetY + "px";
				rippleContainer.style.left = offsetX + "px";
				rippleContainer.style.transform = "translate(-50%, -50%) scale(" + fullCoverRadius / 100 + ")";
			}
		}
		function rippleEnd(e) {
			var rippleContainer = getRippleContainer(e.target);
			if (rippleContainer.getAttribute("animating") === "1") {
				rippleContainer.setAttribute("animating", "2");
				var background = root.getComputedStyle(rippleContainer, null).getPropertyValue("background");
				var destinationRadius = e.target.clientWidth + e.target.clientHeight;
				rippleContainer.style.transition = "none";
				var expandTime = e.target.getAttribute("ripple-release-expand-time") || 0.4;
				rippleContainer.style.transition = "transform " + expandTime + "s linear, background " + expandTime + "s linear, opacity " + expandTime + "s ease-in-out";
				rippleContainer.style.transform = "translate(-50%, -50%) scale(" + destinationRadius / 100 + ")";
				rippleContainer.style.background = "radial-gradient(transparent 10%, " + background + " 40%)";
				rippleContainer.style.opacity = "0";
				e.target.dispatchEvent(new CustomEvent("ripple-button-click", {
						target: e.target
					}));
				var Fn = Function;
				new Fn("" + e.target.getAttribute("onrippleclick")).call(root);
			}
		}
		function rippleRetrieve(e) {
			var rippleContainer = getRippleContainer(e.target);
			if (rippleContainer.style.transform === "translate(-50%, -50%) scale(0)") {
				rippleContainer.setAttribute("animating", "0");
			}
			if (rippleContainer.getAttribute("animating") === "1") {
				rippleContainer.setAttribute("animating", "3");
				var collapseTime = e.target.getAttribute("ripple-leave-collapse-time") || 0.4;
				rippleContainer.style.transition = "transform " + collapseTime + "s linear, box-shadow " + collapseTime + "s linear";
				rippleContainer.style.boxShadow = "none";
				rippleContainer.style.transform = "translate(-50%, -50%) scale(0)";
			}
		}
		var ripple = {
			registerRipples: function () {
				var rippleButtons = document.getElementsByClassName("ripple");
				var i;
				var fn1 = function () {
					rippleButtons[i].addEventListener("touchstart", function (e) {
						rippleStart(e);
					}, {
						passive: true
					});
					rippleButtons[i].addEventListener("touchmove", function (e) {
						if (e.target.hasAttribute("ripple-cancel-on-move")) {
							rippleRetrieve(e);
							return;
						}
						var overEl;
						try {
							/* overEl = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY).className.indexOf("ripple") >= 0; */
							overEl = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY).classList.contains("ripple");
						} catch (err) {
							overEl = false;
						}
						if (!overEl) {
							rippleRetrieve(e);
						}
					}, {
						passive: true
					});
					rippleButtons[i].addEventListener("touchend", function (e) {
						rippleEnd(e);
					}, {
						passive: true
					});
					rippleButtons[i].addEventListener("mousedown", function (e) {
						rippleStart(e);
					}, {
						passive: true
					});
					rippleButtons[i].addEventListener("mouseup", function (e) {
						rippleEnd(e);
					}, {
						passive: true
					});
					rippleButtons[i].addEventListener("mousemove", function (e) {
						if (e.target.hasAttribute("ripple-cancel-on-move") && (e.movementX !== 0 || e.movementY !== 0)) {
							rippleRetrieve(e);
						}
					}, {
						passive: true
					});
					rippleButtons[i].addEventListener("mouseleave", function (e) {
						rippleRetrieve(e);
					}, {
						passive: true
					});
					rippleButtons[i].addEventListener("transitionend", function (e) {
						if (e.target.getAttribute("animating") === "2" || e.target.getAttribute("animating") === "3") {
							e.target.style.transition = "none";
							e.target.style.transform = "translate(-50%, -50%) scale(0)";
							e.target.style.boxShadow = "none";
							e.target.setAttribute("animating", "0");
						}
					}, {
						passive: true
					});
					if (getRippleContainer(rippleButtons[i]) === rippleButtons[i]) {
						rippleButtons[i].innerHTML += '<div class="rippleContainer"></div>';
					}
				};
				for (i = 0; i < rippleButtons.length; i++) {
					var isBindedRippleClass = "is-binded-ripple";
					if (!rippleButtons[i].classList.contains(isBindedRippleClass)) {
						rippleButtons[i].classList.add(isBindedRippleClass);
						fn1();
					}
				}
			},
			ripple: function (el) {
				/* if (el.className.indexOf("ripple") < 0) { */
				if (!el.classList.contains("ripple")) {
					return;
				}
				var rect = el.getBoundingClientRect();
				var e = {
					target: el,
					offsetX: rect.width / 2,
					offsetY: rect.height / 2
				};
				rippleStart(e);
				rippleEnd(e);
			}
		};
		/* root.addEventListener("load", function () { */
			var css = document.createElement("style");
			css.type = "text/css";
			css.innerHTML = ".ripple { overflow: hidden !important; position: relative; } .ripple .rippleContainer { display: block; height: 200px !important; width: 200px !important; padding: 0px 0px 0px 0px; border-radius: 50%; position: absolute !important; top: 0px; left: 0px; transform: translate(-50%, -50%) scale(0); -webkit-transform: translate(-50%, -50%) scale(0); -ms-transform: translate(-50%, -50%) scale(0); background-color: transparent; }  .ripple * {pointer-events: none !important;}";
			document.head.appendChild(css);
			ripple.registerRipples();
		/* }); */
		return ripple;
	})
	();
	root.ripple = ripple;
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

/*global jQuery */
/*!
 * Super lightweight script (~1kb) to detect via Javascript events like
 * 'tap' 'dbltap' "swipeup" "swipedown" "swipeleft" "swiperight"
 * on any kind of device.
 * Version: 2.0.1
 * Author: Gianluca Guarini
 * Contact: gianluca.guarini@gmail.com
 * Website: http://www.gianlucaguarini.com/
 * Twitter: @gianlucaguarini
 * Copyright (c) Gianluca Guarini
 * @see {@link https://github.com/GianlucaGuarini/Tocca.js/blob/master/Tocca.js}
 * passes jshint
 */
(function(doc, win) {
	"use strict";
	if (typeof doc.createEvent !== 'function') {
		return false;
	}
	var tapNum = 0,
		pointerId,
		currX,
		currY,
		cachedX,
		cachedY,
		timestamp,
		target,
		dblTapTimer,
		longtapTimer;
	var pointerEventSupport = function(type) {
			var lo = type.toLowerCase(),
				ms = 'MS' + type;
			return navigator.msPointerEnabled ? ms : window.PointerEvent ? lo : '';
		},
		defaults = {
			useJquery: !win.IGNORE_JQUERY && typeof jQuery !== 'undefined',
			swipeThreshold: win.SWIPE_THRESHOLD || 100,
			tapThreshold: win.TAP_THRESHOLD || 150,
			dbltapThreshold: win.DBL_TAP_THRESHOLD || 200,
			longtapThreshold: win.LONG_TAP_THRESHOLD || 1000,
			tapPrecision: win.TAP_PRECISION / 2 || 60 / 2,
			justTouchEvents: win.JUST_ON_TOUCH_DEVICES
		},
		wasTouch = false,
		touchevents = {
			touchstart: pointerEventSupport('PointerDown') || 'touchstart',
			touchend: pointerEventSupport('PointerUp') + ' touchend',
			touchmove: pointerEventSupport('PointerMove') + ' touchmove'
		},
		isTheSameFingerId = function(e) {
			return !e.pointerId || typeof pointerId === 'undefined' || e.pointerId === pointerId;
		},
		setListener = function(elm, events, callback) {
			var eventsArray = events.split(' '),
				i = eventsArray.length;
			while (i--) {
				elm.addEventListener(eventsArray[i], callback, false);
			}
		},
		getPointerEvent = function(event) {
			return event.targetTouches ? event.targetTouches[0] : event;
		},
		getTimestamp = function() {
			return new Date().getTime();
		},
		sendEvent = function(elm, eventName, originalEvent, data) {
			var customEvent = doc.createEvent('Event');
			customEvent.originalEvent = originalEvent;
			data = data || {};
			data.x = currX;
			data.y = currY;
			data.distance = data.distance;
			if (defaults.useJquery) {
				customEvent = jQuery.Event(eventName, {
					originalEvent: originalEvent
				});
				jQuery(elm).trigger(customEvent, data);
			}
			if (customEvent.initEvent) {
				for (var key in data) {
					if (data.hasOwnProperty(key)) {
						customEvent[key] = data[key];
					}
				}
				customEvent.initEvent(eventName, true, true);
				elm.dispatchEvent(customEvent);
			}
			while (elm) {
				if (elm['on' + eventName]) {
					elm['on' + eventName](customEvent);
				}
				elm = elm.parentNode;
			}
		},
		onTouchStart = function(e) {
			if (!isTheSameFingerId(e)) {
				return;
			}
			var isMousedown = e.type === 'mousedown';
			wasTouch = !isMousedown;
			pointerId = e.pointerId;
			if (e.type === 'mousedown' && wasTouch) {
				return;
			}
			var pointer = getPointerEvent(e);
			cachedX = currX = pointer.pageX;
			cachedY = currY = pointer.pageY;
			longtapTimer = setTimeout(function() {
				sendEvent(e.target, 'longtap', e);
				target = e.target;
			}, defaults.longtapThreshold);
			timestamp = getTimestamp();
			tapNum++;
		},
		onTouchEnd = function(e) {
			if (!isTheSameFingerId(e)) {
				return;
			}
			pointerId = undefined;
			if (e.type === 'mouseup' && wasTouch) {
				wasTouch = false;
				return;
			}
			var eventsArr = [],
				now = getTimestamp(),
				deltaY = cachedY - currY,
				deltaX = cachedX - currX;
			clearTimeout(dblTapTimer);
			clearTimeout(longtapTimer);
			if (deltaX <= -defaults.swipeThreshold) {
				eventsArr.push('swiperight');
			}
			if (deltaX >= defaults.swipeThreshold) {
				eventsArr.push('swipeleft');
			}
			if (deltaY <= -defaults.swipeThreshold) {
				eventsArr.push('swipedown');
			}
			if (deltaY >= defaults.swipeThreshold) {
				eventsArr.push('swipeup');
			}
			if (eventsArr.length) {
				for (var i = 0; i < eventsArr.length; i++) {
					var eventName = eventsArr[i];
					sendEvent(e.target, eventName, e, {
						distance: {
							x: Math.abs(deltaX),
							y: Math.abs(deltaY)
						}
					});
				}
				tapNum = 0;
			} else {
				if (cachedX >= currX - defaults.tapPrecision && cachedX <= currX + defaults.tapPrecision && cachedY >= currY - defaults.tapPrecision && cachedY <= currY + defaults.tapPrecision) {
					if (timestamp + defaults.tapThreshold - now >= 0) {
						sendEvent(e.target, tapNum >= 2 && target === e.target ? 'dbltap' : 'tap', e);
						target = e.target;
					}
				}
				dblTapTimer = setTimeout(function() {
					tapNum = 0;
				}, defaults.dbltapThreshold);
			}
		},
		onTouchMove = function(e) {
			if (!isTheSameFingerId(e)) {
				return;
			}
			if (e.type === 'mousemove' && wasTouch) {
				return;
			}
			var pointer = getPointerEvent(e);
			currX = pointer.pageX;
			currY = pointer.pageY;
		};
	setListener(doc, touchevents.touchstart + (defaults.justTouchEvents ? '' : ' mousedown'), onTouchStart);
	setListener(doc, touchevents.touchend + (defaults.justTouchEvents ? '' : ' mouseup'), onTouchEnd);
	setListener(doc, touchevents.touchmove + (defaults.justTouchEvents ? '' : ' mousemove'), onTouchMove);
	win.tocca = function(options) {
		for (var opt in options) {
			if (options.hasOwnProperty(opt)) {
				defaults[opt] = options[opt];
			}
		}
		return defaults;
	};
})(document, "undefined" !== typeof window ? window : this);

/*!
 * modified Generates event when user makes new movement (like a swipe on a touchscreen).
 * @version 1.1.4
 * @link https://github.com/Promo/wheel-indicator
 * @license MIT
 * @see {@link https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection}
 * forced passive event listener if supported
 * passes jshint
 */
/* global module, window, document */
var WheelIndicator = (function (root, document) {
	var eventWheel = "onwheel" in document ? "wheel" : "mousewheel",
	DEFAULTS = {
		callback: function () {},
		elem: document,
		preventMouse: true
	};
	function Module(options) {
		this._options = extend(DEFAULTS, options);
		this._deltaArray = [0, 0, 0];
		this._isAcceleration = false;
		this._isStopped = true;
		this._direction = "";
		this._timer = "";
		this._isWorking = true;
		var self = this;
		this._wheelHandler = function (event) {
			if (self._isWorking) {
				processDelta.call(self, event);
				if (self._options.preventMouse) {
					preventDefault(event);
				}
			}
		};
		addEvent(this._options.elem, eventWheel, this._wheelHandler);
	}
	Module.prototype = {
		constructor: Module,
		turnOn: function () {
			this._isWorking = true;
			return this;
		},
		turnOff: function () {
			this._isWorking = false;
			return this;
		},
		setOptions: function (options) {
			this._options = extend(this._options, options);
			return this;
		},
		getOption: function (option) {
			var neededOption = this._options[option];
			if (neededOption !== undefined) {
				return neededOption;
			}
			throw new Error("Unknown option");
		},
		destroy: function () {
			removeEvent(this._options.elem, eventWheel, this._wheelHandler);
			return this;
		}
	};
	function triggerEvent(event) {
		event.direction = this._direction;
		this._options.callback.call(this, event);
	}
	var getDeltaY = function (event) {
		if (event.wheelDelta && !event.deltaY) {
			getDeltaY = function (event) {
				return event.wheelDelta * -1;
			};
		} else {
			getDeltaY = function (event) {
				return event.deltaY;
			};
		}
		return getDeltaY(event);
	};
	function preventDefault(event) {
		event = event || root.event;
		if (event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	}
	function processDelta(event) {
		var
		self = this,
		delta = getDeltaY(event);
		if (delta === 0)
			return;
		var direction = delta > 0 ? "down" : "up",
		arrayLength = self._deltaArray.length,
		changedDirection = false,
		repeatDirection = 0,
		sustainableDirection,
		i;
		clearTimeout(self._timer);
		self._timer = setTimeout(function () {
				self._deltaArray = [0, 0, 0];
				self._isStopped = true;
				self._direction = direction;
			}, 150);
		for (i = 0; i < arrayLength; i++) {
			if (self._deltaArray[i] !== 0) {
				if (self._deltaArray[i] > 0) {
					++repeatDirection;
				} else {
					--repeatDirection;
				}
			}
		}
		if (Math.abs(repeatDirection) === arrayLength) {
			sustainableDirection = repeatDirection > 0 ? "down" : "up";
			if (sustainableDirection !== self._direction) {
				changedDirection = true;
				self._direction = direction;
			}
		}
		if (!self._isStopped) {
			if (changedDirection) {
				self._isAcceleration = true;
				triggerEvent.call(this, event);
			} else {
				if (Math.abs(repeatDirection) === arrayLength) {
					analyzeArray.call(this, event);
				}
			}
		}
		if (self._isStopped) {
			self._isStopped = false;
			self._isAcceleration = true;
			self._direction = direction;
			triggerEvent.call(this, event);
		}
		self._deltaArray.shift();
		self._deltaArray.push(delta);
	}
	function analyzeArray(event) {
		var
		deltaArray0Abs = Math.abs(this._deltaArray[0]),
		deltaArray1Abs = Math.abs(this._deltaArray[1]),
		deltaArray2Abs = Math.abs(this._deltaArray[2]),
		deltaAbs = Math.abs(getDeltaY(event));
		if ((deltaAbs > deltaArray2Abs) && (deltaArray2Abs > deltaArray1Abs) && (deltaArray1Abs > deltaArray0Abs)) {
			if (!this._isAcceleration) {
				triggerEvent.call(this, event);
				this._isAcceleration = true;
			}
		}
		if ((deltaAbs < deltaArray2Abs) && (deltaArray2Abs <= deltaArray1Abs)) {
			this._isAcceleration = false;
		}
	}
	var supportsPassive = (function () {
		var support = false;
		try {
			var opts = Object.defineProperty && Object.defineProperty({}, "passive", {
					get: function () {
						support = true;
					}
				});
			root.addEventListener("test", function () {}, opts);
		} catch (err) {}
		return support;
	}
		());
	function addEvent(elem, type, handler) {
		if (elem.addEventListener) {
			elem.addEventListener(type, handler, supportsPassive ? {
				passive: true
			}
				 : false);
		} else if (elem.attachEvent) {
			elem.attachEvent("on" + type, handler);
		}
	}
	function removeEvent(elem, type, handler) {
		if (elem.removeEventListener) {
			elem.removeEventListener(type, handler, supportsPassive ? {
				passive: true
			}
				 : false);
		} else if (elem.detachEvent) {
			elem.detachEvent("on" + type, handler);
		}
	}
	function extend(defaults, options) {
		var extended = {},
		prop;
		for (prop in defaults) {
			if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
				extended[prop] = defaults[prop];
			}
		}
		for (prop in options) {
			if (Object.prototype.hasOwnProperty.call(options, prop)) {
				extended[prop] = options[prop];
			}
		}
		return extended;
	}
	return Module;
}
	("undefined" !== typeof window ? window : this, document));
if (typeof exports === "object") {
	module.exports = WheelIndicator;
}
