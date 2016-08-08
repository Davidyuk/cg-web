var Backbone = require('backbone');


module.exports = Backbone.Collection.extend({
  initialize: function(models, options) {
    this.listenTo(options.vent, 'menu:add', this.addItem);
    this.on('change', this.updateTitle);

    this.options = options;
  },

  addItem: function(attributes) {
    this.add(attributes, this.options);
  },

  updateTitle: function() {
    var model = this.findWhere({active: true});
    this.options.vent.trigger('menu:title:change', model ? model.toJSON() : null);
  },

  sync: function() { return false; }
});
