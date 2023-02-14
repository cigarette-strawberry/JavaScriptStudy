// 自己封装工具时使用
(function () {
    /**
     * 函数防抖处理
     * @params
     *    func:最重要执行的函数[必传]
     *    wait:频繁操作的设定时间[默认是300MS]
     *    immediate:设置边界[默认false:结束边界触发   true:开始边界触发]
     */
    const debounce = function debounce (func, wait, immediate) {
        if (typeof func !== 'function')
            throw new TypeError('func must be function');
        if (typeof wait === 'boolean')
        {
            immediate = wait;
            wait = 300;
        }
        if (typeof wait !== 'number') wait = 300;
        if (typeof immediate !== 'boolean') immediate = false;
        let timer;
        // 定时器的返回值是数字
        return function proxy (...params) {
            let runNow = !timer && immediate,
                self = this;
            if (timer)
            {
                clearTimeout(timer);
                timer = null;
            }
            timer = setTimeout(() => {
                if (timer)
                {
                    clearTimeout(timer);
                    timer = null;
                }
                // 结束边界触发
                if (!immediate) func.call(self, ...params);
            }, wait);
            // 开始边界触发
            if (runNow) func.call(self, ...params);
        };
    };

    /**
     * 函数节流处理
     *   @params
     *     func:最终要执行的函数[必传]
     *     wait:设定的触发频率[默认300MS]
     */
    const throttle = function throttle (func, wait) {
        if (typeof func !== 'function')
            throw new TypeError('func must be function');
        if (typeof wait !== 'number') wait = 300;
        let timer,
            previous = 0;
        return function proxy (...params) {
            let now = +new Date(),
                remaining = wait - (now - previous),
                self = this;
            if (remaining <= 0)
            {
                // 间隔时间已经超过wait[包含第一次触发]，无需等待，立即执行
                if (timer)
                {
                    clearTimeout(timer);
                    timer = null;
                }
                func.call(self, ...params);
                previous = now;
            } else if (!timer)
            {
                timer = setTimeout(() => {
                    if (timer)
                    {
                        clearTimeout(timer);
                        timer = null;
                    }
                    func.call(self, ...params);
                    previous = +new Date();
                }, remaining);
            }
        };
    };

    let class2type = {},
        toString = class2type.toString, //Object.prototype.toString
        has0wn = class2type.hasOwnProperty, //Object.prototype.hasOwnProperty
        fnToString = has0wn.toString, //Function. prototype.toString
        ObjectFunctionString = fnToString.call(Object), //"function Object() { [native code] }"
        getProto = Object.getPrototypeOf

    //检测是否为函数数据类型的值
    const isFunction = function isFunction (obj) {
        return typeof obj === "function" && typeof obj.nodeType !== "number" && typeof obj.item !== "function";
    };

    //检测是否为window对象
    const isWindow = function isWindow (obj) {
        return obj != null && obj === obj.window;
    };

    // 检测数据类型的统一处理方法
    const toType = function toType (obj) {
        if (obj == null) return obj + ''
        return typeof obj === "object" || typeof obj === "function" ? toString.call(obj).match(/^\[object (\w+)\]$/)[1].toLowerCase() : typeof obj;
    }

    //检测是否为一个纯粹的对象「obj.__proto__ === 0bject.prototype || Object.create(null)」
    const isPlain0bject = function isPlain0bject (obj) {
        let proto, Ctor;
        if (!obj || toString.call(obj) !== "[object Object]") return false;
        proto = getProto(obj);
        if (!proto) return true;
        Ctor = has0wn.call(proto, "constructor") && proto.constructor;
        return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
    };

    // 检测当前对象是否是空对象
    const isEmptyObject = function isEmptyObject (obj) {
        if (!obj || !/(object|function)/i.test(typeof obj)) return false
        let keys = Object.keys(obj)
        if (typeof Symbol !== 'undefined') keys = keys.concat(Object.getOwnPropertySymbols(obj))
        return keys.length === 0
    }

    // 检测是否为一个有效数字[支持原始值{数字&字符串}&&构造函数创造的Number实例]
    const isNumeric = function isNumeric (obj) {
        let type = toType(obj)
        return (type === 'number' || type === 'string') && !isNaN(obj)
    }

    // 检测是否为数组或类数组
    const isArrayLike = function isArrayLike (obj) {
        let length = !!obj && 'length' in obj && obj.length,
            type = toType(obj)
        if (isFunction(obj) || isWindow(obj)) return false
        return type === 'array' || length === 0 || typeof length === 'number' && length > 0 && (length - 1) in obj
    }

    // 迭代数组、类数组、对象
    const each = function each (obj, callback) {
        if (obj == null || typeof obj !== 'object') throw new TypeError('obj must be an array/like-array/object')
        if (typeof callback !== 'function') callback = function () { }
        if (isArrayLike(obj))
        {
            let i = 0,
                length = obj.length,
                item
            for (; i < length; i++)
            {
                item = obj[i]
                if (callback.call(item, item, i) === false) break;
            }
        } else
        {
            let keys = Object.keys(obj),
                i = 0,
                length = keys.length,
                key,
                item
            if (typeof Symbol !== 'undefined') keys = keys.concat(Object.getOwnPropertySymbols(obj))
            for (; i < length; i++)
            {
                key = keys[i]
                item = obj[key]
                if (callback.call(item, item, key) === false) break;
            }
        }
        return obj;
    }

    // 实现数组/纯粹对象的深浅合并
    // merge(obj1,obj2,obj3)
    // merge(true,obj1,obj2,obj3)
    //    target 要被替换的对象
    //    options 要拿那个对象替换它
    const merge = function merge () {
        let options,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false,
            treated = arguments[length - 1]
        if (typeof target === "boolean")   // 判断第一项是不是布尔类型 是要进行深拷贝还是浅拷贝
        {
            deep = target;
            target = arguments[i] || {};
            i++;
        }
        // 防止死递归
        if (Array.isArray(treated) && treated.treated)
        {
            length--
        } else
        {
            treated = []
            treated.treated = true
        }
        if (typeof target !== "object" && !isFunction(target)) target = {};   // 只有对象和数组才可以进行拷贝
        for (; i < length; i++)
        {
            options = arguments[i]   // 第二个往后的参数 obj2,obj3
            if (options == null) continue
            if (treated.includes(options)) return options
            treated.push(options)
            each(options, function (copy, name) {   // copy:属性值, name:属性名
                let copyIsArray = Array.isArray(copy),
                    copyIsObject = isPlain0bject(copy),
                    clone = target[name]
                if (deep && copy && (copyIsArray || copyIsObject))
                {   // 深合并
                    if (copyIsArray && !Array.isArray(clone)) clone = []
                    if (copyIsObject && !isPlain0bject(clone)) clone = {}
                    target[name] = merge(deep, clone, copy, treated)
                } else if (copy !== undefined)
                {   // 浅合并
                    target[name] = copy
                }
            })
        }
        return target
    }

    //实现数组/对象的深浅克隆
    const clone = function clone () {
        let target = arguments[0],
            deep = false,
            type,
            isArray,
            isObject,
            result,
            Ctor,
            treated = arguments[arguments.length - 1];
        !Array.isArray(treated) || !treated.treated ? (treated = [], treated.treated = true) : null;
        if (typeof target === "boolean")
        {
            deep = target;
            target = arguments[1];
        }

        // 防止死递归
        if (treated.index0f(target) > -1) return target;
        treated.push(target);

        //校验类型
        type = toType(target);
        isArray = Array.isArray(target);
        isObject = isPlainObject(target);

        //特殊值的拷贝
        if (target == null) return target;
        Ctor = target.constructor;
        if (/^(regexp|date)$/i.test(type)) return new Ctor(target);
        if (/^(error)$/i.test(type)) return new Ctor(target.message);
        if (/^(function|generatorfunction)$/i.test(type))
        {
            return function proxy () {
                let args = Array.from(arguments);
                return target.apply(this, args);
            };
        }
        if (!isArray && !isObject) return target;

        //如果是数组/对象，我们依次迭代赋值给新的数组/对象
        result = new Ctor();
        each(target, function (copy, name) {
            if (deep)
            {
                //深拷贝
                result[name] = clone(deep, copy, treated);
                return;
            }
            //浅拷贝
            result[name] = copy;
        });
        return result;
    };


    // 利用闭包的保护作用，把自己写的方法写在私有上下文中，防止全局变量污染
    let utils = {
        isFunction,
        isWindow,
        toType,
        isPlain0bject,
        isEmptyObject,
        isNumeric,
        isArrayLike,
        each,
        merge,
        clone,
        debounce,
        throttle,
    };

    // 多库共存
    let _$ = window.$;
    utils.noConflict = function noConflict () {
        if (window.$ === utils)
        {
            window.$ = _$;
        }
        return utils;
    };

    // 暴露API[支持:浏览器直接导入、webpack环境编译、Node环境执行]
    if (typeof window !== 'undefined')
    {
        window.utils = utils;
    }
    if (typeof module === 'object' && typeof module.exports === 'object')
    {
        module.exports = utils;
    }
})();