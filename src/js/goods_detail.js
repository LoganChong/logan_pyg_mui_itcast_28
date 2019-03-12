
$(function () {
    init();
    function init() {
        detailData();
        eventList();
    }

    // 事件绑定函数
    function eventList() {
        $('.add_car').on('tap', function () {
            // 弹出 mui的消息提示框 自动消失
            mui.toast("您还没有登录");
        })
    }

    function detailData() {
        $.get("http://api.pyg.ak48.xyz/api/public/v1/goods/detail", { goods_id: getUrl('goods_id') }, function (res) {
            if (res.meta.status == 200) {

                let data = res.data;
                console.log(data);
                let html = template('goodDetailTemp', data)

                $('.pyg_view').html(html)

                //获得slider插件对象
                var gallery = mui('.mui-slider');
                gallery.slider({
                    interval: 5000//自动轮播周期，若为0则不自动播放，默认为0；
                });
            }
        })
    }



    // 获取页面地址栏?号后带的数据
    function getUrl(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }
})