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