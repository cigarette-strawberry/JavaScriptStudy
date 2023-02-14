let obj1 = {
    url: '/api/login',
    method: 'GET',
    headers: {
        token: '123',
        'Content-Type': 'application/json'
    }
}
let obj2 = {
    method: 'POST',
    data: {
        name: 'xiaowu',
        age: 18
    },
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}
// 返回及处理的是obj1   浅合并:浅比较，只对对象的第一级进行比较，用obj2中的每一项直接替换obj1中相同的这一项
console.log(Object.assign(obj1, obj2));
// 先拿obj1替换{}中的每一项[把obj1复制过去一份]，接下来再拿obj2替换对象中相同的每一项
console.log(Object.assign({}, obj1, obj2));