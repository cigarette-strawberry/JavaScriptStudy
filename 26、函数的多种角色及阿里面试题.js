/**
 * 函数的多种角色
 *    @1 函数{第一角色}
 *       + 普通函数: 私有上下文、AO、作用域/作用域链、形参赋值、变量提升、闭包...
 *       + 构造函数[类]: 拥有普通函数执行的特点、类、实例、prototype、__proto__...
 *    @2 对象[静态属性和方法]
 */

function Modal(x, y) {
    this.x = x;
    this.y = y;
}
Modal.prototype.getX = function () {
    console.log(this.x);
};
Modal.prototype.getY = function () {
    console.log(this.y);
};
Modal.n = 200;
Modal.setNumber = function (n) {
    this.n = n;
};
let m = new Modal(10, 20);

// --------------------------------------------------------------

function Foo() {
    getName = function () {
        console.log(1);
    };
    return this;
}
Foo.getName = function () {
    console.log(2);
};
Foo.prototype.getName = function () {
    console.log(3);
};
var getName = function () {
    console.log(4);
};
function getName() {
    console.log(5);
}
Foo.getName(); // => 2
getName(); // => 4
Foo().getName(); // => 1
getName(); // => 1
new Foo.getName(); // => 2
new Foo().getName(); // => 3
new new Foo().getName(); // => 3
