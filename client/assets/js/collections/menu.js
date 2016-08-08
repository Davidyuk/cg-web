var Backbone = require('backbone');


module.exports = Backbone.Collection.extend({
  initialize: function(models, options) {
    this.listenTo(options.vent, 'menu:add', this.addItem);

    this.options = options;
  },

  addItem: function(attributes) {
    this.add(attributes, this.options);
  },

  sync: function() { return false; }
});
