var a = 9;
function fn() {
    a = 0; // => 1、2、3
    return function (b) {
        return b + a++;
    };
}
var f = fn();
console.log(f(5)); // => 5
console.log(fn()(5)); // => 5
console.log(f(5)); // => 6
console.log(a); // => 2

// -------------------------------------

var x = 5,
    y = 6;
function func() {
    x += y;
    func = function (y) {
        console.log(y + --x); // => 13
    };
    console.log(x, y); // => 11 6
}
func(4);
func(3);
console.log(x, y); // => 10 6

// -------------------------------------

/**
 * 匿名函数具名化: 原本应该是匿名函数，但是我们现在设置了名字
 *    和正式的实名函数还是有很大的区别
 *    @1 具名化的名字，不允许在所处的上下文中使用[不能在外部使用]，因为所处上下文中并不会声明这个变量
 *    @2 但是可以在函数内部使用[相当于在函数私有上下文的AO中]，声明了一个b变量
 *    @3 并且直接修改这个名字是不生效的
 *    @4 但是这个名字的值默认是函数本身，这个优先级比较低，但凡当前函数上下文中，基于var/function/let/const重新声明过这个b，都是以重新声明的为主
 */
var b = 10;
(function b() {
    b = 20;
    console.log(b);
})();
console.log(b);

// -------------------------------------

// 在没有外物接收这个函数，并且还需要递归执行的时候，我们如何处理？
// ('use strict');
let index = 0;
(function () {
    index++;
    if (index > 5) return;
    console.log(index, this);
    // arguments.callee 当前执行函数本身
    // arguments.callee.caller 当前执行函数所在的环境(全局下执行是null)
    arguments.callee();
    // 问题:
    // @1 arguments.callee() 再次执行，方法中的this是arguments，之前第一次执行，this是window
    // @2 在严格模式下，第一次执行this是undefined；arguments.callee()在严格模式下无法使用
})();

function fun(n, o) {
    console.log(o);
    return {
        fun: function (m) {
            return fun(m, n);
        },
    };
}
var c = fun(0).fun(1);
c.fun(2);
c.fun(3);
