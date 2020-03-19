/**
 * Created by Administrator on 2020/3/18.
 */
var releasedList = [];
if (App.isAngularJsApp() === false) {
    jQuery(document).ready(function() {
        ReleasedTable.init();
        ReleasedEdit.init();
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

var ReleasedTable = function () {
    var initTable = function () {
        var table = $('#released_table');
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
                releasedDataGet(da, callback);
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
                        return '<a href="javascript:;" id="op_preview">预览及反审核</a>'
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

function getReleasedDataEnd(flg, result, callback){
    App.unblockUI('#lay-out');
    if(flg){
        if (result && result.retcode == SUCCESS) {
            var res = result.response;
            releasedList = res.releasedlist;
            tableDataSet(res.draw, res.totalcount, res.totalcount, res.releasedlist, callback);
        }else{
            tableDataSet(0, 0, 0, [], callback);
            alertDialog(result.retmsg);
        }
    }else{
        //TODO:测试数据
        releasedList = [{infoid:"1", channel:"0", nickname:"xx", infotype:"出租房屋", title:"1111", choice:"1", time:"20191010101010"}];
        tableDataSet(0, 0, 0, releasedList, callback);
        alertDialog("已发布信息获取失败！");
    }
}

$("#op_inquiry").on("click", function(){
    //用户查询
    ReleasedTable.init();
});

var ReleasedEdit = function() {
    var handleRegister = function() {
        var validator = $('.register-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                reviewcomment: {
                    required: true
                }
            },

            messages: {
                reviewcomment: {
                    required: "审核意见必须输入"
                }
            },

            invalidHandler: function(event, validator) { //display error alert on form submit

            },

            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function(error, element) {
                if (element.closest('.input-icon').size() === 1) {
                    error.insertAfter(element.closest('.input-icon'));
                } else {
                    error.insertAfter(element);
                }
            },

            submitHandler: function(form) {
                form.submit();
            }
        });

        $('#reject-btn, #adopt-btn').click(function() {
            btnDisable($(this));
            if ($('.register-form').validate().form()) {
                var status = $(this).data("status");
                var review = $('.register-form').getFormData();
                review.status = status;
                infoReview(review);
            }
        });

        //获取发布的信息
        $("#released_table").on('click', '#op_preview', function (e) {
            var host = window.location.protocol + "//" + window.location.host;
            var row = $(this).parents('tr')[0];     //通过获取该td所在的tr，即td的父级元素，取出第一列序号元素
            var infoid = $("#released_table").dataTable().fnGetData(row).infoid;
            var infotype = $("#released_table").dataTable().fnGetData(row).infotype;
            //TODO:根据infotype获取用哪个模板
            $("#preview").attr("src", host + "/preview/used?infoid=" + infoid);
            //设定初始值
            $("textarea",".register-form").val("");
            var exclude = [""];
            var info = {infoid: infoid};
            var options = { jsonValue: info, exclude:exclude, isDebug: false};
            $(".register-form").initForm(options);
            $('#released-detail').modal('show');
        });
    };

    return {
        init: function() {
            handleRegister();
        }
    };
}();

function infoReviewEnd(flg, result, data){
    var res = "失败";
    var text = "";
    var alert = "";
    if(flg){
        if(result && result.retcode != SUCCESS){
            alert = result.retmsg;
        }
        if (result && result.retcode == SUCCESS) {
            res = "成功";
            ReleasedTable.init();
            $('#released-detail').modal('hide');
        }
    }
    if(alert == "") alert = text + "信息审核" + res + "！";
    App.unblockUI('#lay-out');
    alertDialog(alert);
}


var ReleasedChoice = function() {
    $('#op_choice').click(function() {
        var len = $(".checkboxes:checked").length;
        if(len < 1){
            alertDialog("至少选中一项！");
        }else{
            var para = "1";
            confirmDialog("您确定要设定选中信息为精选吗？", ReleasedChoice.choiceInfo, para)
        }
    });
    $('#op_unchoice').click(function() {
        var len = $(".checkboxes:checked").length;
        if(len < 1){
            alertDialog("至少选中一项！");
        }else{
            var para = "0";
            confirmDialog("您确定要取消选中信息为精选吗？", ReleasedChoice.choiceInfo, para)
        }
    });
    return{
        choiceInfo: function(para){
            var infolist = {choice: para, infoidlist:[]};
            $(".checkboxes:checked").parents("td").each(function () {
                var row = $(this).parents('tr')[0];     //通过获取该td所在的tr，即td的父级元素，取出第一列序号元素
                var infoid = $("#released_table").dataTable().fnGetData(row).infoid;
                infolist.infoidlist.push(infoid);
            });
            infoChoice(infolist);
        }
    }
}();

function infoChoiceEnd(flg, result, data){
    var res = "失败";
    var text = "信息设为精选";
    var alert = "";
    if(data.choice == "0"){
        text = "信息取消精选";
    }
    if(flg){
        if(result && result.retcode != SUCCESS){
            alert = result.retmsg;
        }
        if (result && result.retcode == SUCCESS) {
            res = "成功";
            ReleasedTable.init();
        }
    }
    if(alert == "") alert = text + res + "！";
    App.unblockUI('#lay-out');
    alertDialog(alert);
}