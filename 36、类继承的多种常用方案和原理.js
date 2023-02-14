/**
 * 面向对象中: 类的 '继承、封装和多态'
 *    封装:把实现某个功能的代码进行封装处理，后期想实现这个功能，直接调用函数执行即可'低耦合、高内聚'
 *    多态:重载[方法名相同，参数类型或者个数不同，这样会认为是多个方法]&重写[子类重写父类中的方法]
 *    继承:子类继承父类的方法'子类的实例即拥有子类赋予的私有/公有属性和方法，也能拥有父类赋予的私有/公有属性和方法'
 */

/**
 * @1 原型继承
 *    特点:和传统后台语言中的继承不一样[后台:子类继承父类，会把父类的方法copy一份给子类]，并没有把父类的方法copy一份给子类，而是建立子类和父类之间的原型链指向，后期子类实例访问父类中提供的属性和方法，也是基于__proto__原型链一层层查找的
 *    + 父类想要赋予其实例私有的属性x，此时变为了子类实例ch的公有属性
 *    + 子类实例可以基于原型链，修改父类原型上的方法[这样会对父类的其它实例也产生影响]
 */

function Parent () {
    this.x = 100
}
Parent.prototype.getX = function () { }

function Child () {
    this.y = 200
}
Child.prototype = new Parent
Child.prototype.getY = function () { }

let ch = new Child

/**
 * @2 call继承:把父类当作普通方法执行[原型啥的就没啥作用了]，让方法中的this是子类的实例，这样可以达到让父类中赋予其实例私有的属性，最后也变为子类实例私有的属性
 *
 * @3 把call继承和变形的原型继承混合在一起，就实现了 '寄生组合式继承' [推荐]
 */

function Parent () {
    this.x = 100
}
Parent.prototype.getX = function () { }

function Child () {
    Parent.call(this)
    this.y = 200
}
Child.prototype = Object.create(Parent.prototype)
Child.prototype.getY = function () { }

let ch = new Child

/**
 * ES6中类的继承 extends [非常类似于寄生组合式继承]
 */
class Parent {
    constructor() {
        this.x = 100
    }
    getX () { }
}

class Child extends Parent {
    constructor() {
        // 一旦使用了extends，并且编写了constructor，必须在constructor函数中第一行写上 super()
        // 从原理上类似于call继承   super() ===> Parent.call(this)
        super()
        this.y = 200
    }
    getY () { }
}

let ch = new Child