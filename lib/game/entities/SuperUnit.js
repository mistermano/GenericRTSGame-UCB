ig.module('game.entities.SuperUnit')
.requires('impact.entity',
'plugins.astar-for-entities')
.defines(function(){
  var img = 'media/charset/template2.png';
  var imgwidth = 30;
  var imgheight = 32;
  EntitySuperUnit = ig.Entity.extend({
	  animSheet: new ig.AnimationSheet( img, imgwidth, imgheight),
	  redSheet: new ig.AnimationSheet( img+'#FFaaaa', imgwidth, imgheight),
	  greenSheet: new ig.AnimationSheet( img+'#88FF88', imgwidth, imgheight),
	  blueSheet: new ig.AnimationSheet( img+'#aaaaFF', imgwidth, imgheight),
	  yellowSheet: new ig.AnimationSheet( img+'#FFF020', imgwidth, imgheight),
	  size: {x: 12, y: 16},
	  offset: {x: 6, y: 12},
	  animPos: 0,
	  friction: {x: 50, y:50},
	  flip: false,
	  maxVel: {x: 200, y: 200},
	  speed: 100,
	  minAtk: 3,
	  maxAtk: 6,
	  attackCooldown: 2,
	  range: 80, //in pixels
	  lineofsight: 4, //in tiles
	  showingHealth: false,
	  maxHealth: 50,
	  health: 1,
	  unitName: 'super',
	  collides: ig.Entity.COLLIDES.ACTIVE,
	  type: 'unit',
	  zIndex: 10,
	  attackTimer: 0,
	  attackingWho: 0,
	  deadTimer: 0,
	  moving: false,
	  destinationsy: [],
	  destinationsx: [],
	  player: 0,
	  aiUnit: false,
	  owner: 0, //Overwrite with player's number

  init: function( x, y, settings ) {
   this.parent( x, y, settings );
   this.animPos = this.animPos * 22;
   this.attackTimer = new ig.Timer(0);
   this.deadTimer = new ig.Timer(0);
   this.health = this.maxHealth;
   this.colorChange();
   this.passiveCollisionTimer = new ig.Timer(0);
   this.animations();
  },
  
  lineOfSight: function () {
},
  
  colorChange: function() {
   switch (this.owner.color) {
    case 1:
     this.animSheet = this.blueSheet;
    break;
    case 2:
     this.animSheet = this.redSheet;
    break;
    case 3:
     this.animSheet = this.greenSheet;
    break;
    case 4:
     this.animSheet = this.yellowSheet;
    break;
   }
  },
  
  animations: function() {
  /**
	All unit animations are in the same .PNG image. Each row of animations is for a different
	unit. Each row has 22 animations. At the init(), the variable is multiplied by 22.
  */
   this.addAnim( 'idle', 1, [this.animPos + 1] );
   this.addAnim( 'down', 0.15, [this.animPos + 1, this.animPos +  0, this.animPos + 1, this.animPos + 2] );
   this.addAnim( 'up', 0.15, [this.animPos + 4, this.animPos + 3, this.animPos + 4, this.animPos + 5] );
   this.addAnim( 'right', 0.15, [this.animPos + 7, this.animPos +  6, this.animPos +  7, this.animPos + 8] );
   this.addAnim( 'left', 0.15, [this.animPos + 10, this.animPos + 9, this.animPos + 10, this.animPos + 11] );
   
   this.addAnim( 'downatk', 0.15, [this.animPos + 12, this.animPos + 13] );
   this.addAnim( 'upatk', 0.15, [this.animPos + 14, this.animPos + 15] );
   this.addAnim( 'rightatk', 0.15, [this.animPos + 16, this.animPos + 17] );
   this.addAnim( 'leftatk', 0.15, [this.animPos + 18, this.animPos + 19] );
   this.addAnim( 'dead', 0.7, [this.animPos + 20, this.animPos + 21] );
  },
  
  inFocus: function() {
   return ((this.pos.x <= (ig.input.mouse.x + ig.game.screen.x)) &&
    ((ig.input.mouse.x + ig.game.screen.x) <= this.pos.x + this.size.x) &&
    (this.pos.y <= (ig.input.mouse.y + ig.game.screen.y)) &&
    ((ig.input.mouse.y + ig.game.screen.y) <= this.pos.y + this.size.y)
  )},
  
  //@Override
  receiveDamage: function( amount, from ) {
   this.parent(amount, from);
   if (this.attackingWho == 0) {
    this.attackingWho = from;
   }
  },
  
  faceToAttack: function(){
   var distx = this.pos.x - this.attackingWho.pos.x;
   var disty = this.pos.y - this.attackingWho.pos.y;
   
   if (Math.abs(distx) > Math.abs(disty)){
    //Facing up or down?
    if (distx < 0) {
     this.currentAnim = this.anims.leftatk;
    } else {
     this.currentAnim = this.anims.rightatk;
    }
   } else {
    //Facing left or right?
    if (disty < 0) {
     this.currentAnim = this.anims.upatk;
    } else {
     this.currentAnim = this.anims.downatk;
    }
   }
   
  },
  
  attackThis: function() {
   var other = this.attackingWho;
   var obstacles = 0;
   var atk = parseInt(Math.random() * (this.maxAtk - this.minAtk) + this.minAtk);
   if ( this.attackingWho && (this.owner != other.owner) && other.health > 0){
    if ((this.distanceTo(other) < this.range)) {
     //this.getPath(this.pos.x,this.pos.y, true,obstacles, []);
     //Not used with A*
     this.destinationx = 9999999;
     this.destinationy = 9999999;
     
     //If within range, stop moving
     this.vel.x = 0;
     this.vel.y = 0;
     this.faceToAttack();
     if (this.attackTimer.delta() > 0){
		 other.receiveDamage(atk, this);
		 //console.log(other.health);
		 this.attackTimer = new ig.Timer(this.attackCooldown);
	 }
    } else {
     if (this.distanceTo(other) > this.range) {
      //Not used with A*
      this.destinationx = other.pos.x;
      this.destinationy = other.pos.y;
      /*this.getPath(other.pos.x, other.pos.y, true, obstacles, []); */
      this.movement();
     } else { //don't move
		//this.destinationx = this.pos.x;
		//this.destinationy = this.pos.y;
       /*this.getPath(this.pos.x,
       this.pos.y, true, 
       obstacles, []);*/
     }
    }
   }
   if (other.health <= 0) {
    this.attackingWho = 0;
    this.currentAnim = this.anims.idle;
    this.currentAnim.rewind();
   }
  },
  
  findTarget:function(){
   var other;
   var noFocus = true;
   this.target = ig.game.getEntitiesByType('EntitySuperUnit');
   for (var j = 0 ; j < this.target.length ; j++) {
    other = this.target[j];
    if ( (other.owner != this.owner) &&
     //(other.team != this.team) &&
     other.inFocus() ) {
     this.attackingWho = other;
     ig.global.atkTarget = other;
     //console.log(this.attackingWho);
    }
    if (other.inFocus()) {
		//Only needs to find one entity, so stops looking after finding
		noFocus = false;
		break;
	}
   }
   
   this.target = ig.game.getEntitiesByType('EntityBuilding');
   for (var j = 0 ; j < this.target.length ; j++) {
		other = this.target[j];
		if ( (other.owner != this.owner) &&
		 //(other.team != this.team) &&
		 other.inFocus() ) {
			this.attackingWho = other;
			ig.global.atkTarget = other;
		} else {
			if (other.owner == this.owner) {
				this.destinationx = 99999999;
				this.destinationy = 99999999;
			}
		}
		if (other.inFocus()) {
			noFocus = false;
			break;
		}
   }
   
   if (noFocus){this.attackingWho = 0;}
  },
  
  kill: function(){
   if (this.health <= 0 && !this.dead) {
    this.owner.unitsLost++;  
    this.deadTimer = new ig.Timer(3);
    this.dead = true;
    this.currentAnim = this.anims['dead'];
   }
   if (this.dead && this.deadTimer.delta() > 0) {
    this.parent();
   }
  },
  
  moveAll:function(){
	var leader = ig.global.selected[0];
	var distx = leader.destinationx - (leader.pos.x + (leader.size.x/2));
	var disty = leader.destinationy - (leader.pos.y + (leader.size.y/2));
	var mousePosy = (ig.input.mouse.y + ig.game.screen.y);
	var mousePosx = (ig.input.mouse.x + ig.game.screen.x);
	var line = 0;
	var evenNumber = true;
	var coluna = 0;
	
	var distToBottom = ig.system.height - mousePosy;
	var distToRight = ig.system.width - mousePosx;
	//console.log(distToRight + ' + '+distToBottom);
	for (var j = 0; j < ig.global.selected.length ; j++) {
		var current = ig.global.selected[j];
		var posicao = 0;
		if (coluna > 4){coluna = 0; line++;}
		if (Math.abs(distx) > Math.abs(disty)) {
			//6 posições Y diferentes
			posicao = (current.size.y * coluna);
			//if (evenNumber) {posicao = posicao * (-1); evenNumber = false;} else {evenNumber = true;}
			current.destinationy = mousePosy - posicao;
			current.destinationx = leader.destinationx - ((current.size.x + 6) * line);
		} else {
			//6 posições X
			posicao = (current.size.y * coluna) + 8;
			//if (evenNumber) {posicao = posicao * (-1); evenNumber = false;} else {evenNumber = true;}
			current.destinationx = mousePosx - posicao;
			current.destinationy = leader.destinationy - ((current.size.y + 4) * line);
		}
		coluna++;
	}
  },
  
  trace: function( res ) {
	
  },
  
  //http://impactjs.com/documentation/class-reference/collisionmap#trace
	handleMovementTrace: function( res ) {
		this.parent(res);
		//console.log(res.tile);
		//console.log(res.collision);
		//console.log(res.pos);
		if (this.destinationsx[0] != this.destinationx){ this.destinationsx[0] = this.destinationx; console.log('ok');}
		if (this.destinationsy[0] != this.destinationy){ this.destinationsy[0] = this.destinationy;}
		//Detect vertical collision (up/down tile)
		if (res.collision.y) {
			if (this.vel.y > 0.3 || this.vel.y < -0.3) {
				this.destinationy = this.pos.y;
				this.destinationx += 32;
				//collision to the right -> move left
				/*if (res.collision.x && this.vel.x > 0.3) {
					this.destinationx -= 32;
				}
				if (res.collision.x && this.vel.x < -0.3) {
					this.destinationx += 32;
				}*/
			}	
		}
		if (!res.collision.y) {
			this.destinationy = this.destinationsy[0];
		}
	},
  
  movement: function(){
   if( this.destinationx < 9999999 && this.destinationy < 9999999 ) {
   // Accounts for center of character's collision area
	this.collides = ig.Entity.COLLIDES.PASSIVE;
    this.distancetotargetx = this.destinationx - (this.pos.x + (this.size.x/2));
    this.distancetotargety = this.destinationy - (this.pos.y + (this.size.y/2));
   //Math.abs retorna o valor absoluto, o módulo, do numero.
    if( Math.abs(this.distancetotargetx) > 3 || Math.abs(this.distancetotargety) > 3 ) {
     if( Math.abs(this.distancetotargetx) > Math.abs(this.distancetotargety) ) {
     // Move right
      if( this.distancetotargetx > 0.6 ) {
		  this.vel.x = this.speed;
		  this.xydivision = this.distancetotargety / this.distancetotargetx;
		  this.vel.y = this.xydivision * this.speed;
		  this.currentAnim = this.anims.right;
      }else { // Move left
		  this.vel.x = -this.speed;
		  this.xydivision = this.distancetotargety / Math.abs(this.distancetotargetx);
		  this.vel.y = this.xydivision * this.speed;
		  this.currentAnim = this.anims.left;
      }
    }else {
    // Move down
      if( this.distancetotargety > 0.6 ) {
		   this.vel.y = this.speed;
		   this.xydivision = this.distancetotargetx / this.distancetotargety;
		   this.vel.x = this.xydivision * this.speed;
      }else { // Move up
       this.vel.y = -this.speed;
       this.xydivision = this.distancetotargetx / Math.abs(this.distancetotargety);
       this.vel.x = this.xydivision * this.speed;
       }
      }
    }else {
		//this.collides = ig.Entity.COLLIDES.ACTIVE;
		this.passiveCollisionTimer = new ig.Timer(5);
		this.vel.y = 0;
		this.vel.x = 0;
		this.destinationx = 99999999;
		this.destinationy = 99999999;
	}
	}
	//Passive collision so the line can form properly
	if (this.passiveCollisionTimer.delta() > 0){ this.collides = ig.Entity.COLLIDES.ACTIVE;}
  },
  
  directionToAnimate: function(){
	if (this.vel.x == 0 && this.vel.y == 0 && !this.attackingWho) {
     this.currentAnim = this.anims['idle'];
    } else {
	 if (Math.abs(this.vel.x) > Math.abs(this.vel.y)) {
		//Animate left or right
		if (this.vel.x > 0 ){
		  this.currentAnim = this.anims['right'];
		 } else if (this.vel.x < 0 ) {
		  this.currentAnim = this.anims['left'];
		 }
	 } else {
		 if (this.vel.y > 0){
		  this.currentAnim = this.anims['down'];
		 } else if (this.vel.y < 0) {
		  this.currentAnim = this.anims['up'];
		 }
	  }
    }
  },
  
	contains: function(array, obj) {
		for (var i = 0; i < array.length; i++) {
			if (array[i] == obj) {
				return true;
			}
		}
		return false;
	},
  
	showHealth: function(){
		ig.game.spawnEntity( EntityHealthBar,this.pos.x, this.pos.y + this.size.y,{owner: this});
	},
  
  losDraw: function() {
	var ctx = ig.system.context;
	ctx.save();
	// Create a mask layer by a circle
	ctx.beginPath();
	ctx.arc(10, 10, 50, 0, Math.PI * 2, false);
	ctx.clip();
	/* Draw something here, in this example is a night sky */
	//nightskyImage.draw(0, 0);
	// Finish clipping
	ctx.restore();
  },
  
	draw: function(){
		this.parent();
		this.losDraw();
	},
  
   update: function() {
   this.parent();
   if (this.health <= 0) {
    this.kill();
   } else {
    //Moving animations
   this.directionToAnimate();
   if (this.attackingWho != 0) {
    if (this.attackingWho.owner!= this.owner){
     this.attackThis();
    }
   }else {
    //check for enemies inside range, attacks only if idle
    if (this.vel.x == 0 && this.vel.y == 0){
		this.target = ig.game.getEntitiesByType('EntitySuperUnit');
		for (var j = 0 ; j < this.target.length ; j++) {
			if ( this.owner != this.target[j].owner &&
			(this.distanceTo(this.target[j]) <= this.range)) {
				this.attackingWho = this.target[j];
				break;
			}
		}
    }else if (this.vel.x >= 0 && this.vel.y >= 0 && this.aiUnit == true){
		this.target = ig.game.getEntitiesByType('EntitySuperUnit');
		for (var j = 0 ; j < this.target.length ; j++) {
			if ( this.owner != this.target[j].owner &&
			(this.distanceTo(this.target[j]) <= 150)) {
				this.attackingWho = this.target[j];
				break;
			}
		}
		this.target = ig.game.getEntitiesByType('EntityBuilding');
		for (var j = 0 ; j < this.target.length ; j++) {
			if ( this.owner != this.target[j].owner &&
			(this.distanceTo(this.target[j]) <= 150)) {
				this.attackingWho = this.target[j];
				break;
			}
		}	
	}

   }
  
   if( ig.input.pressed( 'rclick' ) ) {
     ig.global.selected = [];
   }
   
   //Get only the point where the mouse clicked. The above changes the destination with every update call
   if (this.contains(ig.global.selected, this)){
    if (!this.showingHealth){
		this.showHealth();
		this.showingHealth = true;
	}
	if (ig.input.pressed('lclick')){
	//Checks if the click was inside the playable area
	    var buildingEntityClicked = 0;
		var buildingEntities = new Array();
		for (var i = 0; i < ig.game.getEntitiesByType('EntityBuilding').length ; i++){
		    buildingEntities[i] = ig.game.getEntitiesByType('EntityBuilding')[i];
		}
		for (var i = 0; i < buildingEntities.length ; i++){
			if (buildingEntities[i].inFocus() && buildingEntities[i].owner == this.owner) {
			    buildingEntityClicked = 1;
				break;
			}
		}
		var canWidth1 = 480;
        if (buildingEntityClicked == 0) {
			if (ig.input.mouse.x < canWidth1 - 100){
				if (ig.input.mouse.x > 0 || ig.input.mouse.y > 0 ||
					ig.input.mouse.x < ig.input.game.backgroundMaps[0].pxWidth - ig.system.width ||
					ig.input.mouse.y < ig.input.game.backgroundMaps[0].pxHeight - ig.system.height ){
					this.findTarget();
					this.destinationx = ig.input.mouse.x + ig.game.screen.x;
					this.destinationy = ig.input.mouse.y + ig.game.screen.y;
					this.moveAll();
				}
			}
        }
	//Make destination distance to instead
	//this.destinationx = this.pos.x - (ig.input.mouse.x + ig.game.screen.x);
    //this.destinationy = this.pos.y - (ig.input.mouse.y + ig.game.screen.y);
	
    
    /*var obstacles; //
    
    //A* pathfinding from the plugin - this.getPath(destinationX, destinationY, diagonalMovement, entityTypesArray, ignoreEntityArray);
    this.getPath(ig.input.mouse.x + ig.game.screen.x,
     ig.input.mouse.y + ig.game.screen.y, true, 
     obstacles, []);
	//It's heavy, so it shouldn't be called on every update
	this.followPath(this.speed, true);*/
    
	} //end click
   }

   if ( this.owner.owner == 1 && (
		((this.pos.x + (this.size.x/2)) > ig.global.selectionRectangle[0] && (this.pos.x + (this.size.x/2)) < ig.global.selectionRectangle[1] ) ||
		((this.pos.x + (this.size.x/2)) < ig.global.selectionRectangle[0] && (this.pos.x + (this.size.x/2)) > ig.global.selectionRectangle[1] ) )
		&& (
		((this.pos.y + (this.size.y/2)) > ig.global.selectionRectangle[2] && (this.pos.y + (this.size.y/2)) < ig.global.selectionRectangle[3] ) ||
		((this.pos.y + (this.size.y/2)) < ig.global.selectionRectangle[2] && (this.pos.y + (this.size.y/2)) > ig.global.selectionRectangle[3] ))
		){
		  ig.global.selected.push(this);
	}
    this.movement();

	if (this.owner.owner == 1){
		if (ig.input.pressed('lclick') && this.inFocus()) {
			if (ig.global.selected.length > 1) {
				ig.global.selected = [];
			}
			ig.global.selected[0] = this;
			//ig.global.selected.push(this);
			this.selected = true;
			//spawn health bar
		}
	
	}
	var canWidth2 = 480;
	if (ig.input.pressed('lclick')){
		if (ig.input.mouse.x >= canWidth2 - 100){
		    ig.global.selected = [];
		}
	}
   } //end isDead else
 }

});

 //Entities for training units
 EntityHealthBar = ig.Entity.extend({
  //size: {x: 28, y: 5},
  type: 0,
  zIndex: 1,
  ownerUnit: 0,
  type: 'healthbar',
  animSheet: new ig.AnimationSheet( "media/charset/smallhealthbar.png", 28, 5),
  posx: 0,
  owner: 0,
  scaling: 1,
  init: function( x, y, settings ) {
   this.parent( x, y, settings );
   // Add the animations
   this.addAnim( 0, 1, [0] );
   this.addAnim( 1, 1, [1] );
   this.addAnim( 2, 1, [2] );
   this.addAnim( 3, 1, [3] );
   this.addAnim( 4, 1, [4] );
   this.addAnim( 5, 1, [5] );
   this.addAnim( 6, 1, [6] );
   this.addAnim( 7, 1, [7] );
   this.addAnim( 8, 1, [8] );
   this.addAnim( 9, 1, [9] );
   //posx = this.owner.pos.x - (this.owner.size.x/2);
   // Switch animations on Init
   //this.animSheet.resize(2);
   //this.animSheet.image.resize(this.scaling);
   //this.currentAnim = this.anims[this.frame];
  },
  
  update: function() {
   //Pins the bar just above the owner
   this.pos.x = this.owner.pos.x - 8;
   this.pos.y = this.owner.pos.y - 14;
   //
   //this.pos.y = this.owner.pos.y + this.owner.size.y;
   //Pinning end
   
   //Updating the healthbar
   for (var i = 1; i < 10 ; i++) {
    if (this.owner.maxHealth == this.owner.health) {
     this.currentAnim = this.anims[9];
     break;
    } else {
     if ((this.owner.maxHealth * i * 0.1) >= this.owner.health) {
      this.currentAnim = this.anims[i];
      break;
     }
    }
   }
   
   if (this.owner.health <= 0 ){
	this.owner.showingHealth = false;
    this.kill();
   }
   
   if (!this.owner.contains(ig.global.selected, this.owner)) {
	this.owner.showingHealth = false;
    this.kill();
   }
   this.parent();
  }
 });
});