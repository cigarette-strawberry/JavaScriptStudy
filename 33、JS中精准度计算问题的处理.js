/**
 * JS"骚"操作之0.1+0.2!==0.3
 *    @1 十进制转换为二进制的计算 n.toString(2)
 *       + 整数部分
 *       + 小数部分
 *
 *    @2 JS使用Number类型表示数字(整数和浮点数)，遵循 IEEE-754 标准 通过64位二进制值来表示一个数字
 *       https://babbage.cs.qc.cuny.edu/IEEE-754.old/Decimal.html
 *       第0位:符号位，0表示正数，1表示负数 S
 *       第1位到第11位「11位指数」:储存指数部分 E
 *       第12位到第63位「52位尾数」:储存小数部分(即有效数字) F
 *       注:尾数部分在规约形式下第一位默认为1 (省略不写)
 *
 *    @3 最大安全数字「16位」Number.MAX_SAFE_INTEGER === Math.pow(2,53)-1
 *
 *    @4 怎么解决精度问题?
 *       + 将数字转成整数「扩大系数」
 *       + 三方库: Math.js 、decimal.js. big.js ...
 */
// JS中的数值是十进制的，但是存储到计算机底层以及进行运算的时候，都是先转换为二进制，再进行运算的

// 整数转换为二进制 先除以2再拿商一直除以2
// 小数转换为二进制 小数部分一直乘以2

const queryDigits = function queryDigits (num) {
    num += '';
    let [, char = ''] = num.split('.');
    return char.length;
};
const plus = function plus (num1, num2) {
    num1 = +num1;
    num2 = +num2;
    if (isNaN(num1) || isNaN(num2)) throw new TypeError(' num1/num2 must be an number!');
    let num1Digits = queryDigits(num1),
        num2Digits = queryDigits(num2),
        baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
    return (num1 * baseNum + num2 * baseNum) / baseNum;
}
console.log(plus(0.1, 0.2));