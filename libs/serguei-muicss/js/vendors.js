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

!function(e,t){"use strict";if("function"!=typeof e.createEvent)return!1;var o,n,r,i,s,u,a,h,p,c=function(e){var o=e.toLowerCase(),n="MS"+e;return navigator.msPointerEnabled?n:!!t.PointerEvent&&o},d={useJquery:!t.IGNORE_JQUERY&&"undefined"!=typeof jQuery,swipeThreshold:t.SWIPE_THRESHOLD||100,tapThreshold:t.TAP_THRESHOLD||150,dbltapThreshold:t.DBL_TAP_THRESHOLD||200,longtapThreshold:t.LONG_TAP_THRESHOLD||1e3,tapPrecision:t.TAP_PRECISION/2||30,justTouchEvents:t.JUST_ON_TOUCH_DEVICES},v=!1,f={touchstart:c("PointerDown")||"touchstart",touchend:c("PointerUp")||"touchend",touchmove:c("PointerMove")||"touchmove"},T=0,l=function(e){return!e.pointerId||void 0===o||e.pointerId===o},E=function(e,t,o){for(var n=t.split(" "),r=n.length;r--;)e.addEventListener(n[r],o,!1)},g=function(e){return e.targetTouches?e.targetTouches[0]:e},w=function(){return(new Date).getTime()},m=function(t,o,i,s){var u=e.createEvent("Event");if(u.originalEvent=i,s=s||{},s.x=n,s.y=r,s.distance=s.distance,d.useJquery&&(u=jQuery.Event(o,{originalEvent:i}),jQuery(t).trigger(u,s)),u.initEvent){for(var a in s)s.hasOwnProperty(a)&&(u[a]=s[a]);u.initEvent(o,!0,!0),t.dispatchEvent(u)}for(;t;)t["on"+o]&&t["on"+o](u),t=t.parentNode};E(e,f.touchstart+(d.justTouchEvents?"":" mousedown"),function(e){if(l(e)&&(o=e.pointerId,"mousedown"!==e.type&&(v=!0),"mousedown"!==e.type||!v)){var t=g(e);i=n=t.pageX,s=r=t.pageY,p=setTimeout(function(){m(e.target,"longtap",e),a=e.target},d.longtapThreshold),u=w(),T++}}),E(e,f.touchend+(d.justTouchEvents?"":" mouseup"),function(e){if(l(e))if(o=void 0,"mouseup"===e.type&&v)v=!1;else{var t=[],c=w(),f=s-r,E=i-n;if(clearTimeout(h),clearTimeout(p),E<=-d.swipeThreshold&&t.push("swiperight"),E>=d.swipeThreshold&&t.push("swipeleft"),f<=-d.swipeThreshold&&t.push("swipedown"),f>=d.swipeThreshold&&t.push("swipeup"),t.length){for(var g=0;g<t.length;g++){var P=t[g];m(e.target,P,e,{distance:{x:Math.abs(E),y:Math.abs(f)}})}T=0}else i>=n-d.tapPrecision&&i<=n+d.tapPrecision&&s>=r-d.tapPrecision&&s<=r+d.tapPrecision&&u+d.tapThreshold-c>=0&&(m(e.target,T>=2&&a===e.target?"dbltap":"tap",e),a=e.target),h=setTimeout(function(){T=0},d.dbltapThreshold)}}),E(e,f.touchmove+(d.justTouchEvents?"":" mousemove"),function(e){if(l(e)&&("mousemove"!==e.type||!v)){var t=g(e);n=t.pageX,r=t.pageY}}),t.tocca=function(e){for(var t in e)e.hasOwnProperty(t)&&(d[t]=e[t]);return d}}(document,"undefined"!=typeof window?window:this);
var WheelIndicator=function(t,e){function i(t){this._options=h(u,t),this._deltaArray=[0,0,0],this._isAcceleration=!1,this._isStopped=!0,this._direction="",this._timer="",this._isWorking=!0;var e=this;this._wheelHandler=function(t){e._isWorking&&(o.call(e,t),e._options.preventMouse&&r(t))},a(this._options.elem,l,this._wheelHandler)}function n(t){t.direction=this._direction,this._options.callback.call(this,t)}function r(e){e=e||t.event,e.preventDefault?e.preventDefault():e.returnValue=!1}function o(t){var e=this,i=d(t);if(0!==i){var r,o,a=i>0?"down":"up",c=e._deltaArray.length,h=!1,l=0;for(clearTimeout(e._timer),e._timer=setTimeout(function(){e._deltaArray=[0,0,0],e._isStopped=!0,e._direction=a},150),o=0;c>o;o++)0!==e._deltaArray[o]&&(e._deltaArray[o]>0?++l:--l);Math.abs(l)===c&&(r=l>0?"down":"up",r!==e._direction&&(h=!0,e._direction=a)),e._isStopped||(h?(e._isAcceleration=!0,n.call(this,t)):Math.abs(l)===c&&s.call(this,t)),e._isStopped&&(e._isStopped=!1,e._isAcceleration=!0,e._direction=a,n.call(this,t)),e._deltaArray.shift(),e._deltaArray.push(i)}}function s(t){var e=Math.abs(this._deltaArray[0]),i=Math.abs(this._deltaArray[1]),r=Math.abs(this._deltaArray[2]),o=Math.abs(d(t));o>r&&r>i&&i>e&&(this._isAcceleration||(n.call(this,t),this._isAcceleration=!0)),r>o&&i>=r&&(this._isAcceleration=!1)}function a(t,e,i){t.addEventListener?t.addEventListener(e,i,p?{passive:!0}:!1):t.attachEvent&&t.attachEvent("on"+e,i)}function c(t,e,i){t.removeEventListener?t.removeEventListener(e,i,p?{passive:!0}:!1):t.detachEvent&&t.detachEvent("on"+e,i)}function h(t,e){var i,n={};for(i in t)Object.prototype.hasOwnProperty.call(t,i)&&(n[i]=t[i]);for(i in e)Object.prototype.hasOwnProperty.call(e,i)&&(n[i]=e[i]);return n}var l="onwheel"in e?"wheel":"mousewheel",u={callback:function(){},elem:e,preventMouse:!0};i.prototype={constructor:i,turnOn:function(){return this._isWorking=!0,this},turnOff:function(){return this._isWorking=!1,this},setOptions:function(t){return this._options=h(this._options,t),this},getOption:function(t){var e=this._options[t];if(void 0!==e)return e;throw Error("Unknown option")},destroy:function(){return c(this._options.elem,l,this._wheelHandler),this}};var d=function(t){return(d=t.wheelDelta&&!t.deltaY?function(t){return-1*t.wheelDelta}:function(t){return t.deltaY})(t)},p=function(){var e=!1;try{var i=Object.defineProperty&&Object.defineProperty({},"passive",{get:function(){e=!0}});t.addEventListener("test",function(){},i)}catch(n){}return e}();return i}("undefined"!=typeof window?window:this,document);"object"==typeof exports&&(module.exports=WheelIndicator);
