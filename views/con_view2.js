kalimdor.view.add('con_view2',function(){
    this.model = "con_model2";
    this.loadStr = function(){
    	var _str = '';
    		_str += '<%_.each(value,function(v){%><div id=\"<%=v.id%>\"><a href=\"#\"><%=v.name%></a></div><%})%>';
    	return _str;
    }
   	// this.loadServer = 'url:views/con_view/con_view.html';
});