var Backbone = require('backbone'),
  _ = require('underscore'),
  template = require('../../templates/news/feed.html');


module.exports = Backbone.View.extend({
  id: 'feed',
  template: template,
  scrolledUp: false,
  loadStartFromPx: 300,

  initialize: function(options) {
    this.listenTo(options.vent, 'route:news', this.onRoute);
    this.listenTo(options.vent, 'news:feed:loading', function() { this.render({loading: true}) });
    this.listenTo(options.vent, 'news:feed:loading:head', this.onLoadingHead);
    this.listenTo(options.vent, 'news:feed:loading:tail', function() { this.render({loadingTail: true}) });
    this.listenTo(options.vent, 'news:feed:loaded', this.onLoaded);
    this.listenTo(options.vent, 'news:feed:loaded:head', function() { this.render({loadedHead: true}) });
    this.listenTo(options.vent, 'news:feed:loaded:tail', this.render);

    this.options = options;
  },

  onRoute: function(id) {
    this.setActive(id);
  },

  onLoaded: function() {
    this.scrolledUp = !this._activeId;
    this.render({loaded: true});
  },

  onLoadingHead: function() {
    this.scrolledUp = true;
    this.render({loadingHead: true});
  },

  render: function(options) {
    options = options || {};

    if (options.loadedHead || options.loadingHead)
      var scrollHeightOld = this.el.scrollHeight;
    this.$el.html(this.template(
      _.extend(
        {
          loading: false,
          loadingHead: false,
          loadingTail: false,
          scrolledUp: options.loading || this.scrolledUp,
          objects: options.loading ? [] : this.collection.toJSON(),
          options: this.options
        },
        options
      )
    ));
    if (options.loadedHead || options.loadingHead) {
      this.$el.scrollTop(
        this.$el.scrollTop() + this.el.scrollHeight - scrollHeightOld
      );
    }

    if (options.loaded && !this.scrolledUp) {
      var h = this.$el.find('.item:first').position().top;
      if (this.$el.scrollTop() < h)
        this.$el.scrollTop(h);
    }

    this.setActive();
    return this;
  },

  setActive: function(id) {
    this._activeId = id = id || this._activeId ||
      (this.collection.first() ? this.collection.first().get('id') : 0);
    this.$el.find('.list .item.active').removeClass('active');
    this.$el.find('.list .item[data-id=' + id + ']').addClass('active');
  },

  events: {
    'scroll': 'onScroll'
  },

  onScroll: function() {
    if (!this.scrolledUp && this.$el.scrollTop() < this.$el.find('.item:first').position().top ||
      this.scrolledUp && this.$el.scrollTop() < this.loadStartFromPx)
      this.options.vent.trigger('news:load:head');

    if (this.$el.scrollTop() + this.$el.height() > this.$el[0].scrollHeight - this.loadStartFromPx)
      this.options.vent.trigger('news:load:tail');
  }
});
