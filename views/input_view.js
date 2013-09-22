seeui.view.add('input_view',function(){
    this.model = "input_model";
    this.loadStr = function(){
    	var _str = '';
    		_str += '<input id="${id}" type="${type}" value="${v}" style="margin:10px;"/>';
    	return _str;
    }
});