seeui.CTRL.add('tree',function(){
	this.view = "con_view";
	this.init = function(){
		var _s = seeui;
		var _tree = seeui.ui.tree('my_tree',{
            overClickEvent:function(e){
            	console.log(this);
            },
            data:[
                    {"id":1,"pid":0,"text":"我的游戏","cr":true},
                    {"id":2,"pid":1,"text":"魔兽世界"},

                    {"id":3,"pid":0,"text":"我的游戏时间","cr":true},
                    {"id":4,"pid":3,"text":"4500分钟"},

                    {"id":5,"pid":0,"text":"我的任务","cr":true},
                    {"id":6,"pid":5,"text":"未完成任务"},
                    {"id":7,"pid":5,"text":"已完成任务"},


                    {"id":8,"pid":0,"text":"拍卖行分析","cr":true},
                    {"id":9,"pid":8,"text":"金币查询"},


                    {"id":10,"pid":0,"text":"副本设置","cr":true},

                    {"id":11,"pid":10,"text":"个人副本提醒"},
                    {"id":12,"pid":10,"text":"即将到来的副本","cr":true},

                        {"id":13,"pid":12,"text":"熔火之心"},
                        {"id":14,"pid":12,"text":"我想去的副本","cr":true},
                            {"id":15,"pid":14,"text":"安其拉战役"},
                            {"id":16,"pid":14,"text":"黑翼之巢"},
                            {"id":17,"pid":14,"text":"黑石山"},
                            {"id":18,"pid":14,"text":"祖尔格拉布神庙"},
                            {"id":19,"pid":14,"text":"瑟银兄弟会"}
            ],
            autoOpen:false
		});

		var _tree = seeui.ui.tree('you_tree',{
			overClickEvent:function(e){
            	console.log(this);
            },
            data:'url:data/tree.js'
		});
	}
});