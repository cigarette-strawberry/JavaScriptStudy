/**
 * EC(G)
 *   VO(G)/GO   var function声明的会放进GO里面   let const声明的会放进VO(G)里面
 *   a
 *   fn -> 0x000 [[scope]]:EC(G)
 * 变量提升: var a;function fn = 0x000
 */
console.log(a); // => undefined
var a = 12; // 全局的a=12
function fn() {
    /**
     * EC(FN)
     *   AO(FN)
     *   a
     * 作用域链:<EC(FN),EC(G)>
     * 形参赋值:---
     * 变量提升: var a
     */
    console.log(a); // => undefined
    var a = 13; // 私有的a=13
}
fn();
console.log(a); // => 12

// ---------------------------------------------

/**
 * EC(G)
 *   VO(G)/AO
 *   a
 *   fn -> 0x001
 * 变量提升 var a;function fn = 0x001
 */
console.log(a); // => undefined
var a = 12;
function fn() {
    /**
     * EC(FN)
     *   AO(FN)
     * 作用域链:<EC(FN),EC(G)>
     * 形参赋值:---
     * 变量提升:---
     */
    console.log(a); // => 12 全局的a=12
    a = 13;
}
fn();
console.log(a); // => 13 全局的a=13

// ---------------------------------------------

/**
 * EC(G)
 *   VO(G)/AO
 *   fn -> 0x002
 * 变量提升 function fn = 0x002
 */
console.log(a); // => ReferenceError: a is not defined 后续代码不执行
a = 12;
function fn() {
    console.log(a);
    a = 13;
}
fn();
console.log(a);
