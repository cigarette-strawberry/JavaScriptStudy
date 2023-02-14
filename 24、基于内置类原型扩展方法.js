function C1(name) {
    if (name) {
        this.name = name;
    }
}
function C2(name) {
    this.name = name;
}
function C3(name) {
    this.name = name || 'join';
}
C1.prototype.name = 'Tom'; // => Tom
C2.prototype.name = 'Tom'; // => undefined
C3.prototype.name = 'Tom'; // => join
console.log(new C1().name + new C2().name + new C3().name); // => Tomundefinedjoin

// ------------------------------------------------------

/**
 * 基于内置类的原型扩展方法:这样实例可以直接调用我们自定义的方法，从而实现某些功能
 *    @1 我们自定义的方法名字最好设置前缀，防止自己写的方法覆盖内置的方法
 *    @2 可以实现 '链式调用':执行一个方法，返回结果可以继续调用所属类原型上的其它方法...
 *    @3 这种操作可以简化调用的方式，无需传递实参，在扩展方法内部的this一般都是我们要处理的值
 */

// 数组去重:原始数组不变，返回的结果是去重后的数组
Array.prototype.myUnique = function myUnique() {
    // this:一般都是当前类的实例[操作按钮]
    let self = this;
    return Array.from(new Set(self));
};
let arr = [10, 20, 30, 10, 20, 30];
console.log(arr.myUnique(), arr);

// ------------------------------------------------------

/**
 * 创建值的两种方案
 *    @1 字面量
 *    @2 构造函数
 *
 * 原始值数据类型，两种方案创建的结果是不一样的
 *    字面量方案创造的是:标准的原始值类型
 *    构造函数方案创造的是:当前类的实例[对象数据类型的]
 *    但是不论如何都是所属类的实例，都可以调用所属类原型上的方法
 */

let n = 10;
let m = new Number(10);
console.log(typeof n); // => 'number'
console.log(typeof m); // => 'object'

console.log(n.toFixed(2)); // => 10.00   '装箱' 首先会把原始值类型的n，变为对象实例类型的n [new Number(n)]
console.log(m.toFixed(2)); // => 10.00   m是标准的实例对象，基于__proto__调用Number.prototype上的方法

console.log(n + 10); // => 20
console.log(m + 10); // => 20   '拆箱' 首先会把m变为原始值类型[Symbol.toPrimitive/valueOf/toString/Number]，再进行运算

// ------------------------------------------------------

(function () {
    const checkNum = num => {
        num = +num;
        return isNaN(num) ? 0 : num;
    };
    Number.prototype.plus = function plus(num) {
        console.log(this); // this => [Number: 10] 实例对象
        num = checkNum(num);
        return this + num;
    };
    Number.prototype.minus = function minus(num) {
        num = checkNum(num);
        return this - num;
    };
})();

let a = 10;
let b = a.plus(10).minus(5);
console.log(b);
