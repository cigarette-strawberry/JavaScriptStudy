/**
 * JS是单线程的: 大部分代码都是同步的，但是也有少部分代码是异步编程的
 *    + 定时器
 *    + ajax: 一般都是异步的
 *    + 事件绑定
 *    ----------上述都是异步的宏任务，下面是异步微任务
 *    + promise
 *    + async await
 *    + generator
 *    + requestAnimationFrame
 *    + ...
 */

// ---------------------------------------------------------------------------

/**
 * let p1 = new Promise(); // => Uncaught TypeError: Promise resolver undefined is not a function
 * let p = new Promise([executor]);
 *    [executor]: 可执行函数
 *       + new Promise的时候,在Promise内部会立即把[executor]函数执行
 *       + 函数中一般用来管理一个异步编程代码(不管控异步编程也是可以的)
 *       + 同时给[executor]函数传递两个值「函数类型」: resolve/reject
 *    p是Promise类的一个实例
 *       + 内置私有属性
 *          [[PromiseState]] 实例状态: pending准备状态 fulfilled/resolved成功态 rejected失败态
 *          [[PromiseResult]] 实例的值
 *       + 公共属性方法 Promise.prototype
 *          + then
 *          + catch
 *          + finally
 *          + Symbol(Symbol.toStringTag):"Promise"
 */
let p1 = new Promise((resolve, reject) => {
  /**
   * 在[executor]执行 resolve/reject 都是为了改变promise实例的状态和值「结果」
   *    一但状态被改变成 fulfilled/rejected 则不能再改为其他的状态
   *    resolve('OK'); [[PromiseState]]: fulfilled [[PromiseResult]]: 'OK'
   *    reject('N0'); [[PromiseState]]: rejected [[PromiseResult]]: 'NO'
   * 如果[executor]函数执行报错，则
   *    [[PromiseState]]: rejected
   *    [[PromiseResult]]: 报错原因
   *    Promise内部做了异常信息捕获「try/catch」
   */
  resolve('OK')
  reject('N0')
})
/**
 * 实例状态的改变，可以控制，执行then方法时，存放的两个方法中的某一个方法执行
 *    p.then(onfulfilledCallback, onrejectedCallback)
 *       + 状态成功执行的是: onfulfilledCallback
 *       + 状态失败执行的是: onrejectedCallback
 *       + 并且把[[PromiseResult]]的值传递给方法
 */
p1.then(
  (result) => {
    console.log('成功 =>', result)
  },
  (reason) => {
    console.log('失败 =>', reason)
  }
)

// ---------------------------------------------------------------------------

let p = new Promise((resolve, reject) => {
  console.log(1)
  resolve('OK') // => 同步修改其状态和结果
  console.log(2)
})
console.log(p) //此时状态已经修改为成功...
/**
 * 执行p.then(onfulfilledCallback, onrejectedCallback)
 *    + 首先把传递进来的onfulfilledCallback和onrejectedCallback存储起来「存储在一个容器中: 因为可以基于then给其存放好多个回调函数」
 *    + 其次再去验证当前实例的状态
 *       + 如果实例状态是pending,则不做任何的处理
 *       + 如果已经变为fulfilled/rejected,则会通知对应的回调函数执行「但是不是立即执行，而是把其放置在EventQueue中的微任务队列中」"promise本身不是异步的，是用来管理异步的，但是then方法是异步的「微任务」"
 */
p.then((result) => {
  console.log('成功-->', result)
})
console.log(3)

// ---------------------------------------------------------------------------

let p = new Promise((resolve, reject) => {
  console.log(1)
  setTimeout(() => {
    resolve('0K')
    // + 改变实例的状态和值「同步」
    // + 通知之前基于then存放的onfulfilledCallback执行「异步的微任务: 也是把执行方法的事情放置在EventQueue中的微任务队列中」
    console.log(p)
    console.log(4)
  }, 1000) // => 存储了一个异步的宏任务
  console.log(2)
})
console.log('p', p)
// 此时接受onfulfilledCallback的时候，状态还是pending，此时只把方法存储起来
p.then((result) => {
  console.log('成功-->', result)
})
console.log(3)
// 等1000ms后，执行定时器中的函数「把异步宏任务拿出来执行」

// ---------------------------------------------------------------------------

let p1 = new Promise((resolve, reject) => {
  resolve('OK')
  // reject('N0')
})
let p2 = p1.then(
  (result) => {
    console.log('P1成功-->', result)
    return Promise.reject(10)
  },
  (reason) => {
    console.log('P1失败-->', reason)
    return 5
  }
)
/**
 * 执行then方法会返回一些全新的promise实例p2
 *    p2的状态和值是咋改变的?
 *    + 不论执行的是基于p1.then存放的onfulfilledCallback/onrejectedCallback两个方法中的哪一个
 *    + 只要方法执行不报错
 *       + 如果方法中返回一个全新的Promise实例，则"全新的Promise实例"的成功和失败决定p2的成功和失败
 *       + 如果不是返回promise呢?则 [[PromiseState]]: fulfilled [[PromiseResult]]: 返回值
 *    + 如果方法执行报错: p2的[[PromiseState]]: rejected [[PromiseResult]]: 报错原因
 */
let p3 = p2.then(
  (result) => {
    console.log('P2成功-->', result)
    return 5
  },
  (reason) => {
    console.log('P2失败-->', reason)
    return Promise.resolve(10)
  }
)
p3.then(
  (result) => {
    console.log('P3成功-->', result)
    return 5
  },
  (reason) => {
    console.log('P3失败-->', reason)
    return Promise.resolve(10)
  }
)
console.log(1)
// Promise.resolve('ok')
// Promise.reject('no')

// ---------------------------------------------------------------------------

// 如果 onfulfilledCallback/onrejectedCallback 不传递，则状态和结果都会 "顺延/穿透" 到下一个同等状态应该执行的回调函数上[内部其实是自己补充了一些实现效果的默认函数]
let p1 = new Promise((resolve, reject) => {
  // resolve('OK');
  reject('N0')
})
  .then(null /* result => result */ /* reason => Promise.reject(reason) */)
  .then(
    (result) => {
      console.log('成功-->', result)
    },
    (reason) => {
      console.log('失败-->', reason)
    }
  )
  .then(
    (result) => {
      console.log('成功-->', result)
    },
    (reason) => {
      console.log('失败-->', reason)
    }
  )

// ---------------------------------------------------------------------------

new Promise((resolve, reject) => {
  resolve('OK')
  // reject('N0');
})
  .then((result) => {
    console.log('成功-->', result)
    // console. log(a);
  })
  .then((result) => {
    console.log('成功-->', result)
    return Promise.reject('xx')
  })
  .catch((reason) => {
    console.log('失败-->', reason)
  })
/*
catch只处理状态为失败下做的事情
Promise.prototype.catch = function (onrejectedCallback) {
    return this.then(null, onrejectedCallback);
};
*/
