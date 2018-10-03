/**
 * 函数节流
 * @param {要节流的函数} fn 
 * @param {没多久跑一次（毫秒）} delay 
 */
const throttle = function(fn, delay) {
    let last = +new Date();
    return function(context, ...args) {
        let now = +new Date();
        if (now - last >= delay) {
            fn.apply(context, args);
            last = now;
        }
    };
}