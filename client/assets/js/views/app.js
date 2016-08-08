var Backbone = require('backbone'),
  _ = require('underscore'),
  $ = require('jquery');


module.exports = Backbone.View.extend({
  vent: null,
  router: null,
  initialize: function(options) {
    _.bindAll.apply(_, function() {
      var a = _.functions(this);
      a.unshift(this);
      return a;
    }.call(this));

    this.vent = options.vent;
    this.vent.on({
      'change:title': this.setTitle,
      'router:add': this.addRoute
    });

    $.ajaxSetup({
      crossDomain: true,
      cache: true
    });

    window.jQuery = $;
    require('semantic');
    delete window.jQuery;

    $(document).on('click', 'a[href^="/"]', this.onLinkClick);

    this.initializeRouter();
  },

  initializeRouter: function() {
    var Router = Backbone.Router.extend({});
    this.router = new Router;
    this.router.on('all', function() {
      this.vent.trigger.apply(this.vent, arguments);
    }.bind(this));
  },

  addRoute: function(options) {
    this.router.route(options.route, options.name);
  },

  onLinkClick: function(event) {
    var href = $(event.currentTarget).attr('href');

    if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
      event.preventDefault();
      this.router.navigate(href, true);
    }
  },

  setTitle: function(title) {
    document.title = title + ' - Кампус Гид';
  }
});
