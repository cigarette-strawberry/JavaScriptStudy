function Dog(name) {
    this.name = name;
}
Dog.prototype.bark = function () {
    console.log('wangwang');
};
Dog.prototype.sayName = function () {
    console.log('my name is' + this.name);
};
/**
 * 手撕NEW的源码(NEW执行的原理)   Ctor -> constructor
 *    @1 把构造函数当作普通函数一样执行
 *    @2 创建当前类的一个空实例对象
 *       + 空对象
 *       + 实例对象.__proto__ === Ctor.prototype
 *    @3 让方法执行的时候，方法中的this指向这个实例对象[this.xxx = xxx就是在给实例对象设置私有的属性和方法]
 *    @4 看方法的返回结果 如果没有返回值/或者返回的是原始值，我们默认都返回实例对象；返回的如果是对象类型，则以用户自己手动返回的为主
 */

// 基础版本
/* function _new(Ctor, ...params) {
    let obj = {};
    obj.__proto__ = Ctor.prototype;
    let result = Ctor.call(obj, ...params);
    if (result && /^(object|function)&/i.test(typeof result)) return result;
    return obj;
} */

// 完整版本
// Object.create(proto): 创建一个空对象，并且把proto作为新创建对象的原型[新对象.__proto__ === proto];proto只能是null和对象类型值，如果是null则创建的新对象不具备__proto__,它不是任何类的实例
function _new(Ctor, ...params) {
    let obj,
        result,
        proto = Ctor.prototype;
    if (
        Ctor === Symbol ||
        Ctor === BigInt ||
        !proto ||
        typeof Ctor !== 'function'
    )
        throw new TypeError(`${Ctor} is not a constructor`);
    obj = Object.create(proto);
    result = Ctor.call(obj, ...params);
    if (result && /^(object|function)&/i.test(typeof result)) return result;
    return obj;
}
let sanmao = _new(Dog, '三毛');
sanmao.bark(); // => wangwang
sanmao.sayName(); // => my name is 三毛
console.log(sanmao instanceof Dog); // => true
