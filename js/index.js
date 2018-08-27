//判断是否正确手机号码
var IsCorrectMobile = function (mobile) {
    var reg = new RegExp(/^(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9]|19[0-9]|166)[0-9]{8}$/);

    return reg.test(mobile);
}

// 姓名,中文，英文；2到20位
function IsCorrectName(temp) {
	var NameRegPatten = /^[ ]*([(\u4e00-\u9fa5)A-Za-z0-9]{1,20})[ ]*$/;
    var regExp = NameRegPatten;
    return regExp.test(temp);
}

//是否正确验证码
function IsCorrectCode(code) {
	var CaptchaRegPatten = /^[ ]*\d+[ ]*$/;
    var reqExp = new RegExp(CaptchaRegPatten);
    return reqExp.test(code);
}

//提示信息方法  例如
//例:tipsMsg('通过style设置你想要的样式', function () {console.log(1)})
function tipsMsg(contentStr, callbackFn, styleStr) {
    layer.open({
        content: contentStr,
        style: styleStr || 'background-color:rgba(0,0,0,.7); color:#fff; border:none;width: 70%;font-size: 0.64rem;', //自定风格
        time: 2,
        shade: false,
        end: callbackFn,
    });
}

//发送验证码按钮倒计时
function Counttime(el, time) {
    var _this = this;
    this.el = el;
    this.time = time || 60;
    this.timer = null;
    this.open = function (timer) {
        if (this.time == 0) {
            this.el.removeAttribute("disabled");
            this.el.classList.remove('forbid');
            this.el.value = "发送验证码";
            this.time = 60;
            return;
        } else {
            this.el.setAttribute("disabled", true);
            this.el.value = this.time + 's后重新发送';
            this.el.classList.add('forbid');
            this.time--;
        }
        this.timer = setTimeout(function () {
            _this.open(this.el);
        }, 1000);
    };
    this.close = function () {
        window.clearInterval(this.timer);
        this.el.removeAttribute("disabled");
        this.el.classList.remove('forbid');
        this.el.value = "发送验证码";
        this.time = 60;
    }
    return _this;
}

//移动端点击去掉那300ms延迟
//FastClick.attach(document.body);
//图标懒加载
function loadLazyImg(container) {

    var con = $("body");
    if (!!container) {
        if (typeof container == "string")
            con = $("#" + container);
        else
            con = container;
    }
    var lazyImg = new lazyload({
        wrapper: con[0],
        selector: '.lazy',
        imgSrc: 'data-original',
        defaultSrc: ''
    });
}
setTimeout(function () {
    loadLazyImg();
},100)

//loading
function loading(){
	layer.open({
        type: 2,
        content: '加载中',
        shade:true
    });
}


/*---------------------------------简单的节流函数-------------------------------*/
/**
 * @param: fun     必选 [function]  要执行的函数
 * @param: delay   必选 [number]    延迟(例如scroll事件，假设delay=500,scroll停止了,0.5s后会执行一次fun)
 * @param: time    必选 [number]    在time时间内必须执行一次fun
 */
function throttle(fun, delay, time) {
    var timeout,
        startTime = new Date();
    return function (ev) {
        var context = this,
            args = arguments,//直接ev也可以的
            curTime = new Date();
        clearTimeout(timeout);
        // 如果达到了规定的触发时间间隔，触发 handler
        if (curTime - startTime >= time) {
            fun.apply(context, args);
            startTime = curTime;
            // 没达到触发间隔，重新设定定时器
        } else {
            //每滚动一次会清上次的定时器，和启动本次定时器
            //这里相当于实现了滚动到停止的时候，也会执行一次fun方法
            timeout = setTimeout(fun, delay);
        }
    };
};

//添加下滑动效
function loadFn(){
	var els = [].slice.call(document.getElementsByClassName('fn_fadeInUp'));
	var scrollTopH = $(window).scrollTop();
	var vh = document.documentElement.clientHeight;
	els.forEach(function(ele,index){
		if($(ele).offset().top< scrollTopH + vh && !$(ele).hasClass('fadeInUp')){
			$(ele).addClass('fadeInUp');
			setTimeout(function(){
				$(ele).find('p,h4').css('visibility','visible');
			},800);
		}
	});
	/*if(els.length == $('.fadeInUp').length){
		$(window).unbind('scroll',loadFn);
	}*/
	var bannerFormDis = $('.banner .form_recommend').offset().top + $('.banner .form_recommend')[0].offsetHeight
	if(scrollTopH >= bannerFormDis){
		$(".cousltBtn").show();
	}else{
		$(".cousltBtn").hide()
	}
}
//$(window).on('scroll',loadFn);
$(window).on('scroll',throttle(loadFn,10,1000));

