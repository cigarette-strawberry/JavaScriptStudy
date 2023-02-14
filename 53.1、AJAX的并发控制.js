/**
 * Promise.all 并发限制 及 async-pool的应用
 *    + 并发限制是指，每个时刻并发执行的promise数量是固定的，最终的执行结果还是保持原来的
 */
const asyncPool = require('./asyncpool')

const delay = function delay (interval) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(interval)
        }, interval);
    })
}

let tasks = [() => {
    return delay(1000)
}, () => {
    return delay(1003)
}, () => {
    return delay(1005)
}, () => {
    return delay(1002)
}, () => {
    return delay(1004)
}, () => {
    return delay(1006)
}]

/* 没有做并发限制 */
Promise.all(tasks.map(task => task())).then(results => {
    console.log('ALL DONE', results);
})

/* 做了并发限制 */
let results = []
asyncPool(2, tasks, (task, next) => {
    console.log(task);
    task().then(result => {
        console.log(result);
        results.push(result)
        next()
    })
}, () => {
    // 所有请求都处理成功之后，触发的回调函数
    console.log('ALL DONE', results);
})