const O = require('./Observer');
const Observer = new O();

function watch(data) {
  if (typeof data !== 'object') 
    return;
  Object.keys(data).forEach(k => {
    let value;
    if (typeof data[k] === 'object') {
      watch(data[k]);
    } else {
      Object.defineProperty(data, k, {
        set(newVal) {
          value = newVal;
          watch(data[k]);
          Observer.notify(newVal);
        },
        get() {
          return value;
        }
      });
    }
  });
}

var a = {
  name: '',
  family: {
    dad: '',
    mom: ''
  }
};
watch(a);
const update = (x) => {
  console.log(x);
};
Observer.add({update});
a.family;
a.family.dad = '1';
a.family.mom = '2';
console.log(a.family.dad);