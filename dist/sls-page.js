(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

function etd() {
	var arguments$1 = arguments;


	if (arguments.length == 0) {
		return {};
	}

	if (!arguments[0] || (arguments[0] && arguments[0] !== true && arguments[0].constructor !== Object)) {
		return {};
	}

	var len = arguments.length,
		start = 1,
		j = len - 1,
		target = arguments[0],
		replace = true;

	if (target === true) {
		target = {};
	}

	if (arguments[j] === false) {
		j--;
		replace = false;
	}

	for (var i = start; i <= j; i++) {
		var cur = arguments$1[i];
		for (var f in cur) {
			if (typeof cur[f] !== 'object') {
				target[f] = cur[f];
			} else {
				if (replace !== false) {
					target[f] = cur[f].constructor === Object ? (target[f].constructor !== Object ? {} : target[f]) : (target[f].constructor !== Array ? [] : target[f]);
					target[f] = ets(target[f], cur[f]);
				}
			}
		}

	}


	return target;
}

/**
 * 分页类
 */
var SlsPage = function SlsPage(opts) {
	var this$1 = this;

	//必传参数
	if (!opts) {
		throw new Error('构造函数必须传入参数！');
	}

	//参数必须为一个对象
	if (typeof opts !== 'object' || opts.constructor !== Object) {
		throw new Error('构造函数参数必须为一个对象！');
	}

	//必传字段
	this.errors = [
		'page_size',
		'page_cur',
		'page_show'
	];

	this.curPageErrorCode = {
		// isNotNumber: 1, //不是数字
		gt: 2, //大于总页数
		lt: 3, //小于1
	};


	//默认信息
	this.params = {
		page_total: 0, //总数量
		page_count: 0, //总页数
		page_cur: 1, //当前页
		page_size: 10, //每页显示数量
		page_show: 5, //显示的页码个数

		step: 0, //分页边界
		page_start: 0, //分页开始位置
		page_end: 0, //分页结束位置

		callback: function(infos) {}, //设置分页成功后的回调

		//默认传入的当前页码 <1 时为1，大于总页数时为总页数
		//所以如果想自己处理逻辑时，只需要把这个参数设置成true，然后传入下面的回调便可自己设置逻辑。
		curPageError: false,
		curPageErrorCallback: function(n, msg) {},
	};



	//合并传过来的参数
	this.params = etd(this.params, opts);

	//检测合并后的参数是否合法
	for (var f in this$1.params) {
		if (this$1.errors.indexOf(f) != -1) {
			if (!this$1.params[f]) {
				throw new Error('参数 ' + f + ' 不能为空!');
			}
			if (this$1.params[f] && typeof this$1.params[f] !== 'number') {
				throw new Error('参数 ' + f + ' 不能是数字类型!');
			}
		}
	}


	if (!this.params.page_count && !this.params.page_total) {
		throw new Error('param page_count or page_total is requied!');
	}

	if (!this.params.page_count && typeof this.params.page_total !== 'number') {
		throw new Error('参数 page_total 必须是一个数字 !');
	}

	if (!this.params.page_total && typeof this.params.page_count !== 'number') {
		throw new Error('参数 page_count 必须是一个数字 !');
	}


	this.pageInfos = {
		page_count: this.params.page_count,
		page_cur: this.params.page_cur,
		page_prev: {
			page: 0,
			text: this.params.page_prev_text || '上一页'
		},
		page_next: {
			page: 0,
			text: this.params.page_next_text || '下一页'
		},
		page_first: {
			page: 0,
			text: this.params.page_first_text || '首页'
		},
		page_last: {
			page: 0,
			text: this.params.page_last_text || '尾页'
		},
		page_lists: []
	};

	//初始化
	this.init();
};


/**
	 * 初始化
	 */
SlsPage.prototype.init = function init () {
	this.updateParam();

	if (this.checkCurPage() === true) {
		this.setPageInfo();
		this.successCallback();
	}
};


/**
	 * 更新参数
	 */
SlsPage.prototype.updateParam = function updateParam () {
	if (!this.params.page_count || this.params.page_total) {
		this.params.page_total = parseInt(this.params.page_total);
		this.params.page_size = parseInt(this.params.page_size);
		this.params.page_count = Math.ceil(this.params.page_total / this.params.page_size);
	}
	this.params.step = Math.floor(this.params.page_show / 2);
};


/**
	 * 传入当前页码的合法性
	 * @param  {number}  当前页码
	 * @return {boolean} 合法返回true，不合法返回false
	 */
SlsPage.prototype.checkCurPage = function checkCurPage (cur) {
	var cur = cur !== undefined ? cur : this.params.page_cur;
	if (typeof cur !== 'number') {
		throw new Error('page_cur must is number！');
		return false;
	}
	if ((cur < 1 || cur > this.params.page_count) && this.params.curPageError === true) {
		this.curPageErrorCallback(cur, this.curPageErrorCode[cur < 1 ? 'lt' : 'gt']);
		return false;
	}
	return true;
};


/**
	 * 当前页码
	 * @param {number}
	 */
SlsPage.prototype.setCurPage = function setCurPage (cur) {
	if (this.checkCurPage(cur) === true) {
		this.setPageInfo(cur);
		this.successCallback();
	}
};


/**
	 * 计算分页
	 */
SlsPage.prototype.setPageInfo = function setPageInfo (cur) {
		var this$1 = this;

	//设置当前页
	this.params.page_cur = cur >= 0 ? cur : this.params.page_cur;
	this.params.page_cur = this.params.page_cur < 1 ? 1 : this.params.page_cur;
	this.params.page_cur = this.params.page_cur > this.params.page_count ? this.params.page_count : this.params.page_cur;

	//计算开始页
	this.params.page_start = this.params.page_cur - this.params.step;
	this.params.page_start = this.params.page_start < 1 ? 1 : this.params.page_start;
	//计算结束页
	this.params.page_end = this.params.page_cur + this.params.step;
	this.params.page_end = this.params.page_end > this.params.page_count ? this.params.page_count : this.params.page_end;


	//此行代码，可以得出当前页码个数是否等于需要显示的个数
	var curPageNum = this.params.page_end - this.params.page_start + 1;
	//设置左右偏移
	if (curPageNum < this.params.page_show) {
		if (this.params.page_start > 1) {
			this.params.page_start = this.params.page_start - (this.params.page_show - curPageNum);
			this.params.page_start = this.params.page_start < 1 ? 1 : this.params.page_start;
			curPageNum = this.params.page_end - this.params.page_start + 1;
		}
		if (this.params.page_end < this.params.page_count) {
			this.params.page_end = this.params.page_end + (this.params.page_show - curPageNum);
			this.params.page_end = this.params.page_end > this.params.page_count ? this.params.page_count : this.params.page_end;
		}
	}

	//组装需要显示的页码
	this.pageInfos.page_lists = [];
	this.pageInfos.page_cur = this.params.page_cur;
	for (var i = this.params.page_start; i <= this.params.page_end; i++) {
		var tempObj = {
			page: i
		};
		if (i == this$1.pageInfos.page_cur) {
			tempObj.cur = true;
		}
		this$1.pageInfos.page_lists.push(tempObj);
	}


	this.pageInfos.page_count = this.params.page_count;

	//设置上下首尾页
	this.pageInfos.page_prev.page = this.pageInfos.page_cur - 1;
	this.pageInfos.page_next.page = this.pageInfos.page_cur + 1;
	this.pageInfos.page_first.page = 1;
	this.pageInfos.page_last.page = this.pageInfos.page_count;

	//设置上首页边界
	if (this.pageInfos.page_cur == 1) {
		this.pageInfos.page_prev.page = false;
		this.pageInfos.page_first.page = false;
	}

	//设置下尾页边界
	if (this.pageInfos.page_cur >= this.pageInfos.page_count) {
		this.pageInfos.page_next.page = false;
		this.pageInfos.page_last.page = false;
	}
};


/**
	 * 成功回调函数。
	 * 初始化和每次更新当前页码时调用
	 */
SlsPage.prototype.successCallback = function successCallback () {
	this.params.callback && this.params.callback(this.pageInfos);
};


/**
	 * 当前页码设置错误时的回调函数。
	 * 当页码不合法时调用，但必须设置参数curPageError:true才有效
	 * @param {string} msg 错误信息
	 */
SlsPage.prototype.curPageErrorCallback = function curPageErrorCallback (cur, type) {
	this.params.curPageErrorCallback && this.params.curPageErrorCallback(cur, this.params.page_count, type || 0);
};


if (window) {
	window['SlsPage'] = SlsPage;
}

})));
