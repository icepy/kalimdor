/*
*	MVC  基于jQuery的一套UI组件  metro风格 {还未完成。}
*/
(function(window,undefined){
	var document = window.document,
    navigator = window.navigator;
    if(window.seeui) return;
	if(!window.seeui){
		window.seeui = (function(){
			var pathinfo = {
	            LocaPath: (function () {
	                var BasePATH = window.SEEUI|| '';
	                if (!BasePATH) {
	                    var jstag = document.getElementsByTagName('script');
	                    for (var snum = 0; snum < jstag.length; snum++) {
	                        var srcMatch = jstag[snum].src.match(/(^|.*[\\\/])seeui(?:_basic)?.js(?:\?.*)?$/i);
	                        if (srcMatch) {
	                            BasePATH = srcMatch[1];
	                            break;
	                        }
	                    }
	                }
	                return BasePATH;
	            })()
			}
			return pathinfo;
		})();
	}
	var _seeui = seeui;
	//ui组件类集合
	seeui.ui = {};
	//UI类
	_seeui.otherOption = function(namespace,callback){
		seeui.ui[namespace] = function(d,o){
			return new callback(d,o);
		}
    }
	_seeui.getHead = function () {
        var h = document.getElementsByTagName('head')[0];
        if (!h) h = document.getDocumentElement().append('head');
        return h
    }
    //动态脚本加载
	_seeui.LoadFile = (function(){
		var Head = _seeui.getHead();
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = _seeui.LocaPath +'LAB.min.js';
        Head.appendChild(script);
        return {
			loadinit:function(arr,fun,c){
				c.LoadFile.Load_Scr(arr,function(){
					fun(jQuery,c);
				}); 
			},
			LoadStyle:function(filename){
				var Head = _seeui.getHead();
				var fileref = document.createElement("link");
		        fileref.setAttribute("rel", "stylesheet");
		        fileref.setAttribute("type", "text/css");
		        fileref.setAttribute("href", "css/"+filename);
		        Head.appendChild(fileref);
			},
			Load_Scr:function(arr,fun){
				script.onload = function(){
					if(arr.length > 0){
						$LAB.script(arr).wait(function () {
	                    	fun();
	                	});
					}
				}
			},
			LoadScript:function(arr,fun){
				$LAB.script(arr).wait(function () {
                	fun();
            	});
			}
        }
	})();
	//初始化相应的依赖库文件，css文件
	(function(_seeui){
		var _style = ['reset-min.css','seeui.css'],
			_script = ['libs/config.js','libs/jquery.js','libs/jquery.tmpl.js'];
		for(var i = 0,le = _style.length; i < le;i++){
			_seeui.LoadFile.LoadStyle(_style[i]);
		}
		_seeui.LoadFile.loadinit(_script,function($,seeui){
			seeui.addplug = seeui.otherOption;
			var libs = seeui.config.plug;
			var _bs = [];
			if(libs === "all"){
				_bs.push('libs/seeui.all.js');
			}else{
				$.each(libs, function(index, val) {
					_bs.push('libs/plug/seeui.'+val+'.js');
				});
			}
			seeui.LoadFile.LoadScript(_bs,function(){
				_seeui.controllers.LoadControllers(['controllers/'+$('#controllers').attr('ctrl')+'.js'],_seeui);
			});
		},_seeui);
	})(_seeui);
    seeui.getSrv = function(gather){
		var ajax = {
			type: 'GET',
			dataType: 'json',
			complete: function(xhr, textStatus) {
			    //called when complete
			},
			success: function(data, textStatus, xhr) {
			    if(typeof gather.callback === 'function'){
			    	gather.callback(data);
			    }
			},
			error: function(xhr, textStatus, errorThrown) {
			    alert('服务加载错误');
			}
		}
		$.ajax($.extend(ajax,gather));
	};
	//游览器检测
    seeui.browser = {
        IE: !!(window.attachEvent && navigator.userAgent.indexOf('Opera') === -1),
        Opera: navigator.userAgent.indexOf('Opera') > -1,
        //检测浏览器是否为WebKit内核
        WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
        //检测浏览器是否为Gecko内核，如Firefox
        Gecko: navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') === -1,
        MobileSafari: !!navigator.userAgent.match(/Apple.*Mobile.*Safari/),
        android: navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1
    }
    //正则表达式
	seeui.reg = {
		body:/<body[^>]*>([\s\S]*)<\/body>/i,
		style:/<style[^>]*>([\s\S]*)<\/style>/i,
		script:/<script\b[^<]*(?:(?!<\/script)<[^>]*)*<\/script>/gi
	}
	//公共方法
	seeui.com = {
		//设置透明
		setOpacity:function(node,level){  
			node = typeof node == "string" ? document.getElementById(node) : node;
		    if (document.all) {
		        node.style.filter = 'alpha(opacity = ' + level + ')';
		    } else {
		    	node.style.opacity = level / 100;
		    }
		},
		//获取宽度
		getWidth:function(){
			var de = document.documentElement;
            var bd = document.body;

            return self.innerWidth || (de && de.clientWidth || de.offsetWidth) || (bd != null ? bd.clientWidth : 0);
		},
		//获取高度
		getHeight:function(){
			var de = document.documentElement;
            var bd = document.body;
            return self.innerHeight || (de && de.clientHeight || de.offsetHeight) || (bd != null ? bd.clientHeight : 0);
		},
		//判断是否为function
		isFunction:function(f){
			return typeof f === 'function';
		},
		//判断是否为string
		isString:function(s){
			return typeof s === 'string';
		},
		//判断是否为array
		isArray:function(a){
			return Object.prototype.toString.call(a) === '[object Array]';
		},
		//判断是否为object
		isObject:function(o){
			return Object.prototype.toString.call(o) === '[object Object]';
		},
		//判断在array中的第几项
		inArray:function(haystack,needle){
			for (var i=0,max = haystack.length; i < max; i++) {
			  if(haystack[i] === needle){
			  	 return i;
			  }
			}
			return -1;
		},
		getURL:function(){
			var loc = document.location.href;
			var _url = loc.substring(0,loc.lastIndexOf('/'));
			return _url;
		}
	};
	/*=================================================================================*/
	/*=================================================================================*/
	/*
		{未完成}
		MVC处理核心，实现处理如下：

					@2013年8月30日，实现了MVC核心基础构造，与文件加载路由模块。

					@2013年8月30日下午4点40分，实现了MVC中视图加载模块，模型渲染模块基础构造。

	*/
	/*=================================================================================*/
	/*=================================================================================*/

	//控制器类
    _seeui.otherCtrl = function(){
    	var self = this;
    	this.GATHERCTRL = {};  //从控制器中采集信息
    	this.CHILDCTRL = function(){ //用子类存储基本信息
    		this.VIEWS = null;
    		this.INIT = null;
    		this.ICO = null;
    	}
    	this.add = function(filename,fun){
    		self.GATHERCTRL = new fun();
    	}
    }
    var _ctrl = _seeui.controllers = new _seeui.otherCtrl();
    _ctrl.LoadControllers = function(filename,callback){
    	_seeui.LoadFile.LoadScript(filename,function(){   		
    		var _c = new _seeui.controllers.CHILDCTRL();
    		var _v = _seeui.controllers.GATHERCTRL;
    		_c.VIEWS = _v.views;
    		_c.INIT = _v.init;
    		_c.ICO = _v.ico;
    		if(_c.VIEWS !== 'none'){
    			_seeui.view.LoadViews('views/'+_c.VIEWS+'.js',_c);
    		}else{
    			$(function(){
    				_c.INIT();
    			})
    		}
    	});
    }
    //视图类
    _seeui.otherView = function(){
    	var self = this;
    	this.GATHERVIEW = {}; //从视图中采集信息
    	this.CHILDVIEW = function(){  //用子类存储基本信息
    		this.loadStr = null;
    		this.models = null;
    		this.loadServer = null;
    	}
    	this.add = function(filename,fun){
    		self.GATHERVIEW = new fun();
    	}
    }
    var _view = _seeui.view = new _seeui.otherView();
    _view.LoadViews = function(filename,_c){
    	_seeui.LoadFile.LoadScript(filename,function(){
    		var _v = new _seeui.view.CHILDVIEW();
    		var _m = _seeui.view.GATHERVIEW;
    		_v.models = _m.model;
    		if(_m.loadStr !== undefined && typeof _m.loadStr() === 'string'){
    			_v.loadStr = _m.loadStr();
    		}
    		if(_m.loadServer !== undefined && typeof _m.loadServer === 'string' && _m.loadServer.split(':')[0] === 'url'){
    			_v.loadServer = _m.loadServer.split(':')[1];
    		}
    		console.log(_v);
    		console.log(_c);
    		if(_v.models !=='none'){
    			_seeui.model.loadM('models/'+_v.models+'.js',_v,_c);
    		}
    	});
    }
    //从服务端加载视图
    _view.LoadServerView = function(url,_m,_c){
    	_seeui.getSrv({
    		url:url,
    		type:'GET',
    		dataType:'html',
    		callback:function(data){
    			_seeui.model.getTemplate(data,_m,_c,function(){
    				$(function(){
    					_c.INIT();
    				});
    			});
    		}
    	})
    }
    //模型类
    _seeui.otherModel = function(){
    	var self = this;
    	this.GATHERMODEL = {}; //从模型中采集数据
    	this.CHILDMODEL = function(){ //用子类存储基本信息
    		this.data = null;
    	}
    	this.add = function(filename,fun){
    		self.GATHERMODEL = new fun();
    	}
    }
    var _model = _seeui.model = new _seeui.otherModel();
    _model.loadM = function(filename,_v,_c){
    	_seeui.LoadFile.LoadScript(filename,function(){
    		var _m_v =  new _seeui.model.CHILDMODEL();
    		var _v_ms = _seeui.model.GATHERMODEL;
    		if(_v_ms.data !== null){
    			_m_v.data = _v_ms.data;
    		}
    		//console.log(_v.loadServer);
    		if(_v.loadStr !== null){
    			_seeui.model.getTemplate(_v.loadStr,_m_v,_c,function(){
    				$(function(){
    					_c.INIT();
    				});
    			});
    		}
			if(_v.loadServer !== null && typeof _v.loadServer === 'string'){
				_seeui.view.LoadServerView(_v.loadServer,_m_v,_c);
			}
    	});
    }
    //解析模版
    _model.getTemplate = function(view,_m,_c,callback){
    	var createTemplateScript = function(ico,callback){
    		$('#'+ico).append('<script id="template" type="text/x-jquery-tmpl">'+view+'</script>');
    		return true;
    	}
    	var deleteTemplateScript = function(){
    		$('#template').remove();
    	}
    	if(typeof _c.ICO !== null){
    		var _true = createTemplateScript(_c.ICO);
    	}
        
        if(_true){
        	var _value = _m.data.value;
        	$('#template').tmpl(_value).appendTo('#body');
        	deleteTemplateScript();
        	if(typeof callback === 'function'){
        		callback();
        	}
        }
    }
    console.log(_seeui);
})(window);