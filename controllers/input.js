seeui.controllers.add('input',function(){
	this.views = 'input_view';
	this.ioc = 'content';
	this.automation = 'text,roll';
	this.init = function(){
		var _s = seeui;
		$('#test').bind('click',function(){
			var data = _s.controllers.saveJSON();
			console.log(data);
		});
		
	}
});