/*
*   MVC system错误信息打印  调用python，来检索文件系统
*/
(function(seeui){
    var _seeui = seeui;
    var Error = function(){
        var _com = _seeui.com,
            _w = _com.getWidth(),
            _h = _com.getHeight(),
            error = '';
        error += '<div id="debug_error" style="background:#fff;position:absolute;top:0xp;left:0px;opacity:10;z-index:1000;width:'+(_w-200)+'px;height:'+_h+'px;display:none;">';
        error += '<h2>debug模块：</h2><div id="error"></div>';
        error += '</div>';
        $('body').append(error);
        var _error = $('#error'),
            _debug_error = $('#debug_error'),
            _waitIco = $('#waitIco');
        return {
            python:function(){

            },
            system_error:function(ary){
                _waitIco.hide();
                var _error_div = '';
                _error.empty();
                for(var i = 0,len = ary.length;i<len;i++){
                    _error_div += '<div style="border:1px solid red;color:red;margin-top:10px;padding:0 0 0 5px;">';
                    _error_div += '<div style="margin-bottom:5px;">错误文件：'+JSON.stringify(ary[i].errorfile[i])+'</div>';
                    _error_div += '<div style="margin-bottom:5px;">错误信息：'+JSON.stringify(ary[i].errorinfo)+'</div></div>';
                } 
                _error.append(_error_div);
                this._e = false;
                _error.show();
                _debug_error.show();
            },
            value_error:function(ary){
                _waitIco.hide();
                var _error_div = '';
                _error.empty();
                for(var i = 0,len = ary.length;i<len;i++){
                    _error_div += '<div style="border:1px solid red;color:red;margin-top:10px;padding:0 0 0 5px;">';
                    _error_div += '<div style="margin-bottom:5px;">错误所在id：'+JSON.stringify(ary[i].id)+'</div>';
                    _error_div += '<div style="margin-bottom:5px;">错误信息value：'+JSON.stringify(ary[i].value)+'</div></div>';
                } 
                _error.append(_error_div);
                this._e = false;
                _error.show();
                _debug_error.show();
            },  
            _e:true
        }
    }
    seeui.debug = Error();
})(seeui);
