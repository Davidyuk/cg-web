var Backbone = require('backbone');


module.exports = Backbone.Collection.extend({
  initialize: function(models, options) {
    this.listenTo(options.vent, 'route:catalog', this.onRoute);

    this.options = options;
  },

  onRoute: function(id) {
    id = id || 1;
    this.add({id: id}, this.options);
    this.get(id).show();
  },

  sync: function() { return false; }
});
