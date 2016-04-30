var unicodeConverter = require('khmer-unicode-converter');

module.exports = function(text) {
  text = text + '';
  if (!text) { return ''; }

  text = text.replace(/ ́/, '´');
  text = text.replace(/ ̈/, '¨');
  text = text.replace(/1⁄4/, '¼');

  return unicodeConverter.abc(text);
};