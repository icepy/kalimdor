seeui.view.add('con_view',function(){
    this.model = "con_model";
    this.loadStr = function(){
    	var _str = '';
    		_str += '<div id="${id}"><a href="#">${name}</a></div>';
    	return _str;
    }
    //this.loadServer = 'url:views/con_view/con_view.html';
});