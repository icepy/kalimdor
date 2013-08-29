/*
*	@幻灯片,渐隐渐出。
*/
seeui.UI.addplug('vitrification',function(d,o){
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