/*globals Frampton:true */

/**
 * The parent namespace for everything else in Frampton
 *
 * @name Frampton
 * @namespace
 */
Frampton.VERSION = '0.1.3';

Frampton.TEST = 'test';

Frampton.DEV = 'dev';

Frampton.PROD = 'prod';

if (typeof Frampton.ENV === 'undefined') {
  Frampton.ENV = {
    MODE : Frampton.PROD,
    MOCK : {}
  };
}

Frampton.mock = function(key) {
  return ((Frampton.ENV.MOCK && Frampton.ENV.MOCK[key]) ? Frampton.ENV.MOCK[key] : null);
};

Frampton.isDev = function() {
  return (Frampton.ENV.MODE === Frampton.DEV);
};

Frampton.isTest = function() {
  return (Frampton.ENV.MODE === Frampton.TEST);
};

Frampton.isProd = function() {
  return (Frampton.ENV.MODE === Frampton.PROD);
};

export default Frampton;