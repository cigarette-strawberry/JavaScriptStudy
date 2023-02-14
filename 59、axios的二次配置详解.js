/* npm install blueimp-md5 md5 加密 */

/**
 * ajax、axios、$.ajax、fetch区别?
 *   都是基于TCP(HTTP/HTTPS)从服务器获取数据
 *   ajax、axios、$.ajax他们的核心:XMLHttpRequest
 *      ajax是原生操作
 *      axios是基于promise封装的ajax库   npm i axios --save「优先推荐J
 *      $.ajax是基于回调函数的方式封装的ajax库   npm i jquery --save
 *   fetch是ES6新增的API，和XMLHttpRequest没有关系，这是浏览器新提供的一种和服务器通信的机制，而且默认就是基于promise管理的，但是兼容性比较差，除了EDGE新版本，其余的IE浏览器不支持
 */

/**
 * 浏览器基于type='module'直接支持的ES6Module规范并不是特别的完善:
 * 1. 页面必须要基于真正的web服务器预览 http/https
 * 2. 导入的路径必须完善
 * 3. 不能和CommonJS规范混着搭配用
 */

/* Axios的二次封装:把所有请求的公共部分进行提取 */

/**
 * @1 配置公共的URL地址
 *  + 如果业务层自己发送请求的时候，请求的URL中包含了 http(s)://这样的前缀，则baseURL不生效
 *  + 真实项目中，我们经常配合webpack设置的环境变量，让前缀地址不同
 *    + 开发环境 development      http://127.0.0.1:9999      $ num run serve
 *    + 测试环境 test      http://192.168.1.23:8080      $ num run test
 *    + 灰度环境 huidu      http://huidu.xxx.com/api      $ num run build & ...      导流 一点点放流量
 *    + 生产环境 production      http://www.xxx.com/api      $ num run build & ...
 *    + ...

let env = process.env.NODE_ENV || 'development',
  baseURL = 'http://127.0.0.1:9999'
switch (env) {
  case 'development':
    baseURL = 'http://127.0.0.1:9999'
    break
  case 'test':
    baseURL = 'http://192.168.1.23:8080'
    break
  case 'huidu':
    baseURL = 'http://huidu.xxx.com/api'
    break
  case 'production':
    baseURL = 'http://www.xxx.com/api'
    break
}
axios.defaults.baseURL = baseURL
 */

axios.defaults.baseURL = 'http://127.0.0.1:9999'

/* 
 @2 其它的一些额外配置
   + 设置超时
   + 设置CORS跨域的时候，是否允许携带资源凭证(cookie)︰客户端和服务器端需要保持统一
*/
axios.defaults.timeout = 10000
axios.defaults.withCredentials = true

/*
 @3 针对于POST系列请求的一些公共配置
   + 设置请求头信息  例如:Content-Type [application/×-www-form-urlencoded & application/json & myltipart/form-data & ...]
      + axios.defaults.headers.xxx='xx×' 所有请求都设置
      + axios.defaults.headers.common.xxX='x××'
      + axios.defaults.headers.post.xxx='xx×' 指定某个请求下才设置
      + ...
      新版本浏览器中，如果我们请求主体传递的信息，其格式处理好了，那么Content-Type我们自己不设置，浏览器也会帮助我们进行处理
   + transformRequest 把POST系列请求中，我们传递的data数据，在发送请求之前，变为指定的数据格式[默认是把data对象变为JSON格式的字符串传递给服务器的]
*/
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded'
axios.defaults.transformRequest = function (data, headers) {
  if (data === null || typeof data !== 'object') return data
  let conType = headers['Content-Type'] || headers.post['Content-Type']
  if (/urlencoded/i.test(conType)) data = Qs.stringify(data)
  if (/json/i.test(conType)) data = JSON.stringify(data)
  return data
}
export default axios

/**
 * 项目上线出现了bug咋处理?
 * 1. 回滚到上一个版本
 * 2. 看bug的大小
 *
 * 1. 我们的产品很难再线上出现bug 我们有严格的测试 开发内测 再给测试人员测试 内部公测 以及更多的人测试
 * 2. 如果出现一些bug
 *   @1 看严重性，如果只是一些人性体验方面的BUG或者是一些影响不大的      直接修改
 *   @2 严重的BUG   则立即回滚到上一个历史版本
 */
