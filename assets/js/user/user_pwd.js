$(function() {
    var form = layui.form;
    //自定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        //判断两次密码是否一致
        samePwd: function(val) {
            if (val === $("[name=oldPwd]").val()) {
                return '新旧密码不能相同'
            }
        },
        rePwd: function(val) {
            if (val !== $("[name=newPwd]").val()) {
                return '两次密码不一致'
            }
        }
    })

    //发送请求实现重置密码功能
    $(".layui-form").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg("重置密码失败！");
                }
                // console.log(res);
                layui.layer.msg("重置密码成功！ 2s后重新登录");
                //重置表单
                $(".layui-form")[0].reset();

                //修改好密码以后 2s重新登录
                setTimeout(function() {
                    window.parent.location.href = '/login.html'
                }, 2000)
            }
        })
    })
})