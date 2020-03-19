/**
 * Created by Administrator on 2019/2/28.
 */
//var cardHostUrl = regulateSucc.cardHostUrl;
var userHostUrl = regulateSucc.userHostUrl;
var loginUrl = regulateSucc.loginUrl;
var webUrl = regulateSucc.gramtuWebUrl;

//登录检查
function loginCheck(data){
    App.blockUI({target:'.login-container',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: loginUrl + "login",    //请求发送到TestServlet处
        data: sendMessageEdit(LOGIN, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("loginCheck:" + JSON.stringify(result));
            loginCheckEnd(true, result);

        },
        error: function (errorMsg) {
            console.info("loginCheck-error:" + JSON.stringify(errorMsg));
            loginCheckEnd(false, "");
        }
    });
}

//系统退出
function logoutCheck(data){
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: loginUrl + "logout",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("logoutCheck:" + JSON.stringify(result));
            logOutEnd(true, result);

        },
        error: function (errorMsg) {
            console.info("logoutCheck-error:" + JSON.stringify(errorMsg));
            logOutEnd(false, "");
        }
    });
}

//注册用户获取
function registerDataGet(data, callback){
    App.blockUI({target:'#lay_out',boxed:true});
    if(data == null){
        data = {nickname:"", phonenumber:"", usertype:"0", currentpage:"", pagesize: "", startindex: "0", draw: 1}
    }
    $.ajax({
        type:"post",
        contentType:"application/json",
        async:true,        //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url:userHostUrl + "register/query",  //请求发送到TestServlet处
        data:sendMessageEdit(DEFAULT, data),
        dataType:"json",      //返回数据形式为json
        success:function(result){
            console.info("registerDataGet:"+JSON.stringify(result));
            getRegisterDataEnd(true,result,callback);
        },
        error:function(errorMsg){
            console.info("registerDataGet-error:"+ JSON.stringify(errorMsg));
            getRegisterDataEnd(false,"",callback);
        }
    });
}

//注册用户发布的信息获取
function publishInfoDataGet(data, callback){
    App.blockUI({target:'#lay_out',boxed:true});
    $.ajax({
        type:"post",
        contentType:"application/json",
        async:true,        //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url:userHostUrl + "publish/query",  //请求发送到TestServlet处
        data:sendMessageEdit(DEFAULT, data),
        dataType:"json",      //返回数据形式为json
        success:function(result){
            console.info("publishInfoDataGet:"+JSON.stringify(result));
            getPublishInfoDataEnd(true,result, callback);
        },
        error:function(errorMsg){
            console.info("publishInfoDataGet-error:"+ JSON.stringify(errorMsg));
            getPublishInfoDataEnd(false,"", callback);
        }
    });
}

//获取分类列表
function typeDataGet(data,callback){
    App.blockUI({target: '#lay-out',boxed: true});
    if(data == null){
        data = {busitype: "0", typename:"", currentpage: "", pagesize: "", startindex: "0", draw: 1}
    }
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: userHostUrl + "type/query",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("typeDataGet:" + JSON.stringify(result));
            getTypeDataEnd(true, result, callback);
        },
        error: function (errorMsg) {
            console.info("typeDataGet-error:" + JSON.stringify(errorMsg));
            getTypeDataEnd(false, "", callback);
        }
    });
}

//分类新增
function typeAdd(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: userHostUrl + "type/add",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("typeAdd:" + JSON.stringify(result));
            typeInfoEditEnd(true, result, TYPEADD);
        },
        error: function (errorMsg) {
            console.info("typeAdd-error:" + JSON.stringify(errorMsg));
            typeInfoEditEnd(false, "", TYPEADD);
        }
    });
}

//分类编辑
function typeEdit(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: userHostUrl + "type/edit",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("typeEdit:" + JSON.stringify(result));
            typeInfoEditEnd(true, result, TYPEEDIT);
        },
        error: function (errorMsg) {
            console.info("typeEdit-error:" + JSON.stringify(errorMsg));
            typeInfoEditEnd(false, "", TYPEEDIT);
        }
    });
}
//分类删除
function typeDelete(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: userHostUrl + "type/delete",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("typeDelete:" + JSON.stringify(result));
            typeInfoEditEnd(true, result, TYPEDELETE);
        },
        error: function (errorMsg) {
            console.info("typeDelete-error:" + JSON.stringify(errorMsg));
            typeInfoEditEnd(false, "", TYPEDELETE);
        }
    });
}

//获取广告列表
function adDataGet(data,callback){
    App.blockUI({target: '#lay-out',boxed: true});
    if(data == null){
        data = {adname:"", currentpage: "", pagesize: "", startindex: "0", draw: 1}
    }
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: userHostUrl + "advert/query",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("adDataGet:" + JSON.stringify(result));
            getAdDataEnd(true, result, callback);
        },
        error: function (errorMsg) {
            console.info("adDataGet-error:" + JSON.stringify(errorMsg));
            getAdDataEnd(false, "", callback);
        }
    });
}

