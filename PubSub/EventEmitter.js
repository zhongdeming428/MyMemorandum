module.exports = function() {
  let events = {};
  let on = function(event, fn) {
    if (events[event] !== undefined) {
      if (!events[event].includes(fn)) {
        events[event].push(fn);
      } else {
        return;
      }
    } else {
      events[event] = [fn];
    }
  };
  let emit = function(event, ...args) {
    let e = {
      event,
      args
    }
    if (events[event] === undefined) {
      return;
    } else {
      events[event].forEach((fn) => {
        fn(e);
      })
    }
  };
  return {
    on,
    emit
  };
}();