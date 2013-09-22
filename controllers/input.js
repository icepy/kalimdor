seeui.controllers.add('input',function(){
	this.views = 'input_view';
	this.ioc = 'content';
	this.init = function(){
		var _s = seeui;
		console.log($('#test'));
		$('#test').bind('click',function(){
			var data = _s.controllers.saveJSON();
			console.log(data);
		});
	}
});