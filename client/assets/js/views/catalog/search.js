var Backbone = require('backbone'),
  _ = require('underscore'),
  template = require('../../templates/catalog/search.html');


module.exports = Backbone.View.extend({
  template: template,
  id: 'search',

  initialize: function(options) {
    this.listenToOnce(options.vent, 'route:catalog', this.render);
    this.listenTo(options.vent, 'route:catalog', this.onRoute);

    this.options = options;
  },

  onRoute: function(id, query) {
    if (id == 'search' && this.$el.find('input').val() != query)
      this.render({query: query});
  },

  events: {
    'focus input': 'onInput',
    'input input': 'onInput',
    'change input': 'onInput'
  },

  onInput: function(event) {
    var query = this.$el.find('input').val();
    var action = function() {
      Backbone.Router.prototype.navigate(
        this.options.reverse('catalog', {search: query}),
        {trigger: true, replace: event.type == 'input'}
      );
    }.bind(this);

    if (this._timeout) clearTimeout(this._timeout);
    if (event.type == 'input') this._timeout = setTimeout(action, 500);
    else action();
  },

  render: function(options) {
    this.$el.html(this.template(
      _.extend({
          query: ''
        },
        options
      )
    ));
    return this;
  }
});
