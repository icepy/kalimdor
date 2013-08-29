/*
*	MVC  基于jQuery的一套UI组件  metro风格 {还未完成。}
*/
(function(window,undefined){
	var document = window.document,
    navigator = window.navigator;
    if(window.seeui) return;
	if(!window.seeui){
		window.seeui = (function(){
			var BeLibsName  = null,
				LibsLoaded = null;
			var pathinfo = {
				version: '1.0',
	            LibsPATH: 'libs',
	            basePath: (function () {
	                var BasePATH = window.SEEUI|| '';
	                if (!BasePATH) {
	                    var jstag = document.getElementsByTagName('script');
	                    for (var snum = 0; snum < jstag.length; snum++) {
	                        var srcMatch = jstag[snum].src.match(/(^|.*[\\\/])seeui(?:_basic)?.js(?:\?.*)?$/i); //?(?:_source)
	                        var funMatch = jstag[snum].src.split('?');
	                        if (srcMatch && funMatch) {
	                            BeLibsName = srcMatch[0];
	                            BasePATH = srcMatch[1];
	                            LibsLoaded = funMatch[1];
	                            break;
	                        }
	                    }
	                }
	                if (BasePATH.indexOf(':/') == -1) if (BasePATH.indexOf('/') === 0) BasePATH = location.href.match(/^.*?:\/\/[^\/]*/)[0] + BasePATH;
	                else BasePATH = location.href.match(/^[^\?]*\/(?:)/)[0] + BasePATH;
	                if (!BasePATH) throw 'seeui 框架路径检测失败.';
	                return BasePATH;
	            })()
			}
			return pathinfo;
		})();
	}
	var _seeui = seeui;
	//UI类
	_seeui.otherOption = function(){
    	this.addplug = function(namespace,callback){
    		seeui[namespace] = function(d,o){
				return new callback(d,o);
			}
    	}
    }
    //控制器类
    _seeui.otherCtrl = function(){
    	var self = this;
    	this.GATHERCTRL = {};  //从控制器中采集信息
    	this.add = function(filename,fun){
    		self.GATHERCTRL = new fun();
    		$(function(){
    			self.GATHERCTRL.init();
    		});
    	}
    	this.HandleControllers = function(){

    	}
    }
    //模型类
    _seeui.otherModel = function(){
    	this.GATHERMODEL = {};
    	this.add = function(filename,fun){
    		self.GATHERMODEL = new fun();
    	}
    	this.HandleModel = function(){

    	}
    }
    //视图类
    _seeui.otherView = function(){
    	this.GATHERVIEW = {};
    	this.add = function(filename,fun){
    		self.GATHERVIEW = new fun();
    	}
    	this.HandleView = function(){

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
        script.src = _seeui.basePath+'LAB.min.js';
        /*
		script.onreadystatechange = function () {
            if (script.readyState == 'loaded' || script.readyState == 'complete') {
                script.onreadystatechange = null;
                v(y, true);
            }
        }
        */
        Head.appendChild(script);
        return {
			loadinit:function(arr,fun,c){
				c.LoadFile.Load_Scr(arr,function(){
					fun(jQuery,c);
				});
				/*
				var timer;     
				function LoadedEvent() {     
				    if (document.loaded) return;     
				    if (timer) window.clearInterval(timer);     
				    document.fire("dom:loaded");     
				    document.loaded = true;     
				} 
				if(document.addEventListener && typeof fun === 'function'){
					document.addEventListener('DOMContentLoaded',fun,false);    
				}
				*/
				/*    
					其他版本游览器稍后支持
			  	if (document.addEventListener) {     
				    if (Prototype.Browser.WebKit) {     
				      timer = window.setInterval(function() {     
				        if (/loaded|complete/.test(document.readyState))     
				          fireContentLoadedEvent();     
				      }, 0);     
				      Event.observe(window, "load", fireContentLoadedEvent);     
				    
				    }   
			  	} else {     
				    document.write("<"+"script id=__onDOMContentLoaded defer src=//:><\/script>");     
				    $("__onDOMContentLoaded").onreadystatechange = function() {     
			      	if (this.readyState == "complete") {     
			        	this.onreadystatechange = null;     
			        	fireContentLoadedEvent();     
			      	}     
			    }
			    */     
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

	(function(_seeui){
		var _style = ['reset-min.css','seeui.css'],
			_script = ['libs/config.js','libs/jquery.js','libs/jquery.tmpl.js'];
		for(var i = 0,le = _style.length; i < le;i++){
			_seeui.LoadFile.LoadStyle(_style[i]);
		}
		_seeui.LoadFile.loadinit(_script,function($,seeui){
			seeui.UI = new seeui.otherOption();
			var libs = seeui.config.UI;
			var _bs = [];
			$.each(libs, function(index, val) {
				_bs.push('libs/plug/seeui.'+val+'.js');
			});
			seeui.LoadFile.LoadScript(_bs,function(){
				seeui.CTRL = new seeui.otherCtrl();
				seeui.LoadFile.LoadScript(['controllers/'+$('#controllers').attr('ctrl')+'.js']);
			});
		},_seeui);
	})(_seeui);

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

   	//字符串拼接stringBuffer 类似 StringBuilder
    var StringBuffer = function () { this._strs = new Array(); }
    StringBuffer.prototype.append = function (str) { this._strs.push(str); };
    StringBuffer.prototype.ToString = function (str) {
        if (str === undefined) str = "";
        return this._strs.join(str);
    };

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
	console.log(_seeui);
})(window);