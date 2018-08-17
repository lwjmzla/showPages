;(function(window, undefined){
    function _now(){
        return new Date().getTime();
    }
    //辅助函数
    var throttle = function(func, wait, options) {
        var context, args, result;
        var timeout = null;
        // 上次执行时间点
        var previous = 0;
        if (!options) options = {};
        // 延迟执行函数
        var later = function() {
            // 若设定了开始边界不执行选项，上次执行时间始终为0
            previous = options.leading === false ? 0 : _now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
        return function() {
            var now = _now();
            // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
            if (!previous && options.leading === false) previous = now;
            // 延迟执行时间间隔
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口
            // remaining大于时间窗口wait，表示客户端系统时间被调整过
            if (remaining <= 0 || remaining > wait) {
                clearTimeout(timeout);
                timeout = null;
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
                //如果延迟执行不存在，且没有设定结尾边界不执行选项
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };
    //分析参数
    function extend(custom, src){
        var result = {};
        for(var attr in src){
            result[attr] = custom[attr] || src[attr]
        }
        return result;
    }
    //绑定事件，兼容处理
    function bindListener(element, type, callback){
        if (element.addEventListener) {
            element.addEventListener(type, callback);
        }else if (element.attachEvent) {
            element.attachEvent('on'+type, callback)
        }else{
            element['on'+type] = callback;
        }
    }
    //解绑事件，兼容处理
    function removeListener(element, type, callback){
        if (element.removeEventListener) {
            element.removeEventListener(type, callback);
        }else if (element.detachEvent) {
            element.detachEvent('on'+type, callback)
        }else{
            element['on'+type] = null;
        }
    }
    //判断一个元素是否为DOM对象，兼容处理
    function isElement(o) {
        if(o && (typeof HTMLElement==="function" || typeof HTMLElement==="object") && o instanceof HTMLElement){
            return true;
        }else{
            return (o && o.nodeType && o.nodeType===1) ? true : false;
        };
    };
    var lazyload = function(options){
    	var dpr = $('html[data-dpr]') ? parseInt($('html[data-dpr]').attr('data-dpr')) : 1;   //2018-4-13新增的兼容dpr
        //辅助变量
        var images = [],
            doc = document,
            body = document.body,
            winHeight = screen.availHeight *dpr,
            load = true;
        //参数配置
        var opt = extend(options, {
            wrapper: body,
            selector: 'img',
            imgSrc: 'data-src',
            defaultSrc: ''
        });
        if (!isElement(opt.wrapper)) {
            //console.log('not an HTMLElement');
            if(typeof opt.wrapper != 'string'){
                //若 wrapper 不是DOM对象 或者不是字符串，报错
                throw new Error('wrapper should be an HTMLElement or a selector string');
            }else{
                //选择器
                opt.wrapper = doc.querySelector(opt.wrapper) || body;
            }
        }
        //查找所有需要延时加载的图片
        function getAllImages(selector){
            return Array.prototype.concat.apply([], opt.wrapper.querySelectorAll(selector));
        }
        //设置默认显示图片
        function setDefault(){
            images.map(function(img){
                img.src = opt.defaultSrc;
            })
        }
        //设置是否加载图片
        function setLoad(flag){
            load = flag;
        }
        function getAbsTop(e){
            var x = e.offsetTop;
            while(e = e.offsetParent){
                x += e.offsetTop;
            }
            return x;
        };
        //加载图片
        function loadImage(){
            var nowHeight = body.scrollTop || doc.documentElement.scrollTop;
            //console.log(nowHeight);
            if (images.length > 0){
                if (load) {
                    var noLoad = [];
                    images.map(function(img, index) {
                        var offset = getAbsTop(img);
                        if (nowHeight + winHeight > offset) {
                            img.src = img.getAttribute(opt.imgSrc);
                            img.className = "";
                            //console.log('loaded');
                            // images.splice(index, 1);
                        }else{
                            noLoad.push(img);
                        }
                    })
                    images = noLoad;
                }
            }else{
                removeListener(window, 'scroll', loadFn)
            }
        }
        var loadFn = throttle(loadImage, 250);
        images = getAllImages(opt.selector);
        bindListener(window, 'scroll', loadFn);
        opt.defaultSrc && setDefault()
        loadImage();
        return {
            version: '0.0.1',
            options: opt,
            setLoad: setLoad
        }
    };
    window.lazyload = lazyload;
})(window);
