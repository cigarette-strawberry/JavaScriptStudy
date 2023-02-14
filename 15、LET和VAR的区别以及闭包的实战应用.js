/**
 * let / const / var
 *    1.变量提升   var存在变量提升 / let不存在变量提升 [但是两者在词法解析阶段都进行过分析]
 *    2.重复声明   在相同上下文中，var可以重复声明一个变量 / 但是let不允许重复声明[无论之前基于何种方式，只要在当前上下文中声明过这个变量，那么则不能再基于let/const重复声明]
 *    3.和全局GO的关系   全局上下文中，基于let声明的变量存储到VO(G)中，而基于var声明的变量，存储到GO中
 *    4.块级上下文   除函数和对象的{}外，如果{)中出现 let/const/function 则会产生块级上下文，块级私有上下文和var没有任何的关系[var不会产生块级上下文，也不会受块级上下文的影响]
 *    5.暂时性死区
 *    ......
 */

//--------------------------------------------------------------------------

/**
 * 全局上下文「页面关闭释放」
 * 函数私有上下文「释放和不释放取决于是否内部有东西被外面占用」
 * 块级私有上下文「除函数和对象的{}外，如果{)中 出现let/const/function则会产生块级上下文，块级私有上下文和var没有任何的关系」
 */

var n = 10;
let m = 20;
{
    var n = 30
    let m = 40
    console.log(n,m); // => 30 40
}
console.log(n,m); // => 30 20
 
//--------------------------------------------------------------------------

/**
 * let新语法规范 VS var老语法规范
 * 代码执行之前的第一件事情: 词法分析 -> AST词法解析书
 */

/**
 * EC(G)
 *   VO(G)
 *     m -> 20
 *   GO(window)
 *     n -> 10
 *   变量提升: var n
 */
console.log(n); // => undefined
console.log(m); // => ReferenceError: Cannot access 'm' before initialization
var n = 10
let m = 20
console.log(n, m); // => 先找VO(G)，没有再找GO   10/20
console.log(window.n, window.m); // => 直接在GO中查找   10/undefined

//--------------------------------------------------------------------------

console.log(a); // => SyntaxError: Identifier 'a' has already been declared 在所有代码没有执行之前，就会报错[词法解析阶段就已经分析出语法错误:重复声明]
var a = 10
var a = 20
let a = 30

//--------------------------------------------------------------------------

// 浏览器暂时有一个BUG(暂时性死区):基于typeof检测出一个未被声明的变量，不会报错，结果是 'undefined'
console.log(q); // => ReferenceError: q is not defined
console.log(typeof q); // => 'undefined'

// 基于let/const可以消除这个暂时性死区问题
console.log(typeof w); // => ReferenceError: Cannot access 'w' before initialization
let w = 10

//--------------------------------------------------------------------------

/**
 * let VS const
 *    变量:可变的量，其实就是一个名字，用来关联一个值[指针指向]，而且关联的值是可以改变的
 *    常量:不可变的量，其实就是一个值
 */

let n = 10;
n = 20;

const m = 10;
m = 20; // => TypeError: Assignment to constant variable. 基于 const 声明的变量是不允许指针重新指向

let a;
a = 10;

const b;
b = 10; // => SyntaxError: Missing initializer in const declaration. const 在声明变量的同时应该立刻赋值

const c = { // => 堆内存地址 0x000
    name:'xiaowu'
}
c.name = 'xiaoyu' // => 可以这样操作
console.log(c); // => { name: 'xiaoyu' }

//--------------------------------------------------------------------------

/**
 * 为啥?
 * @1 循环中的i都是全局上下文中的
 * @2 定时器是异步的[第一轮循环设置一个定时器，不需要等待定时器触发执行，继续下一轮循环...]
 * @3 循环结束后[全局的i => 5]，设置了五个定时器，然后到时间后，再分别把五个定时器出发执行
 * @4 定时器中设置了回调函数执行，形成私有上下文，遇到的i不是自己的私有变量，是全局的，而此时全局的i是5
 */
for (var i = 0; i < 5; i++) {
    // 循环五次设置五个定时器
    setTimeout(() => {
        console.log(i); // => 5 5 5 5 5
    }, 0);
}

// 咋解决 => 闭包 [let / 自己写闭包 / 第三个参数]
for (let i = 0; i < 5; i++) {
    // @1 每一轮循环产生一个私有的块级上下文[每一个块级上下文中的函数被全局中的setTimeout占用 -> "不被释放|闭包"]
    // @2 每一个块中都有一个私有变量 i，存储的是每一轮循环 i 的值 0 1 2 3 4
    let timer = setTimeout(() => {
        console.log(i); // => 0 1 2 3 4
        // 清除使用过的定时器，这样把每一个块级上下文中，创建的函数以及其引用移除掉，让浏览器空闲的时候，回收这些不被释放的内存
        clearTimeout(timer)
        timer = null
    }, 0);
}
// 定时器返回的是一个数字 从1开始 timer=1 clearTimeout(1) timer=null 可以基于timer等于数字还是null来判断定时器是否被清除

let i =0
for (; i < 5; i++) {
    // 自己在每一轮循环构建私有上下文[闭包]
    (function (i) {
        // i 私有变量 [形参] 0 1 2 3 4
        setTimeout(() => {
            console.log(i); // => 0 1 2 3 4
        }, 0); 
    })(i) // 把每一轮循环时候i的值，作为实参传递给私有上下文中的i
}

let i =0
for (; i < 5; i++) {
    setTimeout((i) => {
        console.log(i); // => 0 1 2 3 4
    }, 0, i);
    // 定时器第三个参数，是传递给定时器设定回调函数的形参的值[定时器内部其实也是按照闭包的机制处理的:把每一次传递的值，预先存储起来，后期定时器触发执行，再从之前存储的值中拿出来即可]
}

let i =0
for (; i < 5; i++) {
    let fn = function (i) {
        console.log(i); // => 0 1 2 3 4
    }
    setTimeout(fn.bind(null, i), 0)
    // bind预处理机制
}

//--------------------------------------------------------------------------

// 宏任务 微任务