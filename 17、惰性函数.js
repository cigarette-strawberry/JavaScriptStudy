/**
 * 进阶应用之"惰性函数"
 */
// 获取元素的样式 window.getComputedStyle 获取浏览器计算的样式 元素经过浏览器渲染的样式都可以得到

// 当前方法执行多次[浏览器没有变、页面也没有刷新]，每一次执行都要做兼容判断 这样没有必要，第一次处理兼容，以后没有必要去处理
/* function getCss(element, attr) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(element)[attr];
    }
    return element.currentStyle[attr];
} */

// 还是会走业务逻辑判断
/* let compatible = window.getComputedStyle ? true : false;
function getCss(element, attr) {
    if (compatible) {
        return window.getComputedStyle(element)[attr];
    }
    return element.currentStyle[attr];
} */

// 惰性函数
function getCss(element, attr) {
    // 第一次执行，根据兼容情况，重构getCss函数
    if (window.getComputedStyle) {
        getCss = function (element, attr) {
            return window.getComputedStyle(element)[attr];
        };
    } else {
        getCss = function (element, attr) {
            return element.currentStyle[attr];
        };
    }
    // 第一次把重构的函数执行一次，获取对应的结果
    return getCss(element, attr);
}
console.log(getCss(document.body, 'width'));
console.log(getCss(document.body, 'height'));
console.log(getCss(document.body, 'margin'));
