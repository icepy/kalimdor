seeui
=====

基于jQuery的一套重UI组件，主要用于企业应用。

2013年8月24日，开始写，有不足之处还请大家能指正，并提供详细的参考。

设计计划：先写组件类，再写核心支持文件，再优化组件类，优化核心支持文件，并形成第一版。

用法：

seeui.xxx()

seeui为全局，调用相应的组件类，传入id，与自定义配置对象,并返回一个对象。

如：
seeui.xxx('ss',{
   
   autoOpen:true，
   
   onClick:function(e){
    
   }
})；
