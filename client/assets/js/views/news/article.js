var Backbone = require('backbone'),
  _ = require('underscore'),
  template = require('../../templates/news/article.html');


module.exports = Backbone.View.extend({
  id: 'article',
  template: template,

  initialize: function(options) {
    this.listenTo(options.vent, 'news:article:loading', this.onLoading);
    this.listenTo(options.vent, 'news:article:loaded', this.onLoaded);

    this.options = options;
  },

  onLoading: function() {
    this.render({loading: true});
  },

  onLoaded: function(model) {
    this.model = model;
    this.render();
  },

  render: function(options) {
    this.$el.html(this.template(
      _.extend({
          object: this.model ? this.model.toJSON() : {},
          loading: false,
          options: this.options
        },
        options
      )
    ));
    return this;
  }
});
