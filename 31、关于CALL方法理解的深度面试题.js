Function.prototype, call = function call (context, ...params) {
    if (context == null) context = window
    if (!/^(object|function)$/i.test(typeof context)) context = Object(context)
    let key = Symbol('key'),
        result
    context[key] = this
    result = context[key](...params)
    delete context[key]
    return result
}
/* 
    上面是call的源码
    下面是面试题
*/
var name = "小吴"
function A (x, y) {
    var res = x + y
    console.log(res, this.name);
}
function B (x, y) {
    var res = x - y
    console.log(res, this.name);
}
B.call(A, 40, 30) // => 10 A
B.call.call.call(A, 20, 10) // => NaN undefined
Function.prototype.call(A, 60, 50)
Function.prototype.call.call.call(A, 80, 70) // => NaN undefined