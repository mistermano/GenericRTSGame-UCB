ig.module('game.entities.arrowscroll')
.requires('impact.entity')
.defines(function(){
	var img = 'media/arrow.png';
	var imgwidth = 32;
	var imgheight = 74;
	var keyScroll = 20;
EntityArrowscroll = ig.Entity.extend({ 
	animSheet: new ig.AnimationSheet( img, imgwidth, imgheight),
	//animSheet: new ig.AnimationSheet('media/arrow.png', 32, 74),
	size: {x: 32, y: 74},
	zIndex: 1,
	moveUp: false,
	moveDown: false,
	moveLeft: false,
	moveRight: false,
	
	init: function( x, y, settings ) {
		this.addAnim( 'ok', 0, [0] );
	   this.parent( x, y, settings );
	   if (this.moveUp){
			this.pos.x = ig.game.screen.x + 10;
			this.pos.y = 5;
		}
		if (this.moveDown){
			this.pos.x = ig.game.screen.x + 10;
			this.pos.y = ig.game.screen.y - 5;
		}
		if (this.moveLeft) {
			this.pos.x = 5;
			this.pos.y = ig.game.screen.y + 2;
		}
		if (this.moveRight){
			this.pos.x = ig.game.screen.x + 110;
			this.pos.y = ig.game.screen.y + 2;
		}
		console.log('in/vocado - ' + this.pos.x + 'X ; Y' + this.pos.y);
	},
	
	update: function() {
		this.parent();
		//console.log('in/vocado - ' + this.pos.x + 'X ; Y' + this.pos.y);
		if (this.inFocus) {
		/*
			if (this.moveUp){
				this.pos.x = 50;
				this.pos.y = 5;
				if (!ig.game.screen.y<=0) {
					if(ig.game.screen.y > 30){
						ig.game.screen.y -= keyScroll;
					}else{
						ig.game.screen.y = 0;
					}
				}
			}*//*
			if (this.moveDown){
				this.pos.x = 90;
				this.pos.y = 50;
				if(ig.game.screen.y < this.bottomBorder - 30){
					ig.game.screen.y += keyScroll;
				}
					else{
				ig.game.screen.y = this.bottomBorder;
				}
			}*//*
			if (this.moveLeft) {
				this.pos.x = 500;
				this.pos.y = 120;
				if (!ig.game.screen.x<=0){
					if(ig.game.screen.x > 30){
						ig.game.screen.x -= keyScroll;
					}else{
						ig.game.screen.x = 0;
					}
				}
			}*//*
			if (this.moveRight){
				this.pos.x = 0;
				this.pos.y = 20;
				if(ig.game.screen.x < this.rightBorder - 30){
					ig.game.screen.x += keyScroll;
				}else{
					ig.game.screen.x = this.rightBorder;
				}
			}*/
		}
	},
	
	inFocus: function() {
		return ((this.pos.x <= (ig.input.mouse.x + ig.game.screen.x)) &&
			((ig.input.mouse.x + ig.game.screen.x) <= this.pos.x + this.size.x) &&
			(this.pos.y <= (ig.input.mouse.y + ig.game.screen.y)) &&
			((ig.input.mouse.y + ig.game.screen.y) <= this.pos.y + this.size.y)
		)
	}
	});
});