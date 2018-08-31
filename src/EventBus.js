class Listeners {
  constructor() {
    this.list = {};
  }

  create(eventName, fn) {
    if (!this.list[eventName]) {
      this.list[eventName] = [fn]
    }
    this.list[eventName].push(fn)
  }

  destroy(eventName, fn) {
    this.list[eventName].splice(this.list[eventName].indexOf(fn), 1)
  }

  fire(eventName, ...args) {
    if (this.list[eventName]) {
      this.list[eventName].forEach(fn => {
        fn.call(window, ...args)
      })
    }
  }
}

class EventBus {
  constructor() {
    this.listeners = new Listeners();
  }

  subscribe(eventName, fn, once) {
    console.info(`[${eventName}]: subscribe ${fn.name}`)
    this.listeners.create(eventName, fn);

    if (once) {
      this.unsubscribe(eventName, fn);
    }

    return this.unsubscribe.bind(this, eventName, fn)
  }

  once(eventName, fn) {
    this.subscribe(eventName, fn, true);
  }

  unsubscribe(eventName, fn) {
    console.info(`[${eventName}]: unsubcribe ${fn.name}`)
    this.listeners.destroy(eventName, fn);
  }

  emit(eventName, ...args) {
    console.info(`[${eventName}]: emit ${args}`)
    this.listeners.fire(eventName, ...args);
  }
}

const EB = new EventBus()

export { EB as EventBus }