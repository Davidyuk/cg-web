var Backbone = require('backbone');


module.exports = Backbone.Model.extend({
  initialize: function(attributes, options) {
    this.listenTo(options.vent, 'route', this.onRoute);
  },

  onRoute: function() {
    var href = this.get('href');
    this.set('active', href.length > 1 && !location.pathname.lastIndexOf(href, 0));
  },

  sync: function() { return false; }
});
