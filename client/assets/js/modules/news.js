var $ = require('jquery'),
  _ = require('underscore'),
  View = require('../views/news'),
  Collection = require('../collections/news'),
  Model = require('../models/news');


module.exports = function(options) {
  var title = 'Новости';

  options.vent.trigger('menu:add', {
    href: '/news',
    icon: 'news',
    title: 'Новости'
  });

  options.vent.trigger('router:add', {
    route: 'news(/:id)',
    name: 'news'
  });

  options.reverse.add('news', function(options){
    var id = (typeof options == 'object' ? options.id : options);
    return '/news' + (id ? '/' + id : '');
  });

  options.vent.once('route:news', function(id) {
    var collection = new Collection([], _.extend({
      model: Model
    }, options));

    new View(_.extend({
      el: $('main')[0],
      title: title,
      collection: collection
    }, options));

    var a = [].slice.call(arguments);
    a.unshift('route:news');
    options.vent.trigger.apply(options.vent, a);
  });
};
