/*jshint node:true,strict:false*/
/**
 * async Pool
 * @param  {Number} threadCount Thread Count   线程计数
 * @param  {Array} stack       The task list to deal with   要处理的任务列表
 * @param  {Function} func        The function to deal each individual task   处理每个单独任务的函数
 * @param  {Function} onComplete  The callback function when all tasks are done   所有任务完成时的回调函数
 */
module.exports = function (threadCount, stack, func, onComplete) {
    if (!threadCount) threadCount = 1;
    if (!Array.isArray(stack)) stack = [];
    if (typeof func !== 'function') func = function (data, callback) { callback(); };
    stack = stack.slice();
    var processingCount = 0;
    var eventUtil = {};
    eventUtil.subList = {};
    eventUtil.on = function (e, callback) {
        if (!eventUtil.subList[e])
        {
            eventUtil.subList[e] = [];
        }
        eventUtil.subList[e].push(callback);
    };
    eventUtil.trigger = function (e, data) {
        if (eventUtil.subList[e] && eventUtil.subList[e].length)
        {
            eventUtil.subList[e].forEach(function (callback) {
                callback(e, data);
            });
        }
    };
    eventUtil.on('empty', function (threadIndex) {
        if (!stack.length)
        {
            if (!processingCount && onComplete)
            {
                onComplete();
            }
            return;
        }
        var target = stack.shift();

        setTimeout(function () {
            processingCount++;
            func(target, function () {
                processingCount--;
                eventUtil.trigger('empty', threadIndex);
            });
        }, 0);
    });
    for (var i = threadCount; i--;)
    {
        eventUtil.trigger('empty', i);
    }
};
