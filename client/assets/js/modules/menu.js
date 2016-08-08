var _ = require('underscore'),
  $ = require('jquery'),
  View = require('../views/menu'),
  Collection = require('../collections/menu'),
  Model = require('../models/menu'),
  menuItemTemplate = require('../templates/menu/item.html');


module.exports = function(options) {
  new View(_.defaults({
    collection: new Collection([], _.defaults({model: Model}, options))
  }, options)).render();

  var $mobileMenu = $(options.selector.mobileMenu);
  options.vent.on('menu:title:change', function(item){
    $mobileMenu.children().not(options.selector.sidebarToggleButton).remove();
    if (!item) return;
    item.active = false;
    item.icon = null;
    $mobileMenu.append($(menuItemTemplate(item)));
  });
};
