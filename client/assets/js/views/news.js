var Backbone = require('backbone'),
  _ = require('underscore'),
  FeedView = require('./news/feed'),
  ArticleView = require('./news/article');


module.exports = Backbone.View.extend({
  id: 'news',

  initialize: function(options) {
    var opt = _.clone(options);
    delete opt.el;
    this.feed = new FeedView(opt);
    this.article = new ArticleView(opt);

    this.listenTo(options.vent, 'route:news', this.onRoute);

    this.options = options;
  },

  onRoute: function(id) {
    if (this.$el.attr('id') != this.id) {
      this.$el.attr('id', this.id);
      this.render();
    }
    this.feed.el.className = id ? 'mobile hidden' : '';
    this.article.el.className = id ? '' : 'mobile hidden';
    this.options.vent.trigger('menu_mobile:add', {
      title: this.options.title,
      href: id ? this.options.reverse.get('news') : null
    });
  },

  render: function() {
    this.$el.empty();
    this.$el.append(this.feed.el);
    this.feed.delegateEvents();
    this.$el.append(this.article.el);
    return this;
  }
});
