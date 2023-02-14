/**
 * 进程 & 线程
 *    进程: 一般是一个运行的程序「例如: 浏览器打开一个页面，就是开辟一个进程」
 *    线程: 进程中具体干事的东西，如果一个进程中我们同时做多个事情，需要开辟多个线程「进程包含线程」
 * 
 * 浏览器是多线程的
 *    GUI渲染线程: 渲染页面「加载和识别HTML/CSS这些代码的，到最后可以渲染出对应的页面」
 *    JS引擎线程: 渲染解析JS代码的
 *    事件触发线程: 设置一个事件绑定，事件触发线程监听DOM的操作，控制事件是否触发，绑定的方法是否执行
 *    定时触发器线程: 设置一个定时器，我们有一个线程去监听，到时间后执行对应的方法
 *    异步HTTP请求线程: 页面中从服务器请求资源文件信息或者基于Ajax从服务器获取数据，都是这个线程处理的
 *    。。。。。。
 * 
 * JS是单线程的: 因为浏览器只分配一个线程去渲染解析JS代码
 *    渲染JS代码的时候，上一个任务/代码没有处理完，下一个任务是不能去执行的，同时只能做一件事「同步编程」
 *    JS代码中，也有一些操作是异步编程的: "单线程异步编程"
 *       + EventQueue 事件队列: 等待执行的任务
 *       + WebAPI 监听区域: 监听哪些任务可以去执行了
 *       + EventLoop 事件循环机制
 * 
 * JS中的那些操作是异步编程的
 *    @1 宏任务
 *       setTimeout/setInterval 定时器
 *       事件绑定/队列
 *       XMLHttpRequest(ajax/axios)/Fetch 数据通信
 *       MessageChannel
 *       setImmediate「Node」
 *       ...
 * 
 *    @2 微任务
 *       requestAnimationFrame「有争议」JS动画
 *       Promise.then/catch/finally
 *       async/await
 *       queueMicrotask 基于这个方法可以创建一个异步的微任务(ES6 兼容性比较差)
 *       MutationObserver 监听DOM的改变
 *       IntersectionObserver 监听元素与当前视口交叉信息「图片延迟加载基于这个可以实现」
 *       process.nextTick「Node」
 *       ...
 */

setTimeout(() => {
    console.log(1);
}, 20);
console.log(2);
setTimeout(() => {
    console.log(3);
}, 10);
console.log(4);
console.time('AA');
for (let i = 0; i < 90000000; i++)
{
    // do soming 
}
console.timeEnd('AA'); //=>AA: 79ms 左右
console.log(5);
setTimeout(() => {
    console.log(6);
}, 8);
console.log(7);
setTimeout(() => {
    console.log(8);
}, 15);
console.log(9);
// 2 4 5 7 9 3 1 6 8