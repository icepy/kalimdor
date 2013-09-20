seeui.controllers.add('dialog2',function(){
	this.views = 'con_view2';
	this.ioc = 'console2';
	this.init = function(){
		var _s = seeui;
	}
	////开启了action模块
	this.action = {
		click:{
			wow:function(event){
				console.log(event)
			},
			app:function(event){
				console.log(event);
			}
		}
	}
});