//避免移动端绝对定位问题的影响
/*$('input[type="text"],input[type="number"]').focus(function(){
	$('.fix_bottom ').hide();
});
$('input[type="text"],input[type="number"]').blur(function(){
	$('.fix_bottom ').show();
});*/

$('.meterial_title>div').click(function(){
	var index = $(this).index();
	$(this).addClass('active').siblings().removeClass('active');
	$('.meterial_con').css('transform','translateX(-'+ index*50 +'%)')
})

//滚动到表单
$('.cousltBtn,.top .kf').on('click',function(){
	//  100/320 这个相当于是比例，无论哪个屏幕尺寸都是这个比例 
	$('html,body')
	.stop()
	.animate({scrollTop:$('.banner .form_recommend').offset().top - 100/320* $('.banner .form_recommend').offset().top},500,function(){
		if (timer_form) {
			clearInterval(timer_form)
		}
		timer_form = setInterval(function(){
			$('.form_recommend').eq(0).toggleClass('active');
		},300)
	});
})

var timer_form = null;

$('.form_recommend').eq(0).click(function(){
	clearInterval(timer_form)
	$(this).removeClass('active');
})


//删除文字相关
$('input[type="text"],input[type="number"]').focus(function(){
	$(this).siblings('span.iconfont').show();
})
$('input[type="text"],input[type="number"]').blur(function(){
	$(this).siblings('span.iconfont').fadeOut(100);
})
$('span.iconfont').click(function(){
	$(this).siblings('input[type="text"],input[type="number"]').val('');
})

//关闭提交成功按钮
$('.icon-guanbi2').on('click',function(){
	$('.success_tips').hide();
})

$('#select_bussType,#bottom_select_bussType').click(function(){
	var _this = this;
	weui.picker([
	/*{
	    label: '男',
	    value: 0,
	    //disabled: true // 不可用
	}*/
	{
	    label: '美国发明专利全风险代理申请（巴黎公约途径）',
	    value: 0
	},
	{
	    label: '日本发明专利全风险代理申请（巴黎公约途径）',
	}
	], {
	   className: 'custom-classname',
	   container: 'body',
	   defaultValue: [0],
	   onChange: function (result) {
	       //console.log(result)
	   },
	   onConfirm: function (result) {
	       $(_this).find('input').val(result[0].label);
	   },
	   id: _this.id //用来识别选择器
	});
})


/*var businessMatch = {
	'普通注册':0,
	'双享注册':1,
	'设计商标注册':2,
	'图形商标设计注册':3
}*/

//表单1
var count_recommend = new Counttime($('.identi_code_first')[0]);
$('.identi_code_first').on('click',function(){
	if(!IsCorrectMobile($('#mobile_recommend').val())){
		tipsMsg('请输入正确的手机号码');
		return false;
	}
	loading();
	$.ajax({
        url: domain + "/request/campaignsendvcode",
        type:"post",
        cache: false,
        dataType: "json",
        data: {'mobile':$('#mobile_recommend').val()},  
        //crossDomain:true,
        success: function (resData) {
        	layer.closeAll('loading');
        	if(resData.Success){
        		count_recommend.open();
        		dataRecommend.Token = resData.Token;
        		tipsMsg('短信已发送');
        	}else{
        		tipsMsg('短信服务器出错');
        	}
        },
		error: function(e) { 
			layer.closeAll('loading');
			alert(JSON.stringify(e))
		}   	        
        
    })
})

var dataRecommend = {
	Request:'',
	CustomerName:'商标求购',
	SourceLocationKey:28,
	IpType:3,
	Token:'',
	Mobile:'',
	MobileCaptcha:'',
	RequestDetail:'',
	BusinessMaps:[],
	AdvIdea:'',
	CustomerName:''
};


