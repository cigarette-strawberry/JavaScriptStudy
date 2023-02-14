/**
 * 数据类型检测
 *    1.typeof 检测数据类型的运算符   typeof [value]
 *       + 返回结果是个字符串，包含了对应的数据类型"number"/"string"/"boolean"/"function"/"undefined"...
 *         typeof typeof typeof [10,20] => "string"
 *       + typeof null => "object"
 *       + typeof检测对象类型值，除了特殊对象「函数」返回"function", 其余都是"object"
 *       + ...
 *       原理:所有数据类型值在计算机底层存储的时候，都是基于二进制进行存储的「根据IEEE- -754使用64位2进制值存储」;所有对象数据类型
值前三位都是000, null的值是000000...; typeof检测是按照二进制值来检测的「处理速度是比较快的」，它认为以000开头的都是"object"
「其中包含了null,而函数是经过特殊处理的{能够调用call方法的是函数}」
         不仅如此，我们平时进行数学运算的时候，也是按照底层存储的二进制值来进行运算处理的! !
         问题: 0.1 + 0.2 !== 0.3   => 0.1/0. 2本身存储的二进制是经过省略的，最后相加的结果也会存在精度差

 *    2.instanceof 本意是用来检测当前实例对象是否率属于这个类，并不是数据类型检测，只不过我们依托于他的特点，可以检测数据类型「临时
拉来充壮丁的，所以准确度不好」
         原理: [实例对象 obj] instanceof [构造函数 Ctor]
            @1 检测构造函数是否拥有Symbol.hasInstance这个属性，如果有这个属性，则 Ctor[Symbol.hasInstance](obj) 这样处理[Function.prototype[Symbol.hasInstance]有这个属性，所有的构造函数都可以调用]
            @2 不论是基于这个方法处理，还是没有这个方法，最后的本质都是: 检测当前实例obj的原型链上是否会出现 Ctor 这个构造函数，如果可以出现，则结果是true，找到至 Object.prototype 都没有出现过 Ctor，则结果是false

 *    3.constructor

 *    4.Object.prototype.toString.call()
 */

// instanceof 可以细分对象数据类型
let arr = [10, 20]
console.log(arr instanceof Array); // => true
console.log(arr instanceof RegExp); // => false
console.log(arr instanceof Object); // => true


function Fn () { }
Fn.prototype = Array.prototype
let f = new Fn
console.log(f instanceof Array); // => true 但是f本质上不应该称之为数组[不具备数组应有的结构]


// 内置类不允许我们直接修改这个属性[修改了也没用]
let arr = [10, 20]
Array[Symbol.hasInstance] = function (obj) {
    return false
}
console.log(arr instanceof Array); // => true


// ES5创造构造函数的语法上也不允许我们修改这个属性
function Fn () { }
Fn[Symbol.hasInstance] = function () {
    return false
}
let f = new Fn
console.log(f instanceof Fn); // => true


// 原型对象上也不允许修改
Function.prototype[Symbol.hasInstance] = function (obj) {
    return false
}
console.log([] instanceof Array); // => true


// ES6创造构造函数的语法是支持修改的
class Fn {
    static [Symbol.hasInstance] = function (obj) {
        return false
    }
}
let f = new Fn
console.log(f instanceof Fn); // => false


console.log(1 instanceof Number); // => false   基于 instanceof 进行处理，并不会把原始值进行装箱处理，也就是原始值类型本身是不具备原型链的，所以 instanceof 是不能处理原始值类型的
console.log(new Number(1) instanceof Number); // => true


function instance_of (obj, Ctor) {
    let ctorType = typeof Ctor,
        objType = typeof obj,
        reg = /^(object|function)$/i,
        hasInstance,
        proto;
    //校验Ctor是否是一个对象/函数
    if (Ctor == null || !reg.test(ctorType)) throw new TypeError("Right-hand side of 'instanceof' is not an object");
    //校验obj是否是一个对象/函数「原始值类型直接返回false」
    if (obj == null || !reg.test(objType)) return false;
    //校验Ctor是否有prototype
    if (!Ctor.hasOwnProperty('prototype')) throw new TypeError("Function has non-object prototype 'undefined instanceof check");
    //正常检测处理
    hasInstance = Ctor[Symbol.hasInstance]
    if (hasInstance) return hasInstance.call(Ctor, obj); // => Ctor[Symbol.hasInstance](obj)
    proto = Object.getPrototype0f(obj);
    while (proto)
    {
        if (proto === Ctor.prototype) return true;
        proto = Object.getPrototype0f(proto);
    }
    return false;
}