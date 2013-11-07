/*
*	tree
*/
kalimdor.addplug('tree',function(d,o){
	var $d = $('#'+d);
	var _kalimdor = kalimdor;
	var __c = kalimdor.com;
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
        _kalimdor.ajax.getSrv({
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