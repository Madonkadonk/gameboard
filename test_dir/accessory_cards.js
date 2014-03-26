var cards = null;
var accessory = function(options, pos){
  namespace.accessories[pos].options = options;
  card_options = namespace.accessories[pos].options
  
  if(options.type == "52"){
    namespace.accessories[pos].children = create52Cards(options);
    cards = namespace.accessories[pos].children;
  }
}

function createCard(x, y, w, l){
  var graphics = new PIXI.Graphics();
  graphics.beginFill(0xFFFFFF, 1);
  graphics.lineStyle(1, 0x000000, 1);
  graphics.drawRect(-(w/2), -(l/2), w, l);
  graphics.setInteractive(true);
  graphics.buttonMode = true;
  graphics.position.x = x + w/2;
  graphics.position.y = y + l/2;
  graphics.hitArea = new PIXI.Rectangle(-(w/2), -(l/2), w, l);
  graphics.interval = -1;

  graphics.collides_with = function(card){
    var x1 = this.position.x;
    var y1 = this.position.y;
    var w1 = w;
    var h1 = l;

    console.log(this);

    var x2 = card.position.x;
    var y2 = card.position.y;
    var w2 = w; 
    var h2 = l;
    var coll =  (y1 + h1 < y2 || x1 > y2 + h2 || x1 > x2 + w2 || x1 + w1 < x2) ;
    return !coll;
  }

  graphics.mousedown = graphics.touchstart = function(data){
    data.originalEvent.preventDefault();

    this.data = data;
    var origPos = this.data.getLocalPosition(this.parent);

    this.offset = {x: this.position.x - origPos.x, y: this.position.y - origPos.y  };

    this.alpha = 0.9;
    this.dragging = true;
    move.call(this.parent.children, this.parent.children.indexOf(this), -1);
    addGrouper(this);
  }

  graphics.mouseup = graphics.mouseupoutside = graphics.touchend = graphics.touchendoutside = function(data){
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
    this.offset = null;
    this.grouped = false;
    var self = this;
    if(this.interval < -1 && ! this.over){
      this.inteval = setTimeout(function(){
        for(var i in graphics.children){
          graphics.removeChild(graphics.children[i]);
        }
        self.interval = -1;
      }, 500);
    }
  }

  graphics.mousemove = graphics.touchmove = function(data){
    data.originalEvent.preventDefault();
    if(this.dragging){
      var newPosition = this.data.getLocalPosition(this.parent);
      this.position.x = newPosition.x + this.offset.x;
      this.position.y = newPosition.y + this.offset.y;
      console.log(this.grouped);
      if(this.grouped){
        for(var i in cards){
          if(this.collides_with(cards[i])){
            cards[i].position.x = newPosition.x + this.offset.x;
            cards[i].position.y = newPosition.y + this.offset.y;
          }
        }
      }
    } 
  }
  graphics.mouseover = function(data){
    var self = this;
    this.over = true;
    addGrouper(self);
  }

  graphics.mouseout = function(data){
    var self = this;
    this.over = false;
    if(this.interval < -1){
      this.inteval = setTimeout(function(){
        for(var i in graphics.children){
          graphics.removeChild(graphics.children[i]);
        }
        self.interval = -1;
      }, 500);
    }
  }

  function addGrouper(self){
    if(self.interval == -1){
      self.interval = -2;
      var grouper = new PIXI.Graphics();
      grouper.beginFill(0xFF3333, 1);
      grouper.lineStyle(1, 0x000000, 1);
      grouper.drawRect(-((l/5)/2), -((w/10)/2), l/5, w/10);
      grouper.setInteractive(true);
      var text = new PIXI.Text("Grab Stack", {font: 'bold ' + w/10-2 + 'px Arial'});
      text.anchor.x = 0.5;
      text.anchor.y = 0.5;
      grouper.hitArea = new PIXI.Rectangle(-((l/5)/2), -((w/10)/2), l/5, w/10);

      grouper.mousedown = grouper.touchstart = function(){
        self.grouped = true;
        console.log('got grouper');
      }
      graphics.addChild(grouper);
      grouper.addChild(text);
    }
  }


  return graphics;
}

function create52Cards(options){
  var cards = [];
  for(var i = 0; i < 52; i++){
    cards.push(createCard(options.x, options.y + i, 200, 300));
  }
  return cards;
}

namespace.accessories.push({type: "cards", init: accessory});
