seeui.controllers.add('vitrification',function(){
	this.views = "none";
	this.init = function(){
		var _s = seeui;
		var h = seeui.ui.vitrification('send',{
            autoPlay:true,
            Message:[
                ['燃烧的远征','#'],
                ['巫妖王之怒','#'],
                ['大灾变','#'],
                ['达拉赞崛起','#']
            ]
        });
	}
});