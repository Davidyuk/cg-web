var $ = require('jquery'),
  Backbone = require('backbone'),
  _ = require('underscore');

$(function(){
  var options = {
    vent: _.clone(Backbone.Events),
    config: require('./config'),
    reverse: require('./reverse')
  };

  Backbone.history.start({ pushState: true });
});
