function Fn(x, y) {
    let sum = 10;
    this.total = x + y;
    this.say = function () {
        console.log(this.total);
    };
}
let res = Fn(10, 20);
let f1 = new Fn(20, 30);
let f2 = new Fn();
console.log(f1.sum); // => undefined   sum只是上下文中的私有变量，只有this.xxx=xxx才是给实例设置的私有属性
console.log(f1.total); // => 50
console.log(f1.say === f2.say); // => false

// --------------------------------------------------

function Func(x, y) {
    this.total = x + y;
    return { name: 'xiaowu' }; // => return的值如果是对象返回值就不再会是Func这个类的是实例对象 { name: 'xiaowu' }
}
let f3 = new Func(10, 20); // => return的值只要不是对象依旧会是Func这个类的是实例对象 { total: 30 }
console.log(f3);
