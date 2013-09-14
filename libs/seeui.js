/*
*	MVC架构  基于jQuery的一套UI组件  metro风格 {还未完成。}
*
*	@目前只支持，单控制器，未来会增加对多控制器的支持。
*	
*	@2013年8月30日，实现了MVC核心基础构造，与文件加载路由模块。
*
*	@2013年8月30日下午4点40分，实现了MVC中视图加载模块，模型渲染模块基础构造。
*
*	@2013年8月31日 晚 21点08分，更新从服务端获取视图模型，在view中只需定义模型，视图与模型需要定义在一起。
*
*	@2013年9月14日  核心模块加载方式更改，使用config配置文件的形式来加载相应的依赖。
*
*	@2013年9月14日  增加了mvc文件名字段
*
*	@2013年9月14日  增加了注释
*/
(function(window,undefined){
	var document = window.document,
    navigator = window.navigator;
    if(window.seeui) return;
	if(!window.seeui){
		window.seeui = (function(){
			var pathinfo = {
	            LocaPath: (function () {
	                var BasePATH = window.SEEUI||'';
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
			/*
				未来pathinfo，将增加多个字段来存储相应的信息
			*/
			return pathinfo;
		})();
	}
	var _seeui = seeui;
	/*
		对cookie的封装
	*/
    var webCookie = function (name, value, options) {
        if (typeof value != 'undefined') {
            options = options || {};
            if (value === null) {
                value = '';
                options = $.extend({}, options);
                options.expires = -1;
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 60 * 60 * 1000));
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString();
            }
            var path = options.path ? '; path=' + (options.path) : '';
            var domain = options.domain ? '; domain=' + (options.domain) : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        } else {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    };
	/*
		ui组件类集合
	*/
	seeui.ui = {};
	/*
		UI类
	*/
	var otherOption = function(namespace,callback){
		seeui.ui[namespace] = function(d,o){
			return new callback(d,o);
		}
    }
	_seeui.getHead = function () {
        var h = document.getElementsByTagName('head')[0];
        if (!h) h = document.getDocumentElement().append('head');
        return h
    }
    /*
		对jQuery ajax的封装，未来将增加解决跨域的封装方法
    */
    _seeui.getSrv = function(gather){
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
	/*
		游览器检测
	*/
    _seeui.browser = {
        IE: !!(window.attachEvent && navigator.userAgent.indexOf('Opera') === -1),
        Opera: navigator.userAgent.indexOf('Opera') > -1,
        //检测浏览器是否为WebKit内核
        WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
        //检测浏览器是否为Gecko内核，如Firefox
        Gecko: navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') === -1,
        MobileSafari: !!navigator.userAgent.match(/Apple.*Mobile.*Safari/),
        android: navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1
    }
    /*
    	正则表达式
    */
	_seeui.reg = {
		body:/<body[^>]*>([\s\S]*)<\/body>/i,
		style:/<style[^>]*>([\s\S]*)<\/style>/i,
		script:/<script\b[^<]*(?:(?!<\/script)<[^>]*)*<\/script>/gi
	}
	/*
		公共工具函数集合
	*/
	_seeui.com = {
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
	/*
		初始化时等待图标
	*/
    var LoadWaitIco = function(){
		var _com = _seeui.com,
			_w = _com.getWidth(),
			_h = _com.getHeight(),
			waitico = '';
		waitico += '<div id="waitIco" style="background:#fff;opacity:10;z-index:1000;width:'+_w+'px;height:'+_h+'px;">';
		waitico += '<div style="background:url(css/image/waitloaded.gif);position: absolute;width:48px;height:48px;top:'+(_h-48)/2+'px;left:'+(_w-48)/2+'px;" alt="wati"></div>';
		waitico += '</div>';
		$('body').append(waitico);
		return {
			RemoveWaitIco:function(){
				$('#waitIco').hide();
			},
			ShowWaitIco:function(){
				$('#waitIco').show();
			}
		}
	}
    /*
    	动态脚本加载模块
    */
	_seeui.LoadFile = (function(){
		var Head = _seeui.getHead();
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = _seeui.LocaPath +'LAB.min.js';
        Head.appendChild(script);
        return {
			_loadinit:function(arr,fun,_see){
				_see.LoadFile._Load_Scr(arr,function(){
					var s = _see.config.style,
						k = _see.config.library;
					if(s.length !== 0 && _see.com.isArray(s)){
						for(var i = 0,len = s.length;i<len;i++){
							_see.LoadFile.LoadStyle(s[i]);
						}
					}
					if(k.length !== 0 && _see.com.isArray(k)){
						var _k = [];
						for(var j =0,le = k.length;j<le;j++){
							_k.push('libs/'+k[j]);
						}
						_see.LoadFile.LoadScript(_k,fun);
					}
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
			_Load_Scr:function(arr,fun){
				//只能用一次，第二次失效。
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
		_seeui.LoadFile._loadinit(['libs/config.js'],function(){
			_seeui.wait = LoadWaitIco();
			_seeui.addplug = otherOption;
			var libs = seeui.config.plug;
			var _g = [];
			if(libs === "all"){
				_g.push('libs/seeui.all.js');
			}else{
				$.each(libs, function(index, val) {
					_g.push('libs/plug/seeui.'+val+'.js');
				});
			}
			$(function(){
				seeui.LoadFile.LoadScript(_g,function(){
					_seeui.controllers.LoadControllers(['controllers/'+$('#controllers').attr('ctrl')+'.js'],_seeui);
				});
			});
		},_seeui);
	})(_seeui);

	/*=================================================================================*/
	/*=================================================================================*/
	/*
		{未完成}MVC处理核心
	*/
	/*=================================================================================*/
	/*=================================================================================*/

	//控制器类
    _seeui.otherCtrl = function(){
    	var self = this;
    	this.GATHERCTRL = {};  //从控制器中采集信息
    	this.CTRLNAME = null;  //控制器名字
    	this.CHILDCTRL = function(){ //用子类存储基本信息
    		this.VIEWS = null;
    		this.INIT = null;
    		this.IOC = null;
    		this._CTRLNAME = null;
    	}
    	this.add = function(filename,fun){
    		self.CTRLNAME = filename;
    		self.GATHERCTRL = new fun();
    	}
    }
    var _ctrl = _seeui.controllers = new _seeui.otherCtrl();
    _ctrl.LoadControllers = function(filename,callback){
    	_seeui.LoadFile.LoadScript(filename,function(){   		
    		var _c = new _seeui.controllers.CHILDCTRL();
    		var _v = _seeui.controllers.GATHERCTRL;
    		_c._CTRLNAME = _seeui.controllers.CTRLNAME,_c.VIEWS = _v.views,_c.INIT = _v.init,_c.IOC = _v.ioc;
    		if(_c.VIEWS !== 'none'){
    			_seeui.view.LoadViews('views/'+_c.VIEWS+'.js',_c);
    		}else{
    			_c.INIT();
    			_seeui.wait.RemoveWaitIco();
    		}
    	});
    }
    //视图类
    _seeui.otherView = function(){
    	var self = this;
    	this.GATHERVIEW = {}; //从视图中采集信息
    	this.VIEWNAME = null;
    	this.CHILDVIEW = function(){  //用子类存储基本信息
    		this.loadStr = null;
    		this.models = null;
    		this.loadServer = null;
    		this.Template = null;
    		this._VIEWNAME = null;
    	}
    	this.add = function(filename,fun){
    		self.VIEWNAME = filename;
    		self.GATHERVIEW = new fun();
    	}
    }
    var _view = _seeui.view = new _seeui.otherView();
    _view.LoadViews = function(filename,_c){
    	_seeui.LoadFile.LoadScript(filename,function(){
    		var _v = new _seeui.view.CHILDVIEW();
    		var _m = _seeui.view.GATHERVIEW;
    		_v.models = _m.model,_v._VIEWNAME = _seeui.view.VIEWNAME;
    		if(_m.loadStr !== undefined && typeof _m.loadStr() === 'string'){
    			_v.loadStr = _m.loadStr();
    		}
    		if(_m.loadServer !== undefined && typeof _m.loadServer === 'string' && _m.loadServer.split(':')[0] === 'url'){
    			_v.loadServer = _m.loadServer.split(':')[1];
    		}
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
    				_c.INIT();
    			});
    		}
    	})
    }
    //模型类
    _seeui.otherModel = function(){
    	var self = this;
    	this.GATHERMODEL = {}; //从模型中采集数据
    	this.MODELNAME = null;
    	this.CHILDMODEL = function(){ //用子类存储基本信息
    		this.data = null;
    		this.dataUrl = null;
    		this._MODELNAME = null;
    	}
    	this.add = function(filename,fun){
    		self.MODELNAME = filename;
    		self.GATHERMODEL = new fun();
    	}
    }
    var _model = _seeui.model = new _seeui.otherModel();
    _model.loadM = function(filename,_v,_c){
    	_seeui.LoadFile.LoadScript(filename,function(){
    		var _m_v =  new _seeui.model.CHILDMODEL();
    		var _v_ms = _seeui.model.GATHERMODEL;
    		_m_v._MODELNAME = _seeui.model.MODELNAME;
    		if(_v_ms.data !== null){
    			_m_v.data = _v_ms.data;
    		}
    		var loadDataServer = function(){
    			_m_v.dataUrl = _v_ms.dataServer;
    			_seeui.getSrv({
    				url:_m_v.dataUrl,
    				dataType:'json',
    				type:'GET',
    				callback:function(data){
    					if(data.Template !== undefined){
    						_v.Template = data.Template;
    						_m_v.data = data;
    						//console.log(_m_v.data)
    						_seeui.model.getTemplate(_v.Template,_m_v,_c,function(){
    							_c.INIT();
    						});
    					}
    				}
    			});
    		}
    		if(_v_ms.dataServer !== null){
    			loadDataServer();
    		}
    		//console.log(_v.loadServer);
    		if(_v.loadStr !== null){
    			_seeui.model.getTemplate(_v.loadStr,_m_v,_c,function(){
    				_c.INIT();
    			});
    		}
			if(_v.loadServer !== null && typeof _v.loadServer === 'string'){
				_seeui.view.LoadServerView(_v.loadServer,_m_v,_c);
			}
    	});
    }
    //解析模版
    _model.getTemplate = function(view,_m,_c,callback){
    	var createTemplateScript = function(ioc,callback){
    		$('#'+ioc).append('<script id="template" type="text/x-jquery-tmpl">'+view+'</script>');
    		return true;
    	}
    	var deleteTemplateScript = function(){
    		$('#template').remove();
    		_seeui.wait.RemoveWaitIco();
    	}
    	if(typeof _c.IOC !== null){
    		var _true = createTemplateScript(_c.IOC);
    	}
        
        if(_true){
        	//console.log(_m)
        	var _value = _m.data.value;
        	//console.log(_value);
        	$('#template').tmpl(_value).appendTo('#body');
        	deleteTemplateScript();
        	if(typeof callback === 'function'){
        		callback();
        	}
        }
    }
    console.log(_seeui);
})(window);