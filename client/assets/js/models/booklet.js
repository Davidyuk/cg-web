var Backbone = require('backbone');


module.exports = Backbone.Model.extend({
  file: '/pdf/booklet/booklet{id}.pdf',

  defaults: {
    active: false
  },

  parse: function(data) {
    data.file = this.file.replace('{id}', data.id );
    return data;
  },

  sync: function() { return false; }
});
