var $ = require('jquery'),
  Backbone = require('backbone'),
  _ = require('underscore'),
  template = require('../../templates/catalog/category.html');


module.exports = Backbone.View.extend({
  template: template,
  id: 'category',

  initialize: function(options) {
    this.listenTo(options.vent, 'catalog:loading', this.onLoading);
    this.listenTo(options.vent, 'catalog:loaded', this.onLoaded);

    this.options = options;
  },

  onLoading: function() {
    this.render({loading: true});
  },

  onLoaded: function(model) {
    this.model = model;
    this.render();
  },

  events: {
    'click a.schedule': function(event) {
      event.preventDefault();
      $('a.schedule').next().slideUp();
      $(event.target).next().stop().slideToggle();
    }
  },

  render: function(options) {
    this.$el.html(this.template(
      _.extend({
          loading: false,
          breadcrumbs: [],
          current: {},
          categories: [],
          objects: [],
          options: this.options
        },
        this.model ? this.model.toJSON() : {},
        options
      )
    ));
    return this;
  }
});
