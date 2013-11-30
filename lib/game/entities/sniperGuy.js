ig.module('game.entities.sniperGuy')
.requires('impact.entity',
	'game.entities.SuperUnit')
.defines(function(){
	var img = 'media/charset/cheapguy.png';
	var imgwidth = 24;
	var imgheight = 32;
    EntitySniperGuy = EntitySuperUnit.extend({
        /*
		animSheet: new ig.AnimationSheet( img, imgwidth, imgheight),
		redSheet: new ig.AnimationSheet( img+'#FF8888', imgwidth, imgheight),
		greenSheet: new ig.AnimationSheet( img+'#88FF88', imgwidth, imgheight),
		blueSheet: new ig.AnimationSheet( img+'#8888FF', imgwidth, imgheight),
		yellowSheet: new ig.AnimationSheet( img+'#FFF020', imgwidth, imgheight),
		*/
		animPos: 4,
		speed: 80,
		minAtk: 5,
		maxAtk: 16,
		attackCooldown: 6,
		maxHealth: 20,
		trainTime: 10,
		range: 400,
		cost: 250,
		//collides: ig.Entity.COLLIDES.ACTIVE,

        init: function( x, y, settings ) {
            this.parent( x, y, settings );
        },
		
        update: function() {
			this.parent();
        }
    });
});