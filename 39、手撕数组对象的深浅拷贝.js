// 数组对象的深浅拷贝
let obj = {
    url: '/api/login',
    method: 'GET',
    timeout: 100,
    key: Symbol('key'),
    big: 10n,
    n: null,
    u: undefined,
    reg: /^\d+$/,
    time: new Date(),
    fn: function () {
        console.log(this);
    },
    err: new Error('11111'),
    headers: {
        token: '123',
        'Content-Type': 'application/json'
    },
    cache: false,
    arr: [1, 2, 3]
}
obj.obj = obj

/* ------以下方法都是浅克隆------ */
// 把对象进行克隆   Object.assign   扩展运算符   ...
let new_obj = Object.assign({}, obj)

let new_obj = { ...obj }

// 把数组进行克隆   slice   展开运算符   ...



/* ------实现深克隆最便捷的办法------ */
/**
 * JSON.stringify(): 把对象/数组变为JSON字符串
 * JSON.parse(): 把JSON字符串变为对象/数组 [浏览器需要重新开辟所有内存]
 *    [弊端]
 *    + 不允许出现套娃操作
 *    + 属性值不能是 BigInt
 *    + 丢失一些内容:只要属性值是 symbol、undefined、function 这些类型的
 *    + 还有信息不准确的，例如: 正则->空对象   Error->空对象   日期对象->字符串
 */
let new_obj = JSON.parse(JSON.stringify(obj))

/**
 * Qs.stringify: 把对象变为urlencoded格式字符串 'xxx=xxx&xxx=xxx'
 * Qs.parse: 把urlencoded格式字符串变为对象
 */