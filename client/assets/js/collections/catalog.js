var Backbone = require('backbone');


module.exports = Backbone.Collection.extend({
  initialize: function(models, options) {
    this.listenTo(options.vent, 'route:catalog', this.onRoute);

    this.options = options;
  },

  onRoute: function(id, query) {
    var model;
    if (id == 'search') {
      model = this.findWhere({query: query});
      if (!model) {
        this.add({query: query}, this.options);
        model = this.findWhere({query: query});
      }
    } else {
      id = id || 1;
      this.add({id: id}, this.options);
      model = this.get(id);
    }
    model.show();
  },

  sync: function() { return false; }
});
