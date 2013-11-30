ig.module('game.entities.trainingBuilding')
.requires('impact.entity',
	'game.entities.building')
	
.defines(function(){
	var img = 'media/charset/buildings.png';
	var imgwidth = 86;
	var imgheight = 86;
	EntityTrainingBuilding = EntityBuilding.extend({
		animSheet: new ig.AnimationSheet( 'media/charset/buildings2.png', 86, 86 ),
		size: {x: 86, y: 86},
		cost: 600,
		buildingTime: 10,
		speed: 0,
		maxHealth: 200,
		health: 0,
		lineofsight: 6,
		constrInterval: 2,
		constrHealth: 30, 
		trains: ['FastGuy','HealerGuy'], //Array of units this building trains.
		trainsNames: ['Fast Guy','Healer Guy'], //Names as they appear in the tooltip
		unitPrice: [140,180],
		unitTrainTime: [6,8],
		
		init: function( x, y, settings ) {
            this.parent( x, y, settings );
			if (this.constructing){
				this.owner.currentResources -= this.cost;
				this.owner.spentResources += this.cost;
		    }			
        },
		
		animations: function(){
			this.addAnim( 'fullhealth', 1, [1] );
		},
		
        update: function() {
			this.parent();
        }
		
	});
});