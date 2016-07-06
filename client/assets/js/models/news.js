var Backbone = require('backbone');


module.exports = Backbone.Model.extend({
  api: '{api}news/{id}',

  defaults: {
    thumbnail: 'uploads/catalogue/images/default.png'
  },

  initialize: function(attributes, options) {
    this.on({
      'request': this.onRequest,
      'sync': this.onSync,
      'error': this.onError
    });

    this.options = options;
  },

  parse: function(data) {
    if (data.body) {
      data.body = data.body.replace(/(\r\n){2,}/g, '</p><p>').replace(/(\r\n)+/g, '<br>');
      data.body = '<p>' + data.body + '</p>';
    }
    return data;
  },

  sync: function(method, model, options) {
    if (method != 'read' || !model.get('id')) return false;
    options = options || {};
    options.url = this.api.replace('{api}', this.options.config.server.api).replace('{id}', model.get('id'));
    return Backbone.sync(method, model, options);
  },

  onRequest: function() {
    this.options.vent.trigger('news:article:loading');
  },

  onSync: function() {
    this._loaded = true;
    this.options.vent.trigger('news:article:loaded', this);
  },

  onError: function() {
    this.options.vent.trigger('route:404');
  },

  details: function() {
    if (this._loaded) this.onSync();
    else this.fetch();
  }
});
