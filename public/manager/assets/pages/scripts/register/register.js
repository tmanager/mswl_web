/**
 * Created by Administrator on 2020/3/18.
 */
var registerList = [];
if (App.isAngularJsApp() === false) {
    jQuery(document).ready(function() {
        RegisterTable.init();
    });
}

var RegisterTable = function () {
    var initTable = function () {
        var table = $('#register_table');
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
                    nickname: formData.nickname,
                    phonenumber: formData.phonenumber,
                    channel: formData.channel,
                    currentpage: (data.start / data.length) + 1,
                    pagesize: data.length == -1 ? "": data.length,
                    startindex: data.start,
                    draw: data.draw
                };
                registerDataGet(da, callback);
            },
            columns: [//返回的json数据在这里填充，注意一定要与上面的<th>数量对应，否则排版出现扭曲
                { "data": null},
                { "data": "channel"},
                { "data": "nickname"},
                { "data": "avatarurl" },
                { "data": "phonenumber" },
                { "data": "time" },
                { "data": null }
            ],
            columnDefs: [
                {
                    "targets": [0],
                    "data": null,
                    "render": function (data, type, row, meta) {
                        return meta.settings._iDisplayStart + meta.row + 1;  //行号
                    }
                },{
                    "targets":[1],
                    "render": function(data, type, row, meta) {
                        var channel = "";
                        switch (data) {
                            case "0":
                                channel = "微信";
                                break;
                            case "1":
                                channel = "支付宝";
                                break;
                        }
                        return channel;
                    }
                },
                {
                    "targets":[3],
                    "render": function(data, type, row, meta) {
                        return "<img src='" + data + "' style='width: 50px; height:50px'>";
                    }
                },
                {
                    "targets":[5],
                    "render": function(data, type, row, meta) {
                        return dateTimeFormat(data);
                    }
                },{
                    "targets":[6],
                    "render": function(data, type, row, meta) {
                        return '<a href="javascript:;" id="op_info">发布信息列表</a>'
                    }
                }
            ],
            fnRowCallback: function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                $('td', nRow).attr('style', 'vertical-align: middle; padding-left: 20px');
                $('td:eq(0), td:eq(1), td:eq(2), td:eq(3), td:eq(5), td:eq(6)', nRow).attr('style', 'text-align: center; vertical-align: middle;');
            }
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

function getRegisterDataEnd(flg, result, callback){
    App.unblockUI('#lay-out');
    if(flg){
        if (result && result.retcode == SUCCESS) {
            var res = result.response;
            registerList = res.registerlist;
            tableDataSet(res.draw, res.totalcount, res.totalcount, res.registerlist, callback);
        }else{
            tableDataSet(0, 0, 0, [], callback);
            alertDialog(result.retmsg);
        }
    }else{
        //TODO:测试数据
        registerList = [{id:"1", channel:"0", nickname:"xx", avatarurl:"", phonenumber:"1111", enterprise:"", time:"20191010101010"}];
        tableDataSet(0, 0, 0, registerList, callback);
        alertDialog("注册用户信息获取失败！");
    }
}

$("#register_inquiry").on("click", function(){
    //用户查询
    RegisterTable.init();
});

//获取发布的信息
$("#register_table").on('click', '#op_info', function (e) {
    var row = $(this).parents('tr')[0];     //通过获取该td所在的tr，即td的父级元素，取出第一列序号元素
    var id = $("#register_table").dataTable().fnGetData(row).id;
    //获取发布的信息
    InfoTable.init(id);
});

var InfoTable = function () {
    var initTable = function (id) {
        var table = $('#info_table');
        pageLengthInit(table);
        table.dataTable({
            "language": TableLanguage,
            "bStateSave": false, // save datatable state(pagination, sort, etc) in cookie.
            "lengthMenu": TableLengthMenu,
            "destroy": true,
            "pageLength": 10,
            "serverSide": true,
            "pagingType": "bootstrap_extended",
            "processing": true,
            "searching": false,
            "ordering": false,
            "autoWidth": false,
            "ajax":function (data, callback, settings) {
                var da = {
                    id: id,
                    usertype: userType,
                    currentpage: (data.start / data.length) + 1,
                    pagesize: data.length == -1 ? "": data.length,
                    startindex: data.start,
                    draw: data.draw
                };
                publishInfoDataGet(da, callback);
            },
            columns: [//返回的json数据在这里填充，注意一定要与上面的<th>数量对应，否则排版出现扭曲
                { "data": null},
                { "data": "infotype"},
                { "data": "title" },
                { "data": "time" },
                { "data": null }
            ],
            columnDefs: [
                {
                    "targets": [0],
                    "data": null,
                    "render": function (data, type, row, meta) {
                        return meta.settings._iDisplayStart + meta.row + 1;  //行号
                    }
                },
                {
                    "targets":[3],
                    "render": function(data, type, row, meta) {
                        return dateTimeFormat(data);
                    }
                },{
                    "targets":[4],
                    "render": function(data, type, row, meta) {
                        return '<a href="javascript:;" id="op_preview">预览</a>'
                    }
                }
            ],
            fnRowCallback: function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                $('td:eq(1)', nRow).attr('style', 'text-align: center;');
            }
        });
    };
    return {
        init: function (id) {
            if (!jQuery().dataTable) {
                return;
            }
            initTable(id);
        }
    };
}();

function getPublishInfoDataEnd(flg, result, callback){
    App.unblockUI('#lay-out');
    if(flg){
        if (result && result.retcode == SUCCESS) {
            var res = result.response;
            infoList = res.infolist;
            tableDataSet(res.draw, res.totalcount, res.totalcount, res.infolist, callback);
        }else{
            tableDataSet(0, 0, 0, [], callback);
            alertDialog(result.retmsg);
        }
    }else{
        tableDataSet(0, 0, 0, [], callback);
        alertDialog("发布的信息获取失败！");
    }
}

//获取发布的信息
$("#info_table").on('click', '#op_preview', function (e) {
    var host = window.location.protocol + "//" + window.location.host;
    var row = $(this).parents('tr')[0];     //通过获取该td所在的tr，即td的父级元素，取出第一列序号元素
    var infoid = $("#info_table").dataTable().fnGetData(row).infoid;
    var infotype = $("#info_table").dataTable().fnGetData(row).infotype;
    //TODO:根据infotype获取用哪个模板
    window.open(host + "/preview/used?infoid=" + infoid);
});