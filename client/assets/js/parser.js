module.exports = function(data, options) {
  options = options || {};
  if (options.paragraphs)
    data = '<p>' + data.replace(/(\r\n){2,}/g, '</p><p>') + '</p>';
  if (options.linebreaks)
    data = data.replace(/(\r\n)+/g, '<br>');

  return data;
};
