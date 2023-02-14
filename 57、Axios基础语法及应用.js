/**
 * cdn : <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
 *
 * npm install axios
 *
 * http://www.axios-js.com/zh-cn/docs/
 *
 * 基于Promise封装的ajax库，核心XMLHttpRequest
 *
 * axios函数(对象)
 *    + CancelToken 用于取消ajax请求
 *    + all 基于promise.all实现ajax的并行，当所有的ajax请求都成功，整体才会返回一个成功的promise实例
 *    + spread 解析出基于all返回的结果
 *    + create 创建一个新的实例，来做单独的全局配置
 *    + defaults 全局默认配置
 *    + get/delete/head/options 发送对应方式的请求
 *    + post/put/patch 发送对应方式的请求
 *    + request 发送请求
 *    + interceptors
 *       + request 请求拦截器
 *       + response 响应拦截器
 */

//基于axios发送请求，最后返回的都是promise实例
let formData = new FormData()
formData.append('file', 'xxx')
formData.append('size', '1024')
axios({
  // baseURL+url: 最终请求的地址
  baseURL: 'http://127.0.0.1:8888',
  url: '/user/list',
  method: 'post',
  // params : 基于URL末尾拼接参数的方式，把params对象一项项传递给服务器
  params: {
    lx: 0,
    from: 'wx',
  },

  //内部有的方法，params对象最后可以拼接到URL的末尾，内部就是基于这个方法处理的
  paramsSerializer: function (params) {
    return Qs.stringify(params, {
      arrayFormat: 'brackets',
    })
  },

  /* // data: 只针对POST系列请求，设置请求主体传递的信息，默认会把对象变为 application/json 字符串传递给服务器
    data: {
        file: 'xxx',
        size: 1024
    },
    // 在POST请求下，把请求主体信息发送给服务器之前，对请求主体的信息进行处理
    transformRequest: function (data) {
        return Qs.stringify(data)
    } */

  // 值: FormData\binary\raw...
  data: formData,
  transformRequest: function (data) {
    if (_.isPlain0bject(data)) {
      // 判断是否是存粹对象
      // application/json && x-www-form-urlencoded
      return Qs.stringify(data)
    }
    return data
  },

  //设置请求头信息
  headers: {
    //所有请求通用
    'Content-Type': 'multipart/form-data',
    common: {
      'X- Token': 'xxx',
    },
    //可以只针对某种请求设置
    post: {
      lx: 1,
    },
    get: {
      lx: 0,
    },
  },
  // 零散配置信息
  timeout: 0,
  withCredentials: true,
  // 预设服务器返回的数据格式: 不论服务器返回啥格式，内部会转换为我们预设的格式 json/arraybuffer/blob/document/text...
  responseType: ' json',
  // 监听上传/下载进度
  onUploadProgress: function (progressEvent) {},
  onDownloadProgress: function () {},
  // 内部规定，HTTP状态码为多少，算是请求成功，返回成功Promise，否则返回失败的!!
  validateStatus: function (status) {
    return status >= 200 && status < 300
  },
})

// axios([config])
// axios.request([config])
// axios.get/head/delete/options([url],[config])
// axios.post/put/patch([url],[data],[config])

axios
  .get('http://127.0.0.1:8888/user/list', {
    params: {
      lx: 1,
      from: 'wx',
    },
  })
  .then((response) => {
    // 服务器返回的状态码和validateStatus指定的匹配条件一致(READY-STATE===4)
    // config 设定的配置项
    // headers 响应头信息「对象」
    // request 原生的XHR对象
    // status/statusText 状态码和状态码的描述
    // data 响应主体信息
    console.log('成功', response)
    return response.data
  })
  .then((data) => {
    // 获取响应主体信息，完成对应的业务逻辑
    // ...
  })
  .catch((reason) => {
    // 服务器返回的状态码不与validateStatus条件一致「最起码服务器有返回」
    // 压根服务器啥都没返回「例如:断网」
    // 当前请求超时或者被取消
    //    + config
    //    + request
    //    + toJSON
    //    + message 错误信息
    //    + response 如果是网络层失败，是没有response,如果只是axios层失败，是存在response
    //    + isAxiosError 是否为axios层面失败
    console.log('失败', reason)
    console.dir(reason)
  })

// 请求成功和失败
//    1.网络层失败 请求没有发送成功，或者没有任何的响应「没有完成一个HTTP事物」
//    2.AXIOS层失败
//       + 服务器一定有返回
//       + 只不过状态码和validateStatus不一致
//       + 超时或者取消请求
//    3.业务层失败
//       + 一般都是服务器根据业务需求，基于类似于code等标志，来区分不同的业务形态和结果
