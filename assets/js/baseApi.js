//每次调用ajax请求的时候 包括 post 或者 get 
//会先调用 ajaxPrefilter 函数
//在这个函数中 可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    //再发起真正的请求之前 拼接请求的地址
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    console.log(options.url);

})