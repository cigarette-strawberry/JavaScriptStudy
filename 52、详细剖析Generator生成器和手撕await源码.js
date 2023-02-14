/**
 * function* 函数名字(){} 创建一个生成器函数
 *
 * generator执行「不能加new」，并没有把函数体中的代码执行，返回的结果是把自己当做类，创建的一个实例 "迭代器对象"
 *    itor.__proto__ === generator.prototype
 *       + name: 'xiaowu'
 *    generator.prototype.__proto__ === GeneratorFunction.prototype
 *       + next
 *       + return
 *       + throw
 *       + Symbol.toStringTag : 'Generator'
 *    GeneratorFunction.prototype.__proto__ === ?.prototype
 *       + Symbol.iterator
 * 
 * react
 * redux-saga / DVA / UMI
 * redux-saga 的核心就是 generator
 */

function* generator () {
    console.log('OK');
}
generator.prototype.name = 'xiaowu';
let itor = generator();
console.log(itor);
console.log(itor instanceof generator); // true
console.log(({}).toString.call(itor)); // "[object Generator]"

// ----------------------------------------------------------------------------------------------------------

function* generator () {
    console.log('A');
    yield 1;

    console.log('B');
    yield 2;

    console.log('C');
    yield 3;

    console.log('D');
    return 4;
}
let itor = generator();
// 执行NEXT方法，可以让GENERATOR函数中的代码执行；每一次执行NEXT，遇到YIELD则结束；返回结果是具备DONE/VALUE的对象，并且VALUE值是YIELD后面的值；
console.log(itor.next()); // 输出 'A' { value: 1, done: false }
console.log(itor.next()); // 输出 'B' { value: 2, done: false }
console.log(itor.next()); // 输出 'C' { value: 3, done: false }
console.log(itor.next()); // 输出 'D' { value: 4, done: true }
console.log(itor.next()); // { value: undefined, done: true }
console.log(itor.return('RETURN')); // { value: 'RETURN', done: true }
console.log(itor.throw('xxx')); // 直接抛出异常信息，没有返回值，后续的代码都不能再执行了

// ----------------------------------------------------------------------------------------------------------

function* generator () {
    console.log('A'); // A
    let A = yield 1;
    console.log('B', A); // 100
    let B = yield 2;
    console.log('C', B); // 200
}
let itor = generator();
console.log(itor.next()); // { value: 1, done: false }
// 每一次NEXT传递的值「第一次传递的值没用」: 都是作为上一次YIELD的返回结果
console.log(itor.next(100)); // { value: 2, done: false }
console.log(itor.next(200)); // { value: undefined, done: true }

// ----------------------------------------------------------------------------------------------------------

function* generator1 () {
    yield 1;
    yield 2;
}
function* generator2 () {
    yield 3;
    yield generator1();
    yield 4;
}
let itor = generator2();
console.log(itor.next()); // { value: 3, done: false }
console.log(itor.next()); // { value: generator1执行创建的迭代器对象, done: false }
console.log(itor.next()); // { value: 4, done: false }
console.log(itor.next()); // { value: undefined, done; true }
// =============================
function* generator1 () {
    yield 1;
    yield 2;
}
function* generator2 () {
    yield 3;
    yield* generator1();
    yield 4;
}
let itor = generator2();
console.log(itor.next()); // { value: 3, done: false }
console.log(itor.next()); // { value: 1, done: false }
console.log(itor.next()); // { value: 2, done: false }
console.log(itor.next()); // { value: 4, done; false }
console.log(itor.next()); // { value: undefined, done; true }

// ----------------------------------------------------------------------------------------------------------

// 模拟数据请求
const query = interval => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(interval);
        }, interval);
    });
};
// 需求:第一个请求「1000MS」；第一个请求成功，才能发送第二个请求「2000MS」；第二个请求成功了，我们才可以发送第三个请求「3000MS」；当第三个请求也成功了，才算任务完成...   "串行请求：下一个请求的发送需要依赖上一个请求的结果"
// "并行"：多个请求同时发送「相互之间没有任何依赖」，一般指所有请求都成功，我们再去做啥事情 => Promise.all
// 真实项目中，并行请求是最多的，偶尔有一些需求需要串行处理；并行请求过多也不是什么好事，所以我们需要"并发管理、并行管控"；

// 方案一：基于PROMISE中的THEN链实现串行即可
query(1000).then(result => {
    console.log(`第一个请求成功: ${result}`);
    return query(2000);
}).then(result => {
    console.log(`第二个请求成功: ${result}`);
    return query(3000);
}).then(result => {
    console.log(`第三个请求成功: ${result}`);
});
// =============================
// 方案二：基于generator处理
function* generator () {
    let result = yield query(1000);
    console.log(`第一个请求成功: ${result}`);

    result = yield query(2000);
    console.log(`第二个请求成功: ${result}`);

    result = yield query(3000);
    console.log(`第三个请求成功: ${result}`);
}
let itor = generator();
itor.next().value.then(result => {
    itor.next(result).value.then(result => {
        itor.next(result).value.then(result => {
            itor.next(result);
        });
    });
});
// =============================
// 方案三：自己写一个方法generator
// 帮助我们把generator函数中的内容一点点去迭代
const isPromise = function isPromise (x) {
    if (x !== null && /^(object|function)$/i.test(typeof x))
    {
        if (typeof x.then === "function")
        {
            return true;
        }
    }
    return false;
}
const AsyncFunction = function AsyncFunction (generator, ...params) {
    return new Promise(function (resolve, reject) {
        let itor = generator(...params);
        const next = x => {
            let {
                done,
                value
            } = itor.next(x);
            if (done)
            {
                resolve(value);
                return;
            }
            if (!isPromise(value)) value = Promise.resolve(value);   // 返回值不是Promise实例 要把它变为Promise实例
            value.then(
                result => next(result),   // 成功
                reason => reject(reason)   // 失败
            );
        }
        next();   // 第一次先执行
    });
};
AsyncFunction(function* generator () {
    let result = yield query(1000);
    console.log(`第一个请求成功: ${result}`);
    result = yield query(2000);
    console.log(`第二个请求成功: ${result}`);
    result = yield query(3000);
    console.log(`第三个请求成功: ${result}`);
}).then(() => {
    // GENERATOR函数中的内容全部正常执行完「例如:所有请求都成功」
    console.log('都成功了!!');
}).catch(reason => {
    // GENERATOR函数执行中出现问题「例如某个请求失败」，则直接结束即可
    console.log('请求失败', reason);
});
// =============================
// 方案四：await   就是GENERATOR + PROMISE的语法糖
(async function () {
    let result = await query(1000);
    console.log(`第一个请求成功: ${result}`);

    result = await query(2000);
    console.log(`第二个请求成功: ${result}`);

    result = await query(3000);
    console.log(`第三个请求成功: ${result}`);
})()
