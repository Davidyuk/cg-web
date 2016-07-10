var $ = require('jquery');


module.exports = function(options) {
  var ol = options.ol;

  function SwitchLevelControl(options) {
    options = options || {};

    function switchLevelCb(isUp) {
      return function() {
        options.model.set('level', options.model.get('level') + (isUp ? +1 : -1));
      }
    }

    var label = $('<span>');

    function onChange(model) {
      element.css('display', model.get('showLevel') ? 'block' : 'none');
      label.text(model.get('level'));
    }

    options.model.on('change:showLevel', onChange);
    options.model.on('change:level', onChange);

    // FIXME: I can't understand why `buttonUp.click(switchLevelCb(true));` don't works
    var buttonUp = $('<button><i class="angle up icon"></i></button>');
    buttonUp.get(0).addEventListener('click', switchLevelCb(true));
    var buttonDown = $('<button><i class="angle down icon"></i></button>');
    buttonDown.get(0).addEventListener('click', switchLevelCb(false));

    var element = $('<div class="switch-level ol-unselectable ol-control">')
      .css('display', 'none')
      .append(buttonUp, label, buttonDown);

    ol.control.Control.call(this, {
      element: element.get(0),
      target: options.target
    });
  }
  ol.inherits(SwitchLevelControl, ol.control.Control);

  return new SwitchLevelControl(options);
};
