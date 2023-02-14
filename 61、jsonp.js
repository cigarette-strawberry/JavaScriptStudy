;(function () {
  // 配置默认项
  let inital = {
    url: '',
    params: null,
    jsonpName: 'callback',
    success: Function.prototype,
  }

  // 验证是否为纯粹的对象
  const isPlainObject = function isPlainObject(obj) {
    let proto, Ctor
    if (!obj || Object.prototype.toString.call(obj) !== '[object Object]')
      return false
    proto = Object.getPrototypeOf(obj)
    if (!proto) return true
    Ctor = proto.hasOwnProperty('constructor') && proto.constructor
    return typeof Ctor === 'function' && Ctor === Object
  }

  const jsonp = function jsonp(config) {
    if (!isPlainObject(config)) config = {}
    let { url, params, jsonpName, success } = Object.assign({}, inital, config)
    if (typeof url !== 'string' || url.length === 0)
      throw new TypeError('url must be required!!!')

    // 处理 params
    if (params !== null) {
      if (isPlainObject(params)) params = qs.stringify(params)
      url += `${url.includes('?') ? '&' : '?'}${params}`
    }

    // 创建全局函数
    let f_name = `jsonp${+new Date()}`
    window[f_name] = function (result) {
      // result 就是服务器返回的数据
      if (typeof success === 'function') success(result)
      delete window[f_name]
      document.body.removeChild(script)
    }

    // 处理URL
    url += `${url.includes('?') ? '&' : '?'}${jsonpName}=${f_name}`

    // 发送 JSONP
    let script = document.createElement('script')
    script.src = url
    // 请求失败
    // script.onerror = function () {}
    document.body.appendChild(script)
  }

  if (typeof window !== 'undefined') window.jsonp = jsonp
  if (typeof module === 'object' && typeof module.exports === 'object')
    module.exports = jsonp
})()
