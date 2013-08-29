seeui.CTRL.add('controllers',function(){
	this.view = "con_view";
	this.init = function(){
		var _s = seeui;
		if($('#dialog').length == 0){
			$('body').append('<div id="dialog"></div>');
		}
		var dialog = seeui.dialog('dialog',{
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
		$('#a').click(function(){
			dialog.open();
		});
	}
});