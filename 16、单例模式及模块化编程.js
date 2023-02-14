/**
 * 进阶应用之'单例设计模式'
 *    模块化编程发展历史:JavaScript本身是弱化命名空间概念的，只有全局作用域和函数的私有作用域(ES6中新增块作用域)，而模块化开发，从某种意义上来说，是强化了命名空间的概念
 *    + 有利于代码分离、解耦以及复用
 *    + 团队并行开发
 *    + 避免命名冲突
 *    + 相互引用、按需加载
 *    ------
 *    @1 单例设计模式
 *    @2 AMD require.js
 *    @3 CommonJS Node.js [基于JS编写后台代码、浏览器端不支持] [module.exports={}导出   \   require('../')引入]
 *    @4 CMD sea.js [把CommonJS规范搬到浏览器端]
 *    @5 ES6Module [export default{}导出   \   import xxx from '../'引入]
 *
 *    webpack: 支持CommonJS/ES6Module规范， 基于webpack编译后，会把CommonJS/ES6Module进行处理， 处理后的结果浏览器也是可以支持的「浏览器预览的结果是基于webpack编译的」
 */

// ------------------------------------------------------------------

// 基于闭包的方式，保证了私有性[想实现相互之间的调用，则可以基于window.xxx=xxx把其暴露到全局上{局限性:不适合向全局暴露太多内容，暴露内容多了也可能会导致冲突}]
(function () {
    let name = 'xiaowu';
    let age = '18';
    const fn = function () {};
    window.fn = fn;
})();
(function () {
    let name = 'xiaoyu';
    let age = '20';
    fn();
})();

// ------------------------------------------------------------------

/**
 * 每一个对象都是一个单独的内存空间，我们把描述同一事物的属性和方法存储到这个空间中:避免全局变量污染，而且也可以实现相互之间的引用 => 最简单的'单例设计模式'[设计模式就是一种思想，用来解决某一类问题:单例设计模式解决的问题是，每一个模块和每一个模块之间相互独立、避免全局变量的污染，而且还可以相互调用]
 * @1 每一个对象都是Object这个类的一个单独实例
 * @2 每一个对象都是一个堆内存空间，存储自己的私有键值对[私有化]
 * @3 penson1/penson2 除了被称为对象名，也可以称为"命名空间 nameSpace"
 * @4 我们后期可以基于命名空间，访问到指定空间中的内容[相互引用]
 */
let penson1 = {
    name: 'xiaowu',
    age: 18,
    fn() {},
};

let penson2 = {
    name: 'xiaoyu',
    age: 20,
    handle() {
        penson1.fn();
    },
};

// 真实项目中的应用: 闭包+单例=高级单例设计模式
let AModule = (function () {
    let name = 'xiaowu';
    let age = 18;
    const fn = function () {
        BModule.sum1();
    };
    const sum = () => {};
    // 基于return的方式，把当前模块中需要供其他模块调用的内容暴露出去
    return {
        fn,
        sum,
    };
})();

let BModule = (function () {
    let name = 'xiaoyu';
    let age = 20;
    const fn1 = function () {};
    const sum1 = function () {
        AModule.fn();
    };
    return {
        fn1,
        sum1,
        name,
    };
})();

// ------------------------------------------------------------------

/**
 * AMD:即可以实现模块化开发，也能有效解决模块之间的依赖问题
 * 自己实现一套AMD模块机制
 */
function define(moduleName, factory) {
    factories[moduleName] = factory;
}
function require(modules, callback) {
    modules = modules.map(function (item) {
        let factory = factories[item];
        return factory();
    });
    callback(...modules);
}
/*使用AMD */
define('moduleA', function () {
    return {
        fn() {
            console.log('moduleA');
        },
    };
});

define('moduleB', function () {
    return {
        fn() {
            console.log('moduleB');
        },
    };
});
require(['moduleA', 'moduleB'], function (moduleA, moduleB) {
    moduleA.fn();
    moduleB.fn();
});

// ------------------------------------------------------------------
