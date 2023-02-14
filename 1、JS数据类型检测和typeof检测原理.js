/**
 * JS数据类型精讲及typeof的底层机制
 *     '原始值'类型(基本数据类型/值类型)
 *          string : 普通字符串、模板字符串
 *          number : NaN、Infinity、正常数字...
 *          boolean : true/false
 *          null : 空
 *          undefined : 未定义
 *          Symbol : 唯一值
 *          BigInt : 大数
 *
 *     对象数据类型(引用数据类型)
 *          object
 *            + {} plainObject
 *            + [] array
 *            + /^$/ RegExp
 *            + new Date
 *            + ...
 *          function 函数类型 [可执行对象]
 */

console.log(Symbol() === Symbol()) // => false
/**
 * Symbol.iterator : for of 循环的底层处理机制
 * Symbol.toStringTag : Object.prototype.toString.call()
 * Symbol.hasInstance : instanceof
 * Symbol.toPrimitive : 获取原始值 [数据类型转换、比较]
 * ...
 */

// JS中有最大、最小数字界限
console.log(Number.MAX_SAFE_INTEGER) // => 9007199254740991 最大安全数字
console.log(Number.MIN_SAFE_INTEGER) // => -9007199254740991 最小安全数字
/**
 * 服务器端 [数据库]
 * 服务器端返回一个数字 & 数字超过了最大安全数
 *    + 如果只需要呈现出来，我们把服务器返回来的数字包裹为字符串即可
 *    + 如果需要运算 此时需要BigInt来处理
 */
let n = 9007199254740991n + 1n

/**
 * 数据类型检测
 *    + typeof
 *        + 返回一个字符串，其次字符串中包含对应的数据类型
 *    + instanceof
 *    + constructor
 *    + Object.prototype.toString.call([value])
 *    ------
 *    + Array.isArray
 *    ------
 *    + 分析JQuery源码，自己封装检测数据类型的方法 : toType、isFunction、isWindow、isPlainObject、isArrayLike、isEmptyObject、isNumber...
 */
console.log(typeof null) // => "object"
/**
 * typeof
 * 检测对象数据类型，除了可执行对象 [函数:能够调用call方法的 & 普通函数/构造函数/箭头函数/生成器函数]检测出来的结果是 'function'，其余的情况都是 'object'
 * ------为啥？
 * typeof 检测数据类型的底层机制:
 *    + 所有数据类型在计算机中都是按照二进制存储的
 *      整数:1   浮点:010   字符串:100   布尔:110   对象:000   undefined:-2^30   null:000000   ...
 *    + typeof底层机制就是判断这些二进制值，如果是以000开始的，都是对象[特殊性: 排除函数]，返回的是'object'，此时我们发现null中枪了...
 * 稳定性和性能是很好的，而且用起来简单
 */
