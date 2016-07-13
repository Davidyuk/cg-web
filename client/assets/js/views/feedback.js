var Backbone = require('backbone'),
  _ = require('underscore'),
  template = require('../templates/feedback.html');


module.exports = Backbone.View.extend({
  id: 'feedback',
  template: template,

  initialize: function(options) {
    this.listenTo(this.model, 'invalid', this.onInvalid);
    this.listenTo(this.model, 'sync', this.onSync);
    this.listenTo(this.model, 'error', this.onError);
    this.listenTo(this.model, 'request', this.onRequest);
    this.listenTo(options.vent, 'route:feedback', this.onRoute);
    this.options = options;
  },

  onRoute: function() {
    this.$el.attr('id', this.id);
    this.render();
    this.options.vent.trigger('change:title',
      this.options.title
    );
    this.options.vent.trigger('menu_mobile:add', {
      title: this.options.title
    });
  },

  onInvalid: function(model, error) {
    this.render({message: {
      type: 'error',
      content: error
    }});
  },

  onSync: function() {
    this.model.clear();
    this.render({message: {
      type: 'success',
      content: 'Сообщение отправлено'
    }});
  },

  onError: function() {
    this.render({message: {
      type: 'error',
      content: 'Произошла ошибка, обновите страницу'
    }});
  },

  onRequest: function() {
    this.render({message: {
      type: 'warning',
      content: 'Ожидание ответа сервера'
    }});
  },

  render: function(options) {
    this.$el.html(this.template(
      _.extend({
        object: this.model.toJSON()
      }, options)
    ));
    return this;
  },

  events: {
    'submit form': function(event) {
      event.preventDefault();
      this.model.save({
        username: this.$('input[type=text]').val(),
        phone: this.$('input[type=tel]').val(),
        message: this.$('textarea').val()
      });
    }
  }
});
