//每次调用ajax请求的时候 包括 post 或者 get 
//会先调用 ajaxPrefilter 函数
//在这个函数中 可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    //再发起真正的请求之前 拼接请求的地址
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    // console.log(options.url);

    //统一为有权限的接口设置 headers 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        }
    }

    //全局同意挂载 comolete 回调函数
    options.complete = function(res) {
        //在complete 回调函数中 可以使用 res.responseJSON 拿到服务端的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //1.强制清空 token
            localStorage.removeItem('token');
            //2.强制跳转到登陆页面
            location.href = './login.html';
        }
    }
})