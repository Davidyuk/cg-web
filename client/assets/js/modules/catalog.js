var $ = require('jquery'),
  _ = require('underscore'),
  View = require('../views/catalog'),
  Collection = require('../collections/catalog'),
  CollectionCommon = require('../collections/common'),
  Model = require('../models/catalog');


module.exports = function(options) {
  var title = 'Справочник';

  options.vent.trigger('menu:add', {
    href: '/catalog',
    icon: 'catalog',
    title: title
  });

  options.vent.trigger('router:add', {
    route: 'catalog(/:id)(/:query)',
    name: 'catalog'
  });

  options.reverse.add('catalog', function(options){
    var suffix = '';
    var id = typeof options == 'object' ? options.id : options;
    if (id) suffix += '/' + id;
    else suffix += options && options.search ? '/search/' + options.search : '';
    return '/catalog' + suffix;
  });

  options.vent.once('route:catalog', function(id) {
    var dayCollection = new CollectionCommon([
      { id: 1, name: 'Понедельник', abbr: 'Пн' },
      { id: 2, name: 'Вторник', abbr: 'Вт' },
      { id: 3, name: 'Среда', abbr: 'Ср' },
      { id: 4, name: 'Четверг', abbr: 'Чт' },
      { id: 5, name: 'Пятница', abbr: 'Пт' },
      { id: 6, name: 'Суббота', abbr: 'Сб' },
      { id: 7, name: 'Воскресенье', abbr: 'Вс' }
    ], options);

    new Collection([], _.extend({
      model: Model,
      dayCollection: dayCollection,
      title: title
    }, options));

    new View(_.extend({
      el: $(options.selector.main)[0],
      title: title
    }, options));

    options.vent.trigger('change:title', title);

    var a = [].slice.call(arguments);
    a.unshift('route:catalog');
    options.vent.trigger.apply(options.vent, a);
  });
};
