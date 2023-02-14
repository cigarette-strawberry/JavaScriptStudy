/* 
    半服务器渲染 SSR   Node( nuxt.js || next.js )
        首屏 服务器渲染 其余屏幕 客户端基于Ajax获取数据实现渲染
*/

/* 
    客户端地址 (WEB服务器)
    数据接口地址 (数据服务器)

        协议、域名、端口:三者有一个不一样都是跨域请求

    浏览器默认存在跨域的限制 [基于Ajax/Fetch发送请求]，为了保证安全性
*/

/* 
    为啥会产生跨域
        服务器分离: WEB服务器、数据服务器、图片服务器
        云信息共享: 第三方API接口
        有助于分离开发: 开发跨域、部署同源
*/

/* 
    前端发展到现在，基本上都是跨域请求「不论是开发的时候，还是项目部署完成」
    部分项目: 开发的时候是跨域的「预览页面是本地启动的Web服务器，调取的数据是其他服务器上的部署之后，我们会部署在同一台服务器的相同服务下「部署是同源的」
    我们只需要解决开发过程中的跨域即可

    开发过程中是跨域请求
*/

/* 
    解决方案
        修改本地POST
            DNS解析的时候 会找到本地的DNS缓存
        JSONP
            script   script标签不存在域的限制 和 源的限制
        CORS
        Proxy
        ...
*/

// -----------JSONP   只能发送GET请求 'script标签只能发送get请求'
jsonp({
  url: 'https://www.baidu.com/sugrec',
  params: {
    prod: 'pc',
    wd: 'zhufeng',
  },
  jsonpName: 'cb',
  success: function (result) {
    console.log(result)
  },
})

// -----------CORS的原理:服务器设置允许源
fetch('http://127.0.0.1:1001/test', {
  credentials: 'include', // 携带资源凭证
})
  .then((response) => response.json())
  .then((result) => {
    console.log(result)
  })

/* 使用中间件 进行跨域 */
app.use((req, res, next) => {
  let safeList = [
    'http://127.0.0.1:5500',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:3000',
  ]
  /* 
      '*' 允许所有的源 [不安全，同时也不支持携带任何的资源凭证]
      '具体某个源{不能设置多个}':这样可以携带资源凭证信息
      ------
      想要支持多源，我们可以设置白名单
    */
  let origin = req.headers.origin || req.headers.referer || ''
  origin = origin.replace(/\/$/g, '')
  origin = safeList.includes(origin) ? origin : ''
  res.header('Access-Control-Allow-Origin', origin)
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type,Content-Length,Authorization,Accept,X-Requested-with'
  )
  res.header(
    'Access-Control-Allow-Methods',
    'PUT, POST,GET,DELETE,OPTIONS,HEAD'
  )

  // 在CORS跨域资源共享中，客户端发送真正的请求之前，会先发送一个试探性请求 OPTIONS:验证一下当前客户端和服务器端是否可以进行正常的通信。。。
  req.method === 'OPTIONS' ? res.send('OK') : next()
})

// -----------Proxy的原理:webpack-dev-server  客户端 向 代理服务器 发送请求 代理服务器 向 真正的服务器发送请求 拿到数据再返回给客户端

fetch('/subscriptions/recommended_collections')
  .then((response) => response.json())
  .then((result) => {
    console.log(result)
  })

const path = require('path')
const HtmlwebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    filename: 'main. [hash].min.js',
    path: path.resolve(__dirname, 'build'),
  },
  devServer: {
    port: '3000',
    compress: true,
    open: true,
    hot: true,
    proxy: {
      '/ ': {
        target: 'http://127.0.0.1:3001',
        changeorigin: true,
      },
    },
  },
  // 配置wEBPACK的插件
  plugins: [
    new HtmlwebpackPlugin({
      template: `./public/index.html`,
      filename: 'index.html',
    }),
  ],
}
