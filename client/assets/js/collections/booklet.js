var Backbone = require('backbone');


module.exports = Backbone.Collection.extend({
  active: null,
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
