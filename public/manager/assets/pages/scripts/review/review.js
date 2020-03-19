/**
 * Created by Administrator on 2020/3/18.
 */
var reviewList = [];
if (App.isAngularJsApp() === false) {
    jQuery(document).ready(function() {
        ReviewTable.init();
        ReviewEdit.init();
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

var ReviewTable = function () {
    var initTable = function () {
        var table = $('#review_table');
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
                reviewDataGet(da, callback);
            },
            columns: [//返回的json数据在这里填充，注意一定要与上面的<th>数量对应，否则排版出现扭曲
                { "data": null},
                { "data": "channel"},
                { "data": "nickname"},
                { "data": "infotype" },
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
                    "targets":[5],
                    "render": function(data, type, row, meta) {
                        return dateTimeFormat(data);
                    }
                },{
                    "targets":[6],
                    "render": function(data, type, row, meta) {
                        return '<a href="javascript:;" id="op_preview">预览及审核</a>'
                    }
                }
            ],
            fnRowCallback: function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                $('td', nRow).attr('style', 'vertical-align: middle; padding-left: 20px');
                $('td:eq(0), td:eq(1), td:eq(5), td:eq(6)', nRow).attr('style', 'text-align: center; vertical-align: middle;');
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

function getReviewDataEnd(flg, result, callback){
    App.unblockUI('#lay-out');
    if(flg){
        if (result && result.retcode == SUCCESS) {
            var res = result.response;
            reviewList = res.reviewlist;
            tableDataSet(res.draw, res.totalcount, res.totalcount, res.reviewlist, callback);
        }else{
            tableDataSet(0, 0, 0, [], callback);
            alertDialog(result.retmsg);
        }
    }else{
        //TODO:测试数据
        reviewList = [{infoid:"1", channel:"0", nickname:"xx", infotype:"出租房屋", title:"1111", time:"20191010101010"}];
        tableDataSet(0, 0, 0, reviewList, callback);
        alertDialog("待审核信息获取失败！");
    }
}

$("#op_inquiry").on("click", function(){
    //用户查询
    ReviewTable.init();
});

var ReviewEdit = function() {
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
        $("#review_table").on('click', '#op_preview', function (e) {
            var host = window.location.protocol + "//" + window.location.host;
            var row = $(this).parents('tr')[0];     //通过获取该td所在的tr，即td的父级元素，取出第一列序号元素
            var infoid = $("#review_table").dataTable().fnGetData(row).infoid;
            var infotype = $("#review_table").dataTable().fnGetData(row).infotype;
            //TODO:根据infotype获取用哪个模板
            $("#preview").attr("src", host + "/preview/used?infoid=" + infoid);
            //设定初始值
            $("textarea",".register-form").val("");
            var exclude = [""];
            var info = {infoid: infoid};
            var options = { jsonValue: info, exclude:exclude, isDebug: false};
            $(".register-form").initForm(options);
            $('#review-detail').modal('show');
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
            ReviewTable.init();
            $('#review-detail').modal('hide');
        }
    }
    if(alert == "") alert = text + "信息审核" + res + "！";
    App.unblockUI('#lay-out');
    alertDialog(alert);
}