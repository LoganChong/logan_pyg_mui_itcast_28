
$(function () {
    // 1 发送请求需要的参数对象 全局变量 方便修改
    let QueryObj = {
        // 查询关键词
        query: '',
        // 分类ID
        cid: getUrl("cid"),
        // 页数索引
        pagenum: 1,
        // 每页长度
        pagesize: 10
    }

    // 2 总页码 是在发送请求成功了 才能 正确的赋值
    var TotalPage = 1;
    init();
    function init() {
        eventList();
        mui.init({
            pullRefresh: {
                container: ".pyg_view",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
                // 下拉刷新组件的配置
                down: {
                    height: 50,//可选,默认50.触发下拉刷新拖动距离,
                    auto: true,//可选,默认false.首次加载自动下拉刷新一次
                    // 一打开页面的时候 自动显示 下拉刷新组件
                    // contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                    // contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                    // contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                    callback: function callback() {//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                        var cb = function cb(data) {
                            let html = template('goodListTemp', { arr: data })
                            $('.list').html(html);

                            mui(".pyg_view").pullRefresh().endPulldownToRefresh(); // 重置 上拉组件

                            mui('.pyg_view').pullRefresh().refresh(true);
                        }
                        // 重置页码 变成第一页
                        QueryObj.pagenum = 1;// 重置 上拉组件  思路十分正确 但是 mui框架不给力 没有效果 
                        // 但是 我有方法来解决 bug 把以下代码 放入到 cb的回调函数中执行就可以了
                        // mui('.pyg_view').pullRefresh().refresh(true);

                        goodsSearch(cb);
                    }
                },
                up: {
                    callback: function callback() {
                        if (QueryObj.pagenum >= TotalPage) {
                            console.log("没有数据 不要再划了 网页都要崩掉！"); // 自己把没有数据的提示 放入到页面中 一旦传入了一个true 那么这么上拉组件永远不会再被执行
                            // 没数据了 肯定没有办法再执行 

                            mui(".pyg_view").pullRefresh().endPullupToRefresh(true);
                        } else {
                            console.log("还有数据 准备 下一次的请求");
                            QueryObj.pagenum++;// 定义数据回来之后的逻辑
                            var cb = function cb(data) {
                                var html = template("goodListTemp", {
                                    arr: data
                                }); // append 追加

                                $(".list").append(html); // 结束上拉组件
                                // 结束上拉加载更多 如果没有数据 传入 true 否则 传入 false

                                mui(".pyg_view").pullRefresh().endPullupToRefresh(false);
                            };
                            goodsSearch(cb);
                        }
                    }
                }
            }
        });
    }

    // 绑定事件
    function eventList() {  
        $('.list').on('tap','a',function(){
            let href = this.href;
            location.href = href;
        })
    }
    // 获取商品列表数据
    function goodsSearch(func) {
        $.get('http://api.pyg.ak48.xyz/api/public/v1/goods/search', QueryObj, function (res) {
            if (res.meta.status == 200) {
                var data = res.data.goods;
                // 计算总页数
                TotalPage = Math.ceil(res.data.total / QueryObj.pagesize);

                // 生成标签
                func(data);
            } else {
                console.log('请求数据失败');
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