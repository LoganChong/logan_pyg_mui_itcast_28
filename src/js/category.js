$(function () {
    /* 
  1 实现了静态布局
  2 首页动态渲染数据
    1 左侧菜单是全部渲染 
    2 右侧的内容 是 根据左侧 被选中的菜单 才开始 渲染 
    3 写两个方法  (页面用到的数据 只要发送一次请求去获取 就可以提供给下次下次 使用 )
      渲染左边（）
      渲染右边（）
  3 点击左侧菜单
    1 左侧菜单被 激活选中
    2 右侧的内容 动态跟着渲染
      1 先获取 被点击的li标签的索引
   */

    //  全局变量 存放 接口的返回数据 result.data
    let CateDatas;
    // 方便各个函数调用
    init();
    function init() {
        renderDatas();
        eventList();
    }

    function eventList() {
        // 1 左侧菜单的点击事件  委托 委派
        // touchstart 原生的触屏事件  tap是点击事件在zepto中进行了封装
        $(".left_menu ").on("tap", "li", function () {
            $(this).addClass('active').siblings().removeClass('active');

            // 获取 被点击的li标签的索引 $(this).index()
            let index = $(this).index();
            renderRight(index);
        })
    }

    function renderDatas() {
        let sessStr = sessionStorage.getItem('goodsDate');
        if (!sessStr) {
            categories()
        } else {
            // 将数据转换为json对象格式
            let sessObj = JSON.parse(sessStr);
            if (Date.now() - sessObj.time > 5000) {
                categories();
            } else {
                // 将旧的值赋值给全局变量的CateDatas，让旧数值渲染页面
                CateDatas = sessObj.data;
                categories();
            }
        }
    }
    function categories() {
        $.get('http://api.pyg.ak48.xyz/api/public/v1/categories', result => {
            if (result.meta.status == 200) {
                // 成功
                // 获取要渲染左侧的数据
                CateDatas = result.data;
                // 渲染左边
                // 将数据缓存起来
                var goodsDate = { data: CateDatas, time: Date.now() }
                sessionStorage.setItem('goodsDate', JSON.stringify(goodsDate));

                // 模块化，将需求分离出去，不会显得复杂
                renderLeft();
                // 渲染右边
                renderRight(0);
            }
        })
    }
    // 执行渲染左边
    function renderLeft() {
        let leftHtml = '';
        for (let i = 0; i < CateDatas.length; i++) {
            let temphtml = `
            <li class="${i == 0 ? "active" : ""}">${CateDatas[i].cat_name}</li>`
            leftHtml += temphtml;
        }
        // 放入左容器
        $(".left_menu").html(leftHtml);
        // 元素生成完毕
        var myScroll = new IScroll('.left_box');
    }
    function renderRight(index) {
        // 获取 大家电的数据
        let rightData;
        let item2Obj;
        // 获取右侧内容 需要循环的数据
        item2Obj = CateDatas[index];
        rightData = item2Obj.children;
        let rightHtml = template("rightTpl", { arr: rightData });
        $(".right_box").html(rightHtml);
        // 加isScroll插件需要严格对照他的规定格式，所以需要修改一下html格式,

        // 因为iscroll插件还要元素满足已有成型的高度，
        // 而图片元素加载比较慢，所以在其高度未加载完成前就已经执行scroll初始化，初始化的高度会有差异
        // 解决方式是 img元素有onload事件,加载完毕执行函数
        // 又因为需要执行每一张图片的onload事件，每一次执行都会执行一次初始化事件，浪费资源，
        let imglength = $(".right_box img").length;
        $(".right_box img").on("load", function () {
            imglength--;
            if (imglength == 0) {
                var myScroll = new IScroll('.right_box');
            }
        })

        console.log($("#aaa"))
        $("#aaa").on('load',function(){
            console.log('afdsf')
        })



    }
})