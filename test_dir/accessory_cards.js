var accessory = function(options, pos){
  console.log(options);
  namespace.accessories[pos].options = options;
}

namespace.accessories.push({type: "cards", init: accessory});
