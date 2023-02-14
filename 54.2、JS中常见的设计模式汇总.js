/**
 * Publish & Subscribe 发布订阅模式「自定义事件处理的一种方案」
 *    灵感来源于: addEventListener DOM2事件绑定
 *       + 给当前元素的某一个事件行为，绑定多个不同的方法「事件池机制」
 *       + 事件行为触发，会依次通知事件池中的方法执行
 *       + 支持内置事件{标准事件，例如: click、dblclick、mouseenter...}
 *    应用场景: 凡是某个阶段到达的时候，需要执行很多方法「更多时候，到底执行多少个方法是不确定的，需要编写业务边处理」，我们都可以基于发布订阅设计模式来管理代码；   创建事件池->发布计划   向事件池中加入方法->向计划表中订阅任务   fire->通知计划表中的任务执行
 *
 * Observer观察者模式
 * Mediator中介者模式
 *
 * jQuery也有发布订阅的操作   let $plan1 = $.Callbacks()   $plan1.add   $plan1.remove   $plan1.fire
 */

;(function () {
  // 自己创造的事件池
  let pond = []

  // 向事件池中注入方法
  function subscribe(func) {
    // 去重处理
    if (!pond.includes(func)) {
      pond.push(func)
    }
    // 每一次执行，返回的方法是用来移除当前新增的这一项的
    return function unsubscribe() {
      pond = pond.filter((item) => item !== func)
    }
  }

  // 通知事件池中的每个方法执行
  subscribe.fire = function fire(...params) {
    pond.forEach((item) => {
      if (typeof item === 'function') {
        item(...params)
      }
    })
  }

  window.subscribe = subscribe
})()

// 大函数:subscribe 执行返回小函数:unsubscribe 形成闭包 所以传入的 func 就会被保存起来 此时我们就知道 这个 func 是谁
let unsubscribe1 = subscribe(function () {
  console.log(1, arguments)
})
subscribe(function () {
  console.log(2, arguments)
})
subscribe(function () {
  console.log(3)
  unsubscribe1()
})
subscribe(function () {
  console.log(4)
})

setTimeout(() => {
  subscribe.fire(1, 2, 3)
}, 1000)

setTimeout(() => {
  subscribe.fire(1, 2, 3)
}, 2000)

// ----------------------------------------------------------------------------------------------------------

/* 需求：从服务器获取数据，获取数据后要做很多事情 */
// A模块
/* const fn1 = data => { }
subscribe(fn1)
// B模块
const fn2 = data => { }
subscribe(fn2)
// C模块
const fn3 = data => { }
subscribe(fn3)
// D模块
const fn4 = data => { }
subscribe(fn4)
// E模块
const fn5 = data => { }
subscribe(fn5)

query().then(data => {
    subscribe.fire(data)
}) */

// ----------------------------------------------------------------------------------------------------------

let $plan1 = $.Callbacks()
$plan1.add(function () {
  console.log(1, arguments)
})
$plan1.add(function () {
  console.log(2, arguments)
})
setTimeout(() => {
  $plan1.fire(100, 200)
}, 1000)

let $plan2 = $.Callbacks()
$plan2.add(function () {
  console.log(3, arguments)
})
$plan2.add(function () {
  console.log(4, arguments)
})
setTimeout(() => {
  $plan2.fire(300, 400)
}, 2000)
