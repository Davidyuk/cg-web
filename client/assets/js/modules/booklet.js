var $ = require('jquery'),
  _ = require('underscore'),
  View = require('../views/booklet'),
  Collection = require('../collections/booklet'),
  Model = require('../models/booklet');


module.exports = function(options) {
  var title = 'Буклет первокурсника';

  options.vent.trigger('menu:add', {
    href: '/booklet',
    title: title,
    type: 'bottom'
  });

  options.vent.trigger('router:add', {
    route: 'booklet(/:id)',
    name: 'booklet'
  });

  options.reverse.add('booklet', function(options){
    var id = (typeof options == 'object' ? options.id : options);
    return '/booklet' + (id ? '/' + id : '');
  });

  options.vent.once('route:booklet', function(id) {
    var collection = new Collection([
      { id:  1, name: 'Предстоит учиться мне' },
      { id:  2, name: 'Как пройти в библиотеку' },
      { id:  3, name: 'Твои права и обязанности' },
      { id:  4, name: 'Твой кампус' },
      { id:  5, name: 'Как добраться' },
      { id:  6, name: 'Жить с комфортом' },
      { id:  7, name: 'Доступ и безопасность' },
      { id:  8, name: 'Если вас влечёт наука' },
      { id:  9, name: 'Если хочешь быть активным' },
      { id: 10, name: 'Дерзайте, вы талантливы' },
      { id: 11, name: 'Если хочешь быть здоров' },
      { id: 12, name: 'Думайте о карьере' },
      { id: 13, name: 'Интересуетесь историей' },
      { id: 14, name: 'Полезная информация' }
    ], _.extend({
      parse: true,
      model: Model,
      title: title
    }, options));
    collection.setActive(1);

    new View(_.extend({
      el: $('main')[0],
      title: title,
      collection: collection
    }, options));

    var a = [].slice.call(arguments);
    a.unshift('route:booklet');
    options.vent.trigger.apply(options.vent, a);
  });
};
