/**
 * Function.prototype
 *    + call
 *    + apply
 *    + bind
 * 每一个函数都是Function的实例，都可以调用其原型上的三个方法，用来实现函数内部THIS的改变
 */
function fn (x, y) {
    console.log(this, x, y)
    return x + y
}
let obj = {
    name: 'xiaowu',
}
/**
 * fn 首先基于__proto__找到Function.prototype上的call方法，把call方法执行
 *    + 传递的实参 obj
 *    + call方法中的this -> fn
 * call方法执行的作用是: 把fn[this]执行，并且让方法fn[this]中的this指向变为第一个传递的实参[obj]
 */
fn.call() // => 非严格模式下:this->window[传递第一个参数是null/undefined也是window]   严格模式下:this->undefined[传递的第一个参数是谁，this就是谁]
console.log(fn.call(obj, 10, 20))

// --------------------------------------------------------

/**
 * apply和call只有一个区别: 传递给执行函数的实参方式不一样
 *    fn.call([context],params1,params2,...)
 *    fn.apply([context],[params1,params2,...])
 * 最后的结果都是把params一项项的传递给fn的
 * call的性能要比apply好一丢丢[尤其是传递的实参在三个以上]
 */

let arr = [30, 40]
fn.apply(obj, arr)

// --------------------------------------------------------

/* 应用一:实现数组求最大值/最小值 */
let arr = [1, 4, 3, 6, 5, 2]

// 排序法
arr.sort((a, b) => b - a)
console.log(arr[0])

// Math.max/min
console.log(Math.max(arr)) // => NaN
console.log(Math.max(...arr))
console.log(Math.max.apply(Math, arr))

// 假设法
let max = arr[0]
arr.slice(1).forEach((item) => {
    if (item > max)
    {
        max = item
    }
})
console.log(max)

// 自己拼字符串   eval 把字符串变为表达式
let str = 'Math.max(' + arr + ')' // => Math.max(1, 4, 3, 6, 5, 2)
console.log(str, eval(str))

// --------------------------------------------------------

/* 应用二:鸭子类型 长的像鸭子却不是鸭子 */
function fn () {
    console.log(arguments) // => 类数组 [Arguments] { '0': 1, '1': 2, '2': 3, '3': 4 }
    // arguments.__proto__ === Object.prototype   类数组对象，不能直接使用数组的方法
    // 想让类数组使用数组提供的方法(Array.prototype)

    // 方案一:把类数组转换为数组
    let a = [...arguments]
    let b = Array.from(arguments)
    // 让类数组借用数组原型上的方法，实现类数组转换为数组[大部分数组的方法，都可以被类数组调用]
    let c = Array.prototype.slice.call(arguments, 0)
    let d = [].slice.call(arguments)
    return d.reduce((total, item) => total + item)

    // 方案二:直接调用
    return [].reduce.call(arguments, (total, item) => total + item)

    // 方案三:改变原型指向
    arguments.__proto__ = Array.prototype
    return arguments.reduce((total, item) => total + item)
}
console.log(fn(1, 2, 3, 4)) // => 以上三种方案都可以实现

// --------------------------------------------------------

// 更暴力的方案:直接把你的东西抢过来用
/* Array.prototype.push = function push(val) {
    // this -> 数组
    // 1、把val放置在数组的末尾
    // this[this.length] = val
    // 2、数组长度累加(对于数组来说，新增一项后，它的length也会自动的累加'数组结构的特点')
    // this.length++
    // return this.length
};
let arr = [1,2,3,4]
arr.push(10); */
let obj = {
    2: 3,
    3: 4,
    length: 2,
    push: Array.prototype.push,
}
obj.push(1) // => obj[2] = 1   obj.length++
obj.push(2) // => obj[3] = 2   obj.length++
console.log(obj) // => {2:1,3:2,length:4} { '2': 1, '3': 2, length: 4, push: [Function: push] }

// --------------------------------------------------------

/**
 * bind
 * call/apply都是立即把函数执行[改变this和传递参数]
 * bind没有把函数立即执行，只是把后期要改变的this及传递的参数预先存储起来[柯里化]
 */
function fn (x, y, ev) {
    console.log(this, x, y, ev)
    return x + y
}
let obj = {
    name: 'xiaoyu',
}

document.onclick = fn // => 点击文档才执行fn   this->document   x->MouseEvent事件对象   y->undefined
document.onclick = fn.call(obj, 10, 20) // => 立即执行了fn，我们需要点击的时候才执行
document.onclick = function anonymous (ev) {
    // this => document
    fn.call(obj, 10, 20, ev)
}
document.onclick.bind(obj, 10, 20)

let proxy = fn.bind(obj, 10, 20)
proxy()
/**
 * 执行bind，fn没有立即执行[预先把fn/obj/10/20都存储起来了]，返回一个新函数
 * let proxy = fn.bind(obj, 10, 20)
 * 执行返回的函数，proxy内部帮助我们把fn执行[this和参数该处理都处理了]
 * proxy()
 */

// ------------------------------------------------------------------------

// 自己实现一个bind方法
/* 
    思路: 先把 anonymous 绑定给 document.onclick，这样点击的时候，先执行的是 anonymous [ev是事件对象，anonymous中的this是document]；我们在anonymous执行的时候，再把fn执行，完成this和相关参数的处理即可
    document.onclick = function anonymous (ev) {
        // this => document
        fn.call(obj, 10, 20, ev)
    }
 */
Function.prototype.bind = function bind (context, ...params) {
    // this:fn   context:obj   params:[10,20]
    let self = this
    return function anonymous (...args) {
        // args:[ev]
        params = params.concat(args)
        return self.call(context, ...params)
    }
}
document.onclick = fn.bind(obj, 10, 20)