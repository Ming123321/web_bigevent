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
    function getArtshow() {
        $.ajax({
            method: "GET",
            url: "/my/article/" + artId,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // console.log(res);
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

// $(function() {
//     // 通过 URLSearchParams 对象，获取 URL 传递过来的参数
//     var params = new URLSearchParams(location.search)
//     var artId = params.get('id')
//     // 文章的发布状态
//     var pubState = ''

//     // 获取需要的 layui 对象
//     var form = layui.form

//     // 1. 渲染文章分类列表
//     renderArticleCates()
//     function renderArticleCates() {
//       $.get('/my/article/cates', function(res) {
//         if (res.status !== 0) {
//           return layer.msg('获取文章分类列表失败！')
//         }
//         var htmlStr = template('selectArtCates', res)
//         $('#art_cate').html(htmlStr)
//         form.render()
//         getArticleById()
//       })
//     }

//     // 2. 根据文章的 Id，获取文章的详情，并初始化表单的数据内容
//     function getArticleById() {
//       // 发起请求，获取文章详情
//       $.get('/my/article/' + artId, function(res) {
//         // 获取数据失败
//         if (res.status !== 0) {
//           return layer.msg('获取文章失败！')
//         }
//         // 获取数据成功
//         var art = res.data
//         // 为 form 表单赋初始值
//         form.val('addArticle', {
//           Id: art.Id,
//           title: art.title,
//           cate_id: art.cate_id,
//           content: art.content
//         })

//         // 手动初始化富文本编辑器
//         initEditor()

//         // 初始化图片裁剪器
//         var $image = $('#image')

//         $image.attr('src', 'http://ajax.frontend.itheima.net' + art.cover_img)
//         // $image.attr('src', 'http://www.liulongbin.top:3007' + art.cover_img)

//         // 裁剪选项
//         var cropperOption = {
//           aspectRatio: 400 / 280,
//           preview: '.img-preview',
//           // 初始化图片裁剪框的大小
//           autoCropArea: 1
//         }
//         // 初始化裁剪区域
//         $image.cropper(cropperOption)
//       })
//     }

//     // 3. 选择封面
//     $('#btnChooseCoverImage').on('click', function(e) {
//       e.preventDefault()
//       $('#fileCover').click()
//     })

//     // 4. 监听文件选择框的 change 事件
//     $('#fileCover').on('change', function(e) {
//       var files = e.target.files
//       // 没有选择文件
//       if (files.length === 0) {
//         return
//       }
//       // 重新为裁剪区域设置图片
//       $('#image')
//         .cropper('destroy')
//         .attr('src', URL.createObjectURL(files[0]))
//         .cropper({
//           aspectRatio: 400 / 280,
//           preview: '.img-preview'
//         })
//     })

//     // 设置文章的发布状态
//     $('#btnPublish').on('click', function() {
//       pubState = '已发布'
//     })
//     $('#btnSave').on('click', function() {
//       pubState = '草稿'
//     })

//     // 5. 发布文章
//     $('#formAddArticle').on('submit', function(e) {
//       e.preventDefault()

//       $('#image')
//         .cropper('getCroppedCanvas', {
//           width: 400,
//           height: 280
//         })
//         .toBlob(function(blob) {
//           // 5.1 组织参数对象
//           var fd = new FormData($('#formAddArticle')[0])
//           // 5.2 添加封面
//           fd.append('cover_img', blob)
//           // 5.3 添加文章的发表状态
//           fd.append('state', pubState)
//           // 5.4 发起请求
//           $.ajax({
//             method: 'POST',
//             url: '/my/article/edit',
//             data: fd,
//             contentType: false,
//             processData: false,
//             success: function(res) {
//               if (res.status !== 0) {
//                 return layer.msg('编辑文章失败!')
//               }
//               location.href = '/article/art_list.html'
//             }
//           })
//         })
//     })
//   })