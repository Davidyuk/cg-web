var Backbone = require('backbone');


module.exports = Backbone.Collection.extend({
  initialize: function(models, options) {
    this.url = options.url ? options.url
      .replace('{api}', options.config.server.api)
      .replace('{server}', options.config.server) : null;
  },

  sync: function(method, model, options) {
    if (method != 'read' || !this.url) return false;
    options = options || {};
    options.url = this.url;
    return Backbone.sync.apply(this, arguments);
  }
});
