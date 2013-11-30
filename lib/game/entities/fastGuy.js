ig.module('game.entities.fastGuy')
.requires('impact.entity',
	'game.entities.SuperUnit')
.defines(function(){
	var img = 'media/charset/cheapguy.png';
	var imgwidth = 24;
	var imgheight = 32;
    EntityFastGuy = EntitySuperUnit.extend({
        /*
		animSheet: new ig.AnimationSheet( img, imgwidth, imgheight),
		redSheet: new ig.AnimationSheet( img+'#FF8888', imgwidth, imgheight),
		greenSheet: new ig.AnimationSheet( img+'#88FF88', imgwidth, imgheight),
		blueSheet: new ig.AnimationSheet( img+'#8888FF', imgwidth, imgheight),
		yellowSheet: new ig.AnimationSheet( img+'#FFF020', imgwidth, imgheight),
		*/
		animPos: 3,
		speed: 160,
		minAtk: 4,
		maxAtk: 6,
		attackCooldown: 2,
		maxHealth: 26,
		trainTime: 7,
		range: 160,
		cost: 180,
		//collides: ig.Entity.COLLIDES.ACTIVE,

        init: function( x, y, settings ) {
            this.parent( x, y, settings );
        },
		
        update: function() {
			this.parent();
        }
    });
});