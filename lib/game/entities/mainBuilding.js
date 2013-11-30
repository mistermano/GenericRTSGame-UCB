ig.module('game.entities.mainBuilding')
.requires('impact.entity',
	'game.entities.building')

.defines(function(){
	var img = 'media/charset/buildings.png';
	var imgwidth = 80;
	var imgheight = 86;
	EntityMainBuilding = EntityBuilding.extend({
		animSheet: new ig.AnimationSheet( 'media/charset/buildings2.png', 80, 86 ),
		size: {x: 80, y: 86},
		speed: 0,
		maxHealth: 500,
		health: 0,
		lineofsight: 6,
		trains: ['CheapGuy'], //Array of units this building trains.
		trainsNames: ['Cheap Guy'], //Names as they appear in the tooltip
		unitPrice: [120],
		unitTrainTime: [4],
		
		init: function( x, y, settings ) {
            this.parent( x, y, settings );
        },
		
        update: function() {
			this.parent();
        }
	});
});