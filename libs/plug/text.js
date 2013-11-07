/*
*   文本框控件
*/
kalimdor.addplug('text',function(d,o){
    var _t = $('#'+d+'_td');
    var v = _t.append(function(){
    	var _str = '';
    		_str += '<input kalimdor="node" id="'+o.id+'" type="'+o.type+'" style="border:1px solid #ccc;"/>';
    	return _str;
    });
    //console.log(v);
});