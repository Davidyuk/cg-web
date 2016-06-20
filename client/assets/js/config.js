var config = {
  server: require('./config/server'),
  breakpoints: {
    mobile            : 320,
    tablet            : 768,
    computer          : 992,
    largeMonitor      : 1200,
    widescreenMonitor : 1920
  }
};

config.server.host = config.server.host || (config.server.hostname +
    (config.server.port == '80' ? '' : ':' + config.server.port)
  );

config.server.toString = function() {
  return '//' + config.server.host + '/';
};

config.server.api.toString = function() {
  return config.server + config.server.api.path;
};

module.exports = config;
