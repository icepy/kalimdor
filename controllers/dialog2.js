kalimdor.controllers.add('dialog2',function(){
	this.views = 'con_view2';
	this.ioc = 'console2';
	this.init = function(){
		var _s = kalimdor;
		kalimdor.set('con_model2',{"id":"kalimdor","name":"卡利姆多"});
	}
	////开启了action模块
	this.action = {
		click:{
			wow:function(event){
				var data = kalimdor.controllers.saveJSON();
				console.log(data);
			},
			app:function(event){
				console.log(event);
			}
		}
	}
});