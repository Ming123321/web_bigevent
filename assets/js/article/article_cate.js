$(function() {

    var layer = layui.layer;
    var form = layui.form;

    getArtCateList();
    //获取文章分类列表
    function getArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类列表失败！")
                }
                //使用模板引擎快速显示数据
                var htmlStr = template('tpl-table', res);
                $("tbody").html(htmlStr);
            }
        })
    }

    //通过索引方便关闭弹出层
    var indexAdd = null;
    //为添加类别按钮 点击显示弹出层
    $("#btnAddCate").on("click", function() {
        indexAdd = layer.open({
            //根据默认参数设置弹出层
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $("#form_add").html(),
        })
    })

    //实现添加文章分类的功能 
    //通过事件委托来实现添加
    $("body").on('submit', '#formArtCate', function(e) {
        //阻止表单的默认提交行为
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("新增分类失败！");
                }
                //更新最新的文章分类列表
                getArtCateList();
                layer.msg("新增分类成功！");
                //根据索引 关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    //通过事件委托实现点击编辑按钮弹出层
    var indexEdit = null;
    //点击编辑按钮 弹出表示层
    $("tbody").on("click", "#artEdit", function() {
        indexEdit = layer.open({
            //根据默认参数设置弹出层
            type: 1,
            area: ['500px', '250px'],
            title: '编辑文章分类',
            content: $("#form_edit").html(),
        })

        //不发 ajax 请求 也可以做到
        console.log($(this).parents('tr').children().eq(0).html());

        var id = $(this).attr('data-id');
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            success: function(res) {
                //表单数据的填充
                form.val('form-edit', res.data)
            }
        })
    });

    //通过事件委托实现确认修改文章分类功能
    $("body").on("submit", "#formArtedit", function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("更新分类信息失败！")
                }
                layer.msg("更新分类信息成功！");
                layer.close(indexEdit);
                getArtCateList();
            }
        })
    })

    //实现删除功能
    $("tbody").on('click', ".btn-del", function() {
        //注意this问题 id要写在外面
        var id = $(this).attr('data-id');
        // console.log(id);
        //提示用户是否确认删除
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    };
                    layer.msg('删除文章分类成功！');
                    //关闭confirm 询问框
                    layer.close(index);
                    getArtCateList();
                }
            })
        });
    })
})