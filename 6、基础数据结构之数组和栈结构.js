/**
 * 数组是特殊的对象 [对象:由零到多组键值对组成的]
 *     特殊: 对象的键(属性名)不能是一个对象类型，如果是对象，会默认转换成字符串(toString)作为属性名
 *     以数字作为索引{属性名}，逐级递增；内置length属性，存储数组长度
 * Set/Map ES6新增的数据结构
 *     Set 自动去重
 *     Map 允许属性名是对象
 */

let obj1 = { [{ name: 'xxx' }]: 10 }
console.log(obj1) // => { '[object Object]': 10 }

let obj2 = {
  [Symbol(0)]: 10
}
console.log(obj2) // => { [Symbol(0)]: 10 }

let a = { name: 'xxx' }
let b = { name: 'zzz' }
let obj3 = { [a]: 10 }
obj3[b] = 20
console.log(obj3) // => { '[object Object]': 20 }

/**
 * 栈结构
 *    特点: 后进先出 或者 先进后出
 *    @1 新进栈的内容在栈的顶端，这样会把之前进栈的压缩到栈的底部
 *    @2 出栈也是需要从顶端开始出，上面的不出去，下面的也出不去
 *    容器 enter进栈 leave出栈 size栈的大小 value获取栈中现有的内容
 */
class Stack {
  container = []
  enter(element) {
    // 进栈
    this.container.unshift(element)
  }
  leave() {
    // 出栈
    this.container.shift()
  }
  size() {
    // 大小
    return this.container.length
  }
  value() {
    // 获取栈的内容 slice实现浅克隆，目的是保证外部接收到的内容，再进行操作的时候，不会直接影响到 container
    return this.container.slice(0)
  }
}
let sk1 = new Stack() // 每一次new创建一个新的栈结构[新的容器]

/**
 * 面试题: 十进制转二进制
 *    + 十进制 正常JS中使用的数字类型就是10进制[包含:0-9]
 *    + 二进制 [包含:0-1]
 * [Number].toString([radix]) [radix]默认值是10
 */
let num = 45
console.log(num.toString()) //= > '45' 十进制字符串
console.log(num.toString(2)) // => '101101' 二进制字符串

function decimal2binary(decimal) {
  if (decimal === 0) return 0
  let negative = decimal < 0
  decimal = Math.abs(decimal)
  let merchant = Math.floor(decimal / 2),
    remainder = decimal % 2,
    sk = new Stack()
  sk.enter(remainder)
  while (merchant > 0) {
    remainder = merchant % 2
    sk.enter(remainder)
    merchant = Math.floor(merchant / 2)
  }
  return `${negative ? '-' : ''}${sk.value().join('')}`
}
console.log(decimal2binary(-15)) // => '-1111'
console.log((-15).toString(2)) // => '-1111'
