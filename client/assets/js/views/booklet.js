var Backbone = require('backbone'),
  template = require('../templates/booklet.html');


module.exports = Backbone.View.extend({
  id: 'booklet',
  template: template,

  initialize: function(options) {
    this.options = options;
    this.options.vent.on('route:booklet', this.onRoute.bind(this));
  },

  onRoute: function(id) {
    this.$el.attr('id', this.id);
    if (id) this.collection.setActive(id);
    if (!this.collection.active)
      return this.options.vent.trigger('route:404');
    this.isDetail = !!id;
    this.options.vent.trigger('change:title',
      (id ? this.collection.active.get('name') + ' - ' : '') +
      this.options.title
    );
    this.render();
    this.options.vent.trigger('menu_mobile:add', {
      title: this.options.title,
      href: id ? this.options.reverse.get('booklet') : null
    });
  },

  render: function() {
    var active = this.collection.getActive();
    this.$el.html(this.template({
      objects: this.collection.toJSON(),
      active: active ? active.toJSON() : active,
      isDetail: this.isDetail
    }));
    return this;
  }
});
