var Backbone = require('backbone'),
  SwitchLevelControl = require('../controls/level');


module.exports = Backbone.View.extend({
  id: 'map',

  initialize: function(options) {
    this.listenTo(this.model, 'change:level', this.onLevelChange);
    this.listenTo(this.model, 'change:showLevel', this.onLevelChange);
    this.listenTo(this.model, 'change', this.onCordsChange);
    this.listenTo(options.vent, 'route:map', this.onRoute);

    this.options = options;
    var ol = options.ol;

    this.map = new ol.Map({
      controls: ol.control.defaults().extend([
        new ol.control.FullScreen(),
        new ol.control.ZoomSlider(),
        new SwitchLevelControl(this.options)
      ]),
      interactions: ol.interaction.defaults().extend([
        new ol.interaction.DragRotateAndZoom()
      ]),
      renderer: 'canvas',
      view: new ol.View({
        center: ol.proj.transform([this.model.get('lon'), this.model.get('lat')], 'EPSG:4326', 'EPSG:3857'),
        zoom: this.model.get('zoom'),
        minZoom: this.model.minZoom,
        maxZoom: this.model.maxZoom
      }),
      layers: this.genLayers(),
      target: this.el
    });

    this.map.once('postrender', function() {
      this.model.updateShowLevel();
      this.map.on('moveend', this.onMapMoveEnd.bind(this));
    }, this);
  },

  onMapMoveEnd: function() {
    var view = this.map.getView();
    var coords = this.options.ol.proj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');
    this.model.set({
      lon: coords[0],
      lat: coords[1],
      zoom: view.getZoom()
    });
  },

  onCordsChange: function() {
    var view = this.map.getView();
    view.setZoom(this.model.get('zoom'));
    view.setCenter(this.options.ol.proj.transform(
      [this.model.get('lon'), this.model.get('lat')], 'EPSG:4326', 'EPSG:3857'
    ));
  },

  onLevelChange: function() {
    this.map.getLayers().forEach(function (layer) {
      if (!layer.get('level')) return;
      layer.setVisible(this.model.get('showLevel') && this.model.get('level') == layer.get('level'));
    }, this);
  },

  onRoute: function() {
    if (this.$el.attr('id') != this.id) this.render();
    this.options.vent.trigger('change:title',
      this.options.title
    );
  },

  genLayers: function() {
    var layers = [];

    var ol = this.options.ol;
    layers.push(new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: this.options.config.services.tms.replace('{layer}', 'mapvlru'),
        extent: ol.proj.transform(this.options.config.layers.crimea.extent, 'EPSG:4326', 'EPSG:3857'),
        attributions: [
          new ol.Attribution({ html: this.options.config.copyright })
        ]
      })
    }));

    for (var i = 1; i <= 12; i++) {
      var layer = new ol.layer.Tile({
        source: new ol.source.XYZ({
          url: this.options.config.services.tms.replace('{layer}', 'dvfu-' + i),
          extent: ol.proj.transform([131.8799,43.0127,131.9128,43.0448], 'EPSG:4326', 'EPSG:3857')
        }),
        opacity: 0.5
      });
      layer.set('level', i);
      layer.setVisible(false);
      layers.push(layer);
    }

    return layers;
  },

  render: function() {
    this.$el.attr('id', this.id).empty();
    this.map.setTarget(this.el);
    return this;
  }
});
