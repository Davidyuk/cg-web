var Backbone = require('backbone'),
  _ = require('underscore'),
  CategoryView = require('./catalog/category'),
  SearchView = require('./catalog/search');


module.exports = Backbone.View.extend({
  id: 'catalog',

  initialize: function(options) {
    var opt = _.clone(options);
    delete opt.el;
    this.category = new CategoryView(opt);
    this.search = new SearchView(opt);

    this.listenTo(options.vent, 'route:catalog', this.onRoute);

    this.options = options;
  },

  onRoute: function(params) {
    if (this.$el.attr('id') != this.id) {
      this.$el.attr('id', this.id);
      this.render();
    }
  },

  render: function() {
    this.$el.empty();
    this.$el.append(this.search.el);
    this.search.delegateEvents();
    this.$el.append(this.category.el);
    this.category.delegateEvents();
    return this;
  }
});
