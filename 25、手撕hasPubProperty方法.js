/**
 * 检测公有属性和私有属性
 *    + 检测是否为私有属性: Object.prototype.hasOwnProperty
 *    + in 检测当前对象是否具有这个属性[私有或者公有都可以检测]:原理是检测私有属性中是否有没有，没有的话，按照原型链一级级的向上查找，直到找到Object.prototype为止，只要能找到结果就是true
 *    + Object.getPrototypeOf:获取当前对象的原型链[其所属类的原型对象]，类似于obj.__proto__ [__proto__在IE浏览器中被保护起来了，不允许我们直接操作]
 *    + Object.keys(obj): 获取obj对象所有非Symbol并且可枚举的私有属性[数组]
 *    + Object.getOwnPropertyNames(obj): 获取obj对象所有非Symbol的私有属性[数组]
 *    + Object.getOwnPropertySymbols(obj): 获取obj对象所有Symbol类型的私有属性[数组]
 */

let obj = {
  name: 'xiaowu',
  age: '20',
}
console.log(obj.hasOwnProperty('name')) // => true
console.log(obj.hasOwnProperty('toString')) // => false

console.log('name' in obj) // => true
console.log('toString' in obj) // => true

// -----------------------------------------------------------

// 面试题:检测一个属性是否是对象的公有属性
//    思路一:是它的一个属性，但是还不是私有的属性，则一定是公有的属性[不完善:如果私有和公有中都有这个属性，结果就是不准确的]
let a = {
  name: 'xiaoyu',
  age: '20',
}
Object.prototype.hasPubProperty = function hasPubProperty(attr) {
  // this => a
  let self = this
  return attr in self && !self.hasOwnProperty(attr)
}
console.log(a.hasPubProperty('name')) // => false
console.log(a.hasPubProperty('toString')) // => true

//    思路二:跳过私有的查找，直接到对象的原型链上去查找，一直找到Object.prototype为止，某一个原型对象上有这个属性，结果就是true [很完善]
// Object.getPrototypeOf:获取当前对象的原型链[其所属类的原型对象]，类似于obj.__proto__ [__proto__在IE浏览器中被保护起来了，不允许我们直接操作]

let b = {
  name: 'xiaoyu',
  age: '20',
}
Object.prototype.hasPubProperty = function hasPubProperty(attr) {
  // this => b
  let self = this,
    proto = Object.getPrototypeOf(self)

  /* while (proto) {
        if (proto.hasOwnProperty(attr)) return true;
        proto = Object.getPrototypeOf(proto);
    }
    return false; */

  // 快捷的写法 把上面的while循环注释掉
  return attr in proto
}
console.log(b.hasPubProperty('name')) // => false
console.log(b.hasPubProperty('toString')) // => true

// -----------------------------------------------------------

/**
 * 扩展小知识:遍历对象，我们使用 for in 循环，但是 for in 循环有很多问题
 *    @1 性能较差，for in 在迭代的时候，除了迭代所有的私有属性，其原型上的公有属性也会被迭代 -> 前提:能够被迭代的属性都应该是可枚举的属性(粗略认为，内置属性一般是不可枚举的，自定义的属性是可枚举的) -> 所以使用 for in 循环的时候，我们需要手动的去除对公有属性的迭代
 *    @2 优先迭代所有的数字属性名[从小到大]，其次才是迭代非数字的，与自己编写的属性顺序不完全一致；不能迭代Symbol类型的私有属性
 */
Object.prototype.qqq = function qqq() {}
let c = {
  name: 'xiaoyu',
  age: '20',
  [Symbol('ww')]: 100,
  5: 5,
  1: 1,
}
for (const key in c) {
  if (!c.hasOwnProperty(key)) break
  console.log(key)
}

// -----------------------------------------------------------

let arr = new Array(9999999).fill(0)
console.time('AA')
for (let index = 0; index < arr.length; index++) {}
console.timeEnd('AA') // => AA: 48.842ms
console.time('BB')
for (const key in arr) {
}
console.timeEnd('BB') // => AA: 4.761s
console.time('CC')
arr.map(() => {})
console.timeEnd('CC') // => CC: 212.251ms

// -----------------------------------------------------------

// Object.keys: 获取obj对象所有非Symbol并且可枚举的私有属性[数组]
// Object.getOwnPropertyNames(obj): 获取obj对象所有非Symbol的私有属性[数组]
// Object.getOwnPropertySymbols(obj): 获取obj对象所有Symbol类型的私有属性[数组]
let obj = {
  name: 'xiaoyu',
  age: '20',
  [Symbol('ww')]: 100,
  5: 5,
  1: 1,
}
let keys = Object.keys(obj)
if (typeof Symbol !== 'undefined')
  keys = keys.concat(Object.getOwnPropertySymbols(obj))
keys.forEach((key) => {
  console.log(key, obj[key])
})

for (let i = 0; i < keys.length; i++) {
  let key = keys[i]
  console.log(key, obj[key])
}

// -----------------------------------------------------------

// ***** ES5语法中创建构造函数[核心在执行时是否加new来决定] *****
// 构造函数体
function Modal(x, y) {
  this.x = x
  this.y = y
}
// 原型对象上扩展的供其实例调取使用的公共属性和方法    m.z/m.getX/m.getY
Modal.prototype.z = 10
Modal.prototype.getX = function () {
  console.log(this.x)
}
Modal.prototype.getY = function () {
  console.log(this.y)
}
// 把函数当作一个对象，给其设置的静态私有属性和方法[和实例没啥关系]   Modal.n/Modal.setNumber
Modal.n = 200
Modal.setNumber = function (n) {
  this.n = n
}
let m = new Modal(10, 20)

// -----------------------------------------------------------

class Model {
  // 构造函数体:this.xxx = xxx 给实例设置的私有属性
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  // 这样处理也是给实例设置的私有属性
  a = 10
  b = () => {}
  c = function () {}

  // 向类的原型对象上扩充方法
  //    @1 语法上必须这样写，无法扩充属性
  //    @2 所有扩充的方法是没有prototype的
  //    @3 并且这些方法实例对象不可枚举的属性[ES5中，基于 '类.prototype' 设置的公有方法是可枚举的]
  getX() {
    console.log(this.x)
  }
  getY() {
    console.log(this.y)
  }

  // 把其当作对象，设置静态的私有属性和方法
  static n = 200
  static setNumber(n) {
    this.n = n
  }
}
Model.prototype.e = 10

let m = new Model(10, 20)
console.log(m)
// console.log(Model(10, 20)); // => Class constructor Model cannot be invoked without 'new' 不允许当作普通函数执行，只能new执行
