const Observer = require('./Observer');

const update = (x) => {
  console.log(x);
}
const o = new Observer();
o.add({update});
o.add({update});
o.notify('...');