# 成功回调

回调函数返回一个对象参数pageinfos,包含以下属性

- page_count //number 总页数
- page_cur 	//number  当前页
- page_first //object
	- page	//number or false  首页页码,当没有首页时，为false
	- text //string	首页文本
- page_prev
	- page	//number or false  上一页页码,当没有上一页时，为false
	- text //string	上一页文本
- page_next
	- page	//number or false  下一页页码,当没有下一页时，为false
	- text //string	下一页文本
- page_last
	- page	//number or false  尾页页码,当没有尾页时，为false
	- text //string	尾页文本
- page_lists //array 页码数组，每个元素是个对象，对象包含以下属性
	- page //number 页码


>这里要解释一下page_lists	


###当总页数为10，展示页码个数为5

当前页<=3，时，数组值是：
	
	[{page:1},{page:2},{page:3},{page:4},{page:5}]
当前页为5时，数组值是：
	
	[{page:3},{page:4},{page:5},{page:6},{page:7}]
当前页>=8时，数组值是：
	
	[{page:6},{page:7},{page:8},{page:9},{page:10}]
	

### 当总页数<=展示页码个数
数组的长度等总页数，并且页码始终是从1开始
	
	[{page:1},...]

>当前页码等于列表中的某一个元素的page属性时，此元素会多一个cur属性,值为true。

>可根据这个值给当前页设置高亮。

>也可以用page_cur属性和元素的page匹配。