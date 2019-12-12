/**
 * Created by Administrator on 2019/12/04.
 */
var artList = [];
if (App.isAngularJsApp() === false) {
    jQuery(document).ready(function() {
        ArtTable.init();
    });
}

var ArtTable = function () {
    var initTable = function () {
        var table = $('#art_table');
        pageLengthInit(table);
        table.dataTable({
            "language": TableLanguage,
            "bStateSave": false, // save datatable state(pagination, sort, etc) in cookie.
            "lengthMenu": TableLengthMenu,
            "destroy": true,
            "pageLength": PageLength,
            "serverSide": true,
            "pagingType": "bootstrap_extended",
            "processing": true,
            "searching": false,
            "ordering": false,
            "autoWidth": false,
            "ajax":function (data, callback, settings) {
                var formData = $(".inquiry-form").getFormData();
                var da = {
                    title: formData.title,
                    currentpage: (data.start / data.length) + 1,
                    pagesize: data.length == -1 ? "": data.length,
                    startindex: data.start,
                    draw: data.draw
                };
                artDataGet(da, callback);
            },
            columns: [//返回的json数据在这里填充，注意一定要与上面的<th>数量对应，否则排版出现扭曲
                { "data": null},
                { "data": null},
                { "data": "artid", visible: false },
                { "data": "title" },
                { "data": "artcover" },
                { "data": "time" },
                { "data": "editor" },
                { "data": null }
            ],
            columnDefs: [
                {
                    "targets":[1],
                    "render":function(data, type, row, meta){
                        return '<input type="checkbox" class="checkboxes" value="1" />';
                    }
                },
                {
                    "targets": [0],
                    "data": null,
                    "render": function (data, type, row, meta) {
                        return meta.settings._iDisplayStart + meta.row + 1;  //行号
                    }
                },
                {
                    "targets":[4],
                    "render": function(data, type, row, meta) {
                        return "<img src='" + data + "' style='width: 100px; height:100px'>";
                    }
                },
                {
                    "targets":[5],
                    "render": function(data, type, row, meta) {
                        return dateTimeFormat(data);
                    }
                },{
                    "targets":[7],
                    "render": function(data, type, row, meta) {
                        return '<a href="javascript:;" id="op_edit">文章内容</a>'
                    }
                }
            ],
            fnRowCallback: function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                $('td:eq(1)', nRow).attr('style', 'text-align: center;');
            }
        });
        table.find('.group-checkable').change(function () {
            var set = jQuery(this).attr("data-set");
            var checked = jQuery(this).is(":checked");
            jQuery(set).each(function () {
                if (checked) {
                    $(this).prop("checked", true);
                    $(this).parents('tr').addClass("active");
                } else {
                    $(this).prop("checked", false);
                    $(this).parents('tr').removeClass("active");
                }
            });
        });

        table.on('change', 'tbody tr .checkboxes', function () {
            $(this).parents('tr').toggleClass("active");
        });


    };
    return {
        init: function (data) {
            if (!jQuery().dataTable) {
                return;
            }
            initTable(data);
        }
    };
}();

var ArtDelete = function() {
    $('#op_del').click(function() {
        var len = $(".checkboxes:checked").length;
        if(len < 1){
            alertDialog("至少选中一项！");
        }else{
            var para = 1;
            confirmDialog("数据删除后将不可恢复，您确定要删除吗？", ArtDelete.deleteArt, para)
        }
    });
    return{
        deleteArt: function(){
            var artlist = {artidlist:[]};
            $(".checkboxes:checked").parents("td").each(function () {
                var row = $(this).parents('tr')[0];     //通过获取该td所在的tr，即td的父级元素，取出第一列序号元素
                var artid = $("#art_table").dataTable().fnGetData(row).artid;
                artlist.artidlist.push(artid);
            });
            artDelete(artlist);
        }
    }
}();

function getArtDataEnd(flg, result, callback){
    App.unblockUI('#lay-out');
    if(flg){
        if (result && result.retcode == SUCCESS) {
            var res = result.response;
            artList = res.artlist;
            tableDataSet(res.draw, res.totalcount, res.totalcount, res.artlist, callback);
        }else{
            tableDataSet(0, 0, 0, [], callback);
            alertDialog(result.retmsg);
        }
    }else{
        tableDataSet(0, 0, 0, [], callback);
        alertDialog("文章获取失败！");
    }
}

function artInfoEditEnd(flg, result, type){
    var res = "失败";
    var text = "";
    var alert = "";
    switch (type){
        case ARTDELETE:
            text = "删除";
            break;
    }
    if(flg){
        if(result && result.retcode != SUCCESS){
            alert = result.retmsg;
        }
        if (result && result.retcode == SUCCESS) {
            res = "成功";
            ArtTable.init();
            $('#edit_art').modal('hide');
        }
    }
    if(alert == "") alert = text + "文章" + res + "！";
    App.unblockUI('#lay-out');
    alertDialog(alert);
}

$("#art_inquiry").on("click", function(){
    //用户查询
    ArtTable.init();
});

$("#art_table").on('click', '#op_edit', function (e) {
    e.preventDefault();
    var row = $(this).parents('tr')[0];     //通过获取该td所在的tr，即td的父级元素，取出第一列序号元素
    var artid = $("#art_table").dataTable().fnGetData(row).artid;
    var art = new Object();
    for(var i=0; i < artList.length; i++){
        if(artid == artList[i].artid){
            art = artList[i];
        }
    }
    $("#content").html(art.content);
});