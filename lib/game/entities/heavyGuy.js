ig.module('game.entities.heavyGuy')
.requires('impact.entity',
	'game.entities.SuperUnit')
.defines(function(){
	var img = 'media/charset/template.png';
	var imgwidth = 24;
	var imgheight = 32;
    EntityHeavyGuy = EntitySuperUnit.extend({
        /*
		animSheet: new ig.AnimationSheet( img, imgwidth, imgheight),
		redSheet: new ig.AnimationSheet( img+'#FF8888', imgwidth, imgheight),
		greenSheet: new ig.AnimationSheet( img+'#88FF88', imgwidth, imgheight),
		blueSheet: new ig.AnimationSheet( img+'#8888FF', imgwidth, imgheight),
		yellowSheet: new ig.AnimationSheet( img+'#FFF020', imgwidth, imgheight),
		*/
		animPos: 2,
		speed: 80,
		minAtk: 6,
		maxAtk: 12,
		attackCooldown: 3,
		maxHealth: 35,
		trainTime: 10,
		range: 190,
		cost: 215,
		//collides: ig.Entity.COLLIDES.ACTIVE,

        init: function( x, y, settings ) {
            this.parent( x, y, settings );
        },
		
        update: function() {
			this.parent();
        }
    });
});