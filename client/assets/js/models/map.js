var Backbone = require('backbone'),
  _ = require('underscore');


module.exports = Backbone.Model.extend({
  minLevel: 1,
  maxLevel: 12,
  minZoom: 3,
  maxZoom: 21,
  showLayersOn: {
    lon: { min: 131.8799, max: 131.9128 },
    lat: { min: 43.0127, max: 43.0448 },
    minZoom: 18
  },

  defaults: {
    lon: 131.893528,
    lat: 43.023759,
    zoom: 16,
    level: 7,
    showLevel: false
  },

  set: function(attributes, options) {
    if (typeof attributes == 'string') {
      var t = {};
      t[attributes] = options;
      attributes = t;
      options = null;
    }
    if (attributes.lon) attributes.lon = (attributes.lon * 1).toFixed(6) * 1;
    if (attributes.lat) attributes.lat = (attributes.lat * 1).toFixed(6) * 1;
    if (attributes.zoom) {
      attributes.zoom *= 1;
      attributes.zoom = Math.min(attributes.zoom, this.maxZoom);
      attributes.zoom = Math.max(attributes.zoom, this.minZoom);
    }
    if (typeof attributes.level != 'undefined') {
      attributes.level *= 1;
      attributes.level = Math.min(attributes.level, this.maxLevel);
      attributes.level = Math.max(attributes.level, this.minLevel);
    }
    Backbone.Model.prototype.set.call(this, attributes);
  },

  initialize: function(attributes, options) {
    this.listenTo(options.vent, 'route:map', this.onRoute);

    this.on('change', function(){
      this.updateShowLevel();
      this.updatePath();
    });

    this.options = options;
  },

  onRoute: function(query) {
    var options = {};
    if (query)
      query.split('&').forEach(function(param){
        var r = param.split('=');
        options[r[0]] = r[1];
      });
    this.set(options);
  },

  updateShowLevel: function() {
    var c = this.showLayersOn;
    var r = this.get('zoom') >= c.minZoom;
    var lon = this.get('lon');
    r = r && c.lon.min < lon && lon < c.lon.max;
    var lat = this.get('lat');
    r = r && c.lat.min < lat && lat < c.lat.max;
    this.set('showLevel', r);
  },

  updatePath: function() {
    var opt = _.clone(this.attributes);
    Object.keys(opt).forEach(function(key){
      if (opt[key] == this.defaults[key])
        delete opt[key];
    }, this);
    if (!opt.showLevel) delete opt.level;
    delete opt.showLevel;
    Backbone.Router.prototype.navigate(
      this.options.reverse('map', opt), {replace: true}
    );
  }
});
