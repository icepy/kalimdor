/*
*   roll滚动，淡出淡入，上下，左右滚动
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
    //console.log(ioc)
    //console.log(_config);
    /*
    *   管理一些必须的dom对象
    */
    var dom = {
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
        change_bool:false,
        max_h:-(ioc.height()*_config.butnum),
        sin_h:ioc.height()+4,
        change_h:0,
        cost_h:0,
        max_w:-(ioc.height()*_config.butnum),
        sin_w:ioc.width()+4,
        change_w:0
    }
    if(_config.result === 'updown' || _config.result === 'around'){
        _config.autoTime = _config.autoTime*2;
    }
    /*
    *   大量的逻辑，在类的内部完成 ，扩展内部逻辑，在action中
    */
    var action = {
        _init:function(){
            this.create_create_view();
        },
        create_create_view:function(){
            var create_view = '',value = _config.value,_c_id = _config.Children_id;
            if(_config.url === null){
                _config.url = '';
            }
            //console.log(value)
            if(value.length !== 0){
                create_view += '<ol class="roll_ol" id="roll_ol_'+d+'">';
                for(var i = 0,len = value.length;i<len;i++){
                    i == 0 ? create_view += '<li id="'+value[i].id+'_pus" style="display:block;">' : create_view += '<li id="'+value[i].id+'_pus" style="display:none;">';
                    create_view += '<a href="#"><img src="'+_config.url+value[i].img+'"/>';
                    create_view += '</a></li>';
                }
                create_view += '</ol>';
                create_view += '<ul class="roll_ul" id="roll_ul_'+d+'">';
                for(var j = 0;j<_config.butnum;j++){
                    j == 0 ? create_view +='<li class="hover">'+(j+1)+'</li>' : create_view +='<li>'+(j+1)+'</li>';
                }
                create_view += '</ul>';
                //console.log(create_view);
                dom.ioc.append(create_view);
                dom.but_ul = $('#roll_ul_'+d);
                dom.con_ol = $('#roll_ol_'+d);

            }else{
                /*
                *   如果是纯静态页面
                */
                if(typeof _c_id === 'string'){
                    console.log(dom.ioc);
                }

            }
            //记录最大次数
            time.max = dom.con_ol.children().length;
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
            dom.but_ul.delegate('li','mouseenter',function(e){
                var _t = parseInt($(this).text());
                time.cost = _t - 1;
                action.branch();
                clearTimeout(time.add)
                clearTimeout(time.subtr);
            });
            dom.but_ul.delegate('li','mouseleave',function(e){
                if(time.cost === time.max -1){
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
            var chil_ol = dom.con_ol.children(),
                chil_ul = dom.but_ul.children(),
                _ca = {'display':'none'}
            if(time.cache){
                time.cacheol = $(chil_ol[0]);
                time.cacheul = $(chil_ul[0]);
                time.cache = false;
            }
            seeui.com.fadeIn($(chil_ol[cost]));
            time.cacheol.css(_ca);
            time.cacheol = $(chil_ol[cost]);
            $(chil_ul[cost]).addClass('hover');
            time.cacheul.removeClass('hover');
            time.cacheul = $(chil_ul[cost]);
        },
        updown_init:function(cost){
            var chil_ul = dom.but_ul.children();
            var chil_ol = dom.con_ol.children();
            if(time.cache){
                time.cacheul = $(chil_ul[0]);
                time.cache = false;
                $.each(chil_ol,function(i){
                    $(chil_ol[i]).css({'display':'block'});
                });
            }
            var _sin_h = -(time.sin_h * cost);
            if(!time.change_bool){
                if(cost === time.max - 1){
                    time.change_bool = true;
                }
                seeui.com.slideup(dom.con_ol,time.change_h,_sin_h);
                time.change_h = -time.sin_h*cost;
            }else{
                if(cost === 0){
                    time.change_bool = false;
                }
                seeui.com.slidedown(dom.con_ol,time.change_h,_sin_h);
                time.change_h = -time.sin_h*cost; 
            }
            $(chil_ul[cost]).addClass('hover');
            time.cacheul.removeClass('hover');
            time.cacheul = $(chil_ul[cost]);
        },
        around_init:function(cost){
            var chil_ul = dom.but_ul.children();
            var chil_ol = dom.con_ol.children();
            if(time.cache){
                time.cacheul = $(chil_ul[0]);
                time.cache = false;
                $.each(chil_ol,function(i){
                    $(chil_ol[i]).css({'display':'block'});
                });
            }
            var _sin_w = -(time.sin_w * cost);
            if(!time.change_bool){
                if(cost === time.max - 1){
                    time.change_bool = true;
                }
                //seeui.com.slideup(dom.con_ol,time.change_w,_sin_w);
                time.change_w = -time.sin_w*cost;
            }else{
                if(cost === 0){
                    time.change_bool = false;
                }
                //seeui.com.slidedown(dom.con_ol,time.change_w,_sin_w);
                time.change_w = -time.sin_w*cost; 
            }
            $(chil_ul[cost]).addClass('hover');
            time.cacheul.removeClass('hover');
            time.cacheul = $(chil_ul[cost]);
        }

    }
    console.log(dom);
    /*
    *   初始化
    */
    action._init();
});