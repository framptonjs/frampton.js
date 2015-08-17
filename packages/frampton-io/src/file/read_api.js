import Frampton from 'frampton/namespace';
import apply from 'frampton-utils/apply';

function MockReader() {
  this.listeners = {};
  this.readTime = ((Math.random() * 3000) + 300);
  this.progress = 0;
}

MockReader.prototype.timeout = 10000;

MockReader.prototype.read = function() {

  this.progressInterval = setInterval(() => {
    if (this.listeners['progress']) {
      this.listeners['progress'].forEach((next) => {
        this.progress += 15;
        next({
          loaded : ((this.progress/this.readTime) * 500),
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
          target : {
            result: 'test'
          }
        });
      });
    }
  }, this.readTime);

  if (this.listeners['start']) {
    this.listeners['start'].forEach(apply);
  }
};

MockReader.prototype.addEventListener = function(name, callback) {

  if (!this.listeners[name]) {
    this.listeners[name] = [];
  }

  if (this.listeners[name].indexOf(callback) === -1) {
    this.listeners[name].push(callback);
  }
};

MockReader.prototype.readAsDataURL = function(file) {
  this.read(file);
};

MockReader.prototype.readAsArrayBuffer = function(file) {
  this.read(file);
};

MockReader.prototype.readAsText = function(file) {
  this.read(file);
};

MockReader.prototype.readAsBinaryString = function(file) {
  this.read(file);
};

export default function ajax() {
  if (Frampton.isTest()) {
    return new MockReader();
  } else {
    return new FileReader();
  }
}