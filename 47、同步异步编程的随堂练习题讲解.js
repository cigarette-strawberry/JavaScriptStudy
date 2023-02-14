let body = document.body;
body.addEventListener('click', function () {
    Promise.resolve().then(() => {
        console.log(1); // 2
    });
    console.log(2); // 1
});
body.addEventListener('click', function () {
    Promise.resolve().then(() => {
        console.log(3); // 4
    });
    console.log(4); // 3
});

// --------------------------------------------------------------------------

console.log('start'); // 1
let intervalId;
Promise.resolve().then(() => {
    console.log('p1'); // 2
}).then(() => {
    console.log('p2'); // 3
});
setTimeout(() => {
    Promise.resolve().then(() => {
        console.log('p3'); // 5
    }).then(() => {
        console.log('p4'); // 6
    });
    intervalId = setInterval(() => {
        console.log(' interval'); // 7
    }, 3000);
    console.log('timeout1'); // 4
}, 0);

// --------------------------------------------------------------------------

setTimeout(() => {
    console.log('a');
});
Promise.resolve().then(() => {
    console.log('b');
}).then(() => {
    return Promise.resolve('c').then(data => {
        setTimeout(() => {
            console.log('d')
        });
        console.log('f');
        return data;
    });
}).then(data => {
    console.log(data);
});

// --------------------------------------------------------------------------

function func1 () {
    console.log('func1 start');
    return new Promise(resolve => {
        resolve('OK');
    });
}
function func2 () {
    console.log('func2 start');
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('OK');
        }, 10);
    });
}
console.log(1); // 1
setTimeout(async () => {
    console.log(2);
    await func1();
    console.log(3);
}, 20);
for (let i = 0; i < 90000000; i++) { } //循环大约要进行80MS左右
console.log(4);
func1().then(result => {
    console.log(5);
});
func2().then(result => {
    console.log(6);
});
setTimeout(() => {
    console.log(7);
}, 0);
console.log(8);