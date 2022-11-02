var express = require('express');
var fs = require('fs');

var router = express.Router();
var files = fs.readdirSync(__dirname);

files.filter(file => {
  return file !== 'loader.js'
}).forEach(file => {
  var route = require('./' + file.replace('.js', ''));
  if (file === 'index.js') {
    router.use('/', route);
  } else {
    router.use('/mock/' + file.replace('.js', ''), route);
  }
})

module.exports = router;