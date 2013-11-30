ig.module('game.entities.resourceBuilding')
.requires('impact.entity',
	'game.entities.building')

.defines(function(){
	var img = 'media/charset/buildings.png';
	var imgwidth = 230;
	var imgheight = 86;
	EntityResourceBuilding = EntityBuilding.extend({
		animSheet: new ig.AnimationSheet( 'media/charset/buildings2.png', 56, 86 ),
		size: {x: 56, y: 86},
		cost: 500,
		buildingTime: 10,
		speed: 0,
		maxHealth: 150,
		health: 0,
		lineofsight: 6,
		resourceGenerated: 100,
		constrInterval: 1.5,
		constrHealth: 15, 
		resourceTimer: 2, // Em segundos
		trains: [], //Array of units this building trains.
		trainsNames: [], //Names as they appear in the tooltip
		unitPrice: [],
		init: function( x, y, settings ) {
            this.parent( x, y, settings ); 
			if (this.constructing){
				this.owner.currentResources -= this.cost;
				this.owner.spentResources += this.cost;
		    }
			this.resourceT = new ig.Timer(this.resourceTimer);
        },
		
		animations: function(){
			this.addAnim( 'fullhealth', 1, [2] );
		},
		
		generateResources: function(){
			if (this.resourceT.delta() > 0){
				this.owner.currentResources += this.resourceGenerated; 
				this.owner.totalResources += this.resourceGenerated;
				this.resourceT = new ig.Timer(this.resourceTimer);
			}
		},
		
        update: function() {
			this.parent();
			if (this.owner != null && !this.constructing){
				this.generateResources();
			}
        }
		
	});
});