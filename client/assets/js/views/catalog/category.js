var $ = require('jquery'),
  Backbone = require('backbone'),
  _ = require('underscore'),
  templateBase = require('../../templates/catalog/category.html'),
  templateRoot = require('../../templates/catalog/category-root.html');


module.exports = Backbone.View.extend({
  template: templateBase,
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
    this.template = model.id == 1 ? templateRoot : templateBase;
    if (model.id == 1) this.$el.addClass('root');
    else this.$el.removeClass('root');
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
