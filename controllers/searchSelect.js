seeui.controllers.add('searchSelect',function(){
	this.view = "none";
	this.init = function(){
		var _s = seeui;
		var search = seeui.ui.searchSelect('search',{
			width:120,
			height:25,
			title:'apple',
			data:{
				"value":[
					{"id":0,"txt":"ipadmini"},
					{"id":1,"txt":"ipad"},
					{"id":2,"txt":"ipod"},
					{"id":3,"txt":"iphone"},
					{"id":4,"txt":"mac"},
					{"id":5,"txt":"nono"}
				]
			},
			overChangeEvent:function(ui){
				//console.log(ui)
			}
		});
	}
});