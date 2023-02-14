var a = { n: 1 }
var b = a
a.x = a = { n: 2 }
console.log(a.x) // => undefined
console.log(b) // => { n: 1, x: { n: 2 } }

// e r 存储在 Global Window 全局变量 GO 中 window. 可以调用
var q = 12
function w() {}
console.log(q, w) // => 12 [Function: w]
console.log(window.q, window.w) // => 12 [Function: w]

// q w 存储在 Script VO(G) 中 window. 不可以调用
let e = 13
const r = function () {}
console.log(e, r) // => 13 [Function: r]
console.log(window.e, window.r) // => undefined undefined
