/**
 * 函数去抖
 * @param {要去抖的函数} fn 
 * @param {延迟时间（毫秒）} delay 
 */
const debounce = function(fn, delay) {
    let timer = null;
    return function(context, ...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(context, args);
        }, delay);
    }
}