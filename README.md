seeui
=====

基于jQuery的一套重UI组件，HTML结构完全是由前端输出。


用法：

seeui.xxx()

seeui为全局，调用相应的组件类，传入id，与自定义配置对象,并返回一个对象。

如：
seeui.xxx('ss',{
  autoOpen:true，
  
  onClick:function(e){
    
  }
})
