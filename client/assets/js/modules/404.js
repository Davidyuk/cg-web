var $ = require('jquery'),
  template = require('../templates/404.html');


module.exports = function(options) {
  options.vent.trigger('router:add', {
    route: '*route',
    name: '404'
  });

  options.vent.on('route:404', function() {
    $('main').attr('id', 'e404').html(template());
  });
};
