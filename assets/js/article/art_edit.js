$(function() {
    var layer = layui.layer;
    var form = layui.form;

    initCate();
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
                form.render();
                getArtshow();
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image');

    //通过URLSearchParams 对象 获取URL传递过来的参数
    var params = new URLSearchParams(location.search);
    // console.log(params);
    var artId = params.get('id');
    //根据文章的ID 获取文章的详情 并初始化表单数据内容
    getArtshow();

    function getArtshow() {
        $.ajax({
            method: "GET",
            url: "/my/article/" + artId,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                console.log(res);
                //为表单赋值
                var art = res.data
                form.val('form_edit', {
                    Id: art.Id,
                    title: art.title,
                    cate_id: art.cate_id,
                    content: art.content,
                });
                // 初始化富文本编辑器
                initEditor();

                $image.attr('src', 'http://ajax.frontend.itheima.net' + art.cover_img);
                // 裁剪选项
                var cropperOption = {
                    aspectRatio: 400 / 280,
                    preview: '.img-preview',
                    // 初始化图片裁剪框的大小
                    autoCropArea: 1
                };
                // 初始化裁剪区域
                $image.cropper(cropperOption)
            }
        })
    }

    //点击选择封面按钮上传封面图片
    $("#chooseImg").on("click", function(e) {
        e.preventDefault();
        $("#Addfile").click();
    })

    //更换裁剪区域的图片
    $("#Addfile").on("change", function() {
        //拿到用户上传的图片
        // console.dir(this);
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
            .cropper({ // 重新初始化裁剪区域
                aspectRatio: 400 / 280,
                preview: '.img-preview',
            })
    })

    //发布文章
    var art_state = '已发布';
    $('#btnSave').on('click', function() {
        art_state = '草稿';
    });
    //由于表单中包含了文件内容 
    //需要使用 FormData 对象来保存表单内容
    $("#Artrelease").on('submit', function(e) {
        e.preventDefault();
        var fd = new FormData($(this)[0]);
        //添加文章状态
        fd.append('state', art_state);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                editArt(fd)
            });

    })

    function editArt(fd) {
        //发送请求
        $.ajax({
            method: "POST",
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('文章编辑失败');
                }
                layer.msg('文章编辑成功')
                location.href = '/article/article_list.html'
            }
        })
    }
})