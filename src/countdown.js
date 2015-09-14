/*
 * countdown.js
 * author: lijie
 * mail : 19175416@qq.com
 * version: v1.0.0
 */
(function(factory) {
	if (typeof define === "function" && define.amd) {

		define(["jquery"], factory);
	} else {

		factory(jQuery);
	}
})(function($) {

	"use strict";

	var defaultOptions = {
		format: 'dd天hh时mm分ss.ms',
		endText: '已结束',
		auto: true,
		onEnd: null, //结束一个倒计时元素
		onTimerEnd: null //计时器停止
	};

	function Countdown(el, options) {

		this.$el = el;
		this.elems = [];
		this.timer = null;
		this.interval = 1000;
		this._o = $.extend(defaultOptions, options);
		this._init();
	}
	Countdown.prototype = {

		_init: function() {
			var _ = this;

			_.elems = $.makeArray(_.$el);

			this.interval = _._o.format.indexOf('ms') ? 100 : 1000;

			if (this._o.auto) {

				this.start();
			}

		},
		start: function() {

			var _this = this;

			if (this.timer != null) {

				clearInterval(this.timer);
			}
			this.timer = setInterval(function() {

				_this._render();

			}, this.interval);
		},
		stop: function() {

			clearInterval(this.timer);
			this._o.onTimerEnd();
		},
		_end: function(ele) {

			$(ele).html(this._o.endText);
			this._remove(ele);
			if ($.isFunction(this._o.onEnd)) {
				this._o.onEnd(ele);
			}
		},
		_render: function() {

			var _this = this;

			if (!this.elems) {

				this._clearInterval();
			}
			$(this.elems).each(function() {

				var diff = ($(this).attr("diff") * 1000) - (new Date).getTime();

				if (diff <= 0) {

					_this._end(this);

				} else {

					$(this).html(_this._formatDate(diff));
				}

			});
		},
		_formatDate: function(diff) {

			var format = this._o.format;

			var d = 86400000,
				h = 3600000,
				m = 60000,
				s = 1000,
				ms = 100,
				D,
				H,
				M,
				S,
				MS

			var timeHandler = {

				dd: function() {
					H = diff % d;
					return Math.floor(diff / d);
				},
				hh: function() {
					/*
					 * format设置为hh:mm:ss的情况下
					 * diff/h 表示 不显示天数
					 */
					M = !H ? diff % h : H % h;
					return Math.floor(H / h);
				},
				mm: function() {
					/*
					 * format设置为mm:ss的情况下
					 * diff/m 表示 不显示天数和小时数
					 * 不考虑 dd:mm 的情况
					 */
					S = !M ? diff % m : M % m;
					return Math.floor(M / m);
				},
				ss: function() {
					MS = S % s;
					return Math.floor(S / s);
				},
				ms: function() {
					return Math.floor(MS / ms);
				}

			}
			//add leading zeros
			var leadzero = function(x) {
				return (1e15 + "" + x).slice(-2);
			};
			//replace
			format = format.replace(/(dd|hh|mm|ss|ms)/g, function(k) {

				return k === 'ms' ? timeHandler[k]() : leadzero(timeHandler[k]())
			});

			return format;
		},
		/*
		 * 添加倒计时元素
		 */
		add: function($ele) {

			var _this = this;

			$ele.each(function() {

				if (!_this._hasElem(this)) {

					_this.elems.push(this);
				}
			})
		},
		_hasElem: function(ele) {

			return ($.inArray(ele, this.elems) > -1);
		},
		/*
		 *
		 */
		_remove: function(ele) {
			//remove ele
			this.elems = $.map(this.elems,
				function(value) {
					return (value == ele ? null : value);
				});
		}
	}

	window.Countdown = Countdown;
});
