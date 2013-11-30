ig.module('game.entities.mainMenu')
.requires('impact.entity')

.defines(function(){
	var menu = 'media/menubuttonshorizontal.png';
	EntityMainMenu = ig.Entity.extend({
		startingResources: 0,
		animSheet: new ig.AnimationSheet(menu, 159, 43),
		collides: ig.Entity.COLLIDES.NONE,
		size: {x: 159, y: 43},
        //offset: {x: 0, y: 0},
        flip: false,
        maxVel: {x: 0, y: 0},
		selected: false,
		init: function( x, y, settings ) {
            this.parent( x, y, settings ); 
			this.animations();
			this.currentAnim = this.anims['idle'+this.currButton];
        },
		animations: function(){
			this.addAnim( 'idlePlayButton', 1, [0]);
			this.addAnim( 'pressedPlayButton', 1, [1]);
			this.addAnim( 'idleOptionsButton', 1, [2]);
			this.addAnim( 'pressedOptionsButton', 1, [3]);
			this.addAnim( 'idleExitButton', 1, [4]);
			this.addAnim( 'pressedExitButton', 1, [5]);
		},
		update: function(){
			this.parent();
			if (ig.input.state( 'lclick' ) && this.inFocus()){
				this.currentAnim = this.anims['pressed'+this.currButton];
				this.selected = true;
			}else if (this.selected == true){
				this.currentAnim = this.anims['idle'+this.currButton];
				this.selected = false;
				if (this.currButton == 'PlayButton'){
					menuOption = 1;
				}
			}
		},
		inFocus: function() {
			return ((this.pos.x <= (ig.input.mouse.x + ig.game.screen.x)) &&
				((ig.input.mouse.x + ig.game.screen.x) <= this.pos.x + this.size.x) &&
				(this.pos.y <= (ig.input.mouse.y + ig.game.screen.y)) &&
				((ig.input.mouse.y + ig.game.screen.y) <= this.pos.y + this.size.y)
		)}
	});
});