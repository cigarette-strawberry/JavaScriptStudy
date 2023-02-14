// 环境区分 在什么场所下运行
(function (global, factory) {
    "use strict";
    if (typeof module === "object" && typeof module.exports === "object")
    {
        /* 对于CommonJS和类似CommonJS的环境，如果存在适当的“窗口”，执行工厂并获得jQuery。 对于没有带有' document '的' window '的环境(例如Node.js)，将工厂公开为module.exports。 这就需要创建一个真正的“窗口”。 例如:var jQuery = require(" jQuery ")(window); */
        module.exports = global.document ?
            factory(global, true) :
            function (w) {
                if (!w.document)
                {
                    throw new Error("jQuery requires a window with a document");
                }
                return factory(w);
            };
    } else
    {
        factory(global);
    }
    // Pass this if window is not defined yet   如果窗口尚未定义，请传递此参数
})(typeof window !== "undefined" ? window : this, function (window, noGlobal) {
    var version = "3.6.0",
        // Define a local copy of jQuery   定义jQuery的本地副本
        jQuery = function (selector, context) {
            // The jQuery object is actually just the init constructor 'enhanced'
            // Need init if jQuery is called (just allow error to be thrown if not included)
            /* jQuery对象实际上是初始化构造函数'enhanced'，如果jQuery被调用，需要初始化(如果不包含，只允许抛出错误)   */
            return new jQuery.fn.init(selector, context);
        };

    // --------------------------------------------------------------------------------------------------------

    /* 原型重定向后 constructor 会消失需要自己再补一个 */
    jQuery.fn = jQuery.prototype = {
        jquery: version,
        constructor: jQuery,
        length: 0,
    }

    // --------------------------------------------------------------------------------------------------------

    // A central reference to the root jQuery(document)   对根jQuery(文档)的中心引用
    // Initialize central reference   初始化中心参考
    var rootjQuery = jQuery(document),
        /* #id优先级高于<标签>，以避免通过位置跨站。 hash严格的HTML识别:必须以<开头 */
        rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
        init = jQuery.fn.init = function (selector, context, root) {
            var match, elem;

            // HANDLE: $(""), $(null), $(undefined), $(false)   返回一个空的JQ实例对象
            if (!selector)
            {
                return this;
            }

            // Method init() accepts an alternate rootjQuery
            // so migrate can support jQuery.sub (gh-2101)
            root = root || rootjQuery;

            // selector 支持三种不同的类型:字符串、原生DOM对象(浏览器内置方法获取的DOM元素对象)、函数...
            if (typeof selector === "string")
            {
                if (selector[0] === "<" &&
                    selector[selector.length - 1] === ">" &&
                    selector.length >= 3)
                {
                    // Assume that strings that start and end with <> are HTML and skip the regex check
                    // 传递的是HTML字符串:创建一个DOM元素对象[JQ实例对象]
                    match = [null, selector, null];
                } else
                {
                    // 传递的是选择器字符串:获取DOM元素对象[JQ实例对象]
                    match = rquickExpr.exec(selector);
                }

                // Match html or make sure no context is specified for #id
                if (match && (match[1] || !context))
                {

                    // HANDLE: $(html) -> $(array)
                    if (match[1])
                    {
                        context = context instanceof jQuery ? context[0] : context;

                        // Option to run scripts is true for back-compat
                        // Intentionally let the error be thrown if parseHTML is not present
                        jQuery.merge(this, jQuery.parseHTML(
                            match[1],
                            context && context.nodeType ? context.ownerDocument || context : document,
                            true
                        ));

                        // HANDLE: $(html, props)
                        if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context))
                        {
                            for (match in context)
                            {

                                // Properties of context are called as methods if possible
                                if (isFunction(this[match]))
                                {
                                    this[match](context[match]);

                                    // ...and otherwise set as attributes
                                } else
                                {
                                    this.attr(match, context[match]);
                                }
                            }
                        }

                        return this;

                        // HANDLE: $(#id)
                    } else
                    {
                        elem = document.getElementById(match[2]);

                        if (elem)
                        {

                            // Inject the element directly into the jQuery object
                            this[0] = elem;
                            this.length = 1;
                        }
                        return this;
                    }

                    // HANDLE: $(expr, $(...))
                } else if (!context || context.jquery)
                {
                    return (context || root).find(selector);

                    // HANDLE: $(expr, context)
                    // (which is just equivalent to: $(context).find(expr)
                } else
                {
                    return this.constructor(context).find(selector);
                }

                // HANDLE: $(DOMElement)
            } else if (selector.nodeType)
            {
                // 原生DOM对象:把DOM元素对象变为JQ对象[类数组集合]
                this[0] = selector;
                this.length = 1;
                return this;
                // HANDLE: $(function)
                // Shortcut for document ready
            } else if (isFunction(selector))
            {
                // 传递的是函数:$(document).ready(function(){}) === $(function(){})
                //    + 等待页面DOM结构加载完成触发执行回调函数
                //    + document.addEventListener('DOMContentLoaded', function () { })
                //    思考? window.onload = function(){ } 所有资源都加载完才会触发执行
                return root.ready !== undefined ?
                    root.ready(selector) :

                    // Execute immediately if ready is not present
                    selector(jQuery);
            }

            // 处理HTMLCollection/NodeList等DOM元素集合的
            return jQuery.makeArray(selector, this);
        };
    // Give the init function the jQuery prototype for later instantiation   为init函数提供jQuery原型，以便以后进行实例化
    init.prototype = jQuery.fn;

    // --------------------------------------------------------------------------------------------------------

    // results is for internal usage only
    jQuery.makeArray = function makeArray (arr, results) {
        var ret = results || [];

        if (arr != null)
        {
            if (isArrayLike(Object(arr)))
            {
                jQuery.merge(ret,
                    typeof arr === "string" ?
                        [arr] : arr
                );
            } else
            {
                push.call(ret, arr);
            }
        }

        return ret;
    }

    // --------------------------------------------------------------------------------------------------------

    // Support: Android <=4.0 only, PhantomJS 1 only
    // push.apply(_, arraylike) throws on ancient WebKit
    // 把两个 类数组集合 或者 数组集合 合并在一起   合并两个集合{把第二个集合放在第一个集合的末尾，返回第一个集合}[数组集合或者类数组集合]
    jQuery.merge = function merge (first, second) {
        var len = +second.length,
            j = 0,
            i = first.length;

        for (; j < len; j++)
        {
            first[i++] = second[j];
        }

        first.length = i;

        return first;
    }

    // --------------------------------------------------------------------------------------------------------

    // @1 向 $.fn/$ 扩展方法   $.fn.extend(obj) or $.extend(obj)
    //    其实就是合并 把 obj 和 $.fn/$ 对象合并   类似于 $.extend($/$.fn,obj)   'JQ插件'
    // @2 实现两个及多个对象的合并[支持深度比较合并]
    //    $.extend(obj1,obj2,obj3,...) 返回的是 obj1   类似于Object.assign
    //    $.extend(true,obj1,obj2,obj3,...) 传true 深度合并
    jQuery.extend = jQuery.fn.extend = function () {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;
        if (typeof target === "boolean")
        {
            deep = target;
            target = arguments[i] || {};
            i++;
        }
        if (typeof target !== "object" && !isFunction(target)) target = {};
        // deep 是布尔类型的值[深浅合并的切换]   target 第一个传递进来的要合并的对象

        // 是想要向 $/$.fn 上扩充方法   target:jQuery对象或者jQuery.fn原型对象
        if (i === length)
        {
            target = this;
            i--;
        }
        for (; i < length; i++)
        {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null)
            {

                // Extend the base object
                for (name in options)
                {
                    copy = options[name];

                    // Prevent Object.prototype pollution
                    // Prevent never-ending loop
                    if (name === "__proto__" || target === copy)
                    {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (jQuery.isPlainObject(copy) ||
                        (copyIsArray = Array.isArray(copy))))
                    {
                        src = target[name];

                        // Ensure proper type for the source value
                        if (copyIsArray && !Array.isArray(src))
                        {
                            clone = [];
                        } else if (!copyIsArray && !jQuery.isPlainObject(src))
                        {
                            clone = {};
                        } else
                        {
                            clone = src;
                        }
                        copyIsArray = false;

                        // Never move original objects, clone them
                        target[name] = jQuery.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined)
                    {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };

    // --------------------------------------------------------------------------------------------------------

    /* 暴露jQuery和$标识符，即使是在AMD和CommonJS的浏览器模拟器   */
    if (typeof noGlobal === "undefined")
    {
        window.jQuery = window.$ = jQuery;
    }
    return jQuery;
})

/**
 * jQuery === $
 *
 * 把jQuery当做一个普通函数   $([selector])   JQ选择器:获取元素对象，返回的结果是一个JQ类的实例对象，所以也称之为'JQ对象'
 * let $box = $('.box')
 *
 * 把jQuery当做一个普通对象，使用其静态的私有属性方法
 * $.ajax({
 *    url:'/api',
 *    ...
 * })
 */

/**
 * 面试题: 有一个方法Fn   Fn()和new Fn()的区别   Fn()普通函数执行能否创造Fn这个类的实例
 */
// 工厂设计模式:把一个构造函数当作普通函数执行，最后还可以获取到当前构造函数的实例
function Fn () {
    return new init()
}
Fn.prototype = {
    constructor: Fn
}
const init = function init () {
    this.xxx = 'xxx'
}
init.prototype = Fn.prototype
Fn()

// --------------------------------------------------------------------------------------------------------

// 生成器函数本身具备这个特点:当作普通函数执行，返回一个迭代器对象itor，并且itor.__proto__===fn.prototype
function* fn () { }
fn.prototype = {
    constructor: fn,
    name: 'fn'
}
let itor = fn()
console.log(itor);