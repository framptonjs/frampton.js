const FramptonBuild = require('frampton-build');

const packages = {
  'frampton' : { trees: null },
  'frampton-utils' : { trees: null },
  'frampton-math' : { trees: null },
  'frampton-list' : { trees: null },
  'frampton-object' : { trees: null },
  'frampton-string' : { trees: null },
  'frampton-data' : { trees: null },
  'frampton-html' : { trees: null },
  'frampton-style' : { trees: null },
  'frampton-events' : { trees: null },
  'frampton-signal' : { trees: null }
};

const build = new FramptonBuild({
  name : 'frampton',
  packages : packages
});

module.exports = build.getDistTree();
