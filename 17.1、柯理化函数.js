/**
 * 进阶应用之"柯里化函数 && compose组合函数"
 *    1、百度简单面试题
 *    2、经典的curring函数面试题
 *    3、重写reduce
 *    4、compose组合函数
 */

// reduce的用法
let arr = [1, 2, 3, 4];
let total = arr.reduce(function (result, item, index) {
    /*
        result:上一次迭代，回调函数处理/返回的结果
        第一次迭代，不存在上一次，result是数组第一项的值 相当于数组是从第二项开始迭代
        item:当前迭代的这一项
        index:当前迭代这一项的索引
     */
    console.log(result, item); // => 1 2 / 3 3 / 6 4
    return result + item;
});
console.log(total);

// --------------------------------------------------------

let arr = [1, 2, 3, 4];
let total = arr.reduce(function (result, item) {
    /* 
        reduce中传递了第二个参数，则初始第一次执行回调函数，result就是第二个参数值[第二个参数被理解为是result初始值]
        接下来从数组第一项开始迭代
    */
    console.log(result, item); // => 0 1 / 1 2 / 3 3 / 6 4
    return result + item;
}, 0);
console.log(total);

// --------------------------------------------------------

// 闭包应用:利用闭包的 "保存" 作用，我们可以把一些信息预先存储起来[预处理]，供其下级上下文中后期拿来使用，我们把这种预先存储/预先处理的机制称之为"函数柯里化"
const fn = function fn(...params) {
    // 基于ES6剩余运算符获取传递的实参集合[数组集合]
    // 基于arguments获取[类数组集合]
    return function small(...args) {
        params = params.concat(args);
        // 数组求和
        return params.reduce((result, item) => result + item);
    };
};
let res = fn(1, 2)(3);
console.log(res);

// --------------------------------------------------------

// 重写reduce
Array.prototype.reduce = function reduce(callback, initial) {
    let self = this,
        i = 0,
        result = initial,
        len = self.length,
        isInit = typeof initial === 'undefined' ? false : true;
    // 格式验证
    if (typeof callback !== 'function')
        throw new TypeError(`${callback} is not a function`);
    if (len === 0 && !isInit)
        throw new TypeError(`reduce of empty array with no initial value`);
    if (len === 0 && isInit) return initial;
    if (len === 1 && !isInit) return self[0];
    if (!isInit) {
        result = self[0];
        i = 1;
    }
    for (; i < len; i++) {
        result = callback(result, self[i], i);
    }
    return result;
};
/* 
    数组为空 & 没有初始值
    reduce of empty array with no initial value

    数组为空 & 有初始值
    初始值

    数组只有一项 & 没有初始值
    第一项的值

    数组只有一项 & 有初始值
    正常迭代一次处理
*/

let arr = [1, 2, 3, 4];
let total = arr.reduce(function (result, item) {
    console.log(result, item); // => 1 2 / 3 3 / 6 4
    return result + item;
});
console.log(total);

// --------------------------------------------------------

function func(x, y) {
    return x + y;
}
alert(func);
console.log(func); // => 控制台看到的是字符串，只不过前面标注一个 f ，代表是函数转换成为的字符串[控制台的机制]
/**
 * 无论是 alert 还是 console.log ，在输出函数的时候，都是要把函数转换为字符串，然后再输出，只不过表现形式不同
 *    @1 首先调用 Symbol.toPrimitive 获取原始值，如果不存在这个属性
 *    @2 再调用 valueOf 获取原始值，如果获取的不是原始值
 *    @3 再调用 toString 获取字符串
 *    @4 如果最后想要的是数字，则再 Number 一下
 */

// curring函数
const curring = () => {
    // 在闭包中创建一个params集合，用来存储每一次add执行传递进来的实参值
    let params = [];
    const add = (...args) => {
        params = params.concat(args);
        return add;
    };
    // 基于重构转换为字符串的步骤，我们实现最后的求和操作
    add[Symbol.toPrimitive] = () => {
        return params.reduce((result, item) => result + item);
    };
    return add;
};
let add = curring();
let res = add(1)(2)(3);
console.log(res); // => 6

add = curring();
res = add(1, 2, 3)(4);
console.log(res); // => 10

add = curring();
res = add(1)(2)(3)(4)(5);
console.log(res); // => 15

// --------------------------------------------------------

/* 
    在函数式编程当中有一个很重要的概念就是函数组合，实际上就是把处理数据的函数像管道一样连接起来，然后让数据穿过管道得到最终的结果。
    例如:
    const add1 = x => x + 1;
    const mul3 = x => x * 3;
    const div2 = x => x / 2;
    div2 (mul3(add1(add1(0)))); // => 3

    而这样的写法可读性明显太差了，我们可以构建一个compose函数，它接受任意多个函数作为参数(这些函数都只接受一个参数)，然后compose返回的也是一个函数，达到以下的效果:
    const operate = compose(div2, mul3, add1, add1)
    operate(0) // => 相当于 div2(mul3(add1(add1(0))))
    operate(2) // => 相当于 div2(mul3(add1(add1(2))))

    简而言之: compose可以把类似于f(g(h(x)))这种写法简化成compose(f, g, h)(x), 请你完成compose函数的编写
*/
const add1 = x => x + 1;
const mul3 = x => x * 3;
const div2 = x => x / 2;

// 方案一
/* const compose = function compose(...funcs) {
    // funcs = [div2, mul3, add1, add1]
    // x = 0
    let len = funcs.length;
    if (len === 0) return x => x;
    if (len === 1) return funcs[0];
    return function operate(x) {
        return funcs.reduceRight((result, func) => {
            // func 是每一个迭代的方法
            return func(result);
        }, 0);
    };
}; */

// 方案二
function compose(...funcs) {
    if (funcs.length === 0) {
        return arg => arg;
    }
    if (funcs.length === 1) {
        return funcs[0];
    }
    /* return funcs.reduce(
        (a, b) =>
            (...args) =>
                a(b(...args))
    ); */

    /* return funcs.reduce((a, b) => {
        return (...args) => {
            return a(b(...args));
        };
    }); */

    // [div2, mul3, add1]
    return funcs.reduce((a, b) => {
        // @1 a:div2   b:mul3   return:AN1
        // @2 a:AN1   b:add1   return:AN2
        return x => {
            return a(b(x));
        };
        // AN2(0) -> AN1(add1(0)) -> div2(mul3(add1(0)))
    });
}

// let result = compose(div2, mul3, add1, add1)(0);
let result = compose(div2, mul3, add1)(0);
console.log(result);

result = compose()(0);
console.log(result);

result = compose(add1)(0);
console.log(result);
