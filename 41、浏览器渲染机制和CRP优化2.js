setTimeout(() => {
    let box = document.querySelector('#box');
    box.style.width = '100px';
    box.style.height = '100px';
    // 上面三行代码在老版本浏览器会进行两次回流和重绘

    // 集中改变样式
    box.style.cssText = "width: 100px ;height: 100px;";
    box.className = 'big';

    // 新版浏览器都有一个机制: 渲染队列机制
    let box = document.querySelector('#box');
    box.style.width = '100px';
    console.log(box.style.width); // => 获取样式: style.xxx/getComputedStyle/getBoundingClientRect/clientWidth.../offsetWidth.../scrollWidth... 刷新浏览器渲染队列
    box.style.height = '100px';

    // ---读写分离:把获取样式和设置样式的操作分离开
    box.style.width = '100px';
    box.style.height = '100px';
    console.log(box.style.width);

    // ---读写分离
    let prevW = parseFloat(window.getComputedStyle(box)['width']),
        prevH = parseFloat(window.getComputedStyle(box)['height']);
    box.style.width = prevW + 100 + 'px';
    box.style.height = prevH + 100 + 'px';

    //文档碎片
    let box = document.querySelector('#box'),
        frag = document.createDocumentFragment();
    for (let i = 0; i < 10; i++)
    {
        let span = document.createElement('span');
        span.innerHTML = i + 1;
        frag.appendChild(span);
    }
    box.appendChild(frag);

    let box = document.querySelector('#box'),
        str = ``;
    for (let i = 0; i < 10; i++)
    {
        str += `<span>${i + 1}</span>`;
    }
    box.innerHTML = str;
}, 1000);