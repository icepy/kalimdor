kalimdor.controllers.add('dialog',function(){
	this.views = 'con_view';
	this.ioc = 'console1';
	this.init = function(){
		var _s = kalimdor;
		var dialog = kalimdor.ui.dialog('dialog',{
			autoOpen:false,
			width:400,
			height:80,
			zIndex:200,
			cursor:'move',
			title:'dialog对话框例子',
			shade:true,
			drop:true,
			buttons:[
				{
					text:'关闭',
					click:function(ui){
						dialog.close();
					}
				},
				{
					text:'确认',
					click:function(ui){
						
					}
				}
			]

		});
		//console.log($('#open'));
		$('#open').click(function(){
			dialog.open();
		});
		//console.log(kalimdor.get('con_model2'));
	}
});