getUserInfo();

$(function() {

    // getUserInfo();

    //点击按钮 实现退出功能
    $("#btnLogout").on('click', function() {
        //提示用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            //1.清空本地存储
            localStorage.removeItem('token');
            //2.重新跳转登陆页面
            location.href = '/login.html';

            //关闭confirm 询问框
            layer.close(index);
        });
    })
})

//注意 getUserInfo() 函数要写在jquery入口函数外 这样才能在外部调用到它
//获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: '/my/userinfo',
        //headers 请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || '',
        // },
        async: false, //把ajax 变为同步请求
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败");
            }
            //调用函数渲染用户头像
            renderAvatar(res.data);
        },
        //无论成功还是失败 都会调用 comolete 函数
        // complete: function(res) {
        //     // console.log(res);
        //     //在complete 回调函数中 可以使用 res.responseJSON 拿到服务端的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         //1.强制清空 token
        //         localStorage.removeItem('token');
        //         //2.强制跳转到登陆页面
        //         location.href = './login.html';
        //     }
        // }
    })
}

//渲染用户的头像
function renderAvatar(user) {
    //1.获取用户的名称
    var name = user.nickname || user.username;
    //2.设置欢迎文本
    $("#welcome").html('欢迎&nbsp;&nbsp;' + name);
    //3.按需渲染用户的头像
    if (user.user_pic !== null) {
        //渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.txt_avatar').hide();
    } else {
        //渲染文本头像
        $('.layui-nav-img').hide();
        //获取到文本的第一个字符
        var first = name[0].toUpperCase();
        $('.txt_avatar').html(first).show();
    }
}