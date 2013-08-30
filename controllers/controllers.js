seeui.controllers.add('controllers',function(){
	this.views = 'con_view';
	this.ico = 'body';
	this.init = function(){
		var _s = seeui;
		var dialog = seeui.ui.dialog('dialog',{
			autoOpen:true,
			width:400,
			height:80,
			zIndex:200,
			cursor:'move',
			title:'dialog对话框例子',
			shade:true,
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
		$('#open').click(function(){
			dialog.open();
		});
	}
});