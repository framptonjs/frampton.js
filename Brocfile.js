var FramptonBuild = require('frampton-build');
var packages   = require('./packages');

var build = new FramptonBuild({
  name     : 'frampton',
  packages : packages
});

module.exports = build.getDistTree();