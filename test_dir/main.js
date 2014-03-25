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
    console.log(dat);
    var accessories_total = dat.accessories.length;
    var accessories_count = 0;
    function class_counter(){
      accessories_count++;
      if(accessories_count >= accessories_total){
        main(dat);
      }
    }
    for(var i in dat.accessories) {
      console.log(dat.accessories[i]);
      var script_url = 'accessory_' + dat.accessories[i].type + '.js';
      console.log(script_url);
      $.getScript(script_url, function(){
        console.log('loaded ' + script_url);
        class_counter();
      });
    }
  });
});

function main(game_data){
  var stage = new PIXI.Stage(0x66FF99);

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

  requestAnimFrame( animate );

  function animate() {
    renderer.render(stage);

    requestAnimFrame( animate );
  }
}
