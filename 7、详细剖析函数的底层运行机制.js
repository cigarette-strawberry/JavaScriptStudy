/**
 * 在当前上下文(全局上下文/私有上下文/块级上下文)中,JS代码自上而下执行之前，首先会把当前上下文中带 "var/function" 的关键字进行变量提升:带var的只是提前声明，并没有赋值[定义]，但是带function关键字的，是提前的声明+赋值[定义]；基于 "let/const" 声明的变量是不具备这个机制的
 *
 * 函数的底层运行机制:
 *    [创建函数:声明函数+赋值]
 *        1、在Heap堆内存中分配一块空间 [16进制的内存地址]
 *        2、除了存储一些键值对[和对象一样]，还做了很多其他的事情
 *           @1 声明了函数的作用域 [[scope]]，作用域的值是当前创建函数时候所在的上下文
 *           @2 把函数体中的代码当做 "字符串" 存储到堆内存中
 *           @3 和对象一样，存储一些自己的键值对[静态私有的属性和方法]
 *        3、把内存地址赋值给对应的变量[函数名]即可
 *    [执行函数]
 *        1、形成一个私有的上下文 "EC(x)" 供后期函数体中的代码执行
 *           @1 在私有上下文中，有一个后期存储当前上下文中声明变量的地方 "私有变量对象AO" [AO是VO的分支，在函数中，变量对象是AO]
 *           @2 进栈执行
 *        2、在代码执行之前，他还会处理很多的事情
 *           @1 初始化作用域链 [[scope-chain]]: <自己形成的上下文，函数的作用域{创建时候声明的}>
 *                 作用: 但凡代码执行的时候，遇到一个变量，首先看是否是自己上下文中的私有变量(AO)，如果是自己的，接下来对变量的操作，和外界没有任何关系；如果不是自己私有的，则继续按照作用域链，查找是否为其上级上下文(也就是函数作用域)中的。。。如果查找过程中一直都没有，找到EC(G)就结束即可
 *           @2 初始化 this 指向
 *           @3 初始化 arguments [实参集合]
 *           @4 形参赋值: 形参变量也是当前上下文中的私有变量，是要存储到AO中的
 *           @5 变量提升
 *        3、代码执行
 *        4、一般情况下，在代码执行完，当前形成的私有上下文会出栈释放，以此来优化内存空间
 */

var x = [12, 23];
function fn(y) {
    y[0] = 100;
    y = [100];
    y[1] = 200;
    console.log(y); // => [ 100, 200 ]
}
fn(x);
console.log(x); // => [ 100, 23 ]
