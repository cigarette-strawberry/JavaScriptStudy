/**
 * 数据类型检测
 *    3. constructor 和 instanceof一样，并不是专业进行数据类型检测的
 *       constructor 会默认的进行装箱操作
 *       问题: constructor的值可以被肆意的更改，导致最后检测的结果不一定是准确的   arr.constructor = 'xxx'
 * 
 *    4. Object.prototype.toString.call([value]) 万能检测数据类型的方法「准确」
 *       @1 除了Object.prototype.toString是用来检测数据类型的，其余数据类型内置类的原型上的toString方法，一般都是用来转换为字符串的
 *       @2 obj.toString() -> "[object Object]"
 *          obj基于__proto__找到Object.prototype.toString,并且把这个方法执行
 *          toString方法中的this是obj，所以就是在检测obj的数据类型; "只要让toString方法执行，方法中的this是谁，就是在检测谁的数据类型" => Object.prototype.toString.call([value])或者({}).toString.call([value])
 *          返回的结果: "[object 实例[Symbol.toStringTag]/当前实例所属的构造函数{自定义的构造函数不见得是这样}]"
 */

let arr = [1, 2],
    num = 10
console.log(arr.constructor === Array); // => true
console.log(num.constructor === Number); // => true

//---------------------------------------------------------

// alert会把输出的内容转换为字符串 Symbol.toPrimitive/valueOf()/toString()
alert([10, 20]); //Array.prototype.toString "10,20"
alert({
    name: 'xxx'
}); //Object.prototype.toString "[object Object]"

// 对象处理成为字符串
//     + JSON.stringify(obj)
//     + JSON.parse(str)

//检测自定义构造函数的实例的数据类型
class Fn { }
let f = new Fn;
console.log(Object.prototype.toString.call(f)); //默认"[object Object]"

class Fn {
    [Symbol.toStringTag] = 'Fn';
}
let f = new Fn;
console.log(Object.prototype.toString.call(f)); //"[object Fn]"

