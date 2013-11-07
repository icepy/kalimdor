/*!!
*   MVC架构  基于jQuery的解决方案{还未完成}
*
*   @2013年8月30日，实现了MVC核心基础构造，与文件加载路由模块。
*   
*   @2013年8月30日下午4点40分，实现了MVC中视图加载模块，模型渲染模块基础构造。
*
*   @2013年8月31日 晚 21点08分，更新从服务端获取视图模型，在view中只需定义模型，视图与模型需要定义在一起。
*
*   @2013年9月14日  核心模块加载方式更改，使用config配置文件的形式来加载相应的依赖。
*
*   @2013年9月14日  增加了mvc文件名字段
*
*   @2013年9月14日  增加了注释
*
*   @2013年9月15日  增加对多控制器的支持
*
*   @2013年9月20日  增加action动作列队
*
*   @2013年9月22日  增加debug模式，对模型的存储与检索
*
*   @2013年9月26日  增加对控件的自动化渲染机制
*
*   @2013年11月7日  增加get，set方法。get可以获取当前模型，set可以设置模型，一旦设置，将更新视图。
*/
(function(window,undefined){
	var document = window.document,
    navigator = window.navigator,
    local = window.location;
    var regxscript = /(^|.*[\\\/])kalimdor(?:_basic)?.js(?:\?.*)?$/i;
    if(window.kalimdor){return;}
	if(!window.kalimdor){
		window.kalimdor = {};
        var path = kalimdor.pathinfo = {};
        var BasePATH = window.kalimdor ||'';
        var LocaPath = function(){
            var cri = document.getElementsByTagName('script')[0];
            BasePATH = cri.src.match(regxscript)[1];
            return BasePATH;
        }
        path.LocaPath = LocaPath();
    }
	var _kalimdor = kalimdor;
    _kalimdor. getURL = function(){
        var loc = document.location.href;
        var _url = loc.substring(0,loc.lastIndexOf('/'));
        return _url;
    }
	/*
		ui组件类集合
	*/
	kalimdor.ui = {};
	/*
		UI类
	*/
	var otherOption = function(namespace,callback){
		kalimdor.ui[namespace] = function(d,o){
			return new callback(d,o);
		}
    }
    /*
		对jQuery ajax的封装，未来将增加解决跨域的封装方法
    */
    _kalimdor.ajax = {
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
    _kalimdor.cookie = {
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
		公共工具函数集合
	*/
	_kalimdor.com = {
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
		var _com = _kalimdor.com,
			_w = _com.getWidth(),
			_h = _com.getHeight(),
			waitico = '';
		waitico += '<div id="waitIco" style="position:absolute;background:#fff;opacity:10;z-index:1000;width:'+_w+'px;height:'+_h+'px;">';
		waitico += '<div style="background:url(css/image/waitloaded.gif);position: absolute;width:48px;height:48px;top:'+(_h-48)/2+'px;left:'+(_w-48)/2+'px;" alt="wati"></div>';
		waitico += '</div>';
        $('body').prepend(waitico);
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
	_kalimdor.LoadFile = (function(){
		var Head = _kalimdor.com.getHead();
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = _kalimdor.pathinfo.LocaPath +'LAB.min.js';
        Head.appendChild(script);
        return {
			_loadinit:function(arr,fun,_kalim){
				_kalim.LoadFile._Load_Scr(arr,function(){
					var s = _kalim.config.style,
						k = _kalim.config.library;
					if(s.length !== 0 && _kalim.com.isArray(s)){
						for(var i = 0,len = s.length;i<len;i++){
							_kalim.LoadFile.LoadStyle(s[i]);
						}
					}
					if(k.length !== 0 && _kalim.com.isArray(k)){
						var _k = [];
						for(var j =0,le = k.length;j<le;j++){
							_k.push('libs/'+k[j]);
						}
						_kalim.LoadFile.LoadScript(_k,fun);
					}
				}); 
			},
			LoadStyle:function(filename){
				var Head = _kalimdor.com.getHead();
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
	(function(_kalimdor){
        //console.log(kalimdor.com.getBody());
		_kalimdor.LoadFile._loadinit(['libs/config.js'],function(){
			_kalimdor.addplug = otherOption;
            _kalimdor.wait = LoadWaitIco();
			var libs = kalimdor.config.plug,
                debug = kalimdor.config.debug,
			    _g = [];
            if(debug !== undefined && debug !== false){
                _g.push('libs/kalimdor.debug.js');   
            }
			if(libs === "all"){
				_g.push('libs/kalimdor.ui.js');
			}else{
				$.each(libs, function(index, val) {
					_g.push('libs/plug/'+val+'.js');
				});
			}
			$(function(){
				kalimdor.LoadFile.LoadScript(_g,function(){
                    var c = $('#controllers').attr('ctrl').split('|'),_c = [];
                    $.each(c,function(_v){
                        _c.push('controllers/'+c[_v]+'.js');
                    });
					_kalimdor.controllers.LoadControllers(_c,_kalimdor);

				});
			});
		},_kalimdor);
	})(_kalimdor);

	/*=================================================================================*/
	/*=================================================================================*/
	/*
		{未完成}MVC处理核心
	*/
	/*=================================================================================*/
	/*=================================================================================*/
    var affair_data = [];
    var setVIEW = {};
    var template = function(view,obj,_c){
        if(typeof _c.ioc !== null){
            var _value = obj;
            $('#'+_c.ioc).append(_.template(view,{value:_value}));
            if(typeof callback === 'function'){
                callback();
            }
        }
    }
    _kalimdor.get = function(name){
        return _kalimdor.model.GATHERMODEL[name].data.value;
    }
    _kalimdor.set = function(name,obj){
        var model = _kalimdor.model.GATHERMODEL[name];
        var view = setVIEW[model.view];
        var value = [];
        value.push(obj);
        template(view.loadStr,value,view);
    }
	//控制器类
    _kalimdor.otherCtrl = function(){
    	var self = this;
    	this.GATHERCTRL = {};  //从控制器中采集信息
    	this.CTRLNAME = [];  //控制器名字
    	this.CHILDCTRL = function(){};
    	this.add = function(filename,fun){
    		self.CTRLNAME.push(filename);
    		self.GATHERCTRL[filename] = new fun();
    	}
    }
    var _ctrl = _kalimdor.controllers = new _kalimdor.otherCtrl();

    //控制器加载
    _ctrl.LoadControllers = function(filename,callback){

    	_kalimdor.LoadFile.LoadScript(filename,function(){   		
    		var _c = new _kalimdor.controllers.CHILDCTRL();
    		var _G_ctrl = _kalimdor.controllers.GATHERCTRL;
            //console.log(_G_ctrl);
    		_c.CTRL = _G_ctrl,_c._CTRLNAME = _kalimdor.controllers.CTRLNAME,_c.Views = [];
            $.each(_c.CTRL,function(_i,_v){
                if(_v['views'] !== 'none'){
                    _c.Views.push('views/'+_v['views']+'.js');
                }else{
                    //console.log(_v);
                    _v.init();
                    _kalimdor.wait.RemoveWaitIco();
                }
            });
            //console.log(_c.Views)
            _kalimdor.view.LoadViews(_c.Views,_c);
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
            json = null,
            _value = null,
            find = function(value){
                for(var i = 0,len = value.length;i<len;i++){
                    var field = value[i].field;
                    for(var j = 0,le = field.length;j<le;j++){
                        if(field[j].id !== undefined){
                            S_JONS.push({
                                'id':field[j].id,
                                'value':$('#'+field[j].id).val()
                            });
                        }
                    }
                }
            }
        if(typeof id === 'string'){
            json = _kalimdor.model.GATHERMODEL[id];
            if(json.dataServer !== undefined){
                _value = json.data.value;
                find(_value);
            }
        }else{
            json = _kalimdor.model.GATHERMODEL;
            for(x in json){
                if(json[x].dataServer !== undefined){
                    _value = json[x].data.value;
                    find(_value);
                }
            }
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
            if(kalimdor.debug !== undefined){
                kalimdor.debug.value_error(verify);
            }
            return false;
        }
        return true;
    }

    //视图类
    _kalimdor.otherView = function(){
    	var self = this;
    	this.GATHERVIEW = {}; //从视图中采集信息
    	this.VIEWNAME = [];
    	this.CHILDVIEW = function(){};
    	this.add = function(filename,fun){
    		self.VIEWNAME.push(filename);
    		self.GATHERVIEW[filename] = new fun();
    	}
    }
    var _view = _kalimdor.view = new _kalimdor.otherView();
    //视图加载
    _view.LoadViews = function(filename,_c){
    	_kalimdor.LoadFile.LoadScript(filename,function(){
    		var _v = new _kalimdor.view.CHILDVIEW();
    		var _G_view = _kalimdor.view.GATHERVIEW;
            _v.VIEW = _G_view,_v._VIEWNAME = _kalimdor.view.VIEWNAME,_v.Models = [],_v.MVC_CTRL = {};
            $.each(_c.CTRL,function(_i,_vc){
                _v.MVC_CTRL[_vc['views']] = _vc;
            });
            $.each(_v.VIEW,function(_i,_k){
                var _set = setVIEW[_i] = {};
                if(_k.loadStr !== undefined && typeof _k.loadStr() === 'string'){
                    _k.loadStr = _k.loadStr();
                    _set['loadStr'] = _k.loadStr;
                    _set['ioc'] = _v.MVC_CTRL[_i].ioc;
                }else if(_k.loadServer !== undefined && typeof _k.loadServer === 'string'){
                    _k.loadServer = _k.loadServer;
                    _set['loadStr'] = '';
                    _set['ioc'] = '';
                }else{
                    _set['loadStr'] = '';
                    _set['ioc'] = '';
                }
                if(_k['model'] !=='none'){
                    _v.Models.push('models/'+_k['model']+'.js');
                }
            });
            _kalimdor.model.loadM(_v.Models,_v,_c);
    	});
        
    }
    //从服务端加载视图
    _view.LoadServerView = function(url,_m,_c){
    	_kalimdor.ajax.getSrv({
    		url:url,
    		type:'GET',
    		dataType:'html',
    		callback:function(data){
                setVIEW[_m.view].loadStr = data;
                setVIEW[_m.view].ioc = _c.ioc;
    			_kalimdor.model.getTemplate(data,_m,_c,function(){
    				_c.init();
                    if(_c.action !== undefined){
                        _ctrl.action(_c.action);
                    }
    			});
    		}
    	})
    }

    //模型类
    _kalimdor.otherModel = function(){
    	var self = this;
    	this.GATHERMODEL = {}; //从模型中采集数据
    	this.MODELNAME = [];
    	this.CHILDMODEL = function(){};
    	this.add = function(filename,fun){
    		self.MODELNAME.push(filename);
    		self.GATHERMODEL[filename] = new fun();
    	}
    }
    var _model = _kalimdor.model = new _kalimdor.otherModel();

    //模型加载
    _model.loadM = function(filename,_v,_c){

    	_kalimdor.LoadFile.LoadScript(filename,function(){
    		var _m_v =  new _kalimdor.model.CHILDMODEL();
    		var _G_model = _kalimdor.model.GATHERMODEL;
    		_m_v.MODEL = _G_model,_m_v._MODELNAME = _kalimdor.model.MODELNAME;
            var error = [];
            //console.log(_m_v.MODEL)
            for(var x in _m_v.MODEL){

                var _j = _m_v.MODEL[x];
                var mvc_ctrl = _v.MVC_CTRL[_j.view];

                if(mvc_ctrl === undefined && kalimdor.debug !== undefined){
                    error.push({
                        'errorfile':filename,
                        'errorinfo':_j
                    });
                    continue;
                }
                
                //console.log(_j.dataServer);
                if(_j.dataServer !== undefined){ 
                    _kalimdor.model.loadDataServer(_j.dataServer,_j,mvc_ctrl);
                    continue;
                }

                //console.log(_v.MVC_CTRL[_j.view]);
                if(_v.VIEW[_j.view] !== undefined && _v.VIEW[_j.view].loadStr !== undefined){
                    _kalimdor.model.getTemplate(_v.VIEW[_j.view].loadStr,_j,mvc_ctrl,function(){
                        mvc_ctrl.init();
                        if(mvc_ctrl.action !== undefined){
                            _ctrl.action(mvc_ctrl.action);
                        }
                        if(mvc_ctrl.automation !== undefined){
                            _model.automation(mvc_ctrl.automation,_j);
                        }
                    });
                }

                //console.log(_v.VIEW[_j.view])
                if(_v.VIEW[_j.view] !== undefined && typeof _v.VIEW[_j.view].loadServer === 'string'){
                    _kalimdor.view.LoadServerView(_v.VIEW[_j.view].loadServer,_j,mvc_ctrl);
                }

            }
            if(error.length !== 0){
                _kalimdor.debug.system_error(error);
            }
           _kalimdor.wait.RemoveWaitIco();  
    	});
    }
    //从服务端获取所有数据 
    _model.loadDataServer = function(url,_m_v,_c){
        _kalimdor.ajax.getSrv({
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
                    setVIEW[_m_v.view].loadStr = data.Template;
                    setVIEW[_m_v.view].ioc = _c.ioc;
                    _kalimdor.model.renderingTemplate(data.Template,_m,_c,function(){
                        _c.init();
                        if(_c.action !== undefined){
                            _ctrl.action(_c.action);
                        }
                        
                        if(_c.automation !== undefined){
                            var _automodel = _m.data.value;
                            for(var i = 0,len = _automodel.length;i<len;i++){
                                var mod = {
                                    "data":{
                                        "value":_automodel[i].field
                                    }
                                }
                                //console.log(i);
                                _kalimdor.model.automation(_c.automation,mod);
                            }
                        }
                    });
                }
            }
        });
    }
    var renderModelArray = [],
        renderModelBool = false;
    //解析模板
    _model.renderingTemplate = function(template,_m,_c,callback){
        var _template = template,_temp,
            _ioc = _c.ioc.split(','),
            _m = _m.data.value;
        for(var i = 0,len = _m.length;i<len;i++){
            var mod = {
                "data":{
                    "value":_m[i].field
                }
            }
            var ctr = {
                "ioc":_ioc[i]
            }
            if(typeof _template === 'string'){
                _temp = _template;
            }else{
                _temp = _template[i]
            }
            _model.getTemplate(_temp,mod,ctr,function(){
                renderModelArray.push(i);
            });
            if(renderModelArray.length === _m.length){
                renderModelBool = true;
            }
        }
        if(renderModelBool){
            if(typeof callback === 'function'){
                callback();
            }
        }
    }
    //渲染模版
    _model.getTemplate = function(view,_m,_c,callback){
        // console.log(view);
        // console.log(_m);
        // console.log(_c);
    	if(typeof _c.ioc !== null){
        	var _value = _m.data.value;
            $('#'+_c.ioc).append(_.template(view,{value:_value}));
        	if(typeof callback === 'function'){
        		callback();
        	}
        }
    }
    //自动渲染ui应用层控件
    _model.automation = function(auto,_m){
        var _auto = auto.split(','),
            _value = _m.data.value;
            //console.log(_value);
            //console.log(_m);
        $.each(_auto,function(_j,_k){
            $.each(_value,function(_i,_v){
                if(_v.type === _k){
                    kalimdor.ui[_k](_v.id,_v);
                }
            });
        });
    }
    console.log(_kalimdor);
})(window);