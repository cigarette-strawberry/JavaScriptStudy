/**
 * ajax并发控制
 * SPA 单页面应用
 * MPA 多页面应用
 * http 并发限制 同源 默认 5-7
 *
 * 基于Promise.all实现Ajax的串行和并行
 *    串行:一个请求发送完成，再去发送第二个请求[两个请求之间有关联]
 *    并行:多个请求之间没有任何的关联，此时我们可以同时发送多个请求[一般指，当所有请求成功后，我们统一处理啥事情]
 */

/* 串行 1 Promise */
new Promise((resolve, reject) => {
    resolve('OK');
}).then(data => {
    console.log('第一个');
    return new Promise((resolve, reject) => {
        resolve('OK');
    })
}).then(data => {
    console.log('第二个');
});

/* 串行 2 async await */
(async () => {
    let data = await new Promise((resolve, reject) => {
        resolve('OK1')
    })
    console.log(data);

    data = await new Promise((resolve, reject) => {
        resolve('OK2')
    })
    console.log(data);
})()

/* 并行 1 Promise.all */
let req1 = new Promise((resolve, reject) => {
    resolve('OK1')
})
let req2 = new Promise((resolve, reject) => {
    resolve('OK2')
})
let req3 = new Promise((resolve, reject) => {
    resolve('OK3')
})
Promise.all([req1, req2, req3]).then(results => {
    console.log(results);
})