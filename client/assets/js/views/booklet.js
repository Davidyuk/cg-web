var Backbone = require('backbone'),
  template = require('../templates/booklet.html');


module.exports = Backbone.View.extend({
  id: 'booklet',
  template: template,

  initialize: function(options) {
    this.listenTo(options.vent, 'route:booklet', this.onRoute);
    this.options = options;
  },

  onRoute: function(id) {
    this.$el.attr('id', this.id);
    this.isDetail = !!id;

    this.render();
  },

  render: function() {
    this.$el.html(this.template({
      objects: this.collection.toJSON(),
      active: this.collection.getActive().toJSON(),
      isDetail: this.isDetail,
      options: this.options
    }));
    return this;
  }
});
