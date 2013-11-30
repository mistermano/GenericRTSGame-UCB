ig.module('game.entities.finalBuilding')
.requires('impact.entity',
	'game.entities.building')
	
.defines(function(){
	var img = 'media/charset/buildings.png';
	var imgwidth = 80;
	var imgheight = 86;
	EntityFinalBuilding = EntityBuilding.extend({
		cost: 1200,
		buildingTime: 30,
		speed: 0,
		maxHealth: 300,
		health: 0,
		lineofsight: 6,
		constrInterval: 2,
		constrHealth: 30, 
		trains: ['HeavyGuy','SniperGuy'], //Array of units this building trains.
		trainsNames: ['Heavy Guy', 'SniperGuy'], //Names as they appear in the tooltip
		unitPrice: [300,250],
		unitTrainTime: [10,10],
		
		init: function( x, y, settings ) {
            this.parent( x, y, settings ); 
			if (this.constructing){
				this.owner.currentResources -= this.cost;
				this.owner.spentResources += this.cost;
		    }
        },
		
		animations: function(){
			this.addAnim( 'fullhealth', 1, [3] );
		},
		
        update: function() {
			this.parent();
        }
		
	});
});