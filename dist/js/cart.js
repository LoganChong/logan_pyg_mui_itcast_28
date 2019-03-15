"use strict";

/* 
  1 任何人都可以访问这个购物车页面吗   登录过后的用户 才可以访问
    1 判断 本地存储中有没有  userinfo 这个数据  有 登录过
      假如 没有数据 
        1 把当前的页面路径存入到 本地存储中 pageurl
        2 跳转到登录页面
  2 发送请求渲染数据 私人的数据  token  请求头 
    1 token  本地存储 复杂类型
    2 对象也是可以循环

  3 计算总价 
    1 页面打开的时候就计算总价格
    2 点击数字输入框的时候 也是需要计算总价
      1 绑定点击事件
      2 点击触发 再调用 刚才 计算总价的方法
  4 页面状态的改变
    0 想 通过给body标签添加一个class 来控制 下面的标签的显示和隐藏   $("body").toggleClass("edit_status");
      1 当body标签 没有 class  "edit_status"  以下标签就隐藏
      2 当body标签 有 class  “edit_status”   以下标签就显示
    1 一开始 复选框。数字输入框，删除按钮 都是隐藏
    2 点击 编辑按钮的时候 以上的标签 反复切换 显示 
  5 编辑购物车功能 
    0 判断购物车有没有数据
    1 明确 我们可以编辑的只有 购买的数量而已 
    2 分析 接口的数据  发送到后台的数据  格式 是和 获取购物车的数据 的格式 完全一样！！！
        但是 需要修改一个属性 amount ==  购买的数量
    3 构造数据的逻辑
      1 获取到所有的li标签
      2 获取到所有的li标签身上的 商品对象
      3 把获取到的商品的对象中的字段 amount 动态做改变 变成 数字输入框的值
      4 把每一个商品对象 拼接成一个大对象 
    4 发送请求 完成编辑 
      1 post 需要带上参数  请求头
      2 成功之后
        1 弹出 同步成功的 提示
        2 js 刷新一下数据 再调用一次  cartAll
   6 删除功能 和编辑功能一样 都是使用 同步接口 
    0 判断购物车有没有选中要删除的商品
    1 分析 接口的数据  把 要删除的数据  不要发送到后台去！！！
    2 把 未被复选框选中的数据 发送到后台去 该格式 和 编辑的时候的格式一致！！！
    3 绑定 删除 按钮的点击事件
      1 获取 未被选中的 li标签
      2 循环
      3 获取到 li标签的 身上 商品对象
      4 把商品对象的 购买数量 又 修改成 数字输入框里面的值
      5 拼接成给一个 大 对象
      6 发送请求 完成同步
    7 编辑和删除功能
      1 只有 要操作的数据 li标签不一样  
      2 剩下的逻辑 完全一样！！！！
    8 生成订单的分析
      1 判断有没有商品
      2 获取所有的li标签
      3 循环
      4 循环内部开始构造 goods数据
      5 在循环的外部 拼接完成 整个接口的参数
      6 发送请求 完成 创建订单 (当购物车的商品变成了订单之后，刷新购物车页面，再也看不到购物车中的数据 )
   */
