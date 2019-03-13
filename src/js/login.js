
$(function () {
       /* 
    1 点击登录按钮
      1 获取 用户名和密码
      2 合法性的验证 不通过 弹窗 给提示 
    2 构造参数  发送请求完成 登录
      1 登录成功
        1 把token存到本地存储中  既然要存数据 干脆 整个result.data 都存起来 方便后期 扩展使用
        2 登录成功的提示 
    3 登录成功
      1 先判断有没有来源页面  存储在 sessionStorage key pageurl
      2 有 就跳转到来源页面 
      3 没有再跳转到 首页 index.html
     */
    init();
    function init() {
        eventList();

    }

    function eventList() {
        $(".login_btn").on('tap',function(){
            let username = $("input[name='mobile']").val();
            let password = $("input[name='pwd']").val();
            // 验证密码的合法性
            if (password.length < 6) {
                mui.toast("密码格式不对");
                return;
            }
            if(!checkPhone(username)){
                mui.toast("手机格式不对");
                return;
            }

            // 2 构造参数  发送请求完成 登录
            $.ajax({
                type: "post",
                url: "http://api.pyg.ak48.xyz/api/public/v1/login",
                data: {
                    username:username,
                    password:password
                },
                dataType: "json",
                success: function (res) {
                    if(res.meta.status == 200){
                        // 1 把token存到本地存储中  既然要存数据 干脆 整个result.data 都存起来 方便后期 扩展使用
                        // res.data中有token属性
                        sessionStorage.setItem('userinfo',JSON.stringify(res.data));

                        // 提示
                        mui.toast('登录成功');

                        // 获取来源页面
                        var pageUrl = sessionStorage.getItem('pageurl');

                        // 如果无来源页面则跳转到主页
                        if(!pageUrl){
                            pageUrl = "index.html";
                        }

                        // 延迟跳转
                        setTimeout(() => {
                            location.href = pageUrl;
                        }, 1000);

                    }else{
                        // 错误
                        mui.toast(res.meta.msg)
                    }
                }
            });
            
        })
    }


    // 验证 手机合法性
    function checkPhone(phone) {
        if (!/^1[34578]\d{9}$/.test(phone)) {
            return false;
        } else {
            return true;
        }
    }
})