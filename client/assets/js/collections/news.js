var Backbone = require('backbone'),
  _ = require('underscore');


module.exports = Backbone.Collection.extend({
  loadCount: 20,
  api: '{api}news',
  _loading: false,
  _loadedHead: false,
  _loadedTail: false,

  initialize: function(models, options) {
    this.listenTo(options.vent, 'route:news', this.onRoute);
    this.listenTo(options.vent, 'news:load:head', function() { this.load(true) });
    this.listenTo(options.vent, 'news:load:tail', function() { this.load(false) });

    this.options = options;
  },

  sync: function(method, model, options) {
    if (method != 'read') return false;
    options = options || {};

    // jQuery.ajax fails when vent in options
    options = _.clone(options);
    delete options.vent;

    options.url = this.api.replace('{api}', this.options.config.server.api);
    return Backbone.sync.apply(this, arguments);
  },

  onRoute: function(id) {
    if (!this.length && !id) {
      this.options.vent.trigger('news:feed:loading');
      this.fetch(_.defaults({
        data: {count: this.loadCount},
        success: function () {
          this.options.vent.trigger('news:feed:loaded');
          this.first().details();
        }.bind(this)
      }, this.options));
      this._loadedHead = true;
    }

    if (id) {
      if (!this.get(id)) {
        this.options.vent.trigger('news:feed:loading');
        this.fetch(_.defaults({
          data: {id: id, count: this.loadCount},
          success: function () {
            this.options.vent.trigger('news:feed:loaded');
          }.bind(this)
        }, this.options));
      }
      this.add({id: id}, this.options);
      this.get(id).details();
    }
  },

  load: function(isHead) {
    var s = isHead ? 'head' : 'tail';
    var S = isHead ? 'Head' : 'Tail';
    if (this._loading || this['_loaded' + S]) return;
    this._loading = true;
    this.options.vent.trigger('news:feed:loading:' + s);

    var options = _.defaults({
      remove: false,
      data: { count: this.loadCount },
      success: function (collection, response) {
        this['_loaded' + S] = response.length < this.loadCount;
        this.options.vent.trigger('news:feed:loaded:' + s);
        this._loading = false;
      }.bind(this)
    }, this.options);
    if (isHead) {
      options.at = 0;
      options.data.count *= -1;
    }
    options.data.id = this[isHead ? 'first' : 'last']().get('id');

    this.fetch(options);
  }
});
