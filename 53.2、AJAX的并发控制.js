const delay = function delay (interval) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // if (interval === 1004) reject(interval)
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

/* JS实现Ajax并发请求控制的两大解决方案 */

/* 方案1：限制并发的数量limit，限制多少个，我们创造多少个工作区；每个工作区都在发送请求，如果其中某个工作区请求成功，我们从总任务中，继续拿到下一个任务放到这个工作区中去处理 */
// tasks:总任务列表[数组，数组中每一项是一个函数，函数执行发送ajax请求，返回的是一个Promise实例]
// limit:限制并发数量[建议一般小于5个]

const createRequest = function createRequest (tasks, limit) {
    if (!Array.isArray(tasks)) throw new TypeError('tasks must be an array')
    if (typeof limit !== 'number') limit = 2
    let results = [],
        index = 0,
        works = new Array(limit).fill(null)
    works = works.map(_ => {
        // 让每一个工作区都是一个Promise实例，当这个工作区没有再需要处理的任务了，我们让实例为成功，并认为这个工作区是处理完成的
        return new Promise(resolve => {
            const next = async _ => {
                let prevIndex = index,
                    task = tasks[index++],
                    temp
                if (index > tasks.length)
                {
                    // 当前工作区都处理完了
                    resolve()
                    return
                }
                if (typeof task === 'function')
                {
                    try
                    {
                        // 当前任务处理成功，直接把处理后的结果按照指定索引位置，存储到总结果中
                        temp = await task()
                        results[prevIndex] = temp
                    } catch (error)
                    {
                        // 即使当前任务是失败的，我们也给其存储一个null即可
                        results[prevIndex] = null
                    }
                    next()
                }
            }
            next()
        })
    })
    // 当所有工作区都是成功处理完的，最后整体认为所有的任务都处理完成
    return Promise.all(works).then(_ => results)
}

createRequest(tasks, 2).then(results => {
    // 都处理完成后触发执行，results中包含了处理的结果[因为是并行，每个请求之间没有关联性，所以其中某个请求如果失败，我们不想限制后续请求的发送]
    console.log('ALL DONE', results);
})