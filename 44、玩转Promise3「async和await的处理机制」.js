/**
 * ES7: generator + promise 的语法糖 async + await
 *    https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function
 */

// ------------------------------------------------------------------------------------------------

/**
 * async: 函数修饰符   控制函数返回promise实例
 *    + 函数内部执行报错，则返回失败的promise实例，值是失败的原因
 *    + 自己返回一个promise，以自己返回的为主
 *    + 如果函数内部做了异常捕获，则还是成功态
 *    + ...
 */

async function fn() {
  // return 11 // => Promise { 11 }
  return Promise.reject('no')
  /* try {
    console.log(a)
  } catch (error) {}
  return 10 */
}
console.log(fn())

// ------------------------------------------------------------------------------------------------

// 使用async的主要目的: 是为了在函数内部使用await
// function fn () {
//     await 1 // Uncaught SyntaxError: await is only valid in async function
// }

/**
 * await: 后面应该放置一个promise实例「我们书写的不是，浏览器也会把其变为promise实例」，await会中断函数体中其下面的代码执行「await表达式会暂停整个async函数的执行进程并出让其控制权」；只有等待await后面的promise实例是成功态之后，才会把之前暂停的代码继续执行，如果后面的promise实例是失败的，则下面的代码就不在执行了
 *    + await是异步的微任务
 *    + 函数体中遇到await,后面代码该咋地咋地，但是下面的代码会暂停执行「把他们当做一个任务，放置在EventQueue的微任务队列中」
 */
function api(interval) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(interval)
    }, interval)
  })
}
async function fn() {
  let result1 = await api(1000)
  console.log(result1)

  let result2 = await api(3000)
  console.log(result2)

  let result3 = await 1 // => await Promise.resolve(1)
  console.log(result3) // => 1
}
fn()

// ------------------------------------------------------------------------------------------------

var resolveAfter2Seconds = function resolveAfter2Seconds() {
  console.log('starting slow promise')
  return new Promise((resolve) => {
    setTimeout(function () {
      resolve('slow')
      console.log('slow promise is done')
    }, 2000)
  })
}
var resolveAfter1Second = function resolveAfter1Second() {
  console.log('starting fast promise')
  return new Promise((resolve) => {
    setTimeout(function () {
      resolve('fast')
      console.log('fast promise is done')
    }, 1000)
  })
}

// sequential:相继的   [sɪˈkwenʃl]
var sequential = async function sequential() {
  console.log('==SEQUENTIAL START==')
  const slow = await resolveAfter2Seconds()
  console.log(slow)
  const fast = await resolveAfter1Second()
  console.log(fast)
}
// concurrent: 同时发生的   [kənˈkʌrənt]
var concurrent = async function concurrent() {
  console.log('==CONCURRENT START with await==')
  const slow = resolveAfter2Seconds()
  const fast = resolveAfter1Second()
  console.log(await slow)
  console.log(await fast)
}
var concurrentPromise = function concurrentPromise() {
  console.log('==CONCURRENT START with Promise.all==')
  return Promise.all([resolveAfter2Seconds(), resolveAfter1Second()]).then(
    (messages) => {
      console.log(messages[0])
      console.log(messages[1])
    }
  )
}
// parallel:平行的   [ˈpærəlel]
var parallel = async function parallel() {
  console.log('==PARALLEL with await Promise.all==')
  await Promise.all([
    // (async () => console.log(await resolveAfter2Seconds()))(),
    // (async () => console.log(await resolveAfter1Second()))()
    (async () => {
      let result = await resolveAfter2Seconds()
      console.log(result)
    })(),
    (async () => {
      let result = await resolveAfter1Second()
      console.log(result)
    })(),
  ])
}
var parallelPromise = function parallelPromise() {
  console.log(' ==PARALLEL with Promise. then==')
  resolveAfter2Seconds().then((message) => console.log(message))
  resolveAfter1Second().then((message) => console.log(message))
}

sequential()
concurrent()
concurrentPromise()
parallel()
parallelPromise()
