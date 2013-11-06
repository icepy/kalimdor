kalimdor是什么？

采用MVC经典软件模式，应用在企业级开发中{财务，报表类企业应用}，专注与后端的数据交互，代码结构控制，三层解耦。

8月24日，开始写续写，因为此设计，主要是应用在桌面环境，且经验尚浅，有不足之处还请大家能指正。

设计计划：先写组件类，再写核心支持文件，再优化组件类，优化核心支持文件，并形成第一版。

注明：暂时只支持火狐，google游览器，IE9 现在的demo版本。

=====

2013年-------------------

8月30日 夜 3点45分记：
   
    @更新了核心文件，整理了其他文件，实现了MVC核心基础构造，与文件加载路由模块。

8月30日 下午 4点40分

	@实现了MVC中视图加载模块，模型渲染模块基础构造。

8月31日 夜 21点20分

	@更新从服务端获取视图模型，在view中只需定义模型，视图与模型需要定义在一起。

9月14日
  
	@核心模块加载方式更改，使用config配置文件的形式来加载相应的依赖。

	@增加了mvc文件名字段

	@增加了注释

9月15日

	@增加对多控制器的支持

9月20日

	@增加action动作列队与cookie api的封装

9月22日

	@增加debug模式，对模型的存储与检索

9月26日

	@增加对控件的自动化渲染机制

程序运行需要的条件：dialog_demo.php为例。

	在dialog_demo页面中，在头部引入核心文件：<script type="text/javascript" src="libs/kalimdor.js"></script>

	在页面中定义控制器容器：<div id='controllers' ctrl='dialog' style='display:none;'></div>  

容器中，id与ctrl为必填，id必须是controllers，ctrl为任意字符串。

多控制器支持，程序运行条件。

	在页面中定义的控制器容器，ctrl字段以|来分隔。
	<div id='controllers' ctrl='dialog|dialog2|dialog3' style='display:none;'></div>  

========

控制器

在controllers文件夹中定义控制器文件，书写内容如下.views为视图文件名，ioc为容器，init为初始化容器。
```javascript
kalimdor.controllers.add('',function(){
	this.views = '';
	this.ioc = '';
	this.init = function(){
		//初始化容器
	}
});
```
========

视图

注意，如果是服务端取模，则不必定义视图loadStr或loadServer属性。

在views文件夹中定义视图，书写内容如下，model为模型文件名，loadStr为返回的视图字符串，loadServer为从请求过来的视图{需要要定义本地模型数据}。
```javascript
kalimdor.view.add('',function(){
	this.model = '';
	this.loadStr = function(){
		return '';
    }
    this.loadServer = '';
})
```
========

模型

在models文件夹中定义模型，书写内容如下，data为本地数据，dataServer为服务端取模。
```javascript
kalimdor.model.add('',function(){
	this.data = {};
	this.dataServer = '';
})
```
========

组件类

	如何定义组件类：
	kalimdor.addplug('dialog',function(d,o){
		this.open = function(){}
		this.close = function(){}
	})

	addplug方法为扩展组件类方法，参数第一项：'dialog'为必填项，此为类名。
	参数：function(d,o){}匿名函数 d为调用初始化时传入的id，o为调用初始化时是传入的配置对象。

