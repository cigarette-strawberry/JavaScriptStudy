/* GET请求 */
fetch('http://127.0.0.1:9999/user/info2?userId=1', {
  // 请求方式
  method: 'GET',
  // 自定义请求头信息
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  // 是否有缓存
  cache: 'no-cache',
  // 是否允许携带资源凭证   'same-origin'同源   'include'跨域请求中也允许
  credentials: 'include',
})
  .then((response) => {
    console.log(response)
    // 已经从服务器获取结果，不论状态码是以什么开始的，FETCH都认为是成功的(返回的promise是fulfilled)
    // + status/statusText: 返回的HTTP网络状态码
    // + Response.prototype: json/text/blob/arrayBuffer...  把服务器返回的响应主体信息变为我们想要格式，执行这些方法返回对应的promise实例
    if (response.status >= 200 && response.status < 300) {
      return response.json()
    }

    /* return Promise.reject({
      code: 'STATUS ERROR',
      status: response.status,
      statusText: response.statusText,
    }) */

    /* // 如何获取响应头信息
    response.headers.forEach((item, key) => {
      console.log(item, key)
    })
    let itor = response.headers.keys()
    for (let val of itor) {
      console.log(val)
    }
    console.log(response.headers.get('content-type')) */
  })
  .then((result) => {
    console.log('成功:', result)
  })
  .catch((reason) => {
    // 服务器没有返回任何的信息
    console.log(reason)
  })

/* 
  fetch并不如axios(ajax/XMLHttpRequest)这套机制
  中断请求   超时设置   监听上传的进度 。。。
  还没有完善
  不如axios因为axios是基于promise封装好的ajax库
*/

/* POST请求 */
fetcn('http://127.0.0.1:9999/user/login', {
  method: 'POST',
  body: Qs.stringify({
    account: '18310612838',
    password: md5('1234567890'),
  }),
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  credentials: 'include',
})
  .then((response) => response.json())
  .then((result) => {
    console.log(result)
  })

/* 项目中封装的方法 */
/* 真实项目中，我们也会基于NODE环境变量，设置不同的请求前缀{和AXIOS处理类似} */
let baseURL = 'http://127.0.0.1:9999',
  inital = {
    method: 'GET',
    params: null,
    body: null,
    credentials: 'include',
    cache: 'no-cache',
    responseType: 'JSON',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }

//验证是否为纯粹的对象
const isPlainObject = function isPlainObject(obj) {
  let proto, Ctor
  if (!obj || Object.prototype.toString.call(obj) !== '[object Object]')
    return false
  proto = Object.getPrototypeOf(obj)
  if (!proto) return true
  Ctor = proto.hasOwnProperty('constructor') && proto.constructor
  return typeof Ctor === 'function' && Ctor === Object
}

export default function request(url, config) {
  /* init params */
  if (typeof url !== 'string') throw new TypeError('url must be required!')
  if (!isPlainObject(config)) config = {}
  // 针对于HEADERS单独处理
  if (config.headers) {
    // 保证用户传递的HEADERS是个对象
    if (!isPlainObject(config.headers)) config.headers = {}
    config.headers = Object.assign({}, inital.headers, config.headers)
  }
  let { method, params, body, credentials, cache, responseType, headers } =
    Object.assign({}, inital, config)

  /* 处理URL「问号拼接 & 公共前缀」依赖QS库 */
  if (!/^http(s?):\/\//i.test(url)) url = baseURL + url
  if (params != null) {
    if (isPlainObject(params)) params = Qs.stringify(params)
    url += `${url.includes('?') ? '&' : '?'}${params}`
  }

  /* 处理请求主体信息「必须POST系列请求&根据HEADERS中的CONTENT-TYPE处理BODY的格式」*/
  let isPost = /^(POST|PUT|PATCH)$/i.test(method),
    conType = headers['Content-Type'] || 'application/json'
  if (isPost && isPlainObject(body)) {
    if (/urlencoded/i.test(conType)) body = Qs.stringify(body)
    if (/json/i.test(conType)) body = JSON.stringify(body)
  }

  /* 发送请求之前，在HEADERS中携带一些东西（例如:TOKEN）给服务器 */
  let token = localStorage.getItem('token')
  if (token) headers['Authorization'] = token

  /* 校正发送请求前的配置项 */
  config = {
    method: method.toUpperCase(),
    credentials,
    cache,
    headers,
  }
  if (isPost) config.body = body

  /* 正常基于FETCH发送请求 */
  return fetch(url, config)
    .then((response) => {
      let { status, statusText } = response
      if ((status >= 200) & (status < 400)) {
        // 真正的成功:根据RESPONSE-TYPE返回对应格式的数据
        let result
        switch (responseType.toUpperCase()) {
          case 'JSON':
            result = response.json()
            break
          case 'TEXT':
            result = response.text()
            break
          case 'BLOB':
            result = response.blob()
            break
          case 'ARRAYBUFFER':
            result = response.arrayBuffer()
            break
        }
        return result
      }
      // 服务器有返回信息，但是状态码是不对的:失败
      return Promise.reject({
        code: 'STATUS ERROR',
        status,
        statusText,
      })
    })
    .catch((reason) => {
      // 做一些当前项目中，失败状况下的公共提示和处理
      // @1 状态码错误
      if (reason && reason.code === 'STATUS ERROR') {
        switch (reason.status) {
          case 408:
            //...
            break
        }
      }
      // @2断网处理
      if (!navigator.onLine) {
        // ...
      }
      return Promise.reject(reason)
    })
}
