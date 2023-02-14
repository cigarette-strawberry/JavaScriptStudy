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

/* 方案二利用队列的机制处理 */

class TaskQueue {
    constructor(tasks, limit, callback) {
        let self = this
        self.tasks = tasks
        self.limit = limit
        self.callback = callback
        self.queue = []
        self.results = []
        self.runing = 0
        self.index = 0
    }
    // 把任务依次存储到任务队列里面
    pushStack (task) {
        let self = this
        self.queue.push(task)
        self.next()
    }
    // 执行next方法，按照顺序把任务执行[并发管控]
    async next () {
        let self = this,
            { limit, runing, results, queue, tasks, callback } = self
        if (runing < limit && self.index < tasks.length)
        {
            self.runing++ // 因为是循环添加 所以一开始执行的时候 有两个函数同时在执行 此时 runing = 2 只有当其中一个函数结束时 才会执行 self.runing-- 变为 1 然后继续代码执行
            let prevIndex = self.index,
                task = queue[self.index++],
                temp
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
            }
            self.runing--
            self.runing === 0 ? callback(results) : self.next()
        }
    }
}

const createRequest = function createRequest (tasks, limit, callback) {
    if (!Array.isArray(tasks)) throw new TypeError('tasks must be an array')
    if (typeof limit === 'function')
    {
        callback = limit
        limit = 2
    }
    if (typeof limit !== 'number') limit = 2
    if (typeof callback !== 'function') callback = Function.prototype
    let TQ = new TaskQueue(tasks, limit, callback)
    // 依次把总任务列表中的每一项放置在任务队列里面，并且通知任务执行[有限制]
    tasks.forEach(task => {
        TQ.pushStack(task)
    })
}

createRequest(tasks, results => {
    console.log('ALL DONE', results);
})