$(function() {
    var layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    //点击上传按钮实现文件上传
    $("#btnChooseimg").on("click", function() {
        $("#file").click();
    })

    //更换裁剪区域的图片
    //为文件选择框绑定 change 事件
    $("#file").on("change", function(e) {
        //拿到用户上传的图片
        // console.dir(this);
        //e.target.files === this.files
        var files = e.target.files;
        if (files.length === 0) {
            return layer.msg('请选择一张图片上传');
        }
        //1.通过索引拿到用户上传的图片
        var file1 = files[0];
        //2.将文件 转化为路径
        var imgUrl = URL.createObjectURL(file1);
        //3.重新初始化裁剪区域
        $image
            .cropper('destroy') //销毁旧的区域
            .attr('src', imgUrl) //重新设置图片
            .cropper(options) //重新初始化裁剪区域
    })

    //点击确定按钮 实现将图片上传到服务器
    $("#btnConfirm").on("click", function() {
        var dataURL = $image.cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png'); //将画布上的内容 转化为 base64 格式的字符串

        //发送请求
        $.ajax({
            method: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("更换头像失败！")
                }
                layer.msg("更换头像成功！");
                //调用 父级方法 完成用户头像的修改
                window.parent.getUserInfo();
            }
        })
    })
})