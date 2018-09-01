## kalimdor是什么？#

采用MVC经典软件模式，应用在企业级开发中{财务，报表类企业应用}，专注与后端的数据交互，代码结构控制，三层解耦。

## 说明

<a href="https://github.com/xiangwenwe/kalimdor">kalimdor.js</a>为经典MVC结构，它依赖于LAB.js,jQuery.js,undersocre.js，形成一套在桌面浏览器端的解决方案。

其中，文件加载于异步并行加载，它使用了LAB.js，业务逻辑代码的编写基于jQuery,underscore。它采用三层分离的结构，专注于模型的操作，获取，更新。底层请求基于jQuery ajax封装。

这套解决方案于2013年8月24日，开始写续写，因为此设计，主要是应用在桌面环境，且经验尚浅，有不足之处还请大家能指正。

设计计划：先写组件类，再写核心支持文件，再优化组件类，优化核心支持文件，并形成第一版。

注明：暂时只支持火狐，google浏览器，IE9 现在的demo版本。

## 开发时间日志

------2013年------

8月30日 夜 3点45分记：
   
>更新了核心文件，整理了其他文件，实现了MVC核心基础构造，与文件加载路由模块。

8月30日 下午 4点40分

>实现了MVC中视图加载模块，模型渲染模块基础构造。

8月31日 夜 21点20分

>更新从服务端获取视图模型，在view中只需定义模型，视图与模型需要定义在一起。

9月14日
  
>核心模块加载方式更改，使用config配置文件的形式来加载相应的依赖。
>
>增加了mvc文件名字段
>
>增加了注释

9月15日

>增加对多控制器的支持

9月20日

>增加action动作列队与cookie api的封装

9月22日

>增加debug模式，对模型的存储与检索

9月26日

>增加对控件的自动化渲染机制

11月7日

>增加get，set方法

## 如何运行程序

程序运行需要的条件：dialog_demo.html为例。

```javascript
在dialog_demo页面中，在头部引入核心文件：<script type="text/javascript" src="libs/kalimdor.js"></script>

在页面中定义控制器容器：<div id='controllers' ctrl='dialog' style='display:none;'></div>  
```

容器中，id与ctrl为必填，id必须是controllers，ctrl为任意字符串。

多控制器支持，程序运行条件。

```javascript
// 在页面中定义的控制器容器，ctrl字段以|来分隔。

<div id='controllers' ctrl='dialog|dialog2|dialog3' style='display:none;'></div>  
```

### 控制器

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

### 视图

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

### 模型

在models文件夹中定义模型，书写内容如下，data为本地数据，dataServer为服务端取模。
```javascript
kalimdor.model.add('',function(){
  this.data = {};
  this.dataServer = '';
})
```

###组件类

```javascript
如何定义组件类：
kalimdor.addplug('dialog',function(d,o){
  this.open = function(){}
  this.close = function(){}
})

addplug方法为扩展组件类方法，参数第一项：'dialog'为必填项，此为类名。
参数：function(d,o){}匿名函数 d为调用初始化时传入的id，o为调用初始化时是传入的配置对象。
```

## API

### controllers object
 - add()
 
>add() {参数}namespace callbackClass  添加一个控制器

使用：

	kalimdor.controllers.add('name',function(){
		this.views = 'xx';
		this.ioc = 'xx';
		this.init = function(){
			
		}
	}); 
>callbackClass {参数} views ioc init

>views 指定一个视图

>ioc 指定一个容器

>init 指定初始化函数

- saveJSON()

>saveJSON() 对模型的value进行存储。

使用：

	kalimdor.controllers.saveJSON();

### model object

- add()

>add() {参数}namespace callbackClass  添加一个模型

使用：

	kalimdor.model.add('name',function(){
		this.view = 'con_view2';
		this.data = {
			"value":[
				{"id":"wow","name":"魔兽世界5.4更新"},
				{"id":"app","name":"永恒之岛新的地图"}
			]
		}
		//this.dataServer = 'data/dialog.js';
	}); 
>callbackClass {参数} view data dataServer

>view 指定模型使用哪个视图

>data 指定一个本地数据

>dataServer 指定请求URL

注明：创建模型，data或dataServer只能使用其中一个

### view object

- add()

>add() {参数}namespace callbackClass  添加一个视图

使用：

	kalimdor.view.add('con_view',function(){
	    this.model = "con_model";
		this.loadStr = function(){
    		var _str = '';
    			_str += '<%_.each(value,function(v){%><div id=\"<%=v.id%>\"><a href=\"#\"><%=v.name%></a></div><%})%>';
    		return _str;
    	}
   		//this.loadServer = 'url:views/con_view/con_view.html';
	});
>callbackClass {参数} model loadStr loadServer

>model 指定模型使用哪个视图

>loadStr 指定一个本地视图

>loadServer 指定请求URL

注明：如果创建视图，只指定了模型，那么将从模型的URL中请求数据。loadStr或loadServer只能使用其中一个。

- addplug()

>addplug(){参数}namespace callbackClass创建一个组件。

- get()

>get() {参数}name 获取某个模型

- set()

>set() {参数}name obj 对某个模型进行设置，并更新此模型下的视图。

- getURL()

>getURL() 获取当前url

### cookie object

- getCookie()

>getCookie(){参数}name获取cookie value

- setCookie()

>setCookie(){参数}name value potions 设置cookie
