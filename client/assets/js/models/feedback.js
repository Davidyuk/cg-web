var Backbone = require('backbone'),
  $ = require('jquery');


module.exports = Backbone.Model.extend({
  api: '{server}api2/method/feedback',

  initialize: function(attributes, options) {
    this.options = options;
  },

  validate: function(attributes) {
    if (!(attributes.username || attributes.phone || attributes.message))
      return 'Необходимо заполнить хотя бы одно поле';
  },

  sync: function(method, model, options) {
    if (method != 'create') return false;
    options = options || {};
    options.url = this.api.replace('{server}', this.options.config.server);
    options.type = 'POST';
    options.data = $.param(model.toJSON());
    options.contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
    options.dataType = 'json';
    return Backbone.sync(method, model, options);
  }
});
