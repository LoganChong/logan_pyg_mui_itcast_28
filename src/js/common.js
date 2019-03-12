
$(function(){

  // zepto的ajax 发送前 都会被拦截到这里
  $.ajaxSettings.beforeSend = function(xhr,obj){
    // 显示正在等待图标
    $("body").addClass("loadding");
  }
  $.ajaxSettings.complete = function(){
    // 结束 正在等待的图标
    $("body").removeClass("loadding");
  }
})