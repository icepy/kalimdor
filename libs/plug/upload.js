/*
*	@上传控件
*/
kalimdor.addplug('upload',function(d,o){
	var $d = $('#'+d);
	var _C = kalimdor.com;
	$d.css({background:'#fff'});
	var o = o;
	var config ={
		restful:false,
		server:true
	}
	var _config = $.extend(config,o);
	console.log(_config);
	var module = {};
	var _init = {
		_create:function(){
			
		}
	}
});