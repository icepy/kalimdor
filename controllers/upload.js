seeui.controllers.add('upload',function(){
	this.views = "none";
	this.init = function(){
		var _s = seeui;
        var initdialog = function(){
            if($('#up_dialog').length === 0 ){
                $('body').append('<a href="#" id="up_submint">upload</a><div id="dialog"><div id="uploads"></div></div>')
            }
            var _dia = _s.ui.dialog('dialog',{
                width:700,
                height:550,
                shade:true,
                title:'上传控件例子',
                buttons:[
                    {
                        text:'关闭',
                        click:function(ui){
                            _dia.close();
                        }
                    },
                    {
                        text:'确认',
                        click:function(ui){
                            
                        }
                    }
                ]
            });
            var t = true;
            $('#up_submint').click(function(){
                _dia.open();
                if(t){
                    _s.ui.upload('uploads',{});
                }
                t = false;
            });


        }
        initdialog();
	}
});