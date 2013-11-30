ig.module('game.entities.ghostBuilding')
.requires('impact.entity',
'game.entities.building')

.defines(function(){
	var img = 'media/charset/buildings.png';
	var imgwidth = 80;
	var imgheight = 86;
	EntityGhostBuilding = EntityBuilding.extend({
		maxVel: {x: 100, y: 100},
		size: {x: 80, y: 86},
 		collides: ig.Entity.COLLIDES.LITE,
		showingHealth: false,
		collided: false,
		buildingType: null,
		trains: [], //Array of units this building trains.
		trainsNames: [], //Names as they appear in the tooltip
		unitPrice: [],
		
	init: function( x, y, settings ) {
	    this.parent( x, y, settings );
		if(this.buildingType == 'ResourceBuilding'){
			this.animSheet = new ig.AnimationSheet( 'media/charset/buildings2.png', 56, 86 );	
		}else if (this.buildingType == 'TrainingBuilding'){
			this.animSheet = new ig.AnimationSheet( 'media/charset/buildings2.png', 86, 86 );
		}else{
			this.animSheet = new ig.AnimationSheet( 'media/charset/buildings2.png', 86, 86 );
		}
		this.animations();
	},	
	
	animations: function(){
		if(this.buildingType == 'TrainingBuilding'){
			this.addAnim( 'trainingBuilding', 1, [1] );
		}else if(this.buildingType == 'ResourceBuilding'){
			this.addAnim( 'resourceBuilding', 1, [2] );
		}else{
			this.addAnim( 'finalBuilding', 1, [3] );
		}
	},
		
	update: function() {
		this.parent();
		ig.global.selected = [];
		var pX = (ig.input.mouse.x - imgwidth/2) + ig.game.screen.x;
		var pY = (ig.input.mouse.y - imgheight/2) + ig.game.screen.y;
		if (this.collided == false) {
			this.pos.x = pX;
			this.pos.y = pY;
		}
	},
	
	handleMovementTrace: function( res ) {
		if (res.collision.x || res.collision.y){
			this.collided = false;
		}else{
			this.collided = false;
		}
	}
	

	});
});