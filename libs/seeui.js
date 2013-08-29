/*
*	基于jquery的一套ui组件，metro风格
*/
(function(window,undefined){
	var document = window.document,
    navigator = window.navigator;
    if(window.seeui) return;
	if(!window.seeui){
		window.seeui = (function(){
			var pathInfo = {
				version: '1.0',
	            status: 'unloaded',
	            LibsLoaded: [],
	            curload: null,
	            LibsPATH: "libs",
	            basePath:(function(){
	            	var BasePATH = window.SEEUI|| '';
	                if (!BasePATH) {
	                    var jstag = document.getElementsByTagName('script');
	                    for (var snum = 0; snum < jstag.length; snum++) {
	                        var srcMatch = jstag[snum].src.match(/(^|.*[\\\/])seeui(?:_basic)?.js(?:\?.*)?$/i); //?(?:_source)
	                        if (srcMatch) {
	                            BaseFrameSrc = srcMatch[0];
	                            BasePATH = srcMatch[1];
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
			return pathInfo;
		})();
	}
	//添加ui组件
	seeui.addplug = function(namespace,callback){
		seeui[namespace] = function(d,o){
			return new callback(g,d,o);
		}
	}
	//获取根地址
	seeui.getURL = function(){
			var loc = document.location.href;
			var _url = loc.substring(0,loc.lastIndexOf('/'));
			return _url;
	}
	//获取head元素
	seeui.getHead = function () {
        var h = document.getElementsByTagName('head')[0];
        if (!h) h = document.getDocumentElement().append('head');
        return h
    }
    //脚本加载
	seeui.scriptLoad = (function(){
		var j = {},
        k = {};
        return {
            LABJSReady: false,
            load: function (url, callback, n, o) {
                var purl = typeof url == 'string';
                if (purl) url = [url];
                if (!n) n = seeui;

                var q = url.length,
            	r = [],
            	s = [],
	            t = function (y) {
	                if (callback) if (purl) callback.call(n, y);
	                else callback.call(n, r, s);
	            };
                if (q === 0) { t(true); return; }
                var u = function (y, z) {
                    (z ? r : s).push(y);
                    if (--q <= 0) {
                        //o && _sker.document.getDocumentElement().removeStyle('cursor');
                        t(z);
                    }
                },
		        v = function (y, z) {
		            j[y] = 1;
		            var A = k[y];
		            delete k[y];
		            for (var B = 0; B < A.length; B++) A[B](y, z);
		        },
		        w = function (y) {
		            if (j[y]) {
		                u(y, true);
		                return;
		            }
		            var z = k[y] || (k[y] = []);
		            z.push(u);
		            if (z.length > 1) return;
		            var Head = seeui.getHead();
		            var script = document.createElement("script");
		            script.type = "text/javascript";
		            script.src = y

		            
		                script.onload = function () {
		                    //console.log(y+" LOAD");
		                    setTimeout(function () { v(y, true); }, 0);
		                };
		                script.onerror = function () {
		                    v(y, false);
		                };
		            //}
		            Head.appendChild(script);
		        };
                //o && _sker.document.getDocumentElement().setStyle('cursor', 'wait');
                for (var x = 0; x < q; x++) w(url[x]);
            },
            loadByLAB: function (p, callback) {
                this.LABJSReady = true;
                if (p === undefined) return;
                var _jsfiles = [];
                if (typeof p === "string") {
                    var _ps = p.split(',');
                    for (var j = 0; j < _ps.length; j++) {
                        _jsfiles.push(_ps[j]);
                    }
                } else
                    _jsfiles = p;

                if (_jsfiles.length > 0) {
                    $LAB.script(_jsfiles).wait(function () {
                        callback();
                    });
                }
            }
        };
	})();
	(function(){
		var _url = seeui.getURL();
		seeui.scriptLoad.load([_url+'/libs/LAB.min.js'],function(){
			//console.log('a');
		});
	})();
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
	var count=1;
	seeui.LoadFile = function(url){
		if( typeof $LAB === "undefined"){
			if( count < 5 ){
				setTimeout(function(){seeui.LoadFile(url)},25);
				count++;
			}
		}else $LAB.script(url);
	}
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
		}
	};
	var g = {};
	g.keyCode = {
		ESC:27
	};
})(window);
