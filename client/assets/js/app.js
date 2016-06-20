var $ = require('jquery'),
  Backbone = require('backbone');

$(function(){
  Backbone.history.start({ pushState: true });
});
