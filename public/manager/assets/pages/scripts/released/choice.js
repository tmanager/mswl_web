/**
 * Created by Administrator on 2020/3/18.
 */
var choiceList = [];
if (App.isAngularJsApp() === false) {
    jQuery(document).ready(function() {
        ChoiceTable.init();
        ChoiceEdit.init();
    });
}

//时间选择控件初始化
$("#starttime").datetimepicker({
    format: 'yyyy-mm-dd hh:ii',
    language:'zh-CN',
    todayBtn: 'linked',
    todayHighlight:true, //高亮‘今天’
    //clearBtn:true,   //清除按钮
    autoclose: true,//选中之后自动隐藏日期选择框
    endDate : new Date()
}).on('changeDate',function(e){

});

$("#endtime").datetimepicker({
    format: 'yyyy-mm-dd hh:ii',
    language:'zh-CN',
    todayBtn: 'linked',
    autoclose: true,//选中之后自动隐藏日期选择框
    todayHighlight:true, //高亮‘今天’
    //clearBtn:true,   //清除按钮
    endDate : new Date()
}).on('changeDate',function(e){

});

const dateOptions = {
    language: 'zh-CN',
    format: 'yyyy-mm-dd HH:ii',
    minuteStep: 1,
    autoclose: true
};

$('#starttime').datetimepicker(dateOptions).on('show', function () {
    const endTime = $('#endtime').val();
    if (endTime !== '') {
        $(this).datetimepicker('setEndDate', endTime);
    } else {
        $(this).datetimepicker('setEndDate', null);
    }
});

$('#endtime').datetimepicker(dateOptions).on('show', function () {
    const startTime = $('#starttime').val();
    if (startTime !== '') {
        $(this).datetimepicker('setStartDate', startTime);
    } else {
        $(this).datetimepicker('setStartDate', null);
    }
});

var ChoiceTable = function () {
    var initTable = function () {
        var table = $('#choice_table');
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
                    starttime: formData.starttime.replace(/-|:| /g, ""),
                    endtime: formData.endtime.replace(/-|:| /g, ""),
                    nickname: formData.nickname,
                    channel: formData.channel,
                    currentpage: (data.start / data.length) + 1,
                    pagesize: data.length == -1 ? "": data.length,
                    startindex: data.start,
                    draw: data.draw
                };
                choiceDataGet(da, callback);
            },
            columns: [//返回的json数据在这里填充，注意一定要与上面的<th>数量对应，否则排版出现扭曲
                { "data": null},
                { "data": null},
                { "data": "channel"},
                { "data": "nickname"},
                { "data": "infotype" },
                { "data": "title" },
                { "data": "choice" },
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
                    "render":function(data, type, row, meta){
                        return '<input type="checkbox" class="checkboxes" value="1" />';
                    }
                },{
                    "targets":[2],
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
                },{
                    "targets":[6],
                    "render": function(data, type, row, meta) {
                        var choice = "";
                        switch (data) {
                            case "0":
                                choice = "否";
                                break;
                            case "1":
                                choice = "是";
                                break;
                        }
                        return choice;
                    }
                },{
                    "targets":[7],
                    "render": function(data, type, row, meta) {
                        return dateTimeFormat(data);
                    }
                },{
                    "targets":[8],
                    "render": function(data, type, row, meta) {
                        return '<a href="javascript:;" id="op_preview">预览</a>'
                    }
                }
            ],
            fnRowCallback: function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                $('td', nRow).attr('style', 'vertical-align: middle; padding-left: 20px');
                $('td:eq(0), td:eq(1), td:eq(2), td:eq(6), td:eq(7), td:eq(8)', nRow).attr('style', 'text-align: center; vertical-align: middle;');
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

function getChoiceDataEnd(flg, result, callback){
    App.unblockUI('#lay-out');
    if(flg){
        if (result && result.retcode == SUCCESS) {
            var res = result.response;
            choiceList = res.choicelist;
            tableDataSet(res.draw, res.totalcount, res.totalcount, res.choicelist, callback);
        }else{
            tableDataSet(0, 0, 0, [], callback);
            alertDialog(result.retmsg);
        }
    }else{
        //TODO:测试数据
        choiceList = [{infoid:"1", channel:"0", nickname:"xx", infotype:"出租房屋", title:"1111", choice:"1", time:"20191010101010"}];
        tableDataSet(0, 0, 0, choiceList, callback);
        alertDialog("精选信息获取失败！");
    }
}

$("#op_inquiry").on("click", function(){
    //用户查询
    ChoiceTable.init();
});

//获取发布的信息
$("#choice_table").on('click', '#op_preview', function (e) {
    var host = window.location.protocol + "//" + window.location.host;
    var row = $(this).parents('tr')[0];     //通过获取该td所在的tr，即td的父级元素，取出第一列序号元素
    var infoid = $("#choice_table").dataTable().fnGetData(row).infoid;
    var infotype = $("#choice_table").dataTable().fnGetData(row).infotype;
    //TODO:根据infotype获取用哪个模板
    $("#preview").attr("src", host + "/preview/used?infoid=" + infoid);
    $('#choice-detail').modal('show');
});

var ChoiceTop = function() {
    $('#op_top').click(function() {
        var len = $(".checkboxes:checked").length;
        if(len < 1){
            alertDialog("至少选中一项！");
        }else if(len > 3){
            alertDialog("至多选中三项！");
        }else{
            var para = "1";
            confirmDialog("您确定要设定选中信息置顶吗？", ChoiceTop.topInfo, para)
        }
    });
    $('#op_untop').click(function() {
        var len = $(".checkboxes:checked").length;
        if(len < 1){
            alertDialog("至少选中一项！");
        }else{
            var para = "0";
            confirmDialog("您确定要取消选中信息置顶吗？", ChoiceTop.topInfo, para)
        }
    });
    return{
        topInfo: function(para){
            var infolist = {top: para, infoidlist:[]};
            $(".checkboxes:checked").parents("td").each(function () {
                var row = $(this).parents('tr')[0];     //通过获取该td所在的tr，即td的父级元素，取出第一列序号元素
                var infoid = $("#choice_table").dataTable().fnGetData(row).infoid;
                infolist.infoidlist.push(infoid);
            });
            infoTop(infolist);
        }
    }
}();

function infoTopEnd(flg, result, data){
    var res = "失败";
    var text = "信息设为置顶";
    var alert = "";
    if(data.top == "0"){
        text = "信息取消置顶";
    }
    if(flg){
        if(result && result.retcode != SUCCESS){
            alert = result.retmsg;
        }
        if (result && result.retcode == SUCCESS) {
            res = "成功";
            ChoiceTable.init();
        }
    }
    if(alert == "") alert = text + res + "！";
    App.unblockUI('#lay-out');
    alertDialog(alert);
}