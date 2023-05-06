// let p = new Promise([execute function])
//    + 立即把[execute function]这个函数执行
//    + p是Promise实例
//       [[PromiseState]] : pending / resolved{ fulfilled } / rejected
//       [[PromiseResult]] : undefined
let p1 = new Promise((resolve, reject) => {
  // 修改状态和值是立即处理的，而且一但状态改变了，则不能再改变
  resolve(10) // [[PromiseState]]: resolved{ fulfilled}   [[PromiseResult]]: 10
  reject(0) // [[PromiseState]]: rejected   [[PromiseResult]]: 0
})
// 当我们执行then的时候，传递 onfulfilled 、 onrejected 方法
//    @1 如果此时已经知道p1的状态，会把对应的函数执行「不是立即执行，而是创建异步的微任务 {先放在WebAPI中， 但是此时已经知道是可以执行的，所以紧接着就挪至到EventQueue中}」

p1.then(
  function onfulfilled() {},
  function onrejected() {}
)

// --------------------------------------------------------------------------

let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    // 后期执行resolve的时候:
    //    立即改变状态和结果
    //    然后再通知对应的事件池以及其中的方法执行 「异步的微任务:先放置到WebAPI中，但是也知道是可以执行的，随后直接挪至到EventQueue中」
    resolve(10)
  }, 1000)
})
// @2 如果此时不知道p1的状态，会把 onfulfilled 、 onrejected 存储到对应的事件池中 [理解为：进入WebAPI去监听，只有知道实例的状态，才可以执行]；resolve/reject执行，立即修改实例的状态和值，也决定了WebAPI中监听的方法（onfulfilled 、 onrejected）哪一个去执行 [挪至到EventQueue中，异步微任务队列]；等待其它同步代码执行完，再拿出来执行
p1.then(
  function onfulfilled(result) {
    console.log(`成功: ${result}`)
  },
  function onrejected(reason) {
    console.log(`失败: ${reason}`)
  }
)
p1.then(
  function onfulfilled(result) {
    console.log(`成功: ${result}`)
  },
  function onrejected(reason) {
    console.log(`失败: ${reason}`)
  }
)

// --------------------------------------------------------------------------

Promise.resolve(10)
  // 每一次then都会返回-个新的Promise实例「AA」
  //    @1 onfulfilled/onrejected 执行是否报错，如果不报错，AA是成功的
  //    @2 如果方法执行返回的是一个全新的Promise实例「BB」，那BB最后的状态，直接决定AA的状态
  .then(
    function onfulfilled(result) {
      console.log(`成功: ${result}`)
      return Promise.reject(0)
    },
    function onrejected(reason) {
      console.log(`失败: ${reason}`)
    }
  )
  .then(
    function onfulfilled(result) {
      console.log(`成功: ${result}`)
    },
    function onrejected(reason) {
      console.log(`失败: ${reason}`)
    }
  )

// --------------------------------------------------------------------------

const fn = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('OK')
    }, 1000)
  })
}

;(async function () {
  let n = 10
  await 100 // => await Promise.resolve(100)   创建一个异步任务WebAPI 「如果await后面是成功的promise实例，则执行当前上下文中await下面的代码」；因为当前案例，我们知道await后面是成功的，所以直接挪至到EventQueue中等着执行即可;

  let m = 20
  await fn() // => 先把fn立即执行，返回一个promise实例{CC}「此时还不知道状态」   创造一个异步的任务WebAPI，只有当CC是成功的，我们才能确定下面代码执行，此时再挪至到EventQueue中，等待异步微任务执行
  console.log(n + m)
})()

// --------------------------------------------------------------------------

async function async1() {
  console.log('async1 start') // 2
  await async2()
  console.log('async1 end') // 6
}
async function async2() {
  console.log('async2') // 3
}
console.log('script start') // 1
setTimeout(function () {
  console.log('setTimeout') // 8
}, 0)
async1()
new Promise(function (resolve) {
  console.log(' promise1') // 4
  resolve()
}).then(function () {
  console.log('promise2') // 7
})
console.log('script end') // 5
