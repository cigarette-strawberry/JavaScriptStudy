/**
 * 每一次执行THEN都会返回一个新的Promise实例"p2","p2"的状态和结果:
 *    + 由p1.then传入的onfulfilled/onrejected两个方法执行决定
 *       + @1 不论哪个方法执行，如果没有返回新的Promise实例，直接看方法执行是否报错，如果没有报错，则"p2"是成功的，return的值是"p2"的结果
 *       + @2 有返回一个新的Promise实例"AA",则"AA"的状态和结果直接影响了"p2"的结果
 */
let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('ok')
        // reject('no')
    }, 1000);
});

/* let p2 = p1.then(result => {
    console.log(`成功: ${result}`);
    return 100;
}, reason => {
    console.log(`失败: ${reason}`);
    return 0;
});
p2.then(result => {
    console.log(`成功: ${result}`);
}, reason => {
    console.log(`失败: ${reason}`);
}); */

p1.then(result => {
    console.log(`成功: ${result}`);
    throw 'xxx'
}).catch(reason => {
    console.log(`失败: ${reason}`);
});

// ------------------------------------------------------------------------------------------------

(function () {
    "use strict"
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

    // 公共方法(优化代码，减少重复代码)
    function resolvePromise (promise, x, resolve, reject) {
        // promise: 每一次then要返回的新的Promise实例
        // x: onfulfilled/onrejected返回的结果
        // resolve/reject: 他两个执行，可以决定promise是成功还是失败
        if (x === promise) throw new TypeError('Chaining cycle detected for promise #<Promise>');
        if (x !== null && /^(object|function)$/i.test(typeof x))
        {
            var then;
            try
            {
                then = x.then;
            } catch (err)
            {
                reject(err);
            }

            if (typeof then === "function")
            // x是一个Promise/like-Promise实例
            {
                var called = false;
                try
                {
                    then.call(
                        x,
                        function onfulfilled (y) {
                            if (called) return;
                            called = true;
                            resolvePromise(promise, y, resolve, reject);
                        },
                        function onrejected (r) {
                            if (called) return;
                            called = true;
                            reject(r);
                        }
                    );
                } catch (err)
                {
                    if (called) return;
                    reject(err);
                }
                return;
            }
        }
        resolve(x);
    }
    function common (callback, value, promise, resolve, reject) {
        try
        {
            var x = callback(value);
            resolvePromise(promise, x, resolve, reject);
        } catch (err)
        {
            reject(err);
        }
    }

    //原型对象
    Promise.prototype = {
        constructor: Promise,
        then: function then (onfulfilled, onrejected) {
            var self = this,
                delayTimer = null,
                promise
            if (typeof onfulfilled !== 'function')
            {
                onfulfilled = function onfulfilled (result) {
                    return result
                }
            }
            if (typeof onrejected !== 'function')
            {
                onrejected = function onrejected (reason) {
                    throw reason
                }
            }
            // promise是返回的新的实例，执行resolve/reject控制他的状态和结果；但是具体执行哪一个方法，由onfulfilled/onrejected执行决定{是否报错、是否返回新的Promise实例...}
            promise = new Promise(function (resolve, reject) {
                switch (self.state)
                {
                    case 'fulfilled':
                        setTimeout(() => {
                            common(onfulfilled, self.value, promise, resolve, reject)
                        });
                        /* delayTimer = setTimeout(function () {
                            clearTimeout(delayTimer)
                            delayTimer = null
                            try
                            {
                                var x = onfulfilled(self.value)
                                resolvePromise(promise, x, resolve, reject)
                            } catch (error)
                            {
                                reject(error)
                            }
                        }); */
                        break;
                    case 'rejected':
                        setTimeout(() => {
                            common(onrejected, self.value, promise, resolve, reject)
                        });
                        /* delayTimer = setTimeout(function () {
                            clearTimeout(delayTimer)
                            delayTimer = null
                            try
                            {
                                var x = onrejected(self.value)
                                resolvePromise(promise, x, resolve, reject)
                            } catch (error)
                            {
                                reject(error)
                            }
                        }); */
                        break;
                    default:
                        // 向集合中存储的是一个匿名函数，后期执行change方法，先把匿名函数执行，而在匿名函数执行的时候，我们再执行onfulfilled{监听是否报错以及返回值}
                        self.onFulfilledCallbacks.push(function (result) {
                            setTimeout(() => {
                                common(onfulfilled, result, promise, resolve, reject)
                            });
                            /* try
                            {
                                var x = onfulfilled(result)
                                resolvePromise(promise, x, resolve, reject)
                            } catch (error)
                            {
                                reject(error)
                            } */
                        })
                        self.onRejectedCallbacks.push(function (reason) {
                            setTimeout(() => {
                                common(onrejected, reason, promise, resolve, reject)
                            });
                            /* try
                            {
                                var x = onrejected(reason)
                                resolvePromise(promise, x, resolve, reject)
                            } catch (error)
                            {
                                reject(error)
                            } */
                        })
                }
            })
            return promise
        },
        catch: function mycatch (onrejected) {
            return this.then(null, onrejected)
        }
        // finally: function myfinally () { }
    };
    if (typeof Symbol !== "undefined") Promise.prototype[Symbol.toStringTag] = 'Promise';

    //静态属性
    Promise.resolve = function resolve (result) {
        return new Promise(function (resolve) {
            resolve(result)
        })
    };
    Promise.reject = function reject (_, reason) {
        return new Promise(function (reject) {
            reject(reason)
        })
    };

    function isPromise (x) {
        if (x !== null && /^(object|function)$/i.test(typeof x))
        {
            if (typeof x.then === "function")
            {
                return true;
            }
        }
        return false;
    }

    Promise.all = function all (promises) {
        if (!Array.isArray(promises)) throw new TypeError('promises must be an Array');
        varn = 0,
            results = [];
        return new Promise(function (resolve, reject) {
            for (var i = 0; i < promises.length; i++)
            {
                (function (i) {
                    var promise = promises[i];
                    if (!isPromise(promise)) promise = Promise.resolve(promise);
                    promise.then(function (result) {
                        n++;
                        results[i] = result;
                        if (n >= promises.length) resolve(results);
                    }).catch(function (reason) {
                        reject(reason);
                    });
                })(i);
            }
        });
    };
    // Promise.any = function any () { };

    //测试专用
    Promise.deferred = function deferred () {
        var result = {};
        result.promise = new Promise(function (resolve, reject) {
            result.resolve = resolve;
            result.reject = reject;
        });
        return result;
    };

    /*暴露PAI */
    if (typeof window !== "undefined") window.Promise = Promise;
    if (typeof module === "object" && typeof module.exports === "object") module.exports = Promise;
})();

// ------------------------------------------------------------------------------------------------

//模拟数据请求
const query = interval => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(interval);
        }, interval);
    });
};
Promise.all([query(1000), query(3000), query(2000), 4000]).then(results => {
    console.log(results);
}).catch(reason => {
    console.log(reason);
});