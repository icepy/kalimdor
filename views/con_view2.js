seeui.view.add('con_view2',function(){
    this.model = "con_model2";
    this.loadStr = function(){
    	var _str = '';
    		_str += '<div id="${id}"><a href="#">${name}</a></div>';
    	return _str;
    }
   	// this.loadServer = 'url:views/con_view/con_view.html';
});