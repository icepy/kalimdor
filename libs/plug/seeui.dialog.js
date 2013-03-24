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