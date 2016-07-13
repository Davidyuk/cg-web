var $ = require('jquery'),
  _ = require('underscore'),
  View = require('../views/feedback'),
  Model = require('../models/feedback');


module.exports = function(options) {
  var title = 'Обратная связь';

  options.vent.trigger('menu:add', {
    href: '/feedback',
    title: title,
    type: 'bottom'
  });

  options.vent.trigger('router:add', {
    route: 'feedback',
    name: 'feedback'
  });

  options.vent.once('route:feedback', function(id) {
    new View(_.extend({
      el: $('main')[0],
      title: title,
      model: new Model([], options)
    }, options));

    var a = [].slice.call(arguments);
    a.unshift('route:feedback');
    options.vent.trigger.apply(options.vent, a);
  });
};
