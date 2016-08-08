var $ = require('jquery'),
  Backbone = require('backbone'),
  _ = require('underscore'),
  AppView = require('./views/app');

$(function(){
  var options = {
    vent: _.clone(Backbone.Events),
    config: require('./config'),
    reverse: require('./reverse'),
    parser: require('./parser'),
    selector: {
      main: 'main',
      menu: '.ui.vertical.menu',
      sidebar: '.ui.vertical.sidebar.menu',
      sidebarToggleButton: '.sidebar-toggle.item',
      mobileMenu: '.main .ui.top.fixed.menu'
    }
  };

  new AppView(options);

  require('./modules/menu')(options);
  require('./modules/404')(options);

  require('./modules/catalog')(options);
  require('./modules/map')(options);
  require('./modules/news')(options);

  require('./modules/booklet')(options);
  require('./modules/feedback')(options);

  Backbone.history.start({ pushState: true });
});
