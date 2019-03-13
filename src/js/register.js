$(function () {
    /* 
  1 绑定 获取验证码 tap事件
    1 获取手机号码 进行合法性的验证
      1 不通过 给出一个用户提示 就ok
  2 构造参数 发送请求到后台   成功了
    1 禁用按钮   $(this).attr("disabled","disabled");
    2 开启定时器 倒计时 60s
      1 修改按钮的文字 定时的时间
    3 时间到了 
      1 清除定时器
      2 重新启用 按钮
  3 绑定注册点击事件
    1 获取一坨值 表单一些值
    2 挨个验证
      1 不通过弹出对话框 提示
    3 构造参数 发送请求到后台 完成注册
      1 注册失败  手机号码已经被注册过了 弹出一个提示 
    4 注册成功
      1 弹出一个提示 恭喜用户 你进坑。。
      2 跳转页面 登录页面
   */
    init();
    function init() {
        eventList();
    }
    function eventList() {
        $('.get_code_btn').on('tap', function () {
            let mobile_txt = $("input[name='mobile']").val().trim();

            if (!checkPhone(mobile_txt)) {
                // 1.2 弹出一个提示
                mui.toast("手机号码错误");
                return;
            }

            //  2 构造参数发送到后台
            $.post(
                "http://api.pyg.ak48.xyz/api/public/v1/users/get_reg_code",
                { mobile: mobile_txt },
                function (res) {
                    if (res.meta.status == 200) {
                        console.log(res);
                        // 1 禁用按钮
                        $(".get_code_btn").attr("disabled", "disabled");
                        // 2 开启定时器 倒计时 60s
                        // 1 修改按钮的文字 定时的时间
                        let time = 60;
                        let timeId = setInterval(() => {
                            time--;
                            $(".get_code_btn").text(`${time} 秒后重新发送`);
                            if (time == 0) {
                                clearInterval(timeId);
                                $(".get_code_btn").removeAttr('disabled').text('获取验证码')
                            }
                        }, 1000);
                    } else {
                        console.log('获取失败')
                    }
                })
        });
        // 绑定 点击注册 的按钮 事件
        $('.register_btn').on('tap', function () {
            // 3.1 获取一堆值
            let mobile_text = $("input[name='mobile']").val().trim();
            let code_text = $("input[name='code']").val().trim();
            let email_text = $("input[name='email']").val().trim();
            let pwd_text = $("input[name='pwd']").val().trim();
            let pwd2_text = $("input[name='pwd2']").val().trim();
            let gender_text = $("input[name='gender']:checked").val().trim();
            // 需要注意性别gender这个值，如果未加：checked这个筛选，则获取不到值，
            // 还需要在html中将val的值加上，这样才能获取到值，gender参数在后台应该是必填项
            // 3.2 按个验证
            // 验证手机号码
            if (!checkPhone(mobile_text)) {
                //  失败
                // 1.2 弹出一个提示
                mui.toast("手机号码错误");

                return;
            }
            // 验证 验证码的长度 不等于  4 就是错误
            if (code_text.length != 4) {
                mui.toast("验证码不合法");
                return;
            }
            // 验证邮箱的合法性
            if (!checkEmail(email_text)) {
                mui.toast("邮箱不合法");
                return;
            }
            // 验证密码的合法性
            if (pwd_text.length < 6) {
                mui.toast("密码格式不对");
                return;
            }
            // 验证 重复密码
            if (pwd2_text != pwd_text) {
                mui.toast("两次密码不一致！");
                return;
            }
            // 3.3 构造参数 完成注册
            $.post(
                "http://api.pyg.ak48.xyz/api/public/v1/users/reg",
                {
                    mobile: mobile_text,
                    code: code_text,
                    email: email_text,
                    pwd: pwd_text,
                    gender: gender_text
                }, function (res) {
                    console.log(res);
                    if (res.meta.status == 200) {
                        mui.toast('注册成功')
                        setTimeout(() => {
                            location.href = 'login.html'
                        }, 1000)
                    } else {
                        mui.toast(res.meta.msg);
                    }

                });
        });

    }

    // 验证 手机合法性
    function checkPhone(phone) {
        if (!/^1[34578]\d{9}$/.test(phone)) {
            return false;
        } else {
            return true;
        }
    }
    // 验证 邮箱
    function checkEmail(myemail) {
        var myReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
        if (myReg.test(myemail)) {
            return true;
        } else {
            return false;
        }
    }
})