var $ = require('jquery'),
  _ = require('underscore'),
  View = require('../views/map'),
  Model = require('../models/map');


module.exports = function(options) {
  var title = 'Карта';

  options.vent.trigger('menu:add', {
    href: '/map',
    icon: 'map',
    title: 'Карта'
  });

  options.vent.trigger('router:add', {
    route: 'map(?:query)',
    name: 'map'
  });

  options.reverse.add('map', function(options){
    var p = $.param(options);
    return '/map' + (p ? '?' + p : '');
  });

  options.vent.once('route:map', function() {
    var opt = _.extend({
      title: title
    }, options);

    var model = new Model([], opt);

    var p = [
      function(cb) {
        $.getScript('/assets/js/vendor/ol.js', function () {
          opt.ol = ol;
          delete window.ol;
          cb();
        });
      },
      function(cb) {
        var configPath;
        window.requirejs = {
          config: function (c) {
            configPath = c.paths['map-config'];
          }
        };
        $.getScript('http://api.map.vl.ru/map.js', function () {
          delete window.requirejs;
          var config;
          window.define = function (c) {
            config = c;
          };
          $.getScript(configPath, function () {
            delete window.define;
            opt.config = config;
            cb();
          });
        });
      }];
    p.executed = 0;

    var routeParams = [].slice.call(arguments);
    routeParams.unshift('route:map');

    var cb = function(){
      if (++p.executed == p.length) {
        new View(_.extend({
          el: $(options.selector.main)[0],
          model: model
        }, opt));

        options.vent.trigger.apply(options.vent, routeParams);
      }
    };

    p.forEach(function (f) { f(cb) });
  });
};
