/**
 * JS中THIS的五种情况
 *    + 事件绑定
 *    + 函数执行(包括自执行函数和回调函数)
 *    + new构造函数(构造函数中的this是当前类的实例，this.xxx=xxx 实例设置的私有属性)
 *    + 箭头函数
 *       @1 函数执行:形成私有上下文 AO，1、作用域链，2、初始this，3、初始arguments，4、形参赋值，5、变量提升，6、代码执行，释放不释放
 *       @2 箭头函数中没有this，箭头函数执行:初始this这一步是没有的，箭头函数中遇到的this都不是自己的，是自己所属上下文中的this，基于call/apply/bind改变箭头函数中的this是没有任何意义的
 *    + call/apply/bind(都是用来强制改变函数中的this指向)
 *       @1 call/apply(都是能够把函数立即执行，改变函数中this的指向；区别在于传递的实参方式不同:call是一个个传递实参，apply需要把实参放在一个数组中传递给函数)
 *       @2 bind(不是立即把函数执行，而是预先处理函数中this的指向和参数)
 */
/**
 * 箭头函数 VS 普通函数
 *    1、语法区别
 *    2、this区别:箭头函数没有自己的this
 *    3、原型区别:箭头函数没有prototype属性，不能被new执行
 *    4、箭头函数中没有arguments实参集合
 *    ...
 */
window.name = 'window'
const fn = function fn (x, y) {
    console.log(this, x + y);
    return 'xiaowu'
}
let obj = {
    name: 'xiaoyu'
}

// obj.fn(10, 20)  // => Uncaught TypeError: obj.fn is not a function

// 简述:把fn执行，让其this指向obj，并且给fn函数传递10，20，最后接收函数执行的返回值
// 详细:首先fn基于__proto__找到Function.prototype.call方法，并且把call方法执行；执行call方法传递了三个实参，第一个实参context{obj}存储为fn函数中this指向的值，其余参数都是未来给fn执行传递的实参params；在call方法内部做了很多事情:把fn执行，让其this指向context{obj}，并且给fn函数传递params[10，20]，最后接收fn执行的返回值...
let res = fn.call(obj, 10, 20) // let res = fn.apply(obj, [10, 20]) apply性能略低于call
console.log(res);

// ----------------------------------------------------------------------------

// 自己实现一个call方法
// 思路: 给obj增加一个成员(特点: 最好是一个不会和obj现有成员冲突的名字{Symbol})，而且成员的值就是要执行的函数fn   给obj新增的成员是多余的   所以在执行完函数的时候再把它移除掉   原始值数据类型设置成员的时候，虽然不报错，但是也设置不上
Function.prototype, call = function call (context, ...params) {
    // context:obj   params:[10,20]   call方法中this:fn
    // 完成的操作:把this{fn}执行，让fn中的this指向context{obj}，同时把params{[10,20]}中的信息一个个传递给fn，并且接收fn执行的返回结果把其返回...
    // Object(Symbol) 就是把它从原始值类型变为所属类的标准的对象实例
    // let n =10; new n.constructor(n)   Symbol和Bigint不可用
    if (context == null) context = window
    if (!/^(object|function)$/i.test(typeof context)) context = Object(context)
    let key = Symbol('key'),
        result
    context[key] = this
    result = context[key](...params)
    delete context[key]
    return result
}