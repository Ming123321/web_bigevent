$(function() {
    //登录注册切换
    $("#link_reg").on('click', function() {
        $(".login_box").hide();
        $(".reg_box").show();
    })
    $("#link_login").on('click', function() {
        $(".login_box").show();
        $(".reg_box").hide();
    })

    //自定义校验规则 
    //从 layui 中获取form对象
    var form = layui.form;
    var layer = layui.layer; //进行消息提示
    //通过form.verify() 函数自定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
        //校验两次密码是否一致
        repwd: function(value) {
            //通过形参拿到的是确认密码框中的内容 
            //要个密码框中的内容进行比较 不一致返回错误
            var pwd = $(".reg_box [name=password]").val();
            if (pwd !== value) {
                return '请输入相同的密码！';
            }
        }
    })

    //监听注册表单提交事件
    $("#form_reg").on('submit', function(e) {
        //阻止默认提交行为
        e.preventDefault();
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data,
            function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功请登录');
                //模拟人的点击行为
                $('#link_login').click();
            })
    })

    //监听登录表单的提交事件
    $("#form_login").submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            //快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登陆失败！')
                }
                layer.msg("登陆成功！");
                // console.log(res.token);
                //将登陆成功得到的字符串保存到本地浏览器
                localStorage.setItem('token', res.token);
                //跳转到后台主页
                location.href = './index.html';
            }
        })
    })
})