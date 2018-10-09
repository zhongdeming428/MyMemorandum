class Observer {
  constructor() {
    this.observers = [];
  }
  add(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }
  remove(observer) {
    this.observers.forEach((o, i) => {
      if (o === observer) {
        this.observers.splice(i, 1);
      }
    });
  }
  notify(...args) {
    this.observers.forEach(o => {
      o.update(args);
    });
  }
}
module.exports = Observer;