move = function (old_index, new_index) {
  while (old_index < 0) {
    old_index += this.length;
  }
  while (new_index < 0) {
    new_index += this.length;
  }
  if (new_index >= this.length) {
    var k = new_index - this.length;
    while ((k--) + 1) {
      this.push(undefined);
    }
  }
  this.splice(new_index, 0, this.splice(old_index, 1)[0]);
  return this; // for testing purposes
};

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
  results = regex.exec(location.search);
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
namespace = {};
namespace.accessories = [];

$(document).ready(function(){
  var game_url = getParameterByName('game') + '.json'
  $.getJSON(game_url, function( dat ){
    var accessories_total = dat.accessories.length;
    var accessories_count = 0;
    function class_counter(){
      accessories_count++;
      if(accessories_count >= accessories_total){
        main(dat);
      }
    }
    for(var i in dat.accessories) {
      var script_url = 'accessory_' + dat.accessories[i].type + '.js';
      $.getScript(script_url, function(){
        class_counter();
      });
    }
  });
});

function main(game_data){
  var stage = new PIXI.Stage(0x66FF99, true);

  var renderer = PIXI.autoDetectRenderer($('#game_container').width(), $('#game_container').height());

  $('#game_container').prepend(renderer.view);

  var run_acc = namespace.accessories;

  var game_acc = game_data.accessories;

  for(var i in run_acc){
    for(var j in game_acc) {
      if(game_acc[j].type == run_acc[i].type){
        run_acc[i].init(game_acc[j].options, i);
        delete game_acc[j];
        break;
      }
    }
  }

  for(var i in run_acc){
    for(var j in run_acc[i].children){
      stage.addChild(run_acc[i].children[j]);
    }
  }

  requestAnimFrame( animate );

  function animate() {
    renderer.render(stage);

    requestAnimFrame( animate );
  }
}
