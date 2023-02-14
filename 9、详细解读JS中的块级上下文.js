/**
 * 函数执行会产生一个私有的上下文
 *     @1 保护作用:保护私有上下文中的私有变量不受外界的干扰[防止全局变量污染]
 *     @2 保存作用:一但当前上下文不被释放，上下文中的私有变量及其值都会被保存起来，供其下级上下文调取使用
 * 我们把函数执行产生的这两大作用称之为 '闭包' 机制 [但是我们一般会认为只有产生不被释放的上下文才算闭包]
 */

let a = 0,
    b = 0;
function A(a) {
    A = function (b) {
        alert(a + b++);
    };
    alert(a++);
}
A(1); // alert(a++) => '1'
A(2); // alert(a + b++) => '4'

/**
 * 在ES6中，除了全局上下文和函数执行的私有上下文，还多了一种上下文机制:'块级私有上下文[作用域]'
 *    在除函数/对象等之外的大括号中[例如:判断体、循环体...]，如果出现'let/const/function'这些关键词，那么当前大括号所处的代码块，就会产生一个私有的块级上下文；在此块级上下文中，基于let/const/function声明的变量都是私有变量；特殊性:function会在块级上下文和其上级上下文中都会被声明处理，基于var关键词声明的变量，既不会产生块级上下文，也不会受到块级上下文的影响
 */

console.log(c, d); // => undefined undefined
{
    console.log(d); // => [Function: d] 变量提升已经声明定义
    let a = 10;
    const b = 20;
    var c = 30;
    function d() {}
    d = 40;
    console.log(a, b, c, d); // => 10 20 30{全局} 40
}
console.log(c, d); // => 30 [Function: d]
// console.log(a, b); // => 报错 私有的

// 这样处理 i 都是全局的
let i = 0;
for (; i < 5; i++) {
    console.log(i); // => 0~4
}
console.log(i); // => 5

for (let i = 0; i < 5; i++) {
    console.log(i); // => 0~4
}
console.log(i); // => 报错 此时 i 是私有的
