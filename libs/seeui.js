/*
*	MVC架构  基于jQuery的一套UI组件  metro风格 {还未完成。}
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
*
*   @2013年9月15日  增加对多控制器的支持
*
*   @2013年9月20日  增加action动作列队
*
*   @2013年9月22日  增加debug模式，对模型的存储与检索
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
    //字符串拼接stringBuffer 类似 StringBuilder
    var StringBuffer = function () {
        this._strs = new Array();
    }
    StringBuffer.prototype.append = function (str) {
        this._strs.push(str);
    };
    StringBuffer.prototype.ToString = function (str) {
        if (str === undefined) str = "";
        return this._strs.join(str);
    };
	/*
		对cookie的封装
	*/
    var cookie = function (name, value, options) {
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
    /*
		对jQuery ajax的封装，未来将增加解决跨域的封装方法
    */
    _seeui.ajax = {
        getSrv:function(gather){
            var ajax = {
                type: 'GET',
                dataType: 'json',
                complete: function(xhr, textStatus) {

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
        }
    }
    _seeui.cookie = {
        setCookie:function(name, value, opts){
            var o = opts;
            if( o === undefined ) o = { path: '/', expires: 1 }
            cookie(name, value, opts);
        },
        getCookie:function(name){
            if( name === undefined ) return null;
            return cookie(name);
        }
    }
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
        //获取网页body部份代码
		body:/<body[^>]*>([\s\S]*)<\/body>/i,
        //获取网页style部份代码
		style:/<style[^>]*>([\s\S]*)<\/style>/i,
        //获取网页script部份代码
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
		},
        getHead:function () {
            var h = document.getElementsByTagName('head')[0];
            if (!h) h = document.getDocumentElement().append('head');
            return h
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
		var Head = _seeui.com.getHead();
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
				var Head = _seeui.com.getHead();
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
        //console.log(seeui.com.getBody());
		_seeui.LoadFile._loadinit(['libs/config.js'],function(){
			_seeui.addplug = otherOption;
            _seeui.wait = LoadWaitIco();
			var libs = seeui.config.plug,
                debug = seeui.config.debug,
			    _g = [];
            if(debug !== undefined && debug !== false){
                _g.push('libs/seeui.debug.js');   
            }
			if(libs === "all"){
				_g.push('libs/seeui.ui.all.js');
			}else{
				$.each(libs, function(index, val) {
					_g.push('libs/plug/seeui.'+val+'.js');
				});
			}
			$(function(){
				seeui.LoadFile.LoadScript(_g,function(){
                    var c = $('#controllers').attr('ctrl').split('|'),_c = [];

                    $.each(c,function(_v){
                        _c.push('controllers/'+c[_v]+'.js');
                    });
					_seeui.controllers.LoadControllers(_c,_seeui);

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
    var affair_data = [];
	//控制器类
    _seeui.otherCtrl = function(){
    	var self = this;
    	this.GATHERCTRL = {};  //从控制器中采集信息
    	this.CTRLNAME = [];  //控制器名字
    	this.CHILDCTRL = function(){};
    	this.add = function(filename,fun){
    		self.CTRLNAME.push(filename);
    		self.GATHERCTRL[filename] = new fun();
    	}
    }
    var _ctrl = _seeui.controllers = new _seeui.otherCtrl();

    //控制器加载
    _ctrl.LoadControllers = function(filename,callback){

    	_seeui.LoadFile.LoadScript(filename,function(){   		
    		var _c = new _seeui.controllers.CHILDCTRL();
    		var _G_ctrl = _seeui.controllers.GATHERCTRL;
            //console.log(_G_ctrl);
    		_c.CTRL = _G_ctrl,_c._CTRLNAME = _seeui.controllers.CTRLNAME,_c.Views = [];
            $.each(_c.CTRL,function(_i,_v){
                if(_v['views'] !== 'none'){
                    _c.Views.push('views/'+_v['views']+'.js');
                }else{
                    _v.init();
                    _seeui.wait.RemoveWaitIco();
                }
            });
            //console.log(_c.Views)
            _seeui.view.LoadViews(_c.Views,_c);
    	});

    }
    ///action动作列队
    _ctrl.action = function(action){
        /*
        *   开启action模块，将自动寻找事件与事件处理程序，进行注册。
        */

        $.each(action,function(_i,_v){
            $.each(_v,function(_j,_k){
                if($('#'+_j)[0] !== undefined){
                    affair_data.push({
                        'type':_i,
                        'ele':$('#'+_j),
                        'affair_fun':_k
                    });
                    $('#'+_j).bind(_i,_k);
                }
            });
        });
        //console.log(affair_data);
    }

    _ctrl.saveJSON = function(id){
        /*
        *   存储
        */
        var S_JONS = [],
            json = null;
        if(typeof id === 'string'){
            json = _seeui.model.GATHERMODEL[id].data.value;
            $.each(json,function(_i,_v){
                if(_v['id'] !== undefined){
                    S_JONS.push({
                        'id':_v['id'],
                        'value':$('#'+_v['id']).val()
                    });
                }
            });
        }else{
            json = _seeui.model.GATHERMODEL;
            $.each(json,function(_i,_v){
                var _value = _v['data'].value;
                $.each(_value,function(_j,_k){
                    if(_k['id'] !== undefined){
                        S_JONS.push({
                            'id':_k['id'],
                            'value':$('#'+_k['id']).val()
                        });
                    }
                });
            });
        }   
        var is = this.verifyvalue(S_JONS);
        if(!is){
            return false;
        }
        return JSON.stringify(S_JONS);
    }

    _ctrl.verifyvalue = function(json){
        /*
        *   验证
        */
        var _json = json,
            verify = [],
            isempty = false;
        for(var i = 0,len = _json.length;i<len;i++){
            if(_json[i].value.length === 0){
                verify.push({
                    'id':_json[i].id,
                    'value':'值为空'
                });
                isempty = true;
                continue;
            }
        }
        
        if(isempty){
            return false;
        }
    }

    //视图类
    _seeui.otherView = function(){
    	var self = this;
    	this.GATHERVIEW = {}; //从视图中采集信息
    	this.VIEWNAME = [];
    	this.CHILDVIEW = function(){};
    	this.add = function(filename,fun){
    		self.VIEWNAME.push(filename);
    		self.GATHERVIEW[filename] = new fun();
    	}
    }
    var _view = _seeui.view = new _seeui.otherView();

    //视图加载
    _view.LoadViews = function(filename,_c){

    	_seeui.LoadFile.LoadScript(filename,function(){
            
    		var _v = new _seeui.view.CHILDVIEW();
    		var _G_view = _seeui.view.GATHERVIEW;

            _v.VIEW = _G_view,_v._VIEWNAME = _seeui.view.VIEWNAME,_v.Models = [],_v.MVC_CTRL = {};
            $.each(_c.CTRL,function(_i,_vc){
                _v.MVC_CTRL[_vc['views']] = _vc;
            });
            //console.log(_v.VIEW);
            $.each(_v.VIEW,function(_i,_k){
                if(_k.loadStr !== undefined && typeof _k.loadStr() === 'string'){
                    _k.loadStr = _k.loadStr();
                }
                if(_k.loadServer !== undefined && typeof _k.loadServer === 'string'){
                    _k.loadServer = _k.loadServer;
                }
                if(_k['model'] !=='none'){
                    _v.Models.push('models/'+_k['model']+'.js');
                    
                }
            });
            _seeui.model.loadM(_v.Models,_v,_c);
    	});
        
    }
    //从服务端加载视图
    _view.LoadServerView = function(url,_m,_c){
    	_seeui.ajax.getSrv({
    		url:url,
    		type:'GET',
    		dataType:'html',
    		callback:function(data){
    			_seeui.model.getTemplate(data,_m,_c,function(){
    				_c.init();
                    if(_c.action !== undefined){
                        _ctrl.action(_c.action);
                    }
    			});
    		}
    	})
    }

    //模型类
    _seeui.otherModel = function(){
    	var self = this;
    	this.GATHERMODEL = {}; //从模型中采集数据
    	this.MODELNAME = [];
    	this.CHILDMODEL = function(){};
    	this.add = function(filename,fun){
    		self.MODELNAME.push(filename);
    		self.GATHERMODEL[filename] = new fun();
    	}
    }
    var _model = _seeui.model = new _seeui.otherModel();

    //模型加载
    _model.loadM = function(filename,_v,_c){

    	_seeui.LoadFile.LoadScript(filename,function(){
    		var _m_v =  new _seeui.model.CHILDMODEL();
    		var _G_model = _seeui.model.GATHERMODEL;
    		_m_v.MODEL = _G_model,_m_v._MODELNAME = _seeui.model.MODELNAME;
            var error = [];
            //console.log(_m_v.MODEL)
            for(var x in _m_v.MODEL){

                var _j = _m_v.MODEL[x];
                var mvc_ctrl = _v.MVC_CTRL[_j.view];

                if(mvc_ctrl === undefined && seeui.debug !== undefined){
                    error.push({
                        'errorfile':filename,
                        'errorinfo':_j
                    });
                    continue;
                }
                
                //console.log(_j.dataServer);
                if(_j.dataServer !== undefined){ 
                    _seeui.model.loadDataServer(_j.dataServer,_j,mvc_ctrl);
                    continue;
                }

                //console.log(_v.MVC_CTRL[_j.view]);
                if(_v.VIEW[_j.view] !== undefined && _v.VIEW[_j.view].loadStr !== undefined){
                    _seeui.model.getTemplate(_v.VIEW[_j.view].loadStr,_j,mvc_ctrl,function(){
                        mvc_ctrl.init();
                        if(mvc_ctrl.action !== undefined){
                            _ctrl.action(mvc_ctrl.action);
                        }
                    });
                }

                //console.log(_v.VIEW[_j.view])
                if(_v.VIEW[_j.view] !== undefined && typeof _v.VIEW[_j.view].loadServer === 'string'){
                    _seeui.view.LoadServerView(_v.VIEW[_j.view].loadServer,_j,mvc_ctrl);
                }

            }
            if(error.length !== 0){
                _seeui.debug.system_error(error);
            }

            _seeui.wait.RemoveWaitIco();  

    	});
    }
    //从服务端获取所有数据 
    _model.loadDataServer = function(url,_m_v,_c){
        _seeui.ajax.getSrv({
            url:url,
            dataType:'json',
            type:'GET',
            callback:function(data){
                if(data.Template !== undefined ){
                    var _m = {
                        data:{
                            value:data.value
                        }
                    }
                    _m_v.data = _m.data;
                   // console.log(_c);
                    _seeui.model.getTemplate(data.Template,_m,_c,function(){
                        _c.init();
                        if(_c.action !== undefined){
                            _ctrl.action(_c.action);
                        }
                    });
                }
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
    	}
    	if(typeof _c.ioc !== null){
    		var _true = createTemplateScript(_c.ioc);
    	}
        if(_true){
        	var _value = _m.data.value;
        	$('#template').tmpl(_value).appendTo('#'+_c.ioc);
        	deleteTemplateScript();
        	if(typeof callback === 'function'){
        		callback();
        	}
        }
    }
    console.log(_seeui);
})(window);