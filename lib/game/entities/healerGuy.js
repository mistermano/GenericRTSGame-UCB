ig.module('game.entities.healerGuy')
.requires('impact.entity',
	'game.entities.SuperUnit')
.defines(function(){
    EntityHealerGuy = EntitySuperUnit.extend({
        /*
		animSheet: new ig.AnimationSheet( img, imgwidth, imgheight),
		redSheet: new ig.AnimationSheet( img+'#FF8888', imgwidth, imgheight),
		greenSheet: new ig.AnimationSheet( img+'#88FF88', imgwidth, imgheight),
		blueSheet: new ig.AnimationSheet( img+'#8888FF', imgwidth, imgheight),
		yellowSheet: new ig.AnimationSheet( img+'#FFF020', imgwidth, imgheight),
		*/
		animPos: 5,
		speed: 120,
		minAtk: 2,
		maxAtk: 4,
		attackCooldown: 3,
		maxHealth: 22,
		trainTime: 8,
		range: 160,
		cost: 200,
		healCooldown: 2.5,
		//collides: ig.Entity.COLLIDES.ACTIVE,

        init: function( x, y, settings ) {
            this.parent( x, y, settings );
			this.healCd = new ig.Timer(0);
        },
		
		healOthers: function() {
			this.target = ig.game.getEntitiesByType('EntitySuperUnit');
			for (var j = 0 ; j < this.target.length ; j++) {
				other = this.target[j];
				//Does NOT heal self
				if ( this != other && (other.owner == this.owner) &&
					this.distanceTo(other) < this.range
					&& this.healCd.delta() > 0) {
					other.health += 1;
					this.healCd = new ig.Timer(this.healCooldown);
				}
			}
		},
		
        update: function() {
			this.parent();
			this.healOthers();
        }
    });
});