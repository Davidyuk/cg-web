var _ = require('underscore'),
  View = require('../views/menu'),
  Collection = require('../collections/menu'),
  Model = require('../models/menu');


module.exports = function(options) {
  new View(_.defaults({
    collection: new Collection([], _.defaults({model: Model}, options))
  }, options)).render();
};
