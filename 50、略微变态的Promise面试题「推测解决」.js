Promise.resolve().then(() => {
    console.log(0);
    // return 4;
    return Promise.resolve(4); // 如果返回的是一个Promise实例，需要等待Promise是成功的，才能让"异步微任务2"执行；但是如果返回的Promise实例是立即成功的，也不会让"异步微任务2"变为立即可执行的，而是需要"递归"再去验证一次... [推测:内置Promise中多等了两步]
}).then((res) => { // 异步微任务2
    console.log(res)
});
Promise.resolve().then(() => {
    console.log(1);
}).then(() => {
    console.log(2);
}).then(() => {
    console.log(3);
}).then(() => {
    console.log(5);
}).then(() => {
    console.log(6);
});

// 控制台输出的结果和自己推算出来的结果是不一样的