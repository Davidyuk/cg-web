module.exports = function (){
  var urls = [];
  var reverse = function() {
    var name = [].shift.call(arguments);
    return urls[name].apply(null, arguments);
  };
  reverse.get = reverse;
  reverse.add = function(name, cb){
    urls[name] = cb;
  };

  return reverse;
}();
