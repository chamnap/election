var unicodeConverter = require('khmer-unicode-converter');

module.exports = function(text) {
  text = text + '';
  if (!text) { return ''; }

  text = text.replace(/ ́/gm, '´');
  text = text.replace(/ ̈/gm, '¨');
  text = text.replace(/1⁄4/gm, '¼');
  text = text.replace(/μ/, 'µ');
  text = text.replace(/TL/, 'L');

  return unicodeConverter.abc(text);
};