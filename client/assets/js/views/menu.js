var Backbone = require('backbone'),
  $ = require('jquery'),
  template = require('../templates/menu.html');


module.exports = Backbone.View.extend({
  template: template,

  initialize: function(options) {
    this.listenTo(options.vent, 'route', this.onRoute);
    this.listenTo(this.collection, 'add', this.render);
    this.listenTo(this.collection, 'change', this.render);

    this.$sidebar = $(options.selector.sidebar);
    this.$sidebar.sidebar('attach events', options.selector.sidebarToggleButton);
    this.$menu = $(options.selector.menu);

    var $window = $(window);
    $window.resize(function() {
      if ($window.width() > options.config.breakpoints.computer)
        this.$sidebar.sidebar('hide');
    }.bind(this));

    this.options = options;
  },

  onRoute: function() {
    this.$sidebar.sidebar('hide');
  },

  render: function() {
    this.$menu.html(this.template({
      items: this.collection.toJSON()
    }));
    return this;
  }
});
