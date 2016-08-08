var Backbone = require('backbone');


module.exports = Backbone.Model.extend({
  defaults: {
    active: false,
    here: false,
    icon: null
  },

  initialize: function(attributes, options) {
    this.listenTo(options.vent, 'route', this.onRoute);
  },

  onRoute: function() {
    var href = this.get('href');
    this.set('active', href.length > 1 && !location.pathname.lastIndexOf(href, 0));
    this.set('here', href == location.pathname);
  },

  sync: function() { return false; }
});
