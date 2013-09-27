seeui.controllers.add('roll',function(){
	this.views = "none";
	this.init = function(){
		var _s = seeui;
        //console.log(_s);
        var val = [
            {"id":"1","img":"wow_1.jpg","scr":"xxx"},
            {"id":"2","img":"wow_2.jpg","scr":"xxx"},
            {"id":"3","img":"wow3.jpg","scr":"xxx"},
            {"id":"4","img":"wow4.jpg","scr":"xxx"},
            {"id":"5","img":"wow5.jpg","scr":"xxx"}
        ]
        var v = _s.ui.roll('content',{
            value:val,
            url:'img/',
            _class:'roll_ioc'
        });

        var _v = _s.ui.roll('content2',{
            value:val,
            url:'img/',
            result:'updown',
            _class:'roll_ioc'
        });

        var n = _s.ui.roll('content3',{
            value:val,
            url:'img/',
            result:'around',
            _class:'roll_ioc'
        });
	}
});