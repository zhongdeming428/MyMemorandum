
const OBS = new Observer();
OBS.add({
  update(newVal) {
    document.getElementById('input').value = newVal;
    document.getElementById('h1').innerText = newVal;
  }
});

function watch(data) {
  if (typeof data !== 'object')
    return;
  Object.keys(data).forEach(k => {
    let value = '';
    if (typeof data[k] === 'object') 
      watch(data[k]);
    else {
      Object.defineProperty(data, k, {
        set(newVal) {
          value = newVal;
          watch(data[k]);
          OBS.notify(newVal);
        },
        get() {
          return value;
        }
      })
    }
  });
  return data;
}
