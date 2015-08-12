import Frampton from 'frampton/namespace';
import apply from 'frampton-utils/apply';

function MockXMLHttpRequest() {
  this.listeners = {};
  this.headers = {};
  this.requestTime = ((Math.random() * 3000) + 300);
  this.progress = 0;
}

MockXMLHttpRequest.prototype.timeout = 10000;

MockXMLHttpRequest.prototype.open = function(method, url) {};

MockXMLHttpRequest.prototype.send = function() {

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
        next('test');
      });
    }
  }, this.requestTime);

  if (this.listeners['start']) {
    this.listeners['start'].forEach(apply);
  }
};

MockXMLHttpRequest.prototype.addEventListener = function(name, callback) {

  if (!this.listeners[name]) {
    this.listeners[name] = [];
  }

  if (this.listeners[name].indexOf(callback) === -1) {
    this.listeners[name].push(callback);
  }
};

MockXMLHttpRequest.prototype.setRequestHeader = function(key, value) {
  this.headers[key] = value;
};

export default function ajax() {
  if (Frampton.isTest()) {
    return new MockXMLHttpRequest();
  } else {
    return new XMLHttpRequest();
  }
}