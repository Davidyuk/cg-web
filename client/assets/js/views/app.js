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
      'menu:add': this.addMenuItem,
      'menu_mobile:add': this.addMenuFixedItem,
      'menu_mobile:clean': this.clearMenuFixed,
      'router:add': this.addRoute
    });

    $.ajaxSetup({
      crossDomain: true,
      cache: true
    });

    window.jQuery = $;
    require('semantic');
    delete window.jQuery;

    $('.ui.sidebar').sidebar('attach events', '.sidebar-toggle.item');

    $(window).resize(function() {
      if ($(window).width() > options.config.breakpoints.tablet)
        $('.ui.sidebar').sidebar('hide');
    });

    $(document).on('click', 'a[href^="/"]', this.onLinkClick);

    this.initializeRouter();
  },

  initializeRouter: function() {
    var Router = Backbone.Router.extend({});
    this.router = new Router;
    this.router.on('all', function() {
      if (arguments[0] != 'route') {
        this.vent.trigger('menu_mobile:clean');
        this.updateLinkActive();
      }
      this.vent.trigger.apply(this.vent, arguments);
    }.bind(this));
  },

  addRoute: function(options) {
    this.router.route(options.route, options.name);
  },

  onLinkClick: function(event) {
    $('.ui.sidebar').sidebar('hide');

    var href = $(event.currentTarget).attr('href');

    if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
      event.preventDefault();
      this.router.navigate(href, true);
    }
  },

  updateLinkActive: function() {
    var $menu = $('.ui.vertical.menu');
    $menu.find('a.active').removeClass('active');
    var s = location.pathname;
    $menu.find('a[href^="/"]').each(function(_, el){
      var $el = $(el);
      var path = $el.attr('href');
      if (path.length > 1 && !s.lastIndexOf(path, 0))
        $el.addClass('active');
    });
  },

  setTitle: function(title) {
    document.title = title + ' - Кампус Гид';
  },

  addMenuItem: function(opt) {
    opt.type = (opt.type == 'bottom') ? 'bottom' : 'top';
    var $item = $('<a class="item" href="' + opt.href + '">' + opt.title + '</a>');
    if (opt.icon) $item.prepend('<span class="icon-' + opt.icon + '"></span>');
    if (opt.type == 'top') {
      $('.ui.menu .bottom').before($item);
    } else {
      $('.ui.menu .bottom').append($item);
    }
  },

  addMenuFixedItem: function(opt) {
    var $item = $(opt.href ? '<a href="' + opt.href + '"></a>' : '<span></span>');
    $item.addClass('item').text(opt.title);
    if (opt.icon) $item.prepend($('<i class="icon ' + opt.icon + '"></i>'));
    $('.main .ui.top.fixed.menu').append($item);
  },

  clearMenuFixed: function() {
    $('.main .ui.top.fixed.menu .item').not('.sidebar-toggle').remove();
  }
});
