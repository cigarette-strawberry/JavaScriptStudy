/**
 * prototype和 __proto__
 *    大部分 "函数数据类型" 的值都具备 "prototype(原型/显式原型)" 属性，属性值本身是一个对象「浏览器会默认为其开辟一个堆内存，用来存储实例可调期的公共的属性和方法」，在浏览器默认开辟的这个堆内存中「原型对象」有一个默认的属性 "constructor(构造函数/构造器)"，属性值是当前函数/类本身! !
 *    函数数据类型
 *       普通函数(实名或者匿名函数)
 *       箭头函数
 *       构造函数/类「内置类/自定义类」
 *       生成器函数Generator
 *       ...
 *    不具备prototype的函数
 *       箭头函数
 *       基于ES6给对象某个成员赋值函数值的快捷操作
 *       ...
 *
 *    每一个 "对象数据类型" 的值都具备一个属性 "__proto__(原型链/隐式原型)"，属性值指向 "自己所属类的原型prototpe"
 *
 *    对象数据类型值
 *       普通对象
 *       特殊对象:数组、正则、日期、Math、 Eror...
 *       函数对象
 *       实例对象
 *       构造函数.prototype
 *       ...
 *
 * 实例.__proto__ === 所属类.prototype
 */
function fn() {} // 有 prototype 属性
const fn1 = () => {}; // 没有 prototype 属性
let obj = {
    fn2: function () {}, // 有 prototype 属性
    fn3() {}, // 没有 prototype 属性
};
(function fn4() {
    console.dir(fn4); // 有 prototype 属性
})();

//--------------------------------------------------------

function Fn() {
    this.x = 100;
    this.y = 200;
    this.getX = function () {
        console.log(this.x);
    };
}
Fn.prototype.getX = function () {
    console.log(this.x);
};
Fn.prototype.getY = function () {
    console.log(this.y);
};
let f1 = new Fn();
let f2 = new Fn();
console.log(f1.getX === f2.getX); // => false
console.log(f1.getY === f2.getY); // => true
console.log(f1.__proto__.getY === Fn.prototype.getY); // => true
console.log(f1.__proto__.getX === f2.getX); // => false
console.log(f1.getX === Fn.prototype.getX); // => false
console.log(f1.constructor); // => [Function: Fn]
console.log(Fn.prototype.__proto__.constructor); // => [Function: Object]
f1.getX(); // => 100
f1.__proto__.getX(); // => undefined
f2.getY(); // => 200
Fn.prototype.getY(); // => undefined
