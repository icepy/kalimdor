/*
*	roll滚动，淡出淡入，上下，左右滚动
*/
seeui.addplug('roll',function(d,o){
	var self = this,
        ioc = $('#'+d),
        config = {
            autoPlay:false,
            zIndex:20,
            url:null,
            _class:null,
            autoTime:4000,
            butnum:5,                   
            result:'fade',
            Children_id:null,
            value:[]
        },
        _config = $.extend(config,o);
    _config._class !== null ? ioc.addClass(_config._class) : ioc.addClass('roll_default');
    /*
    *   管理一些必须的dom对象
    */
    this.dom = {
        ioc:ioc,
        but_ul:null,
        con_ol:null
    };

    /*
    *   动画管理
    */
    var time = {
        cost:0,
        autoTime:_config.autoTime,
        cacheol:null,
        cacheul:null,
        cache:true,
        max_h:-(ioc.height()*_config.butnum),
        sin_h:ioc.height(),
        cost_h:0,
        max_w:ioc.width(),
        sin_w:ioc.width()
    }

    /*
    *   大量的逻辑，在类的内部完成 ，扩展内部逻辑，在action中
    */
    var action = {
        _init:function(){
            this.create_view();
        },
        create_view:function(){
            var view = '',value = _config.value,_c_id = _config.Children_id;
            if(_config.url === null){
                _config.url = '';
            }
            if(value.length !== 0){
                /*
                *   从渲染开始的
                */
                view += '<ol class="roll_ol" id="roll_ol_'+id+'">';
                for(var i = 0,len = value.length;i<len;i++){
                    i == 0 ? view += '<li id="'+value[i].id+'_pus" style="display:block;">' : view += '<li id="'+value[i].id+'_pus" style="display:none;">';
                    view += '<a href="#"><img src="'+_config.url+value[i].img+'"/>';
                    view += '</a></li>';
                }
                view += '</ol>';
                view += '<ul class="roll_ul" id="roll_ul_'+id+'">';
                for(var j = 0;j<_config.butnum;j++){
                    j == 0 ? view +='<li class="hover">'+(j+1)+'</li>' : view +='<li>'+(j+1)+'</li>';
                }
                view += '</ul>';
                self.dom.ioc.append(view);
                self.dom.but_ul = $('#roll_ul_'+id);
                self.dom.con_ol = $('#roll_ol_'+id);

            }else{
                /*
                *   如果是纯静态页面
                */
                if(typeof _c_id === 'string'){
                    console.log(self.dom.ioc);
                }

            }
            //记录最大次数
            time.max = self.dom.con_ol.children().length;
            this.addition();
            this.addEvent();
        },
        branch:function(){
            switch(_config.result){
                case 'fade':
                        action.fade_init(time.cost);
                    break;
                case 'updown':
                        action.updown_init(time.cost);
                    break;
                case 'around':
                        action.around_init(time.cost);
                    break;
            }
        },
        addEvent:function(){
            self.dom.but_ul.delegate('li','mouseenter',function(e){
                var _t = parseInt($(this).text());
                time.cost = _t - 1;
                action.branch();
                clearTimeout(time.add)
                clearTimeout(time.subtr);
            });
            self.dom.but_ul.delegate('li','mouseleave',function(e){
                if(time.cost === 4){
                    time.cost = -1;
                    action.addition();
                    return;
                }
                action.addition();
            });
        },
        addition:function(){
            if(_config.autoTime === 0){
                _config.autoTime = time.autoTime;
            }
            time.add = setTimeout(function(){
                time.cost ++;
                if(time.cost <= time.max -1){
                    action.branch();
                    setTimeout(action.addition,0);
                }else{
                    time.cost = time.cost -1;
                    _config.autoTime = 0;
                    setTimeout(action.subtraction,0);
                }
            },_config.autoTime);
        },
        subtraction:function(){
            if(_config.autoTime === 0){
                _config.autoTime = time.autoTime;
            }
            time.subtr = setTimeout(function(){
                time.cost --;
                if(time.cost > 0){
                    action.branch();
                    setTimeout(action.subtraction,0);
                }else{
                    time.cost = time.cost - 1;
                    _config.autoTime = 0;
                    setTimeout(action.addition,0);
                }
            },_config.autoTime);
        },
        fade_init:function(cost){
            var chil_ol = self.dom.con_ol.children(),
                chil_ul = self.dom.but_ul.children(),
                _ac = {'display':'block'},
                _ca = {'display':'none'};
            if(time.cache){
                time.cacheol = $(chil_ol[0]);
                time.cacheul = $(chil_ul[0]);
                time.cache = false;
            }
            $(chil_ol[cost]).css(_ac);
            time.cacheol.css(_ca);
            time.cacheol = $(chil_ol[cost]);
            $(chil_ul[cost]).addClass('hover');
            time.cacheul.removeClass('hover');
            time.cacheul = $(chil_ul[cost]);
        },
        updown_init:function(cost){
            var chil_ul = self.dom.but_ul.children();
            if(time.cache){
                var chil_ol = self.dom.con_ol.children();
                time.cacheul = $(chil_ul[0]);
                time.cache = false;
                $.each(chil_ol,function(i){
                    $(chil_ol[i]).css({'display':'block'});
                });
            }
            
            return;
            var updown = function(){
                var s = -(time.sin_h/_config.autoTime)*1000;
                var ms = -(time.sin_h/_config.autoTime);
                
            }
            updown();
        },
        around_init:function(cost){

        }

    }
    console.log(this.dom);
    /*
    *   初始化
    */
    action._init();
});