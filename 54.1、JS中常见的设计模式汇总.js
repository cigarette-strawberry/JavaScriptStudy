/**
 * JS设计模式:是一种思想，让我们更规范更合理去管理代码「方便维护、升级、扩展、开发」
 *    Singleton 单例模式 && Command 命令模式
 *       + 单例模式是最早期的模块化编程思想「同样的还有: AMD/CMD/CommonJS/ES6Module」
 *       + 避免全局变量的污染
 *       + 实现模块之间的相互调用「提供了模块导出的方案」
 *       + 在实际的业务开发中，我们还可以基于命令模式管控方法的执行顺序，从而有效的实现出对应的功能
 */

// 公用板块 utils
let utils = (function () {
    function debounce (func, wait) { }
    return {
        debounce: debounce
    }
})();

// A板块
let AModule = (function () {
    utils.debounce()

    function query () { }
    return {
        query: query
    }
})();

// B板块
let BModule = (function () {
    utils.debounce()
    AModule.query()

    // 获取数据
    function getData () { }
    // 绑定数据
    function binding () { }
    // 处理事件绑定
    function handle () { }
    // 处理其他事情
    function fn () { }
    return {
        // 模块的入口[相当于模块的大脑，控制模块中方法执行的顺序]
        init () {
            getData()
            binding()
            handle()
            fn()
        }
    }
})();
BModule.init()

/**
 * Constructor 构造器模式「站在面向对象的思想上去构建项目」
 * + 自定义类和实例
 * + 私有&公有属性和方法
 * + 编写公共的类库 & 插件组件
 * ---插件
 * 每一次调用插件我们都是创造这个类的一个实例，既保证每个实例之间「每次调用之间」有自己的私有属性,互不影响;也可以保证一些属性方法还是公用的,有效避免代码的冗余...
 */
function Fn () {
    this.xxx = xxx
}
Fn.prototype = {
    constructor: Fn,
    query () { },
    // ...
}
Fn.xxx = function () { }
// ---------------------
class Fn1 {
    constructor() {
        this.xxx = xxx
    }
    query () { }
    static xxx () { }
}
let f1 = new Fn1
let f2 = new Fn1

/**
 * Factory工厂模式
 *    + 简单的工厂模式「一个方法根据传递参数不同，做了不同事情的处理」
 *    + JQ中的工厂模式「加工转换」
 *
 * 经验分享:做后台开发的时候，我们有一个需求，一个产品需要适配多套数据库「mysql sqlserver oracle」，项目需要根据一些配置，轻松转换到对应的数据库上...
 */
function factory (options) {
    if (options == null) options = {};
    if (!/^(object |function)$/i.test(typeof options)) options = {}
    let {
        type,
        payload
    } = options;
    if (type === 'MYSQL')
    {
        // ...
        return;
    }
    if (type === 'SQLSERVER')
    {
        // ...
        return;
    }
    // ...
}
factory({
    type: 'SQLSERVER',
    payload: {
        root: '',
        pass: '',
        select: ''
    }
});
// ---------------------
(function () {
    function jQuery (selector, context) {
        return new jQuery.fn.init(selector, context);
    }
    jQuery.fn = jQuery.prototype = {
        constructor: jQuery,
        //...
    };

    // 中间转换
    function init (selector, context, root) { }
    jQuery.fn.init = init;
    init.prototype = jQuery.fn;

    if (typeof Window !== "undefined")
    {
        window.$ = window.jQuery = jQuery;
    }
})();
// $() -> jQuery实例