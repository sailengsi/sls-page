# 开始使用

正确引入sls-page.js之后，使用以下方式初始化

    var slsPage=new SlsPage(opts);

构造函数SlsPage接收一个对象参数opts，包含以下属性

	{
		//这两个必须得传一个，因为这个分页功能必须要有总页数
		page_count: 0, //总页数
		page_total: 0, //总数量

		page_cur: 1, //当前页，默认为1
		page_size: 10, //每页显示数量，默认为10
		page_show: 5, //显示的页码个数，默认显示5个页码

		page_prev_text:'上一页',//上一页文本
		page_next_text:'下一页',//下一页文本
		page_first_text:'首页',//首页文本
		page_last_text:'尾页',//尾页文本
		
		//这个在初始化完成之后和每次更改当前页码时会被调用。
		回调函数返回一个对象
			page_count-总页数
			page_cur-当前页
			page_first:{}
			page_last:{}
			page_next:{}
			page_prev:{}
			page_lists:[]
		callback: function(infos) {}, //设置分页成功时的回调
		
		//当这个属性为true时，下面的回调才会有效
		curPageError: true,
		这个回调的作用是：默认传入的当前页码，如果<1时，为1，如果>=总页数时，就为总页数
		然而，如果你不想这样做，想自己处理这个逻辑时，可以把curPageError设为true，然后在下面的回调中写自己的逻辑。
		回调函数返回三个参数
			cur-当前页
			count-总页数
			msg-错误类型。1:不是数字；2:小于1；3:大于总页数
		所以，你可以根据错误类型，自己来处理逻辑。
		curPageErrorCallback: function(cur, count, msg) {},
	}

	