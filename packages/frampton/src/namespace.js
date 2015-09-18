/*globals Frampton:true */

/**
 * The parent namespace for everything else in Frampton
 *
 * @name Frampton
 * @namespace
 */
Frampton.VERSION = '0.0.8';

Frampton.TEST = 'test';

Frampton.DEV = 'dev';

Frampton.PROD = 'prod';

if (typeof Frampton.ENV === 'undefined') {
  Frampton.ENV = {
    MODE : Frampton.PROD
  };
}

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