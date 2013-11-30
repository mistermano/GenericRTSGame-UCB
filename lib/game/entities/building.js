ig.module('game.entities.building')
.requires('impact.entity',
'game.entities.SuperUnit',
'game.entities.heavyGuy',
'game.entities.cheapGuy',
'game.entities.fastGuy',
'game.entities.sniperGuy',
'game.entities.healerGuy'
)
.defines(function(){
	var img = 'media/charset/buildings2.png';
	var imgwidth = 80;
	var imgheight = 86;
    EntityBuilding = ig.Entity.extend({
        //animSheet: new ig.AnimationSheet( 'media/charset/buildings.png', 80, 86 ),
		animSheet: new ig.AnimationSheet( img, imgwidth, imgheight),
		redSheet: new ig.AnimationSheet( img+'#FF8888', imgwidth, imgheight),
		greenSheet: new ig.AnimationSheet( img+'#88FF88', imgwidth, imgheight),
		blueSheet: new ig.AnimationSheet( img+'#8888FF', imgwidth, imgheight),
		yellowSheet: new ig.AnimationSheet( img+'#FFF020', imgwidth, imgheight),
        size: {x: 80, y: 86},
        offset: {x: 0, y: 0},
        flip: false,
        maxVel: {x: 0, y: 0},
		speed: 0,
		showingHealth: false,
		maxHealth: 50,
		health: 0,
		lineofsight: 6, //in tiles
		owner: 0, //Overwrite with player's number
		collides: ig.Entity.COLLIDES.FIXED,
		type: 'building',
		training: 0,
		aiBuilding : false,
		constructing: false,
		constructingTime: 10,
		currConstructingTime: 0,
		constructingTimer: new ig.Timer(0),
		constrInterval: 0, //Overwrite with how often the health should be added
		constrHealth: 1, //Overwrite with how much health should be added per interval while constructing
		tooltipTimer: new ig.Timer(0),
		trainingTimer: new ig.Timer(0),
		trains: ['FastGuy','CheapGuy','HeavyGuy','SniperGuy','HealerGuy'], //Array of units this building trains.
		trainsNames: ['Fast Guy','Cheap Guy','Heavy Guy','SniperGuy','HealerGuy'], //Names as they appear in the tooltip
		unitPrice: [140, 120, 300, 180, 250],
		

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
  
  /*colorChangePlayer: function() {
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
  },*/
  
  animations: function(){
	this.addAnim( 'fullhealth', 1, [0] );
	this.addAnim( 'middlehealth', 1, [1] );
	this.addAnim( 'destroyed', 1, [2] );
  },
		
    init: function( x, y, settings ) {
		this.parent( x, y, settings );
		//this.health = this.maxHealth;
		this.colorChange();
		this.animations();
		//this.constructingTimer.set(this.constructingTime);
		//this.currConstructingTime = -(this.constructingTime);
		//this.currentAnim = this.anims['full'];
	},
		
	spawnNewUnit: function(){
		if (this.aiBuilding == true){
			if (!this.spawnAtX){
				if ((ig.game.backgroundMaps[0].pxWidth - ig.system.width/2) > (this.pos.x + ig.game.screen.x)) {
					this.spawnAtX = (this.pos.x + this.size.x)+4;
				} else {
					this.spawnAtX = (this.pos.x)-20;
				}
			}
		
			if (!this.spawnAtY){
				if ((ig.game.backgroundMaps[0].pxHeight - ig.system.height/2) > this.pos.y) {
					this.spawnAtY = (this.pos.y + this.size.y);
				} else {
					this.spawnAtY = (this.pos.y - 12);
				}
			}
			ig.game.spawnEntity( 'Entity'+this.training,
		    this.spawnAtX, this.spawnAtY, {owner: this.owner,aiUnit: true});
			this.owner.unitsTrained++;
		}else{
			ig.game.spawnEntity( 'Entity'+this.training,
		    this.spawnAtX, this.spawnAtY, {owner: this.owner});			
			this.owner.unitsTrained++
		}
	},
		
		inFocus: function() {
			return ((this.pos.x <= (ig.input.mouse.x + ig.game.screen.x)) &&
				((ig.input.mouse.x + ig.game.screen.x) <= this.pos.x + this.size.x) &&
				(this.pos.y <= (ig.input.mouse.y + ig.game.screen.y)) &&
				((ig.input.mouse.y + ig.game.screen.y) <= this.pos.y + this.size.y)
		)},
		
		showUnitFrames: function(){
		//Only needs to calculate these once
		if (!this.spawnAtX){
			if ((ig.game.backgroundMaps[0].pxWidth - ig.system.width/2) > (this.pos.x + ig.game.screen.x)) {
				this.spawnAtX = (this.pos.x + this.size.x)+4;
			} else {
				this.spawnAtX = (this.pos.x)-20;
			}
		}
		
		if (!this.spawnAtY){
			if ((ig.game.backgroundMaps[0].pxHeight - ig.system.height/2) > this.pos.y) {
				this.spawnAtY = (this.pos.y + this.size.y);
			} else {
				this.spawnAtY = (this.pos.y - 12);
			}
		}
		
		/*
			spawnEntity creates a new entity at the X Y coordinates (entity, xcoor, ycoor).
			Variables inside the {} parameter will overwrite the spawned entity's.
		*/
		for(var i = 0; i <this.trains.length; i++){
			ig.game.spawnEntity( EntityUnitFrame,
				this.spawnAtX , (this.pos.y + (i * 18)),
				{ownerBuilding: this, frame: this.trains[i], unit: this.trains[i],
				unitName: this.trainsNames[i], ownerUnitPrice: this.unitPrice[i], ownerPlayer: this.owner}
			);
		}
			ig.global.selected[0]=this;
	},
		
		
	contains: function(array, obj) {
		for (var i = 0; i < array.length; i++) {
			if (array[i] == obj) {
				return true;
			}
		}
		return false;
	},
		
		//=====//
    update: function() {
		if (this.constructing && this.constructingTimer.delta() > 0){
		    this.constructingTimer = new ig.Timer(this.constrInterval);
			this.health += this.constrHealth;
			if (this.health >= this.maxHealth) {
				this.owner.buildingsBuilt++;
				this.health = this.maxHealth;
				this.constructing = false;
			}
		}
		
		if (this.health > this.maxHealth) {
			this.health = this.maxHealth;
		}
		
		if (this.health <= 0){
			this.owner.buildingsLost++;
		}
		//if (this.constructingTimer.delta() > 0 && this.constructing != 0 && this.health < this.maxHealth){
			//this.health += 10;
			//this.currConstructingTime = this.constructingTimer.delta();
		//}
		
		//if (this.constructingTimer.delta() >= 0 && this.constructing != 0){
		//	this.constructing = 0;
		//	this.currConstructingTime = this.constructingTime;
		//	this.showUnitFrames();
		//}
		if (ig.global.selected[0] == this && ig.global.selected.length > 1) {
			ig.global.selected.shift();
		}
		
		if (ig.input.pressed('lclick')) {
			if (this.inFocus()) {
				ig.game.spawnEntity( EntityHealthBar,this.pos.x, this.pos.y + this.size.y,
				{owner: this, animSheet: new ig.AnimationSheet( "media/charset/healthbar.png", 56, 10)});
				if (this.owner.owner == 1){
					ig.global.selected = [];
					ig.global.selected[0] = this;
					if (this.trainingTimer.delta() > 0 && this.constructing == 0){
						this.showUnitFrames();
					}
				}
			} 
		}
		
		if (this.trainingTimer.delta() > 0 && this.training != 0) {
			console.log('time over, spawn new unit!');
			this.spawnNewUnit();
			this.training = 0;
			if (ig.global.selected[0] == this) {
				this.showUnitFrames();
			}
		}
		
		//Kills all unit Frames not from this selected building
		if (ig.global.selected[0] != this){
			var frames = ig.game.getEntitiesByType('EntityUnitFrame');
			var len = frames.length;
			for(var i = 0;i<len;i++){
				if ((frames[i].type=='unitFrame') && (frames[i].ownerBuilding == this)){
					frames[i].kill();
				}
			}
		}
		
        this.parent();
        }
		
    });

	//Entities for training units
	EntityUnitFrame = ig.Entity.extend({
		size: {x: 16, y: 16},
		type: 'unitFrame',
		//Ideally, use a single file for all unit frames, so they only overwrite trainTime and frame
		animSheet: new ig.AnimationSheet('media/charset/unitframes.png', 17, 17 ),
		ownerBuilding: 0,
		trainTime: 3,
		
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			// Add the animations
			this.animations();
			// Switch animations on Init
			this.currentAnim = this.anims[this.frame];
		},
		
		animations: function() {
			this.addAnim( 'CheapGuy', 1, [0] );
			this.addAnim( 'HealerGuy', 1, [1] );
			this.addAnim( 'SniperGuy', 1, [2] );
			this.addAnim( 'FastGuy', 1, [3] );
			this.addAnim( 'HeavyGuy', 1, [4] );
			this.addAnim( 'TankGuy', 1, [5] );
		},
		
		inFocus: function() {
			return ((this.pos.x <= (ig.input.mouse.x + ig.game.screen.x)) &&
				((ig.input.mouse.x + ig.game.screen.x) <= this.pos.x + this.size.x) &&
				(this.pos.y <= (ig.input.mouse.y + ig.game.screen.y)) &&
				((ig.input.mouse.y + ig.game.screen.y) <= this.pos.y + this.size.y)
		)},
		
		trainUnit: function() {
			this.ownerBuilding.trainingTimer = new ig.Timer(this.ownerBuilding.unitTrainTime[0]);
			//this.ownerBuilding.trainingTimer = new ig.Timer(this.trainTime);
			this.ownerBuilding.training = this.unit;
			//console.log('Training started!'+this.unit+' Unit: ' + ig.game.getEntityByName(this.unit));
		},
		
		draw: function() {
			this.parent();
			if(this.inFocus()) {
				ig.system.context.fillStyle = '#111111';
				ig.system.context.fillRect(this.pos.x + this.size.x + 8 - ig.game.screen.x, this.pos.y - ig.game.screen.y , 85, 16);
				ig.system.context.font = '18px';
				ig.system.context.fillStyle = '#FFFFFF';
				//console.log(ig.EntitySuperUnit.unitName);
				ig.system.context.fillText(this.unitName+' $'+this.ownerUnitPrice,this.pos.x + this.size.x + 12 - ig.game.screen.x, this.pos.y + 11 - ig.game.screen.y);
			}
		},
		
		update: function() {
			if (ig.input.pressed('rclick')) {
				this.kill();
			}
			
			if (ig.input.pressed('lclick')){
				if (this.inFocus()){
					//checks if the owner of the building has enough resources
					var entityOwner;
					for (var i = 0;i < ig.game.getEntitiesByType('EntityPlayer').length;i++){
						if (ig.game.getEntitiesByType('EntityPlayer')[i] ==
							this.ownerPlayer) {
							entityOwner = ig.game.getEntitiesByType('EntityPlayer')[i];
						}   
					}
					if ((entityOwner.currentResources - this.ownerUnitPrice) >= 0){
						//kills all unitFrames and starts training
						var frames = ig.game.getEntitiesByType('EntityUnitFrame');
						var len = frames.length;
						for(var i = 0;i<len;i++){
							if ((frames[i].type=='unitFrame')){
								frames[i].kill();
							}
						}
						// remove the cost of the unit from the player resources
						entityOwner.currentResources -= this.ownerUnitPrice;
						entityOwner.spentResources += this.ownerUnitPrice;
						this.trainUnit();
					}
				}
			}
			this.parent();
		}
	});
	
});