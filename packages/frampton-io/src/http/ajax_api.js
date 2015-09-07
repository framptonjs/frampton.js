import Frampton from 'frampton/namespace';
import apply from 'frampton-utils/apply';

function MockAjax() {
  this.listeners = {};
  this.headers = {};
  this.requestTime = ((Math.random() * 1000) + 300);
  this.progress = 0;
}

MockAjax.prototype.timeout = 10000;

MockAjax.prototype.open = function(method, url) {};

MockAjax.prototype.send = function() {

  this.progressInterval = setInterval(() => {
    if (this.listeners['progress']) {
      this.listeners['progress'].forEach((next) => {
        this.progress += 15;
        next({
          loaded : ((this.progress/this.requestTime) * 500),
          total : 500
        });
      });
    }
  }, 20);

  setTimeout(() => {

    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }

    if (this.listeners['load']) {
      this.listeners['load'].forEach((next) => {
        next({
          target: {
            response: 'test'
          },
          total: 500,
          loaded: 500
        });
      });
    }
  }, this.requestTime);

  if (this.listeners['start']) {
    this.listeners['start'].forEach(apply);
  }
};

MockAjax.prototype.addEventListener = function(name, callback) {

  if (!this.listeners[name]) {
    this.listeners[name] = [];
  }

  if (this.listeners[name].indexOf(callback) === -1) {
    this.listeners[name].push(callback);
  }
};

MockAjax.prototype.setRequestHeader = function(key, value) {
  this.headers[key] = value;
};

/**
 * Returns either an instance of XMLHttpRequest or a mock instance if in testing mode.
 *
 * @name ajaxApi
 * @method
 * @memberof Frampton.IO.Http
 * @returns {Object} Instance of XMLHttpRequest for current environment
 */
export default function ajax_api() {
  if (Frampton.isTest()) {
    return new MockAjax();
  } else {
    return new XMLHttpRequest();
  }
}