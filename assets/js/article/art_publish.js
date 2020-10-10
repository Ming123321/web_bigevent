$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initCate();
    // 初始化富文本编辑器
    initEditor();
    //定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类列表失败！")
                }
                //调用模板渲染数据
                var htmlStr = template("tpl-select", res);
                $("[name=cate_id]").html(htmlStr);
                //一定要记得调用 form.render
                //layui的渲染问题
                form.render();
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //点击选择封面按钮上传封面图片
    $("#chooseImg").on("click", function() {
        $("#Addfile").click();
    })

    //更换裁剪区域的图片
    $("#Addfile").on("change", function() {
        //拿到用户上传的图片
        var filelist = this.files;
        // console.log(filelist);
        if (filelist.length === 0) {
            return layer.msg("请选择图片")
        }
        //1.通过索引拿到用户上传的图片
        var file = filelist[0];
        //2.将文件转换为路径
        var imgUrl = URL.createObjectURL(file);
        //3.重新初始化裁剪区
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgUrl) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    var art_state = '已发布';
    $('#btnSave').on('click', function() {
        art_state = '草稿';
    })

    // 由于表单中包含了文件内容，不能再调用 serialize() 函数来序列化表单
    // 需要使用 FormData 对象来保存表单内容
    //发布文章
    $("#Artrelease").on('submit', function(e) {
        e.preventDefault();
        //1.基于form表单 快速创建一个 FormData 对象
        var fd = new FormData($(this)[0]);
        //2.将文章的发布状态保存到 fd 中
        fd.append('state', art_state);
        //3.将裁减后的图片 输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
            });
        //4.发送请求
        publishArt(fd);
        // console.log(fd);
    })

    //发布文章的方法
    function publishArt(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            //如果要想服务器提交 FormData的数据对象 必须要加以下两个对象
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg("发表文章成功");
                location.href = '/article/article_list.html'
            }
        })
    }
})