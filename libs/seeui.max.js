/*
*	基于jquery的一套ui组件，metro风格
*/
(function(window,undefined){
	if(!window.seeui){
		window.seeui = {};
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

/*
*	@对话框
*/
seeui.addplug('dialog',function(g,d,o){
	var $d = $('#'+d);
	var _C = seeui.com;
	$d.css({background:'#fff'});
	var o = o;
	var g = g;
	/*
	*	@config 配置参数
	*	@autoOpen 是否在初始化时打开
	*	@width 设置宽
	*	@height 设置高
	*	@zIndex 设置z-index值
	*	@title 设置标题
	*	@buttons配置按钮
	*	@cursor 设置手势
	*	@shade 是否开启遮罩
	*	@drop 是否开启拖动
	*/
	var config = {
		autoOpen:false,
		width:300,
		height:30,
		zIndex:100,
		title:'seeui dialog例子',
		buttons:[],
		cursor:'',
		shade:false,
		drop:true
	};
	var _config = $.extend(config,o);
	//console.log(_config);
	/*
	*   @module 内部使用对象
	*/
	var module = {
		parent:null,
		content:null,
		move:null,
		button:null,
		peg:null,
		shade:null
	}
	var _init = {
		//创建dom节点
		_create:function(){
			module.content = $d;
			$d.css({width:_config.width,height:_config.height});
			var _bdW = (_C.getWidth()-_config.width)/2;
			var _bdH = (_C.getHeight()-(_config.height+67))/2;
			$d.wrap('<div class="seeui_father_com" style="width:'+_config.width+'px;height:'+(_config.height+68)+'px;position: absolute;left:'+_bdW+'px;top:'+_bdH+'px;display:none;z-index:'+_config.zIndex+'"></div>');
			module.parent = $d.parent();
			if(_config.cursor !== ''){
				module.parent.prepend('<div class="seeui_top_title" style="width:'+(_config.width-5)+'px;cursor:'+_config.cursor+'" title="'+_config.title+'">'+_config.title+'</div>');
			}else{
				module.parent.prepend('<div class="seeui_top_title" style="width:'+(_config.width-5)+'px;" title="'+_config.title+'">'+_config.title+'</div>');
			}
			module.parent.append('<div class="seeui_bottom_but" style="width:'+_config.width+'px;"></div>');
			var $child = module.parent.children();
			module.move = $child.eq(0);
			module.button = $child.eq(2);
			if(_config.buttons.length !== 0){
				var _butStr = '';
				$.each(_config.buttons,function(i){
					_butStr += '<button class="seeui_bottom_items" title="'+_config.buttons[i].text+'">'+_config.buttons[i].text+'</button>';
				});
				module.button.append(_butStr);
				var $childBut = module.button.children();
				module.peg = $childBut;
			}
			if(_config.autoOpen){
				module.parent.show();
				if(_config.shade){
					this._shade();
					module.shade.show();
				}
			}
			this._bindEvent();
			if(_config.drop){
				this._drop();
			}
			//this._openEsc();
		},
		//添加but上的事件
		_bindEvent:function(){
			var that = this;
			if(_config.buttons.length !== 0){
				$.each(module.peg,function(i){
					var _i = i;
					module.peg.eq(i).bind('click',function(){
						_config.buttons[_i].click.call(module.parent,module);
					});
				});
			}
		},
		//初始化遮罩
		_shade:function(){
			if(_config.shade){
				$('body').append('<div class="seeui_dialog_shade" style="z-index:'+(_config.zIndex - 10)+';top:0px;left:0px;"></div>');
			}
			module.shade = $('.seeui_dialog_shade');
		},
		//关闭遮罩
		_openEsc:function(){
			$(document).bind('keydown',function(e){
				if(e.keyCode = g.keyCode.ESC){
					module.parent.hide();
					if(module.shade !== null){
						module.shade.remove();
					}
				}
			});
		},
		//拖动
		_drop:function(){
			var dropX = 0;
			var dropY = 0;
			var move = false;
			$(document).bind('mouseup',function(e){
				move = false;
			});
			$(document).bind('mousemove',function(e){
				if(move){
					var _x = e.clientX - dropX;
					var _y = e.clientY - dropY;
					module.parent.css({top:_y,left:_x});
				}
			});
			module.move.bind('mousedown',function(e){
				move = true;
				dropX = e.clientX - parseInt(module.parent.css('left'));
				dropY = e.clientY - parseInt(module.parent.css('top'));
			});
		}
	}
	_init._create();
	//用户使用的方法，打开与关闭
	this.open = function(){
		module.parent.show();
		if(_config.shade){
			_init._shade();
			module.shade.show();
		}
	}
	this.close = function(){
		module.parent.hide();
		if(module.shade !== null){
			module.shade.remove();
		}
	}
});

/*
*	搜索自定义选择
*/
seeui.addplug('searchSelect',function(g,d,o){
	var $d = $('#'+d);
	/*
	*	@config 配置参数
	*	@width 设置宽
	*	@height 设置高
	*	@title 设置初始值
	*	@data 配置选择模型组
	*/
	var config = {
		width:60,
		height:60,
		title:'例子',
		data:{},
		overChangeEvent:null
	};
	var module = {
		parent:null,
		ul:null
	};
	var _config = $.extend(config,o);
	var _init = {
		//创建元素
		_create:function(){
			var that = this;
			$d.wrap('<div class="seeui_search" style="width:'+_config.width+'px;"></div>');
			$d.addClass('seeui_select_but');
			$d.css({width:_config.width,height:_config.height});
			$d.append(_config.title);
			module.parent = $d.parent();
			var _dom = ''
			_dom +='<ul class="seeui_select_content" style="display:none;" s="n">';
			$.each(_config.data.value,function(i){
				_dom += '<li style="width:'+(_config.width-2)+'px;height:30px;display:block;" id="sele_'+_config.data.value[i].id+'">'+_config.data.value[i].txt+'</li>';
			});
			_dom +='</ul>';
			module.parent.append(_dom);
			module.ul = module.parent.children().eq(1);
			that._bindEvent();
		},
		//添加事件
		_bindEvent:function(){
			var that = this;
			$d.bind('click',function(){
				if(module.ul.attr('s') == 'n'){
					module.ul.show();
					module.ul.attr('s','b');
				}else{
					module.ul.hide();
					module.ul.attr('s','n');
				}
			});
			if(typeof _config.overChangeEvent === 'function'){
				_config.overChangeEvent.call(this,module);
				return false;
			}
			module.ul.delegate('li','click',function(){
				var _tx = $(this).text();
				$d.text(_tx);
				module.ul.hide();
				module.ul.attr('s','n');
			});
		}
	}
	_init._create();
});

/*
*	tree
*/
seeui.addplug('tree',function(g,d,o){
	var $d = $('#'+d);
	var _seeui = seeui;
	var __c = seeui.com;
	/*
	*	@config 配置参数
	*	@width 设置宽
	*	@data 配置选择模型组
	*	@overClickEvent 配置事件模型
	*/
	var config = {
		width:150,
		data:null,
		autoOpen:true,
		overClickEvent:null
	};
	var module = {
		all:null
	};
	var _config = $.extend(config,o);
	var v = function(){
        _init._create_tree(_config.data);
    },
    _v = function(){
        var _c = _config.data.split(':'),
            _url = _c[1];
        _seeui.getSrv({
            url:_url,
            callback:function(data){
                var _value = data.value;
                //console.log(_value);
                _init._create_tree(_value);
            }
        });
    };
    var _show = '';
    var _attr_show = '';
    if(_config.autoOpen === false){
        _show = 'display:none;';
        _attr_show = 'n';
    }else{
        _show = 'display:block';
        _attr_show = 'b';
    }
	var _init = {
		//创建元素
		_create:function(){
			$d.replaceWith(function(){
                var _str = '<div id="'+d+'_menu" style="width:'+_config.width+'px;"><ul id="'+d+'_all" class="tree_all"></ul></div>';
                return _str;
        	});
			module.all = $('#'+d+'_all');
			__c.isArray(_config.data) ? v(): _v();
		},
		_create_tree:function(data){
			//console.log(data);
			var str = '';
			$.each(data,function(_i,_v){
	            var _p = _v.pid,
	                _id = _v.id,
	                _t = _v.text,
	                _cr = _v.cr;
	            if(_p === 0){
	            	_cr !== undefined ? str += '<li id="tree_'+_id+'_'+d+'"><span id="parent_'+_id+'_'+d+'" data-children="'+_cr+'" class="data-ch">'+_t+'</span><ul id="children_'+_id+'_'+d+'" n="'+_attr_show+'" style="margin-left:5px;'+_show+'">'+_get_children(data,_id,5)+'</ul></li>' : str += '<li id="tree_'+_id+'_'+d+'" class="data-ch"><a href="#" class="all_a">'+_t+'</a></li>';
	            }
	        });
	        module.all.append(str);
	        if(typeof _config.overClickEvent ==='function'){
	        	module.all.bind('click',function(e){
	        		_event_click(e,_config.overClickEvent);
	        	});
	        }
		}
	}
    //获取子节点，递归下去，传入的是父节点id，总数据
    var _get_children = function(data,pid,mar,_posi){
        var _all_empty = '',
            _all_str = '',
            _all_data = data,
            _all_pid = pid;
        $.each(data,function(_i,_v){
            var _id = _v.id,
                _pid = _v.pid,
                _t = _v.text,
                _c = _v.cr;
            if(_all_pid == _pid){
            	_c !== undefined ? _all_str += '<li id="tree_'+_id+'_'+d+'"><span id="parent_'+_id+'_'+d+'" data-children="'+_c+'" class="data-zh">'+_t+'</span><ul id="children_'+_id+'_'+d+'" n="'+_attr_show+'" style="margin-left:'+mar+'px;'+_show+'">'+_get_children(data,_id,mar+5)+'</ul></li>' : _all_str += '<li id="tree_'+_id+'_'+d+'"><a href="#" class="all_b">'+_t+'</a></li>';
            }
        });
        //console.log(_all_str);
        return _all_str;
    },
    //事件返回
	_event_click = function(e,_v){
        var _tar = e.target,
            $tar = $(_tar);
        if(_tar.nodeName !== 'UL'){
            if(_tar.nodeName === 'SPAN' && $tar.attr('data-children') === 'true'){
                var _s = $tar.siblings(),
                    _n = _s.attr('n');
                _n === 'b' ? _s.hide().attr('n','n') : _s.show().attr('n','b');
            }else{
                if(_tar.nodeName === 'A'){
                    _v.call($tar,e);
                }
            }
        }
    }
	_init._create();
});

/*
*	@幻灯片,渐隐渐出。
*/
seeui.addplug('vitrification',function(g,d,o){
	var $d = $('#'+d);
	/*
	*	@config 配置参数
	*	@autoPlay 是否自动播放
	*	@createDate  创建模型数据组
	*	@Message 创建消息模型数据组
	*	@zIndex 设置z-index值
	*/
	var config = {
		autoPlay:false,
		createDate:[],
		Message:[],
		frameCode:null,
		zIndex:20
	};
	var _config = $.extend(config,o);
	$d.css({overflow:'hidden',position:'relative',zIndex:_config.zIndex + 100});
	/*
	*	@module 内部使用对象
	*/
	var module = {
		cost:0,
		max:0,
		left:null,
		right:null,
		cont:null,
		contChild:null,
		msg:null,
		play:null,
		loney:null
	}
	var _init = {
		_into:function(){
			var that = this;
			if(_config.createDate.length !== 0){
				that._create();
			}else{
				that._transact();
			}
		},
		_transact:function(){
			var that = this;
			if(_config.Message.length !== 0){
				$d.append('<div class="seeui_vitri_info"></div>');
			}
			that._commonintoinfo();
		},
		_create:function(){
			var that = this;
			var _crehtml = '';
			_crehtml += '<ul>';
			$.each(_config.createDate,function(i){
				_crehtml += '<li id="free_'+_config.createDate[i].guid+'"><img src="'+_config.createDate[i].img+'"/></li>';
			});
			_crehtml += '</ul>';
			_crehtml += '<div></div><div></div><div class="seeui_vitri_info"></div>';
			$d.append(_crehtml);
			that._commonintoinfo();
		},
		_bindEvent:function(){
			var that = this;
			module.right.bind('click',function(){
				if(module.msg !== null){
					module.msg.stop({
						clearQueue:true
					});
				}
				if(module.cost == module.max -1){
					module.cost = -1;
				}
				if(module.cost < module.max){
					if(module.cost !== module.max -1){
						module.cost++;
					}
				}
				if(module.cost < module.max){
					_init._commonShowTime();
				}
				if(_config.autoPlay){
					clearTimeout(module.play);
					clearTimeout(module.loney);
					that._autoPlay();
				}
			});
			module.left.bind('click',function(){
				if(module.msg !== null){
					module.msg.stop({
						clearQueue:true
					});
				}
				if(module.cost == 0){
					module.cost = module.max;
				}
				if(module.cost == module.max -1 || module.cost > 0){
					module.cost--;
				}
				if(module.cost > -1){
					_init._commonShowTime();
				}
				if(_config.autoPlay){
					clearTimeout(module.play);
					clearTimeout(module.loney);
					that._autoLoney();
				}
			});
		},
		_autoPlay:function(){
			module.play = setTimeout(function(){
				if(module.msg !== null){
					module.msg.stop({
						clearQueue:true
					});
				}
				if(module.cost < module.max){
					if(module.cost == module.max -1){
						setTimeout(_init._autoLoney,10);
						return;
					}
					module.cost++;
					if(module.cost < module.max){
						_init._commonShowTime();
					}
					setTimeout(_init._autoPlay,10);
				}
			},4000);
		},
		_autoLoney:function(){
			module.loney = setTimeout(function(){
				if(module.msg !== null){
					module.msg.stop({
						clearQueue:true
					});
				}
				if(module.cost >= 0 && module.cost <= module.max-1){
					if(module.cost == 0){
						setTimeout(_init._autoPlay,10);
						return;
					}
					module.cost--;
					_init._commonShowTime();
					setTimeout(_init._autoLoney,10);
				}
			},4000);
		},
		_commonShowTime:function(){
			$.each(module.contChild,function(j){
				module.contChild.eq(j).hide();
			});
			if(module.msg !== null && _config.Message.length !== 0){
				module.msg.hide();
				module.msg.empty();
				module.msg.css({height:'0px'});
				module.msg.animate({height:'+30'},'slow',function(){
					module.msg.append('<a href="'+_config.Message[module.cost][1]+'">'+_config.Message[module.cost][0]+'</a>')
				});
				module.msg.show();
			}
			module.contChild.eq(module.cost).fadeIn('slow');
		},
		_commonintoinfo:function(){
			var that = this;
			var $c = $d.children();
			module.cont = $c.eq(0);
			module.left = $c.eq(1);
			module.right = $c.eq(2);
			if(_config.Message.length !== 0){
				module.msg = $c.eq(3);
			}
			$d.hover(function(){
				module.left.show();
				module.right.show();
				if(module.msg !== null){
					module.msg.animate({
						height:'+30'
					},'slow');
					module.msg.show();
				}
			},function(){
				module.left.hide();
				module.right.hide();
				if(module.msg !== null){
					module.msg.animate({
						height:'+0'
					},'slow',function(){
						module.msg.hide();
					});
				}
			});
			var $w = $d.width();
			var $h = $d.height();
			module.left.addClass('seeui_vitribut seeui_vis_left');
			module.right.addClass('seeui_vitribut seeui_vis_right');
			module.cont.css({position:'absolute',width:'100%',height:$h,zIndex:_config.zIndex});
			module.left.css({top:($h-module.left.height())/2,zIndex:_config.zIndex+10});
			module.right.css({top:($h-module.right.height())/2,zIndex:_config.zIndex+10});
			$d.css({border:'6px solid #d84f2b'});
			var $li = module.cont.children();
			module.contChild = $li;
			module.max = $li.length;
			$.each($li,function(i){
				$li.eq(i).hide();
			});
			$li.eq(0).fadeIn('slow');
			if(module.msg !== null){
				module.msg.animate({
					height:'+30'
				},'slow',function(){
					module.msg.empty().append('<a href="'+_config.Message[0][1]+'">'+_config.Message[0][0]+'</a>');
				});
				module.msg.show();
			}
			if(_config.autoPlay){
				that._autoPlay();
			}
			that._bindEvent();
		}
	}
	_init._into();
});