$(function () {
  init();

  function init() {
    getCartdata();
    eventList();
  } // 事件绑定


  function eventList() {
    // 编辑按钮点击事件
    $('.edit_btn').on('tap', function () {
      $("body").toggleClass('edit_status');

      if ($("body").hasClass("edit_status")) {
        $(this).text("完成");
      } else {
        $(this).text("编辑");
        editCart();
      }
    }); // 删除按钮

    $('.del_btn').on('tap', function () {
      deleteCart();
    }); // 生成订单

    $(".create_btn").on("tap", function () {
      // 8.1 获取li标签
      var $lis = $(".list li");

      if ($lis.length == 0) {
        mui.toast("您还没有选购商品");
        return;
      } // 构造接口要的参数


      var createObj = {
        // 总价格
        order_price: $(".total_price").text(),
        // 订单地址
        consignee_addr: "p城",
        goods: []
      }; // 8.2 循环

      for (var i = 0; i < $lis.length; i++) {
        // 获取li标签身上的 商品对象
        var li = $lis[i];
        var before_obj = $(li).data("obj"); // 临时的商品对象

        var tmpObj = {};
        tmpObj.goods_id = before_obj.goods_id; // 购买的数量

        tmpObj.goods_number = $(li).find(".mui-numbox-input").val(); // 单价

        tmpObj.goods_price = before_obj.goods_price; // 添加到大的对象只能给

        createObj.goods.push(tmpObj);
      } // 8.6 发送请求 完成 创建订单


      var token = JSON.parse(sessionStorage.getItem("userinfo")).token;
      $.ajax({
        url: "http://api.pyg.ak48.xyz/api/public/v1/my/orders/create",
        type: "post",
        data: createObj,
        headers: {
          Authorization: token
        },
        success: function success(result) {
          if (result.meta.status == 200) {
            // 创建成功
            mui.confirm("要不要跳转到订单页面", "创建成功", ["跳转", "取消"], function (editType) {
              if (editType.index == 0) {
                // 跳转
                location.href = "order.html";
              } else if (editType.index == 1) {// 取消
              }
            });
          } else {// 创建失败
          }
        }
      });
    });
  } // 获取数据渲染页面


  function getCartdata() {
    var _JSON$parse = JSON.parse(sessionStorage.getItem('userinfo')),
        token = _JSON$parse.token;

    $.ajax({
      // type: "get",
      url: "http://api.pyg.ak48.xyz/api/public/v1/my/cart/all",
      // data: "data",
      // dataType: "json",
      // 注意请求头的写法
      headers: {
        Authorization: token
      },
      success: function success(res) {
        if (res.meta.status == 200) {
          // 以前循环的数据都是数组 但是现在 是对象
          // 数组可以循环 对象可以循环
          // 要传递给模板引擎的数据
          // 因为cart_info里的数据是字符串来的，需要转化
          var cart_info = JSON.parse(res.data.cart_info);
          var html = template('mainTpl', {
            goodsObj: cart_info
          });
          $('.list').html(html); // 数字输入框的初始化

          mui(".mui-numbox").numbox();
          additionAll();
        }
      }
    });
  } // 计算购物车总价格


  function additionAll() {
    /* 
    0 把每一种 商品的信息 提前放入到 li标签的自定义属性中，方便后期的获取 
      修改一下 模板引擎的代码 
    1 获取 所有的li标签 里面   商品信息对象
    2 对li标签的商品信息对象数组 进行循环
    3 在循环中
      1 每一种商品的单价 * 该商品的数量(数字输入框里面的值)
      2 需要叠加之后的总价格 渲染到页面的对应的标签上 
    */
    // 1获取所有的li标签
    var $lis = $('.list li'); // 定义总价

    var total = 0;

    for (var i = 0; i < $lis.length; i++) {
      // 获取到每一里的原生dom对象
      var li = $lis[i]; // 获取商品上的信息对象

      var tempObj = $(li).data("obj"); // 再获取商品的价格

      var tempPrice = tempObj.goods_price; // 获取要购买的商品的数量

      var tmp_num = $(li).find(".mui-numbox-input").val();
      total += tempPrice * tmp_num;
    } // 把总价格 赋值到对应的标签上
    // console.log(total);


    $(".total_price").text(total);
  } // 编辑购物车


  function editCart() {
    // 1获取所有的li标签
    var $lis = $('.list li');

    if ($lis.length == 0) {
      mui.toast("您还没有选购商品");
      return;
    } // 需要发送到后台的 对象


    var paramsObj = {};

    for (var i = 0; i < $lis.length; i++) {
      // 获取到每一里的原生dom对象
      var li = $lis[i]; // 获取商品上的信息对象

      var tempObj = $(li).data("obj"); // 获取要购买的商品的数量赋值到tempObj上

      tempObj.amount = $(li).find(".mui-numbox-input").val(); // 给大的对象 赋值

      paramsObj[tempObj.goods_id] = tempObj;
    }

    var token = JSON.parse(sessionStorage.getItem('userinfo')).token;
    $.ajax({
      type: "post",
      url: "http://api.pyg.ak48.xyz/api/public/v1/my/cart/sync",
      data: {
        infos: JSON.stringify(paramsObj)
      },
      headers: {
        Authorization: token
      },
      // dataType: "json",
      success: function success(res) {
        if (res.meta.status == 200) {
          // 同步成功，重新执行页面渲染函数
          mui.toast("同步成功");
          getCartdata();
        } else {
          mui.toast(res.meta.msg);
        }
      }
    });
  } // 删除购物车


  function deleteCart() {
    // 0 获取被选中的li标签
    var lisss = $('.list li');
    console.log(lisss);
    var $lis = $(".list .ol_chk:checked").parents("li");
    console.log($lis);

    if ($lis.length == 0) {
      mui.toast("您还没有选中要删除的商品");
      return;
    } // // console.log($lis);
    // 1 获取未被选中的li标签


    var $unLis = $(".list .ol_chk").not(":checked").parents("li"); // 需要发送到后台的 对象

    var paramsObj = {}; // 5.3.2 先循环

    for (var i = 0; i < $unLis.length; i++) {
      // 获取到单个的li标签 dom原生
      var li = $unLis[i]; //  获取li标签身上的 商品对象 以前存放好的

      var tmpObj = $(li).data("obj"); // 把最新的购买的数量 赋值到 tmpObj上

      tmpObj.amount = $(li).find(".mui-numbox-input").val(); // 给大的对象 赋值

      paramsObj[tmpObj.goods_id] = tmpObj;
    } // 5.4 准备发送请求到后台 进行 编辑购物车


    var token = JSON.parse(sessionStorage.getItem("userinfo")).token;
    $.ajax({
      url: "http://api.pyg.ak48.xyz/api/public/v1/my/cart/sync",
      type: "post",
      data: {
        infos: JSON.stringify(paramsObj)
      },
      headers: {
        Authorization: token
      },
      success: function success(result) {
        // console.log(result);
        if (result.meta.status == 200) {
          // 成功
          mui.toast("同步成功");
          getCartdata();
        } else {
          console.log("失败", result);
        }
      }
    });
  }
});
//# sourceMappingURL=cart.js.map
