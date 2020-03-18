/**
 * Created by Administrator on 2020/3/18.
 */
var typeList = [];
if (App.isAngularJsApp() === false) {
    jQuery(document).ready(function() {
        TypeTable.init();
        TypeEdit.init();
    });
}

var TypeTable = function () {
    var initTable = function () {
        var table = $('#type_table');
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
                    busitype: busiType,
                    typename: formData.typename,
                    currentpage: (data.start / data.length) + 1,
                    pagesize: data.length == -1 ? "": data.length,
                    startindex: data.start,
                    draw: data.draw
                };
                typeDataGet(da, callback);
            },
            columns: [//返回的json数据在这里填充，注意一定要与上面的<th>数量对应，否则排版出现扭曲
                { "data": null},
                { "data": null},
                { "data": "typename" },
                { "data": "sort" },
                { "data": "time" },
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
                        return dateTimeFormat(data);
                    }
                },{
                    "targets":[5],
                    "render": function(data, type, row, meta) {
                        if(!makeEdit(menu,loginSucc.functionlist,"#op_edit")) return '-';
                        return '<a href="javascript:;" id="op_edit">编辑</a>'
                    }
                }
            ],
            fnRowCallback: function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                $('td:eq(0),td:eq(1),td:eq(4),td:eq(5)', nRow).attr('style', 'text-align: center;');
                $('td:eq(3)', nRow).attr('style', 'text-align: right;');
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

var TypeEdit = function() {
    var handleRegister = function() {
        var validator = $('.register-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                typename: {
                    required: true
                },
                sort: {
                    required: true,
                    digits: true
                }
            },

            messages: {
                typename: {
                    required: "分类名必须输入"
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
        $('#register-btn').click(function() {
            btnDisable($('#register-btn'));
            if ($('.register-form').validate().form()) {
                var type = $('.register-form').getFormData();
                type.busitype = busiType;
                if($("input[name=edittype]").val() == TYPEADD){
                    typeAdd(type);
                }else{
                    typeEdit(type);
                }
            }
        });
        //新增分类
        $('#op_add').click(function() {
            validator.resetForm();
            $(".register-form").find(".has-error").removeClass("has-error");
            $(".modal-title").text("新增分类");
            $(":input",".register-form").not(":button,:reset,:submit,:radio").val("")
                .removeAttr("checked")
                .removeAttr("selected");
            //分类代码可以输入
            $("input[name=edittype]").val(TYPEADD);
            $('#edit_type').modal('show');
        });
        //编辑分类
        $("#type_table").on('click', '#op_edit', function (e) {
            e.preventDefault();
            validator.resetForm();
            $(".register-form").find(".has-error").removeClass("has-error");
            $(".modal-title").text("编辑分类");
            var exclude = [""];
            var row = $(this).parents('tr')[0];     //通过获取该td所在的tr，即td的父级元素，取出第一列序号元素
            var typeid = $("#type_table").dataTable().fnGetData(row).typeid;
            var type = new Object();
            for(var i=0; i < typeList.length; i++){
                if(typeid == typeList[i].typeid){
                    type = typeList[i];
                }
            }
            var options = { jsonValue: type, exclude:exclude, isDebug: false};
            $(".register-form").initForm(options);
            $("input[name=edittype]").val(TYPEEDIT);
            $('#edit_type').modal('show');
        });
    };

    return {
        init: function() {
            handleRegister();
        }
    };
}();

var TypeDelete = function() {
    $('#op_del').click(function() {
        var len = $(".checkboxes:checked").length;
        if(len < 1){
            alertDialog("至少选中一项！");
        }else{
            var para = 1;
            confirmDialog("数据删除后将不可恢复，您确定要删除吗？", TypeDelete.deleteType, para)
        }
    });
    return{
        deleteType: function(){
            var typelist = {busitype: busiType, typeidlist:[]};
            $(".checkboxes:checked").parents("td").each(function () {
                var row = $(this).parents('tr')[0];     //通过获取该td所在的tr，即td的父级元素，取出第一列序号元素
                var typeid = $("#type_table").dataTable().fnGetData(row).typeid;
                typelist.typeidlist.push(typeid);
            });
            typeDelete(typelist);
        }
    }
}();

function getTypeDataEnd(flg, result, callback){
    App.unblockUI('#lay-out');
    if(flg){
        if (result && result.retcode == SUCCESS) {
            var res = result.response;
            typeList = res.typelist;
            tableDataSet(res.draw, res.totalcount, res.totalcount, res.typelist, callback);
        }else{
            tableDataSet(0, 0, 0, [], callback);
            alertDialog(result.retmsg);
        }
    }else{
        //TODO 测试
        /*typeList = [
            {typeid:"1",time:"20191220111111", typename:"test1", sort:1},
            {typeid:"2",time:"20191220111111", typename:"test2", sort:2}
        ];*/
        tableDataSet(0, 0, 0, typeList, callback);
        alertDialog("分类信息获取失败！");
    }
}

function typeInfoEditEnd(flg, result, type){
    var res = "失败";
    var text = "";
    var alert = "";
    switch (type){
        case TYPEADD:
            text = "新增";
            break;
        case TYPEEDIT:
            text = "编辑";
            break;
        case TYPEDELETE:
            text = "删除";
            break;
    }
    if(flg){
        if(result && result.retcode != SUCCESS){
            alert = result.retmsg;
        }
        if (result && result.retcode == SUCCESS) {
            res = "成功";
            TypeTable.init();
            $('#edit_type').modal('hide');
        }
    }
    if(alert == "") alert = text + "分类" + res + "！";
    App.unblockUI('#lay-out');
    alertDialog(alert);
}

$("#op_inquiry").on("click", function(){
    //用户查询
    TypeTable.init();
});