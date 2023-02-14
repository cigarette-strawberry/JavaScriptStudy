/* Observer 观察者 */
// 自定义观察者: 形式可以不一样，只需要具备 update 方法即可
class OBSERVER {
    update (msg) {
        console.log(`我是观察者1，我接收到的消息是: ${msg}`);
    }
}

let DEMO = {
    update (msg) {
        console.log(`我是观察者2，我接收到的消息是: ${msg}`);
    }
}

// 目标
class Subject {
    observerList = []
    add (observer) {
        this.observerList.push(observer)
    }
    remove (observer) {
        // 没有考虑数组塌陷问题
        this.observerList = this.observerList.filter(item => item != observer)
    }
    notify (...params) {
        this.observerList.forEach(item => {
            if (item && typeof item.update === 'function')
            {
                item.update(...params)
            }
        })
    }
}
let sub = new Subject
sub.add(new OBSERVER)
sub.add(DEMO)
setTimeout(() => {
    sub.notify('hello world')
}, 1000);

// ------------------------------------------------------------------------------

/* mediator 中介者 */
let mediator = (function () {
    let topics = []

    const subscribe = function subscribe (callback) {
        // 没考虑去重
        topics.push(callback)
    }

    const publish = function publish (...params) {
        topics.forEach(item => {
            if (typeof item === 'function')
            {
                item(...params)
            }
        })
    }

    return {
        subscribe,
        publish
    }
})()

mediator.subscribe(() => console.log(1))
mediator.subscribe(() => console.log(2))
setTimeout(() => {
    mediator.publish()
}, 2000);