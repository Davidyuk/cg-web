var Backbone = require('backbone');


module.exports = Backbone.Model.extend({
  file: '/pdf/booklet/booklet{id}.pdf',
  defaults: {
    active: false
  },
  initialize: function(attributes, options) {
    this.set('url', options.reverse.get('booklet', { id: this.id } ));
  },
  parse: function(data) {
    data.file = this.file.replace('{id}', data.id );
    return data;
  },
  sync: function() { return false; }
});