$('.btn_recommend_first').on('click',function(){
	if($('#bussType').val()==''){
		tipsMsg('业务类型不能为空');
		return false;
	}
	if($('#mobile_industry').val()==''){
		tipsMsg('商标所属分类不能为空');
		return false;
	}
	if($('#request').val()==''){
		tipsMsg('要求不能为空');
		return false;
	}
	if(!IsCorrectName($('#name').val())){
		tipsMsg('请输入正确的姓名');
		return false;
	}
	if(!IsCorrectMobile($('#mobile_recommend').val())){
		tipsMsg('请输入正确的手机号码');
		return false;
	}
	if(!IsCorrectCode($('#yzm_recommend').val())){
		tipsMsg('请输入正确的短信验证码');
		return false;
	}
	
	dataRecommend.Mobile = $('#mobile_recommend').val();
	dataRecommend.MobileCaptcha = $('#yzm_recommend').val();
	dataRecommend.BusinessMaps = [{ key:11, value:$('#bussType').val()}];
	dataRecommend.Request = $('#request').val();
	dataRecommend.RequestDetail = '行业：'+ $('#mobile_industry').val();
	dataRecommend.CustomerName = $('#name').val();
	dataRecommend.AdvIdea = advIdea;
	
	loading();
	$.ajax({
        url: domain + "/request/campaignpurchase",
        type:"post",
        cache: false,
        dataType: "json",
        data: dataRecommend,  
        //contentType: "application/json; charset=utf-8",
        success: function (resData) {
        	layer.closeAll('loading');
        	if(resData.Result){
        		$('.success_tips').show();
        		$('.banner').find('input[type="text"],input[type="number"]').val('');
        		count_recommend.close();
        	}else{
        		tipsMsg(resData.Message);
        	}
        },
		error: function(e) { 
			layer.closeAll('loading');
			alert(JSON.stringify(e))
		}   	        
        
    })
	
})

//表单2
var count_recommend_bottom = new Counttime($('.identi_code_bottom')[0]);
$('.identi_code_bottom').on('click',function(){
	if(!IsCorrectMobile($('#bottom_mobile_recommend').val())){
		tipsMsg('请输入正确的手机号码');
		return false;
	}
	loading();
	$.ajax({
        url: domain + "/request/campaignsendvcode",
        type:"post",
        cache: false,
        dataType: "json",
        data: {'mobile':$('#bottom_mobile_recommend').val()},  
        //crossDomain:true,
        success: function (resData) {
        	layer.closeAll('loading');
        	if(resData.Success){
        		count_recommend_bottom.open();
        		bottom_dataRecommend.Token = resData.Token;
        		tipsMsg('短信已发送');
        	}else{
        		tipsMsg('短信服务器出错');
        	}
        },
		error: function(e) { 
			layer.closeAll('loading');
			alert(JSON.stringify(e))
		}   	        
        
    })
})

var bottom_dataRecommend = {
	Request:'',
	CustomerName:'商标求购',
	SourceLocationKey:28,
	IpType:3,
	Token:'',
	Mobile:'',
	MobileCaptcha:'',
	RequestDetail:'',
	BusinessMaps:{},
	AdvIdea:'',
	CustomerName:''
};


$('.btn_recommend_bottom').on('click',function(){
	if($('#bottom_bussType').val()==''){
		tipsMsg('业务类型不能为空');
		return false;
	}
	if($('#bottom_mobile_industry').val()==''){
		tipsMsg('商标所属分类不能为空');
		return false;
	}
	if($('#bottom_request').val()==''){
		tipsMsg('要求不能为空');
		return false;
	}
	if(!IsCorrectName($('#bottom_name').val())){
		tipsMsg('请输入正确的姓名');
		return false;
	}
	if(!IsCorrectMobile($('#bottom_mobile_recommend').val())){
		tipsMsg('请输入正确的手机号码');
		return false;
	}
	if(!IsCorrectCode($('#bottom_yzm_recommend').val())){
		tipsMsg('请输入正确的短信验证码');
		return false;
	}
	
	bottom_dataRecommend.Mobile = $('#bottom_mobile_recommend').val();
	bottom_dataRecommend.MobileCaptcha = $('#bottom_yzm_recommend').val();
	bottom_dataRecommend.BusinessMaps = [{ key:11, value:$('#bottom_bussType').val()}];
	bottom_dataRecommend.Request = $('#bottom_request').val();
	bottom_dataRecommend.RequestDetail = '行业：'+ $('#bottom_mobile_industry').val();
	bottom_dataRecommend.CustomerName = $('#bottom_name').val();
	bottom_dataRecommend.AdvIdea = advIdea;
	
	loading();
	$.ajax({
        url: domain + "/request/campaignpurchase",
        type:"post",
        cache: false,
        dataType: "json",
        data: bottom_dataRecommend,  
        success: function (resData) {
        	layer.closeAll('loading');
        	if(resData.Result){
        		$('.success_tips').show();
        		$('.bottom_form').find('input[type="text"],input[type="number"]').val('');
        		count_recommend_bottom.close();
        	}else{
        		tipsMsg(resData.Message);
        	}
        },
		error: function(e) { 
			layer.closeAll('loading');
			alert(JSON.stringify(e))
		}   	        
        
    })
	
})