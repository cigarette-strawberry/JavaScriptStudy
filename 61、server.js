/*-CREATE SERVER-*/
const express = require('express'),
  app = express()
app.listen(1001, () => {
  console.log(
    'THE WEB SERVICE IS CREATED SUCCESSFULLY AND IS LISTENING TO THE PORT∶1001'
  )
})
/*-MIDDLE WARE-*/

/* 使用中间件 进行跨域 */ // CORS
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

/*-API-*/

/* jsonp格式 */
app.get('/jsonpTest', (req, res) => {
  let { callback = Function.prototype } = req.query
  let data = {
    code: 0,
    message: '珠峰培训',
  }
  res.send(`${callback}(${JSON.stringify(data)})`)
})

/* 代理 Proxy */
const request = require('request')
app.get('/subscriptions/recommended_collections', (req, res) => {
  let jianURL = `https://www.jianshu.com/asimov${req.url}`
  req.pipe(request(jianURL)).pipe(res)
})

/*STATIC wEB*/
app.use(express.static('./'))
