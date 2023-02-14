/**
 * 一个项目中，我们可能会出现多个事情都需要基于发布订阅来管理，一个事件池不够
 *    + 管理多个事件池
 *       + 面向对象类 & 实例
 *       + 每个实例都有一个自己的私有事件池
 *       + subscribe / unsubscribe / fire 公用的
 *    + 一个事件池支持不同的自定义事件类型
 */

class Sub {
    // 实例私有的属性: 私有的事件池
    pond = []
    // 原型上设置方法: 向事件池中订阅任务
    subscribe (func) {
        let self = this,
            pond = this.pond
        if (!pond.includes(func)) pond.push(func)
        return function unsubscribe () {
            let i = 0,
                len = pond.length,
                item = null
            for (; i < len; i++)
            {
                item = pond[i]
                if (item === func)
                {
                    pond.splice(i, 1)
                    break
                }
            }
        }
    }
    // 通知当前实例所属事件池中的任务执行
    fire (...params) {
        let self = this,
            pond = this.pond
        pond.forEach(item => {
            item(...params)
        })
    }
}

let Sub1 = new Sub()
Sub1.subscribe(function () {
    console.log(1, arguments);
})
Sub1.subscribe(function () {
    console.log(2, arguments);
})
setTimeout(() => {
    Sub1.fire(100, 200)
}, 1000);

let Sub2 = new Sub()
Sub2.subscribe(function () {
    console.log(3, arguments);
})
Sub2.subscribe(function () {
    console.log(4, arguments);
})
setTimeout(() => {
    Sub2.fire(300, 400)
}, 2000);

// ------------------------------------------------------------------------------------------------------

let sub = (function () {
    let pond = {}

    // 向事件池中追加指定自定义事件类型的方法
    const on = function on (type, func) {
        // 每一次增加的时候，验证当前类型在事件池中是否已经存在
        !Array.isArray(pond[type]) ? pond[type] = [] : null
        let arr = pond[type]
        if (arr.includes(func)) return
        arr.push(func)
    }

    // 从事件池中移除指定自定义事件类型的方法
    const off = function off (type, func) {
        let arr = pond[type],
            i = 0,
            item = null
        if (!Array.isArray(arr)) throw new TypeError(`${type} 自定义事件在事件池中并不存在`)
        for (; i < arr.length; i++)
        {
            item = arr[i]
            if (item === func)
            {
                // 移除掉
                // arr.splice(i, 1) // 这样会导致数组塌陷
                arr[i] = null // 这样只是让集合中当前项的值变为null，但是集合的结构是不发生改变的[索引不变]；下一次执行emit的时候，遇到当前项是null，我们再把其移除掉即可
                break
            }
        }
    }

    // 通知事件池中指定自定义事件类型的方法执行
    const emit = function emit (type, ...params) {
        let arr = pond[type],
            i = 0,
            item = null
        if (!Array.isArray(arr)) throw new TypeError(`${type} 自定义事件在事件池中并不存在`)
        for (; i < arr.length; i++)
        {
            item = arr[i]
            if (typeof item === 'function')
            {
                item(...params)
                continue
            }
            // 不是函数的值都移除掉即可
            arr.splice(i, 1)
            i--
        }
    }

    return {
        on, off, emit
    }
})()

const fn1 = () => console.log(1);
const fn2 = () => console.log(2);
const fn3 = () => {
    console.log(3);
    sub.off("A", fn1)
    sub.off("A", fn2)
}
const fn4 = () => console.log(4);
const fn5 = () => console.log(5);
const fn6 = () => console.log(6);

sub.on('A', fn1)
sub.on('A', fn2)
sub.on('A', fn3)
sub.on('A', fn4)
sub.on('A', fn5)
sub.on('A', fn6)
setTimeout(() => {
    sub.emit('A')
}, 1000);

setTimeout(() => {
    sub.emit('A')
}, 3000);

/* sub.on('B', fn4)
sub.on('B', fn5)
sub.on('B', fn6)
setTimeout(() => {
    sub.emit('B')
}, 2000); */