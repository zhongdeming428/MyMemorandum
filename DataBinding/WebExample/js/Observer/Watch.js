import Observer from './Observer';

const OBS = new Observer();
OBS.add({
  update() {
    
  }
});

function watch(data) {
  if (typeof data !== 'object')
    throw new TypeError('监视对象必须是一个 Object 类型的参数！')
  Object.keys(data).forEach(k => {
    let value;
    if (typeof data[k] === 'object') 
      watch(data[k]);
    else {
      Object.defineProperty(data, k, {
        set(newVal) {
          value = newVal;
          watch(data[k]);
        },
        get() {
          return value;
        }
      })
    }
  });
}