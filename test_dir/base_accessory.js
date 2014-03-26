var accessory = function(options, pos){
  namespace.accessories[pos].options = options;

}

namespace.accessories.push({type: "cards", init: accessory});
