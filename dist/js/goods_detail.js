"use strict";

$(function () {
  /* 
  1 点击 “加入购物车” tap事件
  1 获取本地存储中的一个   userinfo
  2 判断 userinfo 是否为null 
    1 null 没有登录过    =>   1 弹出对话框 您还没登录 2 延迟跳转页面 登录页面
  3 登录过了 构造参数 完成 添加到 购物车的功能
  2 准备参数 发送请求完成登录   添加到购物车功能 必须要用到token
  1 准备参数  从第一次获取数据的时候  来获取  
  2 准备发送请求 添加到购物车
  3 在api文档的最开头已经有说明
    1 把token从本地存储中获取出来
    2 把token存放到请求头
         "Authorization" : token
  3 加入购物车成功
  1 弹出 确认框 mui消息提示框 
  2 跳转的时候 跳转到购物车页面
  3 取消的时候 就什么都不做
     */
  // 商品信息对象
  var GoodsObj = {};
  init();

  function init() {
    detailData();
    eventList();
  } // 事件绑定函数


  function eventList() {
    $('.add_car').on('tap', function () {
      // 先获取本地储存的数据，是否有userInfo用户凭证
      var userinfo = sessionStorage.getItem('userinfo');

      if (!userinfo) {
        // 提示未登录
        mui.toast('您还未登录，请您登录');
        setTimeout(function () {
          // 还需要将此页面的url记住，便于用户登录完成后返回此页面
          sessionStorage.setItem('pageurl', location.href);
          location.href = 'login.html';
        }, 1000);
      } else {
        // 需要将数据发送到后台，
        // 带上token不然无效
        // 取出token
        var token = JSON.parse(userinfo).token; // 2.4 把token存入到请求头中
        // 2.4.1 $.post 简洁的ajax的方法 没有办法添加请求头信息，要给ajax添加请求头的时候 必须要使用 $.ajax

        $.ajax({
          type: "post",
          url: "http://api.pyg.ak48.xyz/api/public/v1/my/cart/add",
          data: {
            info: JSON.stringify(GoodsObj)
          },
          dataType: "json",
          headers: {
            Authorization: token
          },
          success: function success(res) {
            if (res.meta.status == 200) {
              mui.confirm('您是否需要跳转购物车页面？', '添加成功', ['跳转', '取消'], function (editType) {
                if (editType.index == 0) {
                  location.href = "cart.html"; // console.log('跳转')
                } else if (editType.index == 1) {
                  console.log("取消");
                }
              });
            } else {
              // 失败
              mui.toast(result.meta.msg);
            }
          }
        });
      }
    });
  }

  function detailData() {
    $.get("http://api.pyg.ak48.xyz/api/public/v1/goods/detail", {
      goods_id: getUrl('goods_id')
    }, function (res) {
      if (res.meta.status == 200) {
        GoodsObj = {
          cat_id: res.data.cat_id,
          goods_id: res.data.goods_id,
          goods_name: res.data.goods_name,
          goods_number: res.data.goods_number,
          goods_price: res.data.goods_price,
          goods_small_logo: res.data.goods_small_logo,
          goods_weight: res.data.goods_weight
        };
        var data = res.data;
        var html = template('goodDetailTemp', data);
        $('.pyg_view').html(html); //获得slider插件对象

        var gallery = mui('.mui-slider');
        gallery.slider({
          interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；

        });
      }
    });
  } // 获取页面地址栏?号后带的数据


  function getUrl(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
  }
});
//# sourceMappingURL=goods_detail.js.map
