function fn () {
  this.x = 100
  this.y = 200
}
/**
 * 向默认的原型对象上扩充方法
 *    @1 麻烦，每一次都要写 fn.prototype [ES6中的class不存在这个问题]
 *    @2 分散，设置的方法可能会分散开来，不方便管理
 */
fn.prototype.getX = function getX () {
  console.log(this.x);
}
fn.prototype.getY = function getY () {
  console.log(this.y);
}
let f1 = new fn()

// -----------------------------------------------------

/**
 * 重定向后，解决了上述的问题，但是也衍生出了新的问题
 *    @1 原型对象上没有 constructor
 *    @2 在原本内置原型对象上设置的sum方法，在重定向后也没有了
 */
function fn () {
  this.x = 100
  this.y = 200
}
fn.prototype.sum = function sum () {
  console.log(this.x, this.y);
}
fn.prototype = {
  getX () { },
  getY () { }
}
let f2 = new fn()

// -----------------------------------------------------

/**
 * 解决方案
 *    原型对象上没有 constructor [手动设置一个]
 *    方法丢失的问题 [原始内置的原型对象和需要重定向的新原型对象合并在一起 Object.assign]
 */
function fn () {
  this.x = 100
  this.y = 200
}
fn.prototype.sum = function sun () { }
fn.prototype = Object.assign({}, fn.prototype, { constructor: fn, getX () { }, getY () { } })
let f3 = new fn()

/**
 * Object.assign(A,B) 用B中的内容替换A [B有的，A没有，把B的东西放在A里面；B没有的，A有，则不处理；B和A都有的，以B为主...]，重点是最后返回的是A这个对象的 [堆内存地址]
 * Object.assign({},A,B) 最后返回的是一个新的堆内存，和A/B都不是一个地址；先拿A和{}合并，在拿B和{}合并
 * Object.assign 合并的时候，对于不可枚举的属性是处理不了的
 */

// -----------------------------------------------------

function Fn () {
  let a = 1;
  this.a = a;
}
Fn.prototype.say = function () {
  this.a = 2;
};
Fn.prototype = new Fn;
let f1 = new Fn;

Fn.prototype.b = function () {
  this.a = 3;
};
console.log(f1.a); // => 1
console.log(f1.prototype); // => undefined
console.log(f1.b); // => [Function (anonymous)]
console.log(f1.hasOwnProperty('b')); // => false
console.log('b' in f1); // => true
console.log(f1.constructor == Fn); // => true

// -----------------------------------------------------

function fun () {
  this.a = 0
  this.b = function () {
    console.log(this.a);
  }
}
fun.prototype = {
  b: function () {
    this.a = 20
    console.log(this.a);
  },
  c: function () {
    this.a = 30
    console.log(this.a);
  }
}
var my_fun = new fun()
my_fun.b() // => 私有的b this->my_fun console.log(my_fun.a) => 0
my_fun.c() // => 公有的c this->my_fun my_fun.a=30{私有的a赋值为30} console.log(my_fun.a) => 30

// -----------------------------------------------------

/**
 * 编写 queryURLParams 方法实现如下的效果(至少两种解决方案)
 *    @1 获取URL地址中，问号参数值 [或者哈希值]
 *    {
 *      name:'xiaowu',
 *      age:'18',
 *      _HASH:'play'
 *    }
 *
 * 课外知识
 *    @2 'name=xiaowu&age=18' 被叫做 urlencoded 格式字符串
 *       类库: Qs.stringify/parse 实现 urlencoded 格式字符串和对象之间的转换
 *
 * URLSearchParams(浏览器自带)
 */

// 方案一
String.prototype.queryURLParams = function queryURLParams (attr) {
  // this => url
  let self = this,
    link = document.createElement('a'),
    obj = {}
  link.href = self
  let { search, hash } = link
  if (hash) obj['_HASH'] = hash.substring(1)
  if (search)
  {
    search = search.substring(1).split('&')
    search.forEach(item => {
      let [key, value] = item.split('=')
      obj[key] = value
    });
  }
  return typeof attr !== 'undefined' ? obj[attr] : obj
}
let url = 'https://www.baidu.com/?name=xiaowu&age=18#play'
console.log(url.queryURLParams('name')); //=> xiaowu
console.log(url.queryURLParams('_HASH')); //=> play
console.log(url.queryURLParams()); //=> {_HASH: "play", name: "xiaowu", age: "18"}

// ------------------------------------------------------------------

// 方案二
String.prototype.queryURLParams = function queryURLParams (attr) {
  // this => url
  let self = this,
    obj = {}
  self.replace(/#([^?=&#]+)/g, (_, $1) => obj['_HASH'] = $1)
  self.replace(/([^?=&#]+)=([^?=&#]+)/g, (_, $1, $2) => obj[$1] = $2)
  return typeof attr !== 'undefined' ? obj[attr] : obj
}
let url = 'https://www.baidu.com/?name=xiaowu&age=18#play'
console.log(url.queryURLParams('name')); //=> xiaowu
console.log(url.queryURLParams('_HASH')); //=> play
console.log(url.queryURLParams()); //=> {_HASH: "play", name: "xiaowu", age: "18"}