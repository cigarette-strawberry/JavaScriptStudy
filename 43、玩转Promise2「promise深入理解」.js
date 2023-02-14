/**
 * 微任务队列优先于宏任务队列执行，
 * 微任务队列上创建的宏任务会被后添加到当前宏任务队列的尾端，微任务队列中创建的微任务会被添加到微任务队列的尾端。
 * 只要微任务队列中还有任务，宏任务队列就只会等待微任务队列执行完毕后再执行
 *
 * 主线程 >> 主线程上创建的微任务 >> 主线程上创建的宏任务
 */
new Promise((resolve) => {
  console.log('promise1')
  resolve()
})
  .then(() => {
    console.log('then11')
    // return new Promise(resolve => {
    new Promise((resolve) => {
      console.log('promise2')
      resolve()
    })
      .then(() => {
        console.log('then21')
      })
      .then(() => {
        console.log('then22')
      })
  })
  .then(() => {
    console.log('then12')
  })
// => promise1 then11 promise2 then21 then12 then22
// 如果加一个 return 返回的则是一个新的Promise 结果就会发生改变 => promise1 then11 promise2 then21 then22 then12

// Promise.all([promise数组: {要求数组中的每一项尽可能都是promise实例}]): 返回一个新的promise实例AA, AA成功还是失败，取决于数组中的每一个promise实例是成功还是失败，只要有一个是失败，AA就是失败的，只有都成功AA才是成功的
// Promise.race: 最先知道状态的promise实例，是成功还是失败，决定了AA是成功还是失败

function fn(interval) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(interval)
    }, interval)
  })
}
let p1 = fn(3000)
let p2 = fn(1000)
let p3 = Promise.resolve(0)
// let p3 = Promise.reject(0)
Promise.all([p1, p2, p3])
  .then((results) => {
    // 不论谁先知道状态，最后结果的顺序和传递数组的顺序要保持一致
    console.log('results', results)
  })
  .catch((reason) => {
    // 处理过程中，遇到一个失败，则All立即为失败，结果就是当前实例失败的原因
    console.log('reason', reason)
  })
