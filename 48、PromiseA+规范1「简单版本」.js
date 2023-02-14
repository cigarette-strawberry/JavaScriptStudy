/*
* 每一个promise实例都具备:
*    [[PromiseState]]: pending/fulfilled(resolved)/rejected
*    [[PromiseResult]]: 值
*
* execute function
*    + 传递的如果不是函数: Uncaught TypeError: Promise resolver ? is not a function
*    + 立即把函数执行
*    + 形参: resolve/reject 两个函数「立即修改promise实例的 [[PromiseState]]/[[PromiseResult]] 」
*    + 函数执行报错，则实例是失败态，并且结果是报错的原因
*
* 不允许不使用new来执行，必须 new Promise
*/
let p1 = new Promise((resolve, reject) => {
    console.log(a);
});

// 执行THEN的时候，如果知道了实例状态，直接执行「不是立即的，也是一个异步微任务」对应的方法
// 此时还不知道实例的状态，则先把方法存储取来，等到后期知道状态的时候「resolve/ reject执行」，再通知之前存储的方法执行即可「异步微任务」

p1.then(result => { }, reason => { });
p1.then(result => { }, reason => { });

// -------------------------------------------------------------------------------------------------

(function () {
    //构造函数
    function Promise (execute) {
        var self = this,
            delayTimer = null
        if (typeof execute !== "function") throw new TypeError('Promise resolver ' + execute + ' is not a function')
        if (!(self instanceof Promise)) throw new TypeError('undefined is not a promise')

        self.state = 'pending'
        self.value = undefined
        self.onFulfilledCallbacks = []
        self.onRejectedCallbacks = []
        var change = function change (State, Value) {
            if (self.state !== 'pending') return

            self.state = State
            self.value = Value

            delayTimer = setTimeout(function () {
                clearTimeout(delayTimer)
                delayTimer = null
                var callbacks = self.state === 'fulfilled' ? self.onFulfilledCallbacks : self.onRejectedCallbacks,
                    i = 0
                for (; i < callbacks.length; i++)
                {
                    callbacks[i](self.value)
                }
            });
        }

        try
        {
            execute(function resolve (result) {
                change('fulfilled', result)
            }, function reject (reason) {
                change('rejected', reason)
            })
        } catch (error)
        {
            change('rejected', error.message)
        }
    }

    //原型对象
    Promise.prototype = {
        constructor: Promise,
        then: function then (onfulfilled, onrejected) {
            var self = this,
                delayTimer = null

            switch (self.state)
            {
                case 'fulfilled':
                    delayTimer = setTimeout(function () {
                        clearTimeout(delayTimer)
                        delayTimer = null
                        onfulfilled(self.value)
                    });
                    break;
                case 'rejected':
                    delayTimer = setTimeout(function () {
                        clearTimeout(delayTimer)
                        delayTimer = null
                        onrejected(self.value)
                    });
                    break;
                default:
                    self.onFulfilledCallbacks.push(onfulfilled)
                    self.onRejectedCallbacks.push(onrejected)
            }
        },
        catch: function mycatch () { }
        // finally: function myfinally () { }
    };
    if (typeof Symbol !== "undefined") Promise.prototype[Symbol.toStringTag] = 'Promise';

    //静态属性
    Promise.resolve = function resolve () { };
    Promise.reject = function reject () { };
    Promise.all = function all () { };
    // Promise.any = function any () { };

    /*暴露PAI */
    if (typeof window !== "undefined") window.Promise = Promise;
    if (typeof module === "object" && typeof module.exports === "object") module.exports = Promise;
})();

// 测试
let p2 = new Promise((resolve, reject) => {
    console.log(1);
    // resolve(100)
    // reject(0)
    setTimeout(() => {
        resolve(100)
        console.log(4);
    }, 1000);
});
console.log(2);
p2.then(result => { console.log(`成功:${result}`); }, reason => { console.log(`失败:${reason}`); });
p2.then(result => { console.log(`成功:${result}`); }, reason => { console.log(`失败:${reason}`); });
console.log(3);