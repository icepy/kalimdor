kalimdor.controllers.add('input',function(){
	this.views = 'input_view';
	this.ioc = 'table_1,table_2';
	this.automation = 'text';
	this.init = function(){
		$('#test').bind('click',function(){
			var data = kalimdor.controllers.saveJSON();
			console.log(data);
		});
	}
});