/**
 * THIS 函数执行的主体,和函数在哪定义以及在哪执行都没有关系
 *     @1 给元素的某一个事件行为绑定方法，当事件行为触发方法执行，方法中的this是当前元素本身
 *        box.onclick = function () {};
 *        box.addEventListener = function ('click', function () {});
 *        ---排除
 *        box.attachEvent('onclick',function(){ this是window })
 *     @2 方法执行，看方法前面是否有 '.'，有 '.'，'.' 前面是谁this就是谁，没有 '.'，this是window[严格模式下是undefined]；大部门情况下，匿名函数(尤其是回调函数)执行，this都是window/undefined
 */

(function () {
    'use strict';
    console.log(this); // => window/undefined
})();

//-------------------------------------------

setTimeout(function () {
    console.log(this); // => window
}, 1000);

//-------------------------------------------

[1, 2, 3].forEach(function () {
    console.log(this); // => 第二个参数不传，就是window，传递第二个参数，forEach内部做了特殊处理，会让回调函数中的this变为第二个参数值
}, 'xiaowu');

//-------------------------------------------

let obj = {
    // 在给obj.fn赋值的时候，先把自执行函数执行的返回结果赋值给属性fn
    // obj.fn = 0x000
    fn: (function () {
        // this => window
        return function () {
            // => 0x000
            console.log(this);
        };
    })(),
};
obj.fn(); // this => obj
let fn = obj.fn;
fn(); // => this => window

//-------------------------------------------

var fullName = 'language';
var obj = {
    fullName: 'javascript',
    prop: {
        getFullName: function () {
            return this.fullName;
        },
    },
};
console.log(obj.prop.getFullName());
// this => obj.prop
// this.fullName => obj.prop.fullName => undefined
var test = obj.prop.getFullName;
console.log(test());
// this => window
// this.fullName => window.fullName => 'language'

//-------------------------------------------

var name = 'window';
var Tom = {
    name: 'Tom',
    show: function () {
        // this => window
        console.log(this.name); // => 'window'
    },
    wait: function () {
        var fun = this.show;
        // this => Tom
        fun();
    },
};
Tom.wait();

//-------------------------------------------

window.val = 1;
var json = {
    val: 10,
    dbl: function () {
        this.val *= 2;
    },
};
json.dbl();
// this => json
// this.val *= 2 => json.val *= 2 => json.val : 20
var dbl = json.dbl;
dbl();
// this => window
// this.val *= 2 => window.val *= 2 => window.val : 2
json.dbl.call(window);
// this被强制改成了window
// this.val *= 2 => window.val *= 2 => window.val : 4
console.log(window.val + json.val); // => 24

//-------------------------------------------

(function () {
    // this => window
    var val = 1;
    var json = {
        val: 10,
        dbl: function () {
            // this => json
            // 但是 val *= 2 并没有用到this，这里的val是上级的上下文的val，也就是自执行函数中的val
            val *= 2; // => 2 此时又把自执行函数中的val变为2
        },
    };
    json.dbl();
    console.log(json.val + val); // => 12
})();

//-------------------------------------------

var num = 10;
var obj = {
    num: 20,
};
obj.fn = (function (num) {
    this.num = num * 3;
    num++;
    return function (n) {
        this.num += n;
        num++;
        console.log(num);
    };
})(obj.num);
var fn = obj.fn;
fn(5); // => 22
obj.fn(10); // => 23
console.log(num, obj.num); // => 65 30
