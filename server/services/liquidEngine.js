const liquid = require('liquidjs');
const path = require('path');

const liquidEngine = liquid({
  root: path.resolve(__dirname, '../'),
  extname: '.html',
});

module.exports = liquidEngine;
