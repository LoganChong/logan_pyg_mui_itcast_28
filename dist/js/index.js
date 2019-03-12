"use strict";

$(function () {
  init();

  function init() {
    bannerData();
    catsDate();
    goodslist();
  }

  function bannerData() {
    $.ajax({
      type: "get",
      url: "http://api.pyg.ak48.xyz/api/public/v1/home/swiperdata",
      // data: "data",
      dataType: "json",
      success: function success(res) {
        if (res.meta.status == 200) {
          var data = res.data;
          var bannerHtml = template("bannerTem", {
            arr: data
          });
          $('.pyg_slide').html(bannerHtml);
          var gallery = mui('.mui-slider');
          gallery.slider({
            interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；

          });
        } else {
          console.log(res.meta.msg);
        }
      }
    });
  } // 分类菜单数据


  function catsDate() {
    $.ajax({
      type: "get",
      url: "http://api.pyg.ak48.xyz/api/public/v1/home/catitems",
      // data: "data",
      dataType: "json",
      success: function success(res) {
        if (res.meta.status == 200) {
          var data = res.data;
          var html = template('pygCatsTemp', {
            arr: data
          });
          $('.pyg_cats').html(html);
        } else {
          console.log('请求失败');
        }
      }
    });
  } // 获取首页商品列表数据


  function goodslist() {
    $.ajax({
      type: "get",
      url: "http://api.pyg.ak48.xyz/api/public/v1/home/goodslist",
      // data: "data",
      dataType: "json",
      success: function success(res) {
        if (res.meta.status == 200) {
          var data = res.data;
          var html = template('goodlistTemp', {
            arr: data
          });
          $('.pyg_goodlist').html(html);
        } else {
          console.log('请求失败');
        }
      }
    });
  }
});
//# sourceMappingURL=index.js.map
