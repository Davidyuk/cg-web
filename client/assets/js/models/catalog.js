var Backbone = require('backbone'),
  _ = require('underscore');


module.exports = Backbone.Model.extend({
  api: '{api}catalog',

  initialize: function(attributes, options) {
    this.on({
      'request': this.onRequest,
      'sync': this.onSync,
      'error': this.onError
    });

    this.options = options;
  },

  show: function() {
    if (this._loaded) this.onSync();
    else this.fetch();
  },

  onRequest: function() {
    this.options.vent.trigger('catalog:loading');
  },

  onSync: function() {
    this._loaded = true;
    this.options.vent.trigger('catalog:loaded', this);

    var title = this.get('current') ? this.get('current').name : '';
    title = title == this.options.title ? '' : title;
    this.options.vent.trigger('change:title',
      (title ? title + ' - ' : '') + this.options.title);
  },

  onError: function() {
    this.options.vent.trigger('route:404');
  },

  parseBase: function(data) {
    var defaultLogoUrl = 'uploads/catalogue/images/default.png';

    if (data.description)
      data.description = this.options.parser(data.description, {linebreaks: true, emails: true});

    data.logoStandardUrl = this.options.config.server + (data.logoStandardUrl || defaultLogoUrl);
    data.logoThumbnailUrl = this.options.config.server + (data.logoThumbnailUrl || defaultLogoUrl);

    if (data.site)
      data.site = {
        name: data.site.replace(/http[s]?:\/\//, '').replace(/\/$/, ''),
        url: ((data.site.indexOf('://') == -1) ? 'http://' : '') + data.site
      };

    if (data.phone)
      data.phone = {
        name: data.phone,
        url: 'tel://' + data.phone.replace(/[^\d+]+/g, '')
      };

    return data;
  },

  parseCategory: function(data) {
    data.isOrganization = data.isOrganization || false;
    return this.parseBase(data);
  },

  parseObject: function(data) {
    if (data.schedule) {
      data.schedule.sort(function(a, b){
        return a.dayId - b.dayId;
      });
      data.schedule.forEach(function (o) {
        o.day = this.options.dayCollection.get(o.dayId).get('abbr');
      }, this);
      var i = 1;
      while (i < data.schedule.length) {
        if (data.schedule[i-1].startAt == data.schedule[i].startAt &&
          data.schedule[i-1].endAt == data.schedule[i].endAt) {
          data.schedule[i-1].day += ', ' + data.schedule[i].day;
          data.schedule.splice(i, 1);
        } else i++;
      }
    }

    if (data.node) {
      data.node.url = this.options.reverse('map', {
        lon: data.node.lon, lat: data.node.lat, zoom: 20,
        level: data.node.level ? data.node.level.name : null
      });
      var a = [];
      if (data.node.building) a.push('здание ' + data.node.building.name);
      if (data.node.level) a.push('уровень ' + data.node.level.name);
      if (data.node.name) a.push(data.node.name);
      data.node.name = a.join(' / ');
    }

    return this.parseBase(data);
  },

  parse: function(data) {
    data.categories.concat(data.breadcrumbs || []).forEach(function(elem) {
      this.parseCategory(elem);
    }, this);
    data.objects.forEach(function(elem) {
      this.parseObject(elem);
    }, this);
    if (data.breadcrumbs && data.breadcrumbs.length) data.current = _.last(data.breadcrumbs);
    return data;
  },

  sync: function(method, model, options) {
    if (method != 'read') return false;
    options = options || {};
    options.url = this.api.replace('{api}', this.options.config.server.api);
    options.data = options.data || {};
    if (model.id) _.extend(options.data, {category: model.id});
    return Backbone.sync(method, model, options);
  }
});
