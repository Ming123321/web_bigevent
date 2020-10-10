$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    //定义美化时间的过滤器
    template.defaults.imports.dateFormat = function(date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var h = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var s = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + '  ' + h + ':' + mm + ':' + s;
    };
    //定义补0函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    //定义一个查询的参数对象，在请求数据的时候将
    //这个参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值 默认请求第一页数据
        pagesize: 2, //每页默认显示几条数据,默认显示2条
        cate_id: '', //文章分类的id
        state: '', //文章的发布状态
    }

    getArtList();
    //获取文章的列表数据
    function getArtList() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败！")
                }
                // console.log(res);
                var htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);
                //调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }

    initArtCate();
    //初始化文章分类方法
    function initArtCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("初始化文章分类失败！");
                }
                // console.log(res);
                //调用模板引擎渲染分类的可选项
                var htmlStr = template("tpl-select", res);
                $('[name=cate_id]').html(htmlStr);
                //通过 layui 重新渲染表单区域的ui 结构
                form.render();
            }
        })
    }

    //实现筛选功能
    $("#form_filter").on("submit", function(e) {
        e.preventDefault();
        //获取表单中的值
        var cate_id = $("[name=cate_id]").val();
        var state = $("[name=state]").val();
        //为查询对象q赋值
        q.cate_id = cate_id;
        q.state = state;
        //重新渲染表格数据
        getArtList();
    })

    //定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render 来渲染分页数据
        laypage.render({
            elem: "pageBox", //存放分页的容器
            count: total, //分页数据的总数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //默认的起始页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],

            //当分页被切换时触发 jump函数
            jump: function(obj, first) {
                //console.log(first);
                //console.log(obj.curr); //得到当前页 
                q.pagenum = obj.curr; //将最新的页码值赋值给q 查询对象
                // getArtList();
                //把最新的条目数 赋值给 q这个查询对象
                q.pagesize = obj.limit;
                // 通过此函数传入的第二个参数解决 jump回调死循环问题
                if (!first) {
                    getArtList();
                }
            }
        })
    }

    //通过事件委托实现文章删除功能
    $("tbody").on("click", ".btn-del", function() {
        //获取删除按钮的个数
        var len = $(".btn-del").length;
        var id = $(this).attr('data-id');
        // console.log(id);
        //提示用户是否确认删除
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    };
                    layer.msg('删除文章分类成功！');
                    //关闭confirm 询问框
                    layer.close(index);

                    //当数据删除完成后,需要哦按段当前这一页中 是否还有剩余数据
                    if (len === 1) {
                        //此时删除完成后 页面上就没有任何数据了
                        //页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    getArtList();
                }
            })
        });
    })

    //编辑功能
    $("tbody").on('click', ".addEdit", function() {
        //点击编辑按钮时 跳转到发表文章页面
        location.href = '/article/art_edit.html?id=' + $(this).attr('data-id');
    })

})