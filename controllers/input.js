seeui.controllers.add('input',function(){
	this.views = 'input_view';
	this.ioc = 'content';
	this.init = function(){
		var _s = seeui;
		$('#test').bind('click',function(){
			var data = _s.controllers.saveJSON();
			console.log(data);
		});

		/*
		*	测试正则
		*/

		var reg = /<div class=\"?(reg)\">(.*)<\/div>/g;
		var g = '<div class="reg"><span>fdf</span></div><div class="reg"><span>gfd</span></div>';
		var _g = reg.exec(g);
		console.log(_g);
	}
});