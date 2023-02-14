/**
 * ajax
 * async javascript and xml
 * async javascript : 全局刷新和局部刷新
 * ajax核心作用 : 实现数据请求 + 客户端渲染   局部刷新
 * xml: 可扩展的标记语言
 * html: 超文本标记语言
 *
 * AJAX核心:基于XMLHttpRequest创建HTTP请求
 *    + 创建xhr实例
 * 
 *    + 打开一个URL地址「发送请求前的一些配置信息」
 *       + method 请求方式: GET(get/delete/head/options...) / POST(post/put/patch...)
 *          GET 和 POST 在官方定义中是没有明确的区别的，但是浏览器或者开发的时候，都有一套约定俗成的规范:
 *          > GET 请求传递给服务器的信息，除了请求头传递以外，要求基于URL问号传参传递给服务器
 *             xhr.open('GET', './1.json?lx=1&name=xxx')
 *          > POST 请求要求传递给服务器的信息，是基于请求主体传递
 *             xhr.send('lx=1&name=xxx')
 *          ----------
 *          1) GET 传递的信息不如POST多，因为URL有长度限制「IE->2KB」，超过这个长度的信息会被自动截掉,这样导致传递内容过多，最后服务器收到的信息是不完整的! ! POST理论上是没有限制的，但是传递的东西越多，速度越慢，可能导致浏览器报传输超时的错误，所以实际上我们会自己手动做限制! !
 *          2) GET 会产生缓存「浏览器默认产生的，不可控的缓存」: 两次及以上，请求相同的API接口，并且传递的参数也一样，浏览器可能会把第一次请求的信息直接返回，而不是从服务器获取最新的信息! !
 *             xhr.open('GET', './1. json?lx=1&name=xxx&_'+Math.random())
 *             在请求URL的末尾设置随机数，以此来清除GET缓存的副作用
 *          3) POST 相对于GET来讲更安全一些 : GET传递的信息是基于URL末尾拼接，这个随便做一些劫持或者修改，都可以直接改了，而POST请求主体信息的劫持，没那么好做! ! 但是"互联网面前，人人都在裸奔"! !所以不管什么方式，只要涉及安全的信息，都需要手动加密「因为默认所有的信息传输都是明文的」! !
 *          ----------
 *       + url请求的URL地址
 *       + async是否采用异步默认是TRUE
 *       + username
 *       + userpass
 * 
 *    + 监听请求的过程，在不同的阶段做不同的处理「包含获取服务器的响应信息」
 *       + ajax状态xhr.readyState
 *          + 0 UNSENT
 *          + 1 OPENED
 *          ------
 *          + 2 HEADERS_RECEIVED 响应头信息已经返回
 *          + 3 LOADING 响应主体信息正在处理
 *          + 4 DONE 响应主体信息已经返回
 * 
 *       + HTTP状态码 xhr.status/xhr.statusText
 *          + 200 0K
 *          + 202 Accepted : 服务器已接受请求，但尚未处理(异步)
 *          + 204 No Content : 服务器成功处理了请求，但不需要返回任何实体内容
 *          + 206 Partial Content : 服务器已经成功处理了部分GET请求(断点续传Range/If-Range/Content-Range/Content-Type: "multipart/byteranges”/Content-Length...)
 *          + 301 Moved Permanently 永久转移「域名迁移」
 *          + 302 Move Temporarily 临时转移 「负载均衡」
 *          + 304 Not Modified
 *          + 305 Use Proxy
 *          + 400 Bad Request : 请求参数有误
 *          + 401 Unauthorized : 权限(Authorization)
 *          + 404 Not Found地址错误
 *          + 405 Method Not Allowed 请求方式不被允许
 *          + 408 Request Timeout 请求超时
 *          + 500 Internal Server Error 未知服务器错误
 *          + 503 Service Unavailable 超负荷
 *          + 505 HTTP Version Not Supported
 *          + ......
 * 
 *       + 获取响应主体信息 xhr.response/responseText/responseXML...
 *          服务器返回的响应主体信息的格式
 *             + 字符串「一般是JSON字符串」 「最常用」
 *             + XML格式数据
 *             + 文件流格式数据「buffer/二进制...」
 *             + ......
 * 
 *       + 获取响应头信息 xhr.getResponseHeader/getAllResponseHeaders
 * 
 *    + 发送请求「send中传递的信息，就是设置的请求主体信息」
 *       基于请求主体传递给服务器的数据格式是有要求的「Postman接口测试工具」
 *       1. form-data 主要应用于文件的上传或者表单数据提交
 *          xhr.setRequestHeader('Content-Type', 'multipart/form-data');
 *          ------
 *          let data = new FormData;
 *          data. append('lx', 0);
 *          data. append('name', 'xxx');
 *          xhr. send(data);
 * 
 *       2. x-www-form-urlencoded格式的字符串
 *          格式: "lx=1&name=xxx" 「常用」
 *          Qs库: $npm i qs
 *          Qs.stringify/parse:实现对象和urlencoded格式字符串之间的转换
 *          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
 *          ------
 *          xhr.send(Qs.stringify({
 *             lx: 0,
 *             name: 'xxx'
 *          }));
 * 
 *       3. raw 字符串格式
 *          普通字符串 -> text/plain
 *          JSON字符串 -> application/json => JSON.stringify/parse「常用」
 *          XML格式字符串 -> application/xml
 *          ......
 * 
 *       4. binary进制数据文件「buffer/二进制...」
 *          一般也应用于文件上传
 *          图片 -> image/jpeg
 *          EXCEL -> application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
 *          ......
 * 
 *       5.GraphQL
 */

/**
 * xhr.abort() 中断请求 xhr.onabort
 * xhr.timeout=0 设置超时时间 xhr.ontimeout
 * xhr.withCredentials=true 在CORS跨域资源请求中 允许携带资源凭证 例如 cookie
 * xhr.upload.onprogress 监听文件上传进度
 * 
 * abort()
 * getAllResponseHeaders()
 * getResponseHeader()
 * open()
 * overrideMimeType()
 * send()
 * setRequestHeader()
 */

let xhr = new XMLHttpRequest
xhr.open('GET', './a.json')
// 设置请求头信息 & 超时时间 & 携带资源凭证 需要在 open之后 send之前
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // 请求头信息中不允许出现中文
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200)
    {
        console.log(xhr.responseText);
    }
}
xhr.send(null)