var $ = require('jquery'),
  Backbone = require('backbone'),
  _ = require('underscore'),
  AppView = require('./views/app');

$(function(){
  var options = {
    vent: _.clone(Backbone.Events),
    config: require('./config'),
    reverse: require('./reverse')
  };

  new AppView(options);

  require('./modules/404')(options);

  require('./modules/map')(options);
  require('./modules/news')(options);

  require('./modules/booklet')(options);
  require('./modules/feedback')(options);

  Backbone.history.start({ pushState: true });
});