//广告新增
function adAdd(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: userHostUrl + "advert/add",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("adAdd:" + JSON.stringify(result));
            adInfoEditEnd(true, result, ADADD);
        },
        error: function (errorMsg) {
            console.info("adAdd-error:" + JSON.stringify(errorMsg));
            adInfoEditEnd(false, "", ADADD);
        }
    });
}

//广告编辑
function adEdit(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: userHostUrl + "advert/edit",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("adEdit:" + JSON.stringify(result));
            adInfoEditEnd(true, result, ADEDIT);
        },
        error: function (errorMsg) {
            console.info("adEdit-error:" + JSON.stringify(errorMsg));
            adInfoEditEnd(false, "", ADEDIT);
        }
    });
}
//广告删除
function adDelete(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: userHostUrl + "advert/delete",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("adDelete:" + JSON.stringify(result));
            adInfoEditEnd(true, result, ADDELETE);
        },
        error: function (errorMsg) {
            console.info("adDelete-error:" + JSON.stringify(errorMsg));
            adInfoEditEnd(false, "", ADDELETE);
        }
    });
}

//待审核信息获取
function reviewDataGet(data, callback){
    App.blockUI({target:'#lay_out',boxed:true});
    if(data == null){
        data = {nickname:"", channel:"", starttime:"", endtime:"", currentpage:"", pagesize: "", startindex: "0", draw: 1}
    }
    $.ajax({
        type:"post",
        contentType:"application/json",
        async:true,        //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url:userHostUrl + "review/query",  //请求发送到TestServlet处
        data:sendMessageEdit(DEFAULT, data),
        dataType:"json",      //返回数据形式为json
        success:function(result){
            console.info("reviewDataGet:"+JSON.stringify(result));
            getReviewDataEnd(true,result,callback);
        },
        error:function(errorMsg){
            console.info("reviewDataGet-error:"+ JSON.stringify(errorMsg));
            getReviewDataEnd(false,"",callback);
        }
    });
}

//信息审核
function infoReview(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: userHostUrl + "info/review",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("infoReview:" + JSON.stringify(result));
            infoReviewEnd(true, result, data);
        },
        error: function (errorMsg) {
            console.info("infoReview-error:" + JSON.stringify(errorMsg));
            infoReviewEnd(false, "", data);
        }
    });
}

//已发布信息获取
function releasedDataGet(data, callback){
    App.blockUI({target:'#lay_out',boxed:true});
    if(data == null){
        data = {nickname:"", channel:"", starttime:"", endtime:"", currentpage:"", pagesize: "", startindex: "0", draw: 1}
    }
    $.ajax({
        type:"post",
        contentType:"application/json",
        async:true,        //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url:userHostUrl + "released/query",  //请求发送到TestServlet处
        data:sendMessageEdit(DEFAULT, data),
        dataType:"json",      //返回数据形式为json
        success:function(result){
            console.info("releasedDataGet:"+JSON.stringify(result));
            getReleasedDataEnd(true,result,callback);
        },
        error:function(errorMsg){
            console.info("releasedDataGet-error:"+ JSON.stringify(errorMsg));
            getReleasedDataEnd(false,"",callback);
        }
    });
}

//设定为精选
function infoChoice(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: userHostUrl + "info/choice",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("infoChoice:" + JSON.stringify(result));
            infoChoiceEnd(true, result, data);
        },
        error: function (errorMsg) {
            console.info("infoChoice-error:" + JSON.stringify(errorMsg));
            infoChoiceEnd(false, "", data);
        }
    });
}


//精选信息获取
function choiceDataGet(data, callback){
    App.blockUI({target:'#lay_out',boxed:true});
    if(data == null){
        data = {nickname:"", channel:"", starttime:"", endtime:"", currentpage:"", pagesize: "", startindex: "0", draw: 1}
    }
    $.ajax({
        type:"post",
        contentType:"application/json",
        async:true,        //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url:userHostUrl + "choice/query",  //请求发送到TestServlet处
        data:sendMessageEdit(DEFAULT, data),
        dataType:"json",      //返回数据形式为json
        success:function(result){
            console.info("choiceDataGet:"+JSON.stringify(result));
            getChoiceDataEnd(true,result,callback);
        },
        error:function(errorMsg){
            console.info("choiceDataGet-error:"+ JSON.stringify(errorMsg));
            getChoiceDataEnd(false,"",callback);
        }
    });
}

//设定为置顶
function infoTop(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: userHostUrl + "info/top",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("infoTop:" + JSON.stringify(result));
            infoTopEnd(true, result, data);
        },
        error: function (errorMsg) {
            console.info("infoTop-error:" + JSON.stringify(errorMsg));
            infoTopEnd(false, "", data);
        }
    });
}