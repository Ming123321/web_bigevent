$(function() {
    var form = layui.form;
    var layer = layui.layer;

    //自定义校验规则
    form.verify({
        nickname: function(val) {
            if (val.length > 6) {
                return '昵称长度必须在1~6 个字符之间';
            }
        }
    })

    initUserInfo();
    //获取用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // console.log(res);
                //调用 form.val() 为表单赋值
                form.val('formUserInfo', res.data);
            }
        })
    }

    //点击按钮实现重置效果
    $("#btnReset").on('click', function(e) {
        //阻止表单的默认提交
        e.preventDefault();
        initUserInfo();
    })

    //更新用户的基本信息
    $(".layui-form").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("更新用户信息失败！")
                }
                layer.msg("更新用户信息成功！");
                //调用父页面中的方法 重新渲染用户头像和用户信息
                window.parent.getUserInfo();
            }
        })
    })

})