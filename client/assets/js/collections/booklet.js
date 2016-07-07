var Backbone = require('backbone');


module.exports = Backbone.Collection.extend({
  active: null,

  initialize: function(models, options) {
    this.listenTo(options.vent, 'route:booklet', this.onRoute);
    this.options = options;
  },

  onRoute: function(id) {
    if (id) this.setActive(id);
    this.options.vent.trigger('change:title',
      (id && this.active ? this.active.get('name') + ' - ' : '') +
      this.options.title
    );
    if (!this.active)
      this.options.vent.trigger('route:404');
  },

  getActive: function() {
    return this.active;
  },

  setActive: function(id) {
    if (this.active) this.active.set('active', false);
    this.active = this.get(id);
    if (this.active) this.active.set('active', true);
  },

  sync: function() { return false; }
